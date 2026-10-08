import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";
import { arquivoDoCache, comCacheDeVetores } from "./cache-de-vetores.js";
import { criarGeradorGemini } from "./embeddings-gemini.js";

/** Gerador de embeddings usado pelas três variantes (ADR 0003 e 0007). */
export interface GeradorDeEmbeddings {
  readonly modelo: string;
  readonly dimensao: number;
  consultas(textos: string[]): Promise<number[][]>;
  trechos(textos: string[]): Promise<number[][]>;
}

const LOTE = 32;

/**
 * Modelo e5 local (transformers.js), quantizado em 8 bits. O e5 exige "query: " na pergunta e
 * "passage: " no trecho; sem os prefixos a busca piora sem dar erro. Pooling pela média e vetor
 * normalizado, como no cartão do modelo. Textos acima do limite do modelo (512 tokens) são
 * truncados pelo tokenizador.
 */
export async function criarGeradorE5(modelo: string): Promise<GeradorDeEmbeddings> {
  env.cacheDir = fileURLToPath(new URL("../../.cache/modelos/", import.meta.url));
  const extrator = await pipeline("feature-extraction", modelo, { dtype: "q8" });

  const embutir = async (textos: string[]): Promise<number[][]> => {
    const vetores: number[][] = [];
    for (let i = 0; i < textos.length; i += LOTE) {
      const saida = await extrator(textos.slice(i, i + LOTE), { pooling: "mean", normalize: true });
      vetores.push(...(saida.tolist() as number[][]));
    }
    return vetores;
  };

  const [amostra] = await embutir(["query: teste"]);
  return {
    modelo,
    dimensao: amostra!.length,
    consultas: (textos) => embutir(textos.map((t) => `query: ${t}`)),
    trechos: (textos) => embutir(textos.map((t) => `passage: ${t}`)),
  };
}

/**
 * Gerador pelo nome do modelo: "gemini-..." pela API do Gemini, com cache em disco por causa da
 * cota diária do nível gratuito (ADR 0009); qualquer outro, e5 local.
 */
export async function criarGerador(modelo: string, chaveGemini: string | null): Promise<GeradorDeEmbeddings> {
  if (!modelo.startsWith("gemini-")) return criarGeradorE5(modelo);
  if (!chaveGemini) throw new Error(`EMBEDDINGS_MODELO=${modelo} exige GEMINI_API_KEY.`);
  return comCacheDeVetores(criarGeradorGemini(modelo, { chave: chaveGemini }), arquivoDoCache(modelo));
}
