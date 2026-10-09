import type { Variante } from "../rag/tipos.js";
import { chaveDoPar, type RegistroDaAvaliacao } from "./executor.js";
import { type Julgamento, precisaDeJuiz } from "./juiz.js";
import type { PerguntaDeAvaliacao } from "./perguntas.js";

/** Posição (a partir de 1) do primeiro trecho que contém a referência; null se não veio. */
export function posicao(registro: RegistroDaAvaliacao, referencia: string): number | null {
  const i = registro.busca.trechos.findIndex((t) => t.referencias?.includes(referencia));
  return i < 0 ? null : i + 1;
}

/** Posição do primeiro dispositivo exigido que a busca trouxe. */
export function primeiraPosicao(registro: RegistroDaAvaliacao, pergunta: PerguntaDeAvaliacao): number | null {
  const posicoes = pergunta.dispositivos.map((d) => posicao(registro, d)).filter((p): p is number => p !== null);
  return posicoes.length > 0 ? Math.min(...posicoes) : null;
}

/** Motivo da recusa em categoria curta, a partir do texto fixo de `concluirResposta`. */
export function categoriaDaRecusa(motivo: string | null): string {
  if (!motivo) return "outro";
  if (motivo.startsWith("nenhum trecho")) return "abaixo do limiar";
  if (motivo.startsWith("o modelo indicou")) return "modelo: não cobre";
  if (motivo.startsWith("resposta sem citação")) return "sem citação";
  if (motivo.startsWith("citação não confere")) return "citação não confere";
  if (motivo.startsWith("valor sem respaldo")) return "valor sem respaldo";
  return "outro";
}

const media = (valores: number[]) => (valores.length === 0 ? null : valores.reduce((a, b) => a + b, 0) / valores.length);

/** Quantil pelo método do posto mais próximo; null sem valores. */
export function quantil(valores: number[], q: number): number | null {
  if (valores.length === 0) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  return ordenados[Math.min(ordenados.length - 1, Math.max(0, Math.ceil(q * ordenados.length) - 1))]!;
}

export interface MetricasDaVariante {
  variante: Variante;
  perguntas: number;
  comErro: number;
  busca: {
    cobertas: number;
    /** Média, nas perguntas cobertas, da fração dos dispositivos exigidos que vieram até a posição k. */
    recallNoK: number | null;
    /** Fração das perguntas cobertas com ao menos um dispositivo exigido até a posição k. */
    acertoNoK: number | null;
    /** Média de 1/posição do primeiro dispositivo exigido, até a profundidade registrada. */
    mrr: number | null;
    /** Pontuação do melhor trecho: separa coberta de fora do corpus? Base para calibrar o limiar. */
    melhorPontuacao: Record<"coberta" | "fora-do-corpus", { min: number | null; mediana: number | null; max: number | null }>;
  };
  resposta: {
    avaliadas: number;
    /** Perguntas cobertas que o sistema recusou, fora as de recusa aceita. */
    falsaRecusa: { quantas: number; de: number };
    /** Perguntas fora do corpus que o sistema recusou, como devia. */
    recusaCorreta: { quantas: number; de: number };
    motivosDeRecusa: Record<string, number>;
    /** Das citações das respostas, quantas estão entre os dispositivos exigidos ou aceitos. */
    citacoesPertinentes: { quantas: number; de: number };
    /** Média, nas respondidas, da fração dos dispositivos exigidos que a resposta citou. */
    coberturaDasCitacoes: number | null;
    tokensEntradaMedio: number | null;
    tokensSaidaMedio: number | null;
    /** Soma a preço de tabela; null se algum registro não tiver preço configurado. */
    custoTabelaUsd: number | null;
    latenciaMs: { geracaoP50: number | null; geracaoP95: number | null; totalP50: number | null; totalP95: number | null };
  };
}

