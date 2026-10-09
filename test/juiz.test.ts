import { describe, expect, it } from "vitest";
import type { RegistroDaAvaliacao } from "../src/avaliacao/executor.js";
import {
  amostraParaAuditoria,
  hashDaResposta,
  INSTRUCOES_DO_JUIZ,
  type Julgamento,
  VERSAO_DO_JUIZ,
  julgamentosValidos,
  julgarExecucao,
  mensagemDoJulgamento,
  type SaidaDoJuiz,
} from "../src/avaliacao/juiz.js";
import { calcularAcerto } from "../src/avaliacao/metricas.js";
import type { PerguntaDeAvaliacao } from "../src/avaliacao/perguntas.js";
import { montarAuditoria, montarRelatorio } from "../src/avaliacao/relatorio.js";
import type { Resposta } from "../src/rag/tipos.js";

const SIGLA = "Lei 99.999/2099";

const pergunta = (id: string, extra: Partial<PerguntaDeAvaliacao> = {}): PerguntaDeAvaliacao => ({
  id,
  origem: "autor, pergunta 1",
  perguntaOriginal: null,
  gabaritoOriginal: null,
  situacao: "confere",
  pergunta: `Pergunta ${id}?`,
  tipo: "coberta",
  recusaAceita: false,
  gabarito: "Com nome completo.",
  dispositivos: [`${SIGLA}, art. 1º, I`],
  aceitos: [],
  naoDeve: ["dizer que o cadastro é opcional"],
  observacao: "",
  validado: true,
  ...extra,
});

const resposta = (texto: string | null, recusa = false): Resposta => ({
  variante: "manual",
  pergunta: "?",
  recusa,
  motivoDaRecusa: recusa ? "o modelo indicou que os trechos recuperados não cobrem a pergunta" : null,
  resposta: texto,
  citacoes: recusa ? [] : [{ sigla: SIGLA, caminho: "art. 1º, I" }],
  trechos: [],
  metricas: { provedor: "gemini", modelo: "m", tokensEntrada: 1, tokensSaida: 1, custoTabelaUsd: null, latenciaMs: { busca: 1, geracao: 1, total: 2 } },
});

const registro = (perguntaId: string, r: Resposta | null, extra: Partial<RegistroDaAvaliacao> = {}): RegistroDaAvaliacao => ({
  execucao: "teste",
  perguntaId,
  variante: "manual",
  registradoEm: "2099-01-01T00:00:00.000Z",
  configuracao: { k: 5, profundidade: 20, limiar: null, modeloDeEmbeddings: "e5", modeloDeLlm: "m" },
  busca: { trechos: [], ms: 1 },
  resposta: r,
  erro: null,
  ...extra,
});

const julgamento = (perguntaId: string, r: Resposta, veredito: Julgamento["veredito"], extra: Partial<Julgamento> = {}): Julgamento => ({
  execucao: "teste",
  perguntaId,
  variante: "manual",
  hashDaResposta: hashDaResposta(r),
  registradoEm: "2099-01-01T00:00:00.000Z",
  juiz: { provedor: "openrouter", modelo: "juiz-ficticio" },
  versaoDoJuiz: VERSAO_DO_JUIZ,
  veredito,
  naoDeveAfirmados: [],
  justificativa: "Justificativa fictícia.",
  tokensEntrada: 1,
  tokensSaida: 1,
  ...extra,
});

describe("mensagemDoJulgamento", () => {
  it("leva pergunta, gabarito, itens de não deve numerados, resposta e citações", () => {
    const mensagem = mensagemDoJulgamento(pergunta("q01"), resposta("Com nome completo."));
    expect(mensagem).toBe(
      [
        "Pergunta: Pergunta q01?",
        "Gabarito: Com nome completo.",
        "Não deve afirmar:\n1. dizer que o cadastro é opcional",
        "Resposta do assistente: Com nome completo.",
        `Citações da resposta: ${SIGLA}, art. 1º, I`,
      ].join("\n\n"),
    );
    expect(mensagemDoJulgamento(pergunta("q02", { naoDeve: [] }), resposta("x"))).toContain("Não deve afirmar:\n(nenhum item)");
  });
});

describe("julgarExecucao", () => {
  const perguntas = new Map([pergunta("q01"), pergunta("q02"), pergunta("f01", { tipo: "fora-do-corpus", dispositivos: [] })].map((p) => [p.id, p]));

  it("julga só resposta a pergunta coberta, no ritmo pedido, e guarda o item de não deve por extenso", async () => {
    const julgados: Julgamento[] = [];
    const pedidos: string[] = [];
    const esperas: number[] = [];
    let relogio = 0;
    const saida: SaidaDoJuiz = { justificativa: "Afirma o que não devia.", veredito: "incorreta", naoDeveAfirmados: [1, 7] };
    const resultado = await julgarExecucao(
      [
        registro("q01", resposta("Cadastro opcional.")),
        registro("q02", resposta(null, true)),
        registro("f01", resposta("Resposta indevida.")),
        registro("q01", resposta("x"), { variante: "langchain" }),
      ],
      perguntas,
      {
        execucao: "teste",
        juiz: { provedor: "openrouter", modelo: "juiz-ficticio" },
        julgar: async (instrucoes, mensagem) => {
          expect(instrucoes).toBe(INSTRUCOES_DO_JUIZ);
          pedidos.push(mensagem);
          return { saida, modelo: "juiz-servido", tokensEntrada: 10, tokensSaida: 5 };
        },
        feitos: new Set(["q01|langchain"]),
        gravar: async (j) => void julgados.push(j),
        intervaloMs: 4000,
        esperar: async (ms) => void (esperas.push(ms), (relogio += ms)),
        agora: () => relogio,
        avisar: () => {},
      },
    );
    expect(resultado).toEqual({ julgados: 1, pulados: 1 });
    expect(pedidos).toHaveLength(1);
    expect(julgados[0]).toMatchObject({
      perguntaId: "q01",
      veredito: "incorreta",
      juiz: { provedor: "openrouter", modelo: "juiz-servido" },
      versaoDoJuiz: VERSAO_DO_JUIZ,
      naoDeveAfirmados: ["dizer que o cadastro é opcional"],
    });
    expect(esperas).toEqual([]);
  });

  it("descarta julgamento de outra versão das instruções, ou de antes do versionamento", () => {
    const r = resposta("Com nome completo.");
    const { versaoDoJuiz: _, ...semVersao } = julgamento("q01", r, "correta");
    expect(julgamentosValidos([registro("q01", r)], [semVersao]).size).toBe(0);
    expect(julgamentosValidos([registro("q01", r)], [julgamento("q01", r, "correta", { versaoDoJuiz: "antiga" })]).size).toBe(0);
    expect(julgamentosValidos([registro("q01", r)], [julgamento("q01", r, "correta")]).size).toBe(1);
  });

  it("descarta julgamento de resposta que mudou depois", () => {
    const antiga = resposta("Texto antigo.");
    const validos = julgamentosValidos([registro("q01", resposta("Texto novo."))], [julgamento("q01", antiga, "correta")]);
    expect(validos.size).toBe(0);
  });
});

