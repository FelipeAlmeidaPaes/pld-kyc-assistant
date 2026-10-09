import type { GeradorDeEmbeddings } from "./embeddings.js";

const URL_GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";
/** Limite de pedidos por chamada de `batchEmbedContents`. */
const LOTE = 100;

export interface OpcoesGemini {
  chave: string;
  /** Tamanho do vetor. Abaixo do máximo, o Gemini não normaliza: a normalização é feita aqui. */
  dimensao?: number;
  tentativas?: number;
  esperaInicialMs?: number;
  esperar?: (ms: number) => Promise<void>;
  fetch?: typeof globalThis.fetch;
}

const normalizar = (v: number[]) => {
  const norma = Math.hypot(...v);
  return norma === 0 ? v : v.map((x) => x / norma);
};

/**
 * Embeddings pela API do Gemini (ADR 0003: comparar o local com API). Usa o tipo de tarefa no
 * lugar dos prefixos do e5: RETRIEVAL_QUERY na pergunta, RETRIEVAL_DOCUMENT no trecho. No
 * nível gratuito, 429 é esperado em lote grande; repete com espera crescente.
 */
export function criarGeradorGemini(modelo: string, opcoes: OpcoesGemini): GeradorDeEmbeddings {
  const { chave, dimensao = 768, tentativas = 6, esperaInicialMs = 5000 } = opcoes;
  const esperar = opcoes.esperar ?? ((ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms)));
  const buscar = opcoes.fetch ?? globalThis.fetch;

  const lote = async (textos: string[], tarefa: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT"): Promise<number[][]> => {
    const corpo = JSON.stringify({
      requests: textos.map((text) => ({
        model: `models/${modelo}`,
        content: { parts: [{ text }] },
        taskType: tarefa,
        outputDimensionality: dimensao,
      })),
    });
    for (let tentativa = 1; ; tentativa++) {
      const resposta = await buscar(`${URL_GEMINI}/${modelo}:batchEmbedContents`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": chave },
        body: corpo,
      });
      if (resposta.ok) {
        const { embeddings } = (await resposta.json()) as { embeddings: { values: number[] }[] };
        return embeddings.map((e) => normalizar(e.values));
      }
      const repetivel = resposta.status === 429 || resposta.status >= 500;
      if (!repetivel || tentativa >= tentativas) {
        throw new Error(`gemini embeddings: HTTP ${resposta.status} após ${tentativa} tentativas`);
      }
      await esperar(esperaInicialMs * 2 ** (tentativa - 1));
    }
  };

  const embutir = async (textos: string[], tarefa: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT") => {
    const vetores: number[][] = [];
    for (let i = 0; i < textos.length; i += LOTE) vetores.push(...(await lote(textos.slice(i, i + LOTE), tarefa)));
    return vetores;
  };

  return {
    modelo,
    dimensao,
    consultas: (textos) => embutir(textos, "RETRIEVAL_QUERY"),
    trechos: (textos) => embutir(textos, "RETRIEVAL_DOCUMENT"),
  };
}
