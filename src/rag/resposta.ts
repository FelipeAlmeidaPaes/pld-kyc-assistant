import { validarCitacoes } from "./citacoes.js";
import type { IndiceDoCorpus } from "./corpus.js";
import type { Geracao, Resposta, TrechoRecuperado, Variante } from "./tipos.js";

export interface Etapas {
  variante: Variante;
  pergunta: string;
  trechos: TrechoRecuperado[];
  /** null quando a busca não justificou chamar o LLM. */
  geracao: Geracao | null;
  latenciaMs: { busca: number; geracao: number | null; total: number };
}

/** Busca sem trecho acima do limiar: recusa sem gastar chamada de LLM. */
export function abaixoDoLimiar(trechos: TrechoRecuperado[], limiar: number | null): boolean {
  if (limiar === null) return false;
  return trechos.length === 0 || Math.max(...trechos.map((t) => t.pontuacao)) < limiar;
}

/**
 * Regras de recusa e de citação, iguais nas três variantes (ADR 0007). A resposta só sai se o
 * modelo disser que os trechos cobrem a pergunta, citar ao menos um dispositivo e todas as
 * citações conferirem com o corpus e com os trechos recuperados.
 */
export function concluirResposta(etapas: Etapas, indice: IndiceDoCorpus): Resposta {
  const { variante, pergunta, trechos, geracao, latenciaMs } = etapas;
  const base = {
    variante,
    pergunta,
    trechos: trechos.map((t) => ({ sigla: t.sigla, caminho: t.caminho, pontuacao: t.pontuacao })),
    metricas: {
      provedor: geracao?.provedor ?? null,
      modelo: geracao?.modelo ?? null,
      tokensEntrada: geracao?.tokensEntrada ?? null,
      tokensSaida: geracao?.tokensSaida ?? null,
      custoTabelaUsd: geracao?.custoTabelaUsd ?? null,
      latenciaMs,
    },
  };
  const recusa = (motivoDaRecusa: string): Resposta => ({
    ...base,
    recusa: true,
    motivoDaRecusa,
    resposta: null,
    citacoes: [],
  });

  if (!geracao) return recusa("nenhum trecho recuperado atingiu a pontuação mínima");
  const { saida } = geracao;
  if (!saida.cobre) return recusa("o modelo indicou que os trechos recuperados não cobrem a pergunta");
  if (saida.citacoes.length === 0) return recusa("resposta sem citação");

  const { validas, invalidas } = validarCitacoes(saida.citacoes, trechos, indice);
  if (invalidas.length > 0) {
    const detalhe = invalidas.map((i) => `${i.citacao.sigla}, ${i.citacao.caminho} (${i.motivo})`).join("; ");
    return recusa(`citação não confere: ${detalhe}`);
  }
  return { ...base, recusa: false, motivoDaRecusa: null, resposta: saida.resposta, citacoes: validas };
}
