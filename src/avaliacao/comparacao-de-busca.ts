import type { Variante } from "../rag/tipos.js";
import type { RegistroDaAvaliacao } from "./executor.js";

export interface ComparacaoDeBusca {
  /** Perguntas com os mesmos trechos, na mesma ordem e com a mesma pontuação. */
  iguais: string[];
  /** Primeira posição em que as duas buscas divergem. */
  diferentes: { perguntaId: string; posicao: number; a: string; b: string }[];
  /** Perguntas registradas só numa das execuções. */
  soNumaExecucao: string[];
}

const descrever = (trecho: { referencias: string[] | null; pontuacao: number } | undefined) =>
  trecho ? `${trecho.referencias?.join(" + ") ?? "(não localizado)"} (${trecho.pontuacao})` : "(nenhum)";

/**
 * Compara a busca de uma variante em duas execuções, até a menor profundidade das duas. Serve para
 * a paridade do servidor MCP (ADR 0013): a busca pela ferramenta tem de ser a mesma da direta,
 * trecho a trecho e com a pontuação exata.
 */
export function compararBuscas(a: RegistroDaAvaliacao[], b: RegistroDaAvaliacao[], variante: Variante): ComparacaoDeBusca {
  const daVariante = (registros: RegistroDaAvaliacao[]) =>
    new Map(registros.filter((r) => r.variante === variante).map((r) => [r.perguntaId, r]));
  const [porA, porB] = [daVariante(a), daVariante(b)];
  const resultado: ComparacaoDeBusca = { iguais: [], diferentes: [], soNumaExecucao: [] };
  for (const perguntaId of new Set([...porA.keys(), ...porB.keys()])) {
    const [ra, rb] = [porA.get(perguntaId), porB.get(perguntaId)];
    if (!ra || !rb) {
      resultado.soNumaExecucao.push(perguntaId);
      continue;
    }
    const profundidade = Math.min(ra.configuracao.profundidade, rb.configuracao.profundidade);
    const [ta, tb] = [ra.busca.trechos.slice(0, profundidade), rb.busca.trechos.slice(0, profundidade)];
    const posicao = Array.from({ length: Math.max(ta.length, tb.length) }, (_, i) => i).find(
      (i) => descrever(ta[i]) !== descrever(tb[i]),
    );
    if (posicao === undefined) resultado.iguais.push(perguntaId);
    else resultado.diferentes.push({ perguntaId, posicao: posicao + 1, a: descrever(ta[posicao]), b: descrever(tb[posicao]) });
  }
  return resultado;
}