describe("acerto e auditoria", () => {
  const perguntas = new Map(
    [pergunta("q01"), pergunta("q02"), pergunta("q03", { recusaAceita: true }), pergunta("q04")].map((p) => [p.id, p]),
  );
  const r1 = resposta("Com nome completo.");
  const r2 = resposta("Cadastro opcional.");
  const registros = [registro("q01", r1), registro("q02", r2), registro("q03", resposta(null, true)), registro("q04", resposta(null, true))];
  const julgamentos = [
    julgamento("q01", r1, "correta"),
    julgamento("q02", r2, "incorreta", { naoDeveAfirmados: ["dizer que o cadastro é opcional"] }),
  ];

  it("conta como acerto fim a fim a resposta correta e a recusa aceita", () => {
    const acerto = calcularAcerto("manual", registros, perguntas, julgamentosValidos(registros, julgamentos));
    expect(acerto).toEqual({
      aJulgar: 2,
      julgadas: 2,
      corretas: 1,
      parciais: 0,
      incorretas: 1,
      acertoFimAFim: { quantas: 2, de: 4 },
      afirmaramNaoDeve: 1,
      declaradasParciais: null,
      parciaisNaoDeclaradas: null,
    });
  });

  it("separa a parcial que o modelo declarou da que ele disse ser total", () => {
    const declarada = { ...resposta("Só o nome."), cobertura: "parcial" as const, naoCoberto: "o documento" };
    const escondida = { ...resposta("Só o nome."), cobertura: "total" as const, naoCoberto: null };
    const completa = { ...resposta("Com nome completo."), cobertura: "total" as const, naoCoberto: null };
    const comDeclaracao = [registro("q01", declarada), registro("q02", escondida), registro("q04", completa)];
    const vereditos = [
      julgamento("q01", declarada, "parcial"),
      julgamento("q02", escondida, "parcial"),
      julgamento("q04", completa, "correta"),
    ];
    const acerto = calcularAcerto("manual", comDeclaracao, perguntas, julgamentosValidos(comDeclaracao, vereditos));
    expect(acerto).toMatchObject({ parciais: 2, declaradasParciais: 1, parciaisNaoDeclaradas: 1 });
    const relatorio = montarRelatorio(comDeclaracao, [...perguntas.values()], vereditos);
    expect(relatorio).toContain("| manual | 3 | 1 | 2 | 0 | 1/3 (33%) | 0 | 1 | 1 |");
    expect(relatorio).toContain("[parcial; sem resposta nos trechos: o documento]");
  });

  it("mostra o juiz no relatório e na célula de cada pergunta", () => {
    const relatorio = montarRelatorio(registros, [...perguntas.values()], julgamentos);
    expect(relatorio).toContain(`Conteúdo das respostas julgado por openrouter/juiz-ficticio, versão ${VERSAO_DO_JUIZ}`);
    expect(relatorio).toContain("| manual | 2 | 1 | 0 | 1 | 2/4 (50%) | 1 |");
    expect(relatorio).toContain("respondeu 1/1, incorreta, afirmou o que não devia");
    expect(relatorio).toContain("> juiz: **correta**. Justificativa fictícia.");
  });

  it("sorteia a amostra de forma fixa, com metade não correta quando dá", () => {
    const muitos = Array.from({ length: 30 }, (_, i) =>
      julgamento(`q${i}`, resposta(`r${i}`), i < 6 ? "parcial" : "correta"),
    );
    const amostra = amostraParaAuditoria(muitos, 10, "semente");
    expect(amostra.filter((j) => j.veredito !== "correta")).toHaveLength(5);
    expect(amostra).toHaveLength(10);
    expect(amostraParaAuditoria(muitos, 10, "semente")).toEqual(amostra);
    expect(amostraParaAuditoria(muitos.slice(0, 8), 10, "s").filter((j) => j.veredito === "correta")).toHaveLength(2);
  });

  it("monta a auditoria com pergunta, gabarito, resposta e veredito", () => {
    const auditoria = montarAuditoria(registros, [...perguntas.values()], julgamentos, 5);
    expect(auditoria).toContain("## A1 · q02 · manual · juiz: incorreta");
    expect(auditoria).toContain("**Gabarito:** Com nome completo.");
    expect(auditoria).toContain("**Justificativa do juiz:** Justificativa fictícia. Afirmou o que não devia: dizer que o cadastro é opcional.");
  });
});
