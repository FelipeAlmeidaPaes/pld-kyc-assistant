import { afterEach, describe, expect, it } from "vitest";
import type { Provedor } from "../src/rag/config.js";
import { IndiceDoCorpus } from "../src/rag/corpus.js";
import { z } from "zod";
import { criarClienteDeChat, esquemaJson, esquemaJsonDe, pedirSaidaEstruturada } from "../src/rag/manual/llm.js";
import { criarPipelineManual } from "../src/rag/manual/pipeline.js";
import { INSTRUCOES } from "../src/rag/prompt.js";
import type { Geracao, TrechoRecuperado } from "../src/rag/tipos.js";
import { montarTrechos } from "../src/rag/trechos.js";
import { iniciarLlmFalso, respostaDeChat } from "./fixtures/llm-falso.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const saidaValida = { cobre: true, resposta: "Com nome completo.", citacoes: [{ sigla: "Lei 99.999/2099", caminho: "art. 1º, I" }] };
const provedor = (nome: Provedor["nome"], urlBase: string, precos: [number, number] | null = null): Provedor => ({
  nome,
  urlBase,
  chave: `chave-${nome}`,
  modelo: `modelo-${nome}`,
  precoEntradaUsd: precos?.[0] ?? null,
  precoSaidaUsd: precos?.[1] ?? null,
});

let fechar: (() => Promise<void>)[] = [];
afterEach(async () => {
  await Promise.all(fechar.map((f) => f()));
  fechar = [];
});
const llm = async (...args: Parameters<typeof iniciarLlmFalso>) => {
  const servidor = await iniciarLlmFalso(...args);
  fechar.push(servidor.fechar);
  return servidor;
};

describe("criarClienteDeChat", () => {
  it("envia instruções, pergunta e esquema JSON, e devolve saída, tokens e custo de tabela", async () => {
    const servidor = await llm(() => respostaDeChat(saidaValida, "modelo-servido"));
    const cliente = criarClienteDeChat([provedor("gemini", servidor.url, [0.1, 0.4])], { usarFallback: true });

    const geracao = await cliente.gerar(INSTRUCOES, "Pergunta fictícia?");

    expect(geracao).toEqual({
      saida: saidaValida,
      provedor: "gemini",
      modelo: "modelo-servido",
      tokensEntrada: 120,
      tokensSaida: 30,
      custoTabelaUsd: (120 * 0.1 + 30 * 0.4) / 1e6,
    });
    const [{ caminho, autorizacao, corpo }] = servidor.requisicoes as [any];
    expect(caminho).toBe("/v1/chat/completions");
    expect(autorizacao).toBe("Bearer chave-gemini");
    expect(corpo).toMatchObject({
      model: "modelo-gemini",
      temperature: 0,
      messages: [
        { role: "system", content: INSTRUCOES },
        { role: "user", content: "Pergunta fictícia?" },
      ],
      response_format: { type: "json_schema", json_schema: { name: "resposta", schema: esquemaJson(), strict: true } },
    });
  });

  it("tenta de novo em 429 com espera crescente", async () => {
    const servidor = await llm((_, i) => (i < 2 ? { status: 429, corpo: {} } : respostaDeChat(saidaValida)));
    const cliente = criarClienteDeChat([provedor("gemini", servidor.url)], { usarFallback: false, esperaInicialMs: 1 });
    await expect(cliente.gerar("x", "y")).resolves.toMatchObject({ provedor: "gemini" });
    expect(servidor.requisicoes).toHaveLength(3);
  });

  it("passa para o próximo provedor só com fallback ligado", async () => {
    const fora = await llm(() => ({ status: 503, corpo: {} }));
    const reserva = await llm(() => respostaDeChat(saidaValida));
    const provedores = [provedor("gemini", fora.url), provedor("openrouter", reserva.url)];

    const comFallback = criarClienteDeChat(provedores, { usarFallback: true, tentativas: 2, esperaInicialMs: 1 });
    await expect(comFallback.gerar("x", "y")).resolves.toMatchObject({ provedor: "openrouter" });

    const semFallback = criarClienteDeChat(provedores, { usarFallback: false, tentativas: 2, esperaInicialMs: 1 });
    await expect(semFallback.gerar("x", "y")).rejects.toThrow("gemini: HTTP 503 após 2 tentativas");
    expect(reserva.requisicoes).toHaveLength(1);
  });

  it("não repete erro definitivo e rejeita saída fora do esquema", async () => {
    const recusa = await llm(() => ({ status: 400, corpo: { error: "esquema inválido" } }));
    await expect(criarClienteDeChat([provedor("gemini", recusa.url)], { usarFallback: false }).gerar("x", "y")).rejects.toThrow(
      "gemini: HTTP 400",
    );
    expect(recusa.requisicoes).toHaveLength(1);

    const torta = await llm(() => respostaDeChat({ cobre: "sim" } as never));
    await expect(criarClienteDeChat([provedor("gemini", torta.url)], { usarFallback: false }).gerar("x", "y")).rejects.toThrow();
  });

  it("pede outra saída estruturada pelo mesmo caminho, com o nome e o esquema dados", async () => {
    const esquema = z.object({ veredito: z.enum(["sim", "nao"]) });
    const servidor = await llm(() => respostaDeChat({ veredito: "sim" } as never, "modelo-servido"));
    const pedido = { instrucoes: "i", mensagem: "m", nome: "julgamento", esquema };
    await expect(pedirSaidaEstruturada(provedor("openrouter", servidor.url), pedido)).resolves.toEqual({
      saida: { veredito: "sim" },
      modelo: "modelo-servido",
      tokensEntrada: 120,
      tokensSaida: 30,
    });
    expect((servidor.requisicoes[0] as any).corpo.response_format).toEqual({
      type: "json_schema",
      json_schema: { name: "julgamento", schema: esquemaJsonDe(esquema), strict: true },
    });
  });

  it("exige ao menos um provedor configurado", () => {
    expect(() => criarClienteDeChat([], { usarFallback: true })).toThrow("Nenhum provedor de LLM configurado");
  });
});

