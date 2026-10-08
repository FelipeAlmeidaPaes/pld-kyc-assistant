import { describe, expect, it } from "vitest";
import { criarLocalizador } from "../src/avaliacao/cobertura.js";
import {
  CotaEsgotada,
  type DependenciasDoExecutor,
  executarAvaliacao,
  type RegistroDaAvaliacao,
  registrosAtuais,
} from "../src/avaliacao/executor.js";
import { calcularMetricas, categoriaDaRecusa, posicao, quantil } from "../src/avaliacao/metricas.js";
import type { PerguntaDeAvaliacao } from "../src/avaliacao/perguntas.js";
import { montarRelatorio } from "../src/avaliacao/relatorio.js";
import type { Resposta, TrechoRecuperado, VarianteMontada } from "../src/rag/tipos.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const SIGLA = "Lei 99.999/2099";
const ref = (caminho: string) => `${SIGLA}, ${caminho}`;

const pergunta = (id: string, extra: Partial<PerguntaDeAvaliacao> = {}): PerguntaDeAvaliacao => ({
  id,
  origem: "autor, pergunta 1",
  perguntaOriginal: null,
  gabaritoOriginal: null,
  situacao: "confere",
  pergunta: `Pergunta ${id}?`,
  tipo: "coberta",
  gabarito: "Gabarito fictício.",
  dispositivos: [ref("art. 1º, I")],
  aceitos: [ref("art. 1º, caput")],
  naoDeve: [],
  observacao: "",
  validado: true,
  ...extra,
});
const fora = (id: string) => pergunta(id, { tipo: "fora-do-corpus", situacao: "nova", dispositivos: [], aceitos: [] });

const trecho = (caminho: string | null, texto: string, pontuacao = 0.9): TrechoRecuperado => ({
  id: "x",
  normaId: "lei-99999",
  sigla: SIGLA,
  caminho,
  texto,
  pontuacao,
});

const resposta = (extra: Partial<Resposta> = {}): Resposta => ({
  variante: "manual",
  pergunta: "?",
  recusa: false,
  motivoDaRecusa: null,
  resposta: "Com nome completo.",
  citacoes: [{ sigla: SIGLA, caminho: "art. 1º, I" }],
  trechos: [],
  metricas: {
    provedor: "gemini",
    modelo: "modelo",
    tokensEntrada: 100,
    tokensSaida: 20,
    custoTabelaUsd: null,
    latenciaMs: { busca: 10, geracao: 1000, total: 1010 },
  },
  ...extra,
});
const recusa = (motivoDaRecusa: string) => resposta({ recusa: true, motivoDaRecusa, resposta: null, citacoes: [] });

describe("criarLocalizador", () => {
  const localizar = criarLocalizador([normaFicticia]);

  it("dá ao trecho de dispositivo só o próprio dispositivo", () => {
    expect(localizar(trecho("art. 1º, § 1º", "qualquer texto"))).toEqual([ref("art. 1º, § 1º")]);
  });

  it("acha o pedaço do divisor padrão no texto corrido, inclusive a linha tocada só em parte", () => {
    const pedaco = "deve manter cadastro dos clientes:\nI - com nome completo;\n§ 1º O cadastro";
    expect(localizar(trecho(null, pedaco))).toEqual([ref("art. 1º, caput"), ref("art. 1º, I"), ref("art. 1º, § 1º")]);
  });

  it("não conta título nem capítulo como dispositivo, e devolve null para pedaço que não está no corpus", () => {
    expect(localizar(trecho(null, "CAPÍTULO II - DAS DISPOSIÇÕES FINAIS"))).toEqual([]);
    expect(localizar(trecho(null, "texto de outro corpus"))).toBeNull();
  });
});