export function calcularMetricas(
  variante: Variante,
  registros: RegistroDaAvaliacao[],
  perguntas: Map<string, PerguntaDeAvaliacao>,
  k: number,
): MetricasDaVariante {
  const daVariante = registros.filter((r) => r.variante === variante && perguntas.has(r.perguntaId));
  const pergunta = (r: RegistroDaAvaliacao) => perguntas.get(r.perguntaId)!;
  const cobertas = daVariante.filter((r) => pergunta(r).tipo === "coberta");

  const recall = cobertas.map((r) => {
    const exigidos = pergunta(r).dispositivos;
    return exigidos.filter((d) => (posicao(r, d) ?? Infinity) <= k).length / exigidos.length;
  });
  const primeiras = cobertas.map((r) => primeiraPosicao(r, pergunta(r)));
  const pontuacoes = (tipo: PerguntaDeAvaliacao["tipo"]) => {
    const valores = daVariante
      .filter((r) => pergunta(r).tipo === tipo && r.busca.trechos.length > 0)
      .map((r) => r.busca.trechos[0]!.pontuacao);
    return { min: quantil(valores, 0), mediana: quantil(valores, 0.5), max: quantil(valores, 1) };
  };

  const comResposta = daVariante.filter((r) => r.resposta !== null);
  const respostaDe = (r: RegistroDaAvaliacao) => r.resposta!;
  const cobertasRespondidas = comResposta.filter((r) => pergunta(r).tipo === "coberta" && !respostaDe(r).recusa);
  const fora = comResposta.filter((r) => pergunta(r).tipo === "fora-do-corpus");
  const motivos: Record<string, number> = {};
  for (const r of comResposta.filter((r) => respostaDe(r).recusa)) {
    const categoria = categoriaDaRecusa(respostaDe(r).motivoDaRecusa);
    motivos[categoria] = (motivos[categoria] ?? 0) + 1;
  }
  const citadas = (r: RegistroDaAvaliacao) => respostaDe(r).citacoes.map((c) => `${c.sigla}, ${c.caminho}`);
  const pertinentes = cobertasRespondidas.map((r) => {
    const validas = new Set([...pergunta(r).dispositivos, ...pergunta(r).aceitos]);
    return citadas(r).filter((c) => validas.has(c)).length;
  });
  const geradas = comResposta.filter((r) => respostaDe(r).metricas.modelo !== null);
  const numeros = (valores: (number | null)[]) => valores.filter((v): v is number => v !== null);
  const custos = geradas.map((r) => respostaDe(r).metricas.custoTabelaUsd);
  const latencias = comResposta.map((r) => respostaDe(r).metricas.latenciaMs);

  return {
    variante,
    perguntas: daVariante.length,
    comErro: daVariante.filter((r) => r.erro !== null).length,
    busca: {
      cobertas: cobertas.length,
      recallNoK: media(recall),
      acertoNoK: media(primeiras.map((p) => ((p ?? Infinity) <= k ? 1 : 0))),
      mrr: media(primeiras.map((p) => (p === null ? 0 : 1 / p))),
      melhorPontuacao: { coberta: pontuacoes("coberta"), "fora-do-corpus": pontuacoes("fora-do-corpus") },
    },
    resposta: {
      avaliadas: comResposta.length,
      falsaRecusa: {
        quantas: comResposta.filter((r) => pergunta(r).tipo === "coberta" && !pergunta(r).recusaAceita && respostaDe(r).recusa).length,
        de: comResposta.filter((r) => pergunta(r).tipo === "coberta").length,
      },
      recusaCorreta: { quantas: fora.filter((r) => respostaDe(r).recusa).length, de: fora.length },
      motivosDeRecusa: motivos,
      citacoesPertinentes: {
        quantas: pertinentes.reduce((a, b) => a + b, 0),
        de: cobertasRespondidas.reduce((total, r) => total + citadas(r).length, 0),
      },
      coberturaDasCitacoes: media(
        cobertasRespondidas.map((r) => {
          const feitas = new Set(citadas(r));
          return pergunta(r).dispositivos.filter((d) => feitas.has(d)).length / pergunta(r).dispositivos.length;
        }),
      ),
      tokensEntradaMedio: media(numeros(geradas.map((r) => respostaDe(r).metricas.tokensEntrada))),
      tokensSaidaMedio: media(numeros(geradas.map((r) => respostaDe(r).metricas.tokensSaida))),
      custoTabelaUsd: custos.some((c) => c === null) ? null : custos.reduce<number>((a, b) => a + b!, 0),
      latenciaMs: {
        geracaoP50: quantil(numeros(latencias.map((l) => l.geracao)), 0.5),
        geracaoP95: quantil(numeros(latencias.map((l) => l.geracao)), 0.95),
        totalP50: quantil(latencias.map((l) => l.total), 0.5),
        totalP95: quantil(latencias.map((l) => l.total), 0.95),
      },
    },
  };
}

export interface AcertoDaVariante {
  /** Respostas a perguntas cobertas que precisam de juiz, e quantas já têm julgamento. */
  aJulgar: number;
  julgadas: number;
  corretas: number;
  parciais: number;
  incorretas: number;
  /** Nas cobertas: resposta julgada correta, ou recusa onde recusar é aceito. */
  acertoFimAFim: { quantas: number; de: number };
  /** Respostas que afirmaram algum item de `naoDeve`. */
  afirmaramNaoDeve: number;
  /** Respostas em que o modelo declarou cobertura parcial; null nas execuções sem a declaração. */
  declaradasParciais: number | null;
  /** Julgadas parciais pelo juiz, mas declaradas totais pelo modelo: a incompletude que fica escondida. */
  parciaisNaoDeclaradas: number | null;
}

export function calcularAcerto(
  variante: Variante,
  registros: RegistroDaAvaliacao[],
  perguntas: Map<string, PerguntaDeAvaliacao>,
  julgamentos: Map<string, Julgamento>,
): AcertoDaVariante {
  const cobertas = registros.filter(
    (r) => r.variante === variante && perguntas.get(r.perguntaId)?.tipo === "coberta" && r.resposta !== null,
  );
  const aJulgar = cobertas.filter((r) => precisaDeJuiz(r, perguntas.get(r.perguntaId)));
  const vereditos = aJulgar.flatMap((r) => julgamentos.get(chaveDoPar(r.perguntaId, r.variante)) ?? []);
  const contar = (v: Julgamento["veredito"]) => vereditos.filter((j) => j.veredito === v).length;
  const recusasAceitas = cobertas.filter((r) => r.resposta!.recusa && perguntas.get(r.perguntaId)!.recusaAceita).length;
  const comDeclaracao = aJulgar.some((r) => r.resposta!.cobertura !== undefined);
  const julgamentoDe = (r: RegistroDaAvaliacao) => julgamentos.get(chaveDoPar(r.perguntaId, r.variante));
  return {
    aJulgar: aJulgar.length,
    julgadas: vereditos.length,
    corretas: contar("correta"),
    parciais: contar("parcial"),
    incorretas: contar("incorreta"),
    acertoFimAFim: { quantas: contar("correta") + recusasAceitas, de: cobertas.length },
    afirmaramNaoDeve: vereditos.filter((j) => j.naoDeveAfirmados.length > 0).length,
    declaradasParciais: comDeclaracao ? aJulgar.filter((r) => r.resposta!.cobertura === "parcial").length : null,
    parciaisNaoDeclaradas: comDeclaracao
      ? aJulgar.filter((r) => r.resposta!.cobertura === "total" && julgamentoDe(r)?.veredito === "parcial").length
      : null,
  };
}
