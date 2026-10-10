import { describe, expect, it } from "vitest";
import { chaveDaNorma, normalizarCaminho, validarCitacoes } from "../src/rag/citacoes.js";
import { custoTabela, lerConfiguracao, nomeDaColecao } from "../src/rag/config.js";
import { IndiceDoCorpus } from "../src/rag/corpus.js";
import { formatarContexto, mensagemDaPergunta } from "../src/rag/prompt.js";
import { abaixoDoLimiar, concluirResposta, type Etapas } from "../src/rag/resposta.js";
import type { Geracao, SaidaDoModelo, TrechoRecuperado } from "../src/rag/tipos.js";
import { idDeterministico, montarTrechos, textoCorrido } from "../src/rag/trechos.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const trechos = montarTrechos(normaFicticia);
const porCaminho = (caminho: string) => trechos.find((t) => t.caminho === caminho)!;
const recuperado = (caminho: string, pontuacao = 0.9): TrechoRecuperado => ({ ...porCaminho(caminho), pontuacao });
const indice = new IndiceDoCorpus([normaFicticia]);

describe("montarTrechos", () => {
  it("deixa de fora revogado e só (VETADO), e mantém (Vetado) no meio do texto", () => {
    expect(trechos.map((t) => t.caminho)).toEqual([
      "art. 1º, caput",
      "art. 1º, I",
      "art. 1º, § 1º",
      "art. 1º, § 1º, I",
      "art. 1º, § 1º, I, a",
      "art. 1º, § 1º, I, a, 1",
      "art. 2º, parágrafo único",
    ]);
  });

  it("monta o trecho com cabeçalho, agrupamento e os dispositivos acima dele, escritos como na norma", () => {
    expect(porCaminho("art. 1º, § 1º, I, a, 1").texto).toBe(
      [
        "Lei 99.999/2099, art. 1º, § 1º, I, a, 1",
        "CAPÍTULO I - DAS REGRAS FICTÍCIAS",
        "Art. 1º A instituição fictícia deve manter cadastro dos clientes:",
        "§ 1º O cadastro fictício será revisto:",
        "I - a cada ano; ou",
        "a) quando houver mudança relevante, desde que:",
        "1. a mudança seja comunicada.",
      ].join("\n"),
    );
    // O caput vetado não entra como contexto do parágrafo único.
    expect(porCaminho("art. 2º, parágrafo único").texto).toBe(
      "Lei 99.999/2099, art. 2º, parágrafo único\nCAPÍTULO II - DAS DISPOSIÇÕES FINAIS\nParágrafo único. O gerente (Vetado) responde pela regra fictícia.",
    );
  });

  it("gera ids estáveis em formato de UUID", () => {
    expect(montarTrechos(normaFicticia).map((t) => t.id)).toEqual(trechos.map((t) => t.id));
    expect(idDeterministico("x")).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

describe("textoCorrido", () => {
  it("escreve a norma em ordem, com título e agrupamentos, sem os dispositivos fora do índice", () => {
    expect(textoCorrido(normaFicticia).split("\n")).toEqual([
      "Lei nº 99.999, de 1º de janeiro de 2099",
      "CAPÍTULO I - DAS REGRAS FICTÍCIAS",
      "Art. 1º A instituição fictícia deve manter cadastro dos clientes:",
      "I - com nome completo;",
      "§ 1º O cadastro fictício será revisto:",
      "I - a cada ano; ou",
      "a) quando houver mudança relevante, desde que:",
      "1. a mudança seja comunicada.",
      "CAPÍTULO II - DAS DISPOSIÇÕES FINAIS",
      "Parágrafo único. O gerente (Vetado) responde pela regra fictícia.",
    ]);
  });
});

describe("normalização de citações", () => {
  it("reconhece a mesma norma escrita de jeitos diferentes", () => {
    expect(chaveDaNorma("Lei 9.999/2099")).toBe("lei 9999");
    expect(chaveDaNorma("Lei nº 9.999, de 2099")).toBe("lei 9999");
    expect(chaveDaNorma("Circular BCB 9.999/2099")).toBe(chaveDaNorma("Circular nº 9.999"));
    expect(chaveDaNorma("Carta Circular BCB 9.999/2099")).not.toBe(chaveDaNorma("Circular BCB 9.999/2099"));
    expect(chaveDaNorma("Resolução Conjunta CMN/BCB 9/2099")).toBe("resolução conjunta 9");
  });

  it("reconhece o mesmo caminho escrito de jeitos diferentes", () => {
    const canonico = normalizarCaminho("art. 1º, § 1º, I, a");
    expect(normalizarCaminho("Art. 1o, §1º, inciso I, alínea \"a\"")).toBe(canonico);
    expect(normalizarCaminho("art. 10")).toBe("art. 10, caput");
    expect(normalizarCaminho("art. 2º, Parágrafo único")).toBe("art. 2, parágrafo único");
  });
});

describe("validarCitacoes", () => {
  const contexto = [recuperado("art. 1º, § 1º, I, a")];

  it("aceita citação de dispositivo visto nos trechos e devolve a forma do corpus, sem repetir", () => {
    const { validas, invalidas } = validarCitacoes(
      [
        { sigla: "Lei nº 99.999/2099", caminho: "art. 1, § 1, inciso I, alínea a" },
        { sigla: "Lei 99.999/2099", caminho: "art. 1º, § 1º, I, a" },
        // O caput do art. 1º está dentro do trecho como contexto, então também foi visto.
        { sigla: "Lei 99.999/2099", caminho: "art. 1º" },
      ],
      contexto,
      indice,
    );
    expect(invalidas).toEqual([]);
    expect(validas).toEqual([
      { sigla: "Lei 99.999/2099", caminho: "art. 1º, § 1º, I, a" },
      { sigla: "Lei 99.999/2099", caminho: "art. 1º, caput" },
    ]);
  });

  it("recusa dispositivo inexistente e dispositivo que não estava nos trechos", () => {
    const { invalidas } = validarCitacoes(
      [
        { sigla: "Lei 99.999/2099", caminho: "art. 9º" },
        { sigla: "Lei 99.999/2099", caminho: "art. 2º, parágrafo único" },
        { sigla: "Lei 11.111/2099", caminho: "art. 1º" },
      ],
      contexto,
      indice,
    );
    expect(invalidas.map((i) => i.motivo)).toEqual([
      "dispositivo não existe no corpus",
      "texto do dispositivo não está nos trechos recuperados",
      "dispositivo não existe no corpus",
    ]);
  });

  it("recusa dispositivo revogado ou só (VETADO), cujo texto vazio estaria em qualquer trecho", () => {
    const citacoes = [
      { sigla: "Lei 99.999/2099", caminho: "art. 1º, II" },
      { sigla: "Lei 99.999/2099", caminho: "art. 2º" },
    ];
    const motivo = "dispositivo sem texto próprio (revogado ou vetado)";
    expect(validarCitacoes(citacoes, contexto, indice).invalidas.map((i) => i.motivo)).toEqual([motivo, motivo]);
    expect(validarCitacoes(citacoes, null, indice).invalidas.map((i) => i.motivo)).toEqual([motivo, motivo]);
  });

  it("sem trechos (servidor MCP), confere só a existência e o texto próprio", () => {
    const { validas, invalidas } = validarCitacoes(
      [
        { sigla: "Lei 99.999/2099", caminho: "art. 2º, parágrafo único" },
        { sigla: "Lei 99.999/2099", caminho: "art. 9º" },
      ],
      null,
      indice,
    );
    expect(validas).toEqual([{ sigla: "Lei 99.999/2099", caminho: "art. 2º, parágrafo único" }]);
    expect(invalidas.map((i) => i.motivo)).toEqual(["dispositivo não existe no corpus"]);
  });
});

describe("concluirResposta", () => {
  const geracao = (saida: SaidaDoModelo): Geracao => ({
    saida,
    provedor: "gemini",
    modelo: "modelo-ficticio",
    tokensEntrada: 100,
    tokensSaida: 20,
    custoTabelaUsd: null,
  });
  const etapas = (g: Geracao | null): Etapas => ({
    variante: "manual",
    pergunta: "Pergunta fictícia?",
    trechos: [recuperado("art. 1º, I")],
    geracao: g,
    latenciaMs: { busca: 1, geracao: g ? 2 : null, total: 3 },
  });
  const citacao = { sigla: "Lei 99.999/2099", caminho: "art. 1º, I" };

  const saida = (extra: Partial<SaidaDoModelo>): SaidaDoModelo => ({
    cobertura: "total",
    resposta: "Com nome completo.",
    naoCoberto: "",
    citacoes: [citacao],
    ...extra,
  });

  it("responde quando o modelo cobre e todas as citações conferem", () => {
    const r = concluirResposta(etapas(geracao(saida({ naoCoberto: "sobra ignorada" }))), indice);
    expect(r).toMatchObject({ recusa: false, resposta: "Com nome completo.", cobertura: "total", naoCoberto: null, citacoes: [citacao] });
    expect(r.metricas).toMatchObject({ provedor: "gemini", tokensEntrada: 100, tokensSaida: 20 });
  });

  it("responde a parte coberta e diz o que ficou sem resposta", () => {
    const r = concluirResposta(etapas(geracao(saida({ cobertura: "parcial", naoCoberto: "o prazo fictício" }))), indice);
    expect(r).toMatchObject({ recusa: false, cobertura: "parcial", naoCoberto: "o prazo fictício" });
  });

  it.each([
    [null, "nenhum trecho recuperado atingiu a pontuação mínima"],
    [geracao(saida({ cobertura: "nenhuma", resposta: "", citacoes: [] })), "o modelo indicou que os trechos recuperados não cobrem a pergunta"],
    [geracao(saida({ resposta: "Sem fonte.", citacoes: [] })), "resposta sem citação"],
    [
      geracao(saida({ resposta: "Inventada.", citacoes: [citacao, { sigla: "Lei 99.999/2099", caminho: "art. 7º" }] })),
      "citação não confere: Lei 99.999/2099, art. 7º (dispositivo não existe no corpus)",
    ],
  ])("recusa com motivo explícito (%#)", (g, motivo) => {
    expect(concluirResposta(etapas(g), indice)).toMatchObject({
      recusa: true,
      motivoDaRecusa: motivo,
      resposta: null,
      cobertura: null,
      citacoes: [],
    });
  });

  it("só aplica limiar quando configurado", () => {
    expect(abaixoDoLimiar([recuperado("art. 1º, I", 0.5)], null)).toBe(false);
    expect(abaixoDoLimiar([recuperado("art. 1º, I", 0.5)], 0.8)).toBe(true);
    expect(abaixoDoLimiar([recuperado("art. 1º, I", 0.85)], 0.8)).toBe(false);
  });
});

describe("prompt", () => {
  it("numera os trechos e preenche a pergunta sem trocar um '{pergunta}' que esteja num trecho", () => {
    const comChave = { ...porCaminho("art. 1º, I"), texto: "Lei 99.999/2099, art. 1º, I\nI - texto com {pergunta} literal;" };
    const semCaminho = { ...porCaminho("art. 1º, caput"), caminho: null, texto: "Art. 1º Texto corrido fictício." };
    expect(formatarContexto([comChave, semCaminho])).toBe(
      "[1] Lei 99.999/2099, art. 1º, I\nI - texto com {pergunta} literal;\n\n[2] Lei 99.999/2099\nArt. 1º Texto corrido fictício.",
    );
    expect(mensagemDaPergunta("Qual a regra?", [comChave])).toBe(
      "Trechos:\n\n[1] Lei 99.999/2099, art. 1º, I\nI - texto com {pergunta} literal;\n\nPergunta: Qual a regra?",
    );
  });
});

describe("configuração", () => {
  it("usa só provedores com chave e modelo, na ordem Gemini e OpenRouter", () => {
    const config = lerConfiguracao({
      OPENROUTER_API_KEY: "k2",
      OPENROUTER_MODEL: "m2:free",
      GEMINI_API_KEY: "k1",
      GEMINI_MODEL: "m1",
      GEMINI_PRECO_ENTRADA_USD_MILHAO: "0.1",
      GEMINI_PRECO_SAIDA_USD_MILHAO: "0.4",
      RAG_FALLBACK: "nao",
    });
    expect(config.provedores.map((p) => [p.nome, p.modelo])).toEqual([["gemini", "m1"], ["openrouter", "m2:free"]]);
    expect(config.usarFallback).toBe(false);
    expect(config.k).toBe(8);
    expect(custoTabela(config.provedores[0]!, 1_000_000, 500_000)).toBeCloseTo(0.3);
    expect(custoTabela(config.provedores[1]!, 1_000_000, 500_000)).toBeNull();
    expect(lerConfiguracao({ GEMINI_API_KEY: "k1" }).provedores).toEqual([]);
  });

  it("recusa modelo do OpenRouter que não seja :free, salvo liberação explícita", () => {
    const env = { OPENROUTER_API_KEY: "k", OPENROUTER_MODEL: "fornecedor/modelo-pago" };
    expect(() => lerConfiguracao(env)).toThrow('não é gratuito (falta ":free")');
    expect(lerConfiguracao({ ...env, OPENROUTER_PERMITIR_PAGO: "sim" }).provedores).toHaveLength(1);
    expect(lerConfiguracao({ ...env, OPENROUTER_MODEL: "fornecedor/modelo:free" }).provedores).toHaveLength(1);
  });

  it("recusa apelido -latest do Gemini", () => {
    expect(() => lerConfiguracao({ GEMINI_API_KEY: "k", GEMINI_MODEL: "gemini-flash-latest" })).toThrow("apelido");
    expect(lerConfiguracao({ GEMINI_API_KEY: "k", GEMINI_MODEL: "gemini-3.5-flash-lite" }).provedores).toHaveLength(1);
  });

  it("dá à coleção o nome da variante e do modelo de embeddings", () => {
    expect(nomeDaColecao("langchain-padrao", "Xenova/multilingual-e5-small")).toBe("langchain-padrao__multilingual-e5-small");
  });
});
