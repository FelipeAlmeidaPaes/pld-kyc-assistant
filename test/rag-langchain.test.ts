import { Document } from "@langchain/core/documents";
import { afterEach, describe, expect, it } from "vitest";
import type { Artigo, NormaNormalizada } from "../src/corpus/types.js";
import type { Provedor } from "../src/rag/config.js";
import { IndiceDoCorpus } from "../src/rag/corpus.js";
import type { GeradorDeEmbeddings } from "../src/rag/embeddings.js";
import { EmbeddingsE5 } from "../src/rag/langchain/embeddings.js";
import { documentosDoDivisorPadrao, documentosDosTrechos } from "../src/rag/langchain/indice.js";
import { criarModeloDeChat, criarPipelineLangchain } from "../src/rag/langchain/pipeline.js";
import { criarClienteDeChat } from "../src/rag/manual/llm.js";
import { formatarContexto, INSTRUCOES, mensagemDaPergunta } from "../src/rag/prompt.js";
import { montarTrechos } from "../src/rag/trechos.js";
import { iniciarLlmFalso, respostaDeChat } from "./fixtures/llm-falso.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const saidaValida = { cobre: true, resposta: "Com nome completo.", citacoes: [{ sigla: "Lei 99.999/2099", caminho: "art. 1º, I" }] };
const provedor = (nome: Provedor["nome"], urlBase: string): Provedor => ({
  nome,
  urlBase,
  chave: `chave-${nome}`,
  modelo: `modelo-${nome}`,
  precoEntradaUsd: null,
  precoSaidaUsd: null,
});
const trechos = montarTrechos(normaFicticia);

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

describe("EmbeddingsE5", () => {
  it("delega ao gerador do projeto, que põe os prefixos do e5", async () => {
    const chamadas: string[] = [];
    const gerador: GeradorDeEmbeddings = {
      modelo: "falso",
      dimensao: 2,
      consultas: async (t) => (chamadas.push(`consulta:${t}`), t.map(() => [1, 0])),
      trechos: async (t) => (chamadas.push(`trechos:${t}`), t.map(() => [0, 1])),
    };
    const embeddings = new EmbeddingsE5(gerador);
    expect(await embeddings.embedQuery("p")).toEqual([1, 0]);
    expect(await embeddings.embedDocuments(["a", "b"])).toEqual([[0, 1], [0, 1]]);
    expect(chamadas).toEqual(["consulta:p", "trechos:a,b"]);
  });
});

describe("documentos", () => {
  it("variante langchain: um documento por trecho, com o mesmo id e texto da variante manual", () => {
    const [primeiro] = documentosDosTrechos(trechos);
    expect(primeiro).toMatchObject({
      id: trechos[0]!.id,
      pageContent: trechos[0]!.texto,
      metadata: { normaId: "lei-99999", sigla: "Lei 99.999/2099", caminho: "art. 1º, caput" },
    });
  });

  it("variante padrão: pedaços de até 1.000 caracteres com sobreposição, sem caminho de citação", async () => {
    const artigos: Artigo[] = Array.from({ length: 40 }, (_, i) => ({
      numero: String(i + 10),
      rotulo: `art. ${i + 10}`,
      agrupamento: null,
      dispositivos: [
        {
          tipo: "caput",
          rotulo: "caput",
          caminho: `art. ${i + 10}, caput`,
          texto: `Regra fictícia número ${i + 10}, com texto suficiente para encher o pedaço do divisor.`,
          notas: [],
          revogado: false,
        },
      ],
    }));
    const longa: NormaNormalizada = { ...normaFicticia, artigos };
    const documentos = await documentosDoDivisorPadrao([longa]);

    expect(documentos.length).toBeGreaterThan(2);
    expect(documentos.every((d) => d.pageContent.length <= 1000)).toBe(true);
    expect(documentos[0]!.metadata).toEqual({ normaId: "lei-99999", sigla: "Lei 99.999/2099", loc: expect.any(Object) });
    // Sobreposição: o fim de um pedaço reaparece no começo do seguinte.
    const fimDoPrimeiro = documentos[0]!.pageContent.split("\n").at(-1)!;
    expect(documentos[1]!.pageContent).toContain(fimDoPrimeiro);
    expect((await documentosDoDivisorPadrao([longa])).map((d) => d.id)).toEqual(documentos.map((d) => d.id));
  });
});