describe("criarPipelineManual", () => {
  const indice = new IndiceDoCorpus([normaFicticia]);
  const trechos: TrechoRecuperado[] = montarTrechos(normaFicticia).map((t, i) => ({ ...t, pontuacao: 0.9 - i / 100 }));
  const geracao: Geracao = { saida: saidaValida, provedor: "gemini", modelo: "m", tokensEntrada: 1, tokensSaida: 1, custoTabelaUsd: null };

  it("busca k trechos, manda instruções e trechos ao modelo e conclui com a regra comum", async () => {
    const chamadas: { instrucoes: string; mensagem: string }[] = [];
    const pipeline = criarPipelineManual({
      buscar: async (_, k) => trechos.slice(0, k),
      gerar: async (instrucoes, mensagem) => (chamadas.push({ instrucoes, mensagem }), geracao),
      indice,
      k: 2,
      limiar: null,
    });

    const resposta = await pipeline("Pergunta fictícia?");

    expect(resposta).toMatchObject({ variante: "manual", recusa: false, citacoes: [{ sigla: "Lei 99.999/2099", caminho: "art. 1º, I" }] });
    expect(resposta.trechos.map((t) => t.caminho)).toEqual(["art. 1º, caput", "art. 1º, I"]);
    expect(chamadas[0]!.instrucoes).toBe(INSTRUCOES);
    expect(chamadas[0]!.mensagem).toContain("[2] Lei 99.999/2099, art. 1º, I");
    expect(chamadas[0]!.mensagem).toMatch(/Pergunta: Pergunta fictícia\?$/);
  });

  it("recusa sem chamar o modelo quando o melhor trecho fica abaixo do limiar", async () => {
    let chamou = false;
    const pipeline = criarPipelineManual({
      buscar: async () => trechos.slice(0, 1),
      gerar: async () => ((chamou = true), geracao),
      indice,
      k: 1,
      limiar: 0.95,
    });
    const resposta = await pipeline("Pergunta fora do corpus?");
    expect(chamou).toBe(false);
    expect(resposta).toMatchObject({ recusa: true, motivoDaRecusa: "nenhum trecho recuperado atingiu a pontuação mínima" });
    expect(resposta.metricas.latenciaMs.geracao).toBeNull();
  });
});