describe("executarAvaliacao", () => {
  const montada = (perguntar: VarianteMontada["perguntar"]): VarianteMontada => ({
    buscar: async (_, k) => [trecho("art. 1º, caput", "a", 0.9), trecho("art. 1º, I", "b", 0.8)].slice(0, k),
    perguntar,
  });

  function dependencias(extra: Partial<DependenciasDoExecutor> = {}) {
    const registros: RegistroDaAvaliacao[] = [];
    const esperas: number[] = [];
    let relogio = 0;
    const deps: DependenciasDoExecutor = {
      execucao: "teste",
      variantes: { manual: montada(async () => resposta()) },
      configuracao: { k: 5, profundidade: 20, limiar: null, modeloDeEmbeddings: "e5", modeloDeLlm: "modelo" },
      localizar: criarLocalizador([normaFicticia]),
      feitos: new Set(),
      gravar: async (r) => void registros.push(r),
      semLlm: false,
      intervaloMs: 5000,
      esperasAposErro: [100, 200],
      esperar: async (ms) => {
        esperas.push(ms);
        relogio += ms;
      },
      agora: () => relogio,
      avisar: () => {},
      ...extra,
    };
    return { deps, registros, esperas };
  }

  it("registra a busca com os dispositivos de cada trecho e a resposta, no ritmo pedido", async () => {
    const { deps, registros, esperas } = dependencias();
    const resultado = await executarAvaliacao([pergunta("q01"), pergunta("q02")], deps);

    expect(resultado).toEqual({ registrados: 2, pulados: 0, comErro: 0 });
    expect(registros[0]).toMatchObject({
      perguntaId: "q01",
      variante: "manual",
      busca: { trechos: [{ referencias: [ref("art. 1º, caput")], pontuacao: 0.9 }, { referencias: [ref("art. 1º, I")], pontuacao: 0.8 }] },
      resposta: { recusa: false },
      erro: null,
    });
    // A primeira chamada sai na hora; a segunda espera o intervalo inteiro.
    expect(esperas).toEqual([5000]);
  });

  it("pula o que já foi feito e não chama o LLM na execução só de busca", async () => {
    let chamadas = 0;
    const { deps, registros } = dependencias({
      variantes: { manual: montada(async () => (chamadas++, resposta())) },
      feitos: new Set(["q01|manual"]),
      semLlm: true,
    });
    expect(await executarAvaliacao([pergunta("q01"), pergunta("q02")], deps)).toEqual({ registrados: 1, pulados: 1, comErro: 0 });
    expect(chamadas).toBe(0);
    expect(registros[0]).toMatchObject({ perguntaId: "q02", resposta: null, erro: null });
  });

  it("tenta de novo depois de esperar e, se não passar, registra o erro e segue", async () => {
    let chamadas = 0;
    const { deps, registros, esperas } = dependencias({
      variantes: { manual: montada(async () => (chamadas++, Promise.reject(new Error("gemini: HTTP 500 após 3 tentativas")))) },
    });
    expect(await executarAvaliacao([pergunta("q01")], deps)).toEqual({ registrados: 1, pulados: 0, comErro: 1 });
    expect(chamadas).toBe(3);
    expect(esperas.filter((ms) => ms === 100 || ms === 200)).toEqual([100, 200]);
    expect(registros[0]).toMatchObject({ resposta: null, erro: "gemini: HTTP 500 após 3 tentativas" });
  });

  it("interrompe a execução quando o 429 persiste, sem perder o que já gravou", async () => {
    let chamadas = 0;
    const { deps, registros } = dependencias({
      variantes: {
        manual: montada(async () => (++chamadas === 1 ? resposta() : Promise.reject(new Error("gemini: HTTP 429 após 3 tentativas")))),
      },
    });
    await expect(executarAvaliacao([pergunta("q01"), pergunta("q02")], deps)).rejects.toBeInstanceOf(CotaEsgotada);
    expect(registros.map((r) => r.perguntaId)).toEqual(["q01"]);
  });
});

