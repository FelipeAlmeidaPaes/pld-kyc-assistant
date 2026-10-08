import type { IndiceDoCorpus } from "../corpus.js";
import { INSTRUCOES, mensagemDaPergunta } from "../prompt.js";
import { abaixoDoLimiar, concluirResposta } from "../resposta.js";
import type { Geracao, Pipeline, TrechoRecuperado } from "../tipos.js";

export interface DependenciasManual {
  buscar: (pergunta: string, k: number) => Promise<TrechoRecuperado[]>;
  gerar: (instrucoes: string, mensagem: string) => Promise<Geracao>;
  indice: IndiceDoCorpus;
  k: number;
  limiar: number | null;
}

/** Variante manual: busca, prompt, chamada e conclusão, em sequência e à vista. */
export function criarPipelineManual(deps: DependenciasManual): Pipeline {
  return async (pergunta) => {
    const inicio = performance.now();
    const trechos = await deps.buscar(pergunta, deps.k);
    const busca = performance.now() - inicio;

    let geracao: Geracao | null = null;
    let duracaoDaGeracao: number | null = null;
    if (!abaixoDoLimiar(trechos, deps.limiar)) {
      const inicioDaGeracao = performance.now();
      geracao = await deps.gerar(INSTRUCOES, mensagemDaPergunta(pergunta, trechos));
      duracaoDaGeracao = performance.now() - inicioDaGeracao;
    }

    const latenciaMs = { busca, geracao: duracaoDaGeracao, total: performance.now() - inicio };
    return concluirResposta({ variante: "manual", pergunta, trechos, geracao, latenciaMs }, deps.indice);
  };
}