describe("criarModeloDeChat", () => {
  it("devolve saída, tokens, modelo e provedor pelo ChatOpenAI apontado para outra URL", async () => {
    const servidor = await llm(() => respostaDeChat(saidaValida, "modelo-servido"));
    const modelo = criarModeloDeChat([provedor("gemini", servidor.url)], true);
    const geracao = await modelo.invoke({ contexto: formatarContexto(trechos.slice(0, 1)), pergunta: "P?" });
    expect(geracao).toEqual({
      saida: saidaValida,
      provedor: "gemini",
      modelo: "modelo-servido",
      tokensEntrada: 120,
      tokensSaida: 30,
      custoTabelaUsd: null,
    });
    expect(servidor.requisicoes[0]!.autorizacao).toBe("Bearer chave-gemini");
  });

  it("manda ao modelo as mesmas mensagens e o mesmo esquema que a variante manual", async () => {
    const servidor = await llm(() => respostaDeChat(saidaValida));
    const pergunta = "Pergunta fictícia?";
    const contexto = trechos.slice(0, 3);

    await criarClienteDeChat([provedor("gemini", servidor.url)], { usarFallback: false }).gerar(
      INSTRUCOES,
      mensagemDaPergunta(pergunta, contexto),
    );
    await criarModeloDeChat([provedor("gemini", servidor.url)], false).invoke({ contexto: formatarContexto(contexto), pergunta });

    const [manual, langchain] = servidor.requisicoes.map((r) => r.corpo) as [any, any];
    // O LangChain só acrescenta "stream": false, que é o padrão da API.
    const { stream, ...restoDoLangchain } = langchain;
    expect(stream).toBe(false);
    expect(restoDoLangchain).toEqual(manual);
  });

  it("passa para o próximo provedor só com fallback ligado", async () => {
    const fora = await llm(() => ({ status: 400, corpo: { error: { message: "falha fictícia" } } }));
    const reserva = await llm(() => respostaDeChat(saidaValida));
    const provedores = [provedor("gemini", fora.url), provedor("openrouter", reserva.url)];
    const entrada = { contexto: "x", pergunta: "y" };

    await expect(criarModeloDeChat(provedores, true).invoke(entrada)).resolves.toMatchObject({ provedor: "openrouter" });
    await expect(criarModeloDeChat(provedores, false).invoke(entrada)).rejects.toThrow();
    expect(reserva.requisicoes).toHaveLength(1);
  });

  it("em 429, só tenta de novo se a resposta disser quanto esperar (diferente da variante manual)", async () => {
    const limite = { status: 429, corpo: { error: { message: "limite" } } };
    const semAviso = await llm(() => limite);
    await expect(criarModeloDeChat([provedor("gemini", semAviso.url)], false).invoke({ contexto: "x", pergunta: "y" })).rejects.toThrow(
      "429",
    );
    expect(semAviso.requisicoes).toHaveLength(1);

    const comAviso = await llm((_, i) => (i < 2 ? { ...limite, cabecalhos: { "Retry-After": "0" } } : respostaDeChat(saidaValida)));
    await expect(criarModeloDeChat([provedor("gemini", comAviso.url)], false).invoke({ contexto: "x", pergunta: "y" })).resolves.toMatchObject({
      provedor: "gemini",
    });
    expect(comAviso.requisicoes).toHaveLength(3);
    // A espera entre tentativas é a do LangChain (1-2 s, depois 2-4 s), não a do Retry-After.
  }, 20_000);
});

describe("criarPipelineLangchain", () => {
  const indice = new IndiceDoCorpus([normaFicticia]);
  const recuperados = documentosDosTrechos(trechos).map((doc, i): [Document, number] => [doc, 0.9 - i / 100]);

  it("encadeia busca, modelo e a regra comum de recusa e citação", async () => {
    const servidor = await llm(() => respostaDeChat(saidaValida));
    const pipeline = criarPipelineLangchain({
      variante: "langchain",
      buscar: async (_, k) => recuperados.slice(0, k),
      modelo: criarModeloDeChat([provedor("gemini", servidor.url)], false),
      indice,
      k: 2,
      limiar: null,
    });

    const resposta = await pipeline("Pergunta fictícia?");

    expect(resposta).toMatchObject({
      variante: "langchain",
      recusa: false,
      resposta: "Com nome completo.",
      citacoes: [{ sigla: "Lei 99.999/2099", caminho: "art. 1º, I" }],
      metricas: { provedor: "gemini", tokensEntrada: 120 },
    });
    expect(resposta.trechos).toEqual([
      { sigla: "Lei 99.999/2099", caminho: "art. 1º, caput", pontuacao: 0.9 },
      { sigla: "Lei 99.999/2099", caminho: "art. 1º, I", pontuacao: 0.89 },
    ]);
    expect(resposta.metricas.latenciaMs.geracao).toBeGreaterThan(0);
  });

  it("não chama o modelo quando o melhor trecho fica abaixo do limiar", async () => {
    const servidor = await llm(() => respostaDeChat(saidaValida));
    const pipeline = criarPipelineLangchain({
      variante: "langchain-padrao",
      buscar: async () => [[new Document({ pageContent: "Art. 1º Texto.", metadata: { normaId: "lei-99999", sigla: "Lei 99.999/2099" } }), 0.5]],
      modelo: criarModeloDeChat([provedor("gemini", servidor.url)], false),
      indice,
      k: 1,
      limiar: 0.8,
    });
    const resposta = await pipeline("Pergunta fora do corpus?");
    expect(resposta).toMatchObject({ variante: "langchain-padrao", recusa: true, trechos: [{ caminho: null, pontuacao: 0.5 }] });
    expect(servidor.requisicoes).toHaveLength(0);
  });
});