describe("métricas", () => {
  const registro = (perguntaId: string, referencias: (string[] | null)[], extra: Partial<RegistroDaAvaliacao> = {}): RegistroDaAvaliacao => ({
    execucao: "teste",
    perguntaId,
    variante: "manual",
    registradoEm: "2099-01-01T00:00:00.000Z",
    configuracao: { k: 2, profundidade: 20, limiar: null, modeloDeEmbeddings: "e5", modeloDeLlm: "modelo" },
    busca: { trechos: referencias.map((r, i) => ({ referencias: r, pontuacao: 0.9 - i / 100 })), ms: 1 },
    resposta: resposta(),
    erro: null,
    ...extra,
  });
  const perguntas = new Map(
    [
      pergunta("q01"),
      pergunta("q02", { dispositivos: [ref("art. 1º, I"), ref("art. 1º, § 1º")] }),
      pergunta("q03"),
      fora("f01"),
    ].map((p) => [p.id, p]),
  );

  it("acha a posição pelo primeiro trecho que contém o dispositivo", () => {
    const r = registro("q01", [[ref("art. 1º, caput")], null, [ref("art. 1º, caput"), ref("art. 1º, I")]]);
    expect(posicao(r, ref("art. 1º, I"))).toBe(3);
    expect(posicao(r, ref("art. 1º, § 1º"))).toBeNull();
  });

  it("calcula recall, acerto e MRR nas cobertas, e recusa e citações nas respostas", () => {
    const registros = [
      registro("q01", [[ref("art. 1º, I")], [ref("art. 1º, caput")]]),
      registro("q02", [[ref("art. 1º, caput")], [ref("art. 1º, § 1º")], [ref("art. 1º, I")]], {
        resposta: resposta({ citacoes: [{ sigla: SIGLA, caminho: "art. 1º, § 1º" }, { sigla: SIGLA, caminho: "art. 2º, parágrafo único" }] }),
      }),
      registro("q03", [[ref("art. 2º, parágrafo único")]], { resposta: recusa("o modelo indicou que os trechos recuperados não cobrem a pergunta") }),
      registro("f01", [[ref("art. 1º, caput")]], { resposta: recusa("resposta sem citação") }),
    ];
    const m = calcularMetricas("manual", registros, perguntas, 2);

    // q01: 1 de 1 até a posição 2; q02: 1 de 2; q03: nenhum.
    expect(m.busca.recallNoK).toBeCloseTo((1 + 0.5 + 0) / 3);
    expect(m.busca.acertoNoK).toBeCloseTo(2 / 3);
    expect(m.busca.mrr).toBeCloseTo((1 + 1 / 2 + 0) / 3);
    expect(m.resposta.falsaRecusa).toEqual({ quantas: 1, de: 3 });
    expect(m.resposta.recusaCorreta).toEqual({ quantas: 1, de: 1 });
    expect(m.resposta.motivosDeRecusa).toEqual({ "modelo: não cobre": 1, "sem citação": 1 });
    // q01 cita o exigido; q02 cita um exigido e um fora da lista.
    expect(m.resposta.citacoesPertinentes).toEqual({ quantas: 2, de: 3 });
    expect(m.resposta.coberturaDasCitacoes).toBeCloseTo((1 + 0.5) / 2);
    expect(m.resposta.custoTabelaUsd).toBeNull();
  });

  it("separa a pontuação do melhor trecho de cobertas e de fora do corpus", () => {
    const m = calcularMetricas("manual", [registro("q01", [[ref("art. 1º, I")]]), registro("f01", [[], []])], perguntas, 2);
    expect(m.busca.melhorPontuacao).toEqual({
      coberta: { min: 0.9, mediana: 0.9, max: 0.9 },
      "fora-do-corpus": { min: 0.9, mediana: 0.9, max: 0.9 },
    });
  });

  it("classifica o motivo da recusa e calcula quantis", () => {
    expect(categoriaDaRecusa("citação não confere: x")).toBe("citação não confere");
    expect(categoriaDaRecusa("nenhum trecho recuperado atingiu a pontuação mínima")).toBe("abaixo do limiar");
    expect(quantil([3, 1, 2, 4], 0.5)).toBe(2);
    expect(quantil([3, 1, 2, 4], 0.95)).toBe(4);
    expect(quantil([], 0.5)).toBeNull();
  });

  it("fica com o registro mais recente de cada par", () => {
    const antigo = registro("q01", [], { erro: "falhou" });
    const novo = registro("q01", [], { registradoEm: "2099-01-02T00:00:00.000Z" });
    expect(registrosAtuais([antigo, novo])).toEqual([novo]);
  });

  it("monta o relatório com as tabelas e o desfecho de cada pergunta", () => {
    const relatorio = montarRelatorio(
      [registro("q01", [[ref("art. 1º, I")]]), registro("f01", [[]], { resposta: recusa("resposta sem citação") })],
      [...perguntas.values()],
    );
    expect(relatorio).toContain("| manual | 1 | 100% | 100% | 1.00 |");
    expect(relatorio).toContain("| q01 | coberta | 1 · respondeu 1/1 |");
    expect(relatorio).toContain("| f01 | fora | recusou (sem citação) |");
  });
});
