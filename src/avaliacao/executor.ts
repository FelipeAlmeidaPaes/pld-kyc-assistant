import { readFile } from "node:fs/promises";
import { SemProvedorDeLlm } from "../rag/config.js";
import type { Resposta, TrechoRecuperado, Variante, VarianteMontada } from "../rag/tipos.js";
import type { PerguntaDeAvaliacao } from "./perguntas.js";

export interface ConfiguracaoDaExecucao {
  /** Trechos que vão ao modelo. */
  k: number;
  /** Até onde a busca é registrada, para posição e MRR além do k. */
  profundidade: number;
  limiar: number | null;
  modeloDeEmbeddings: string;
  /** Modelo pedido ao provedor; null quando a execução é só de busca. */
  modeloDeLlm: string | null;
  /** Como a busca foi feita, quando não é a das variantes (experimentos de busca). */
  busca?: string;
}

/** Uma linha do arquivo da execução: uma pergunta numa variante. */
export interface RegistroDaAvaliacao {
  execucao: string;
  perguntaId: string;
  variante: Variante;
  registradoEm: string;
  configuracao: ConfiguracaoDaExecucao;
  busca: {
    /** Trechos na ordem da busca, com os dispositivos que cada um contém (null: não localizado). */
    trechos: { referencias: string[] | null; pontuacao: number }[];
    ms: number;
  };
  /** null quando a execução é só de busca, ou quando a pergunta falhou (ver erro). */
  resposta: Resposta | null;
  erro: string | null;
}

export interface DependenciasDoExecutor {
  execucao: string;
  variantes: Partial<Record<Variante, VarianteMontada>>;
  configuracao: ConfiguracaoDaExecucao;
  localizar: (trecho: TrechoRecuperado) => string[] | null;
  /** Pares "perguntaId|variante" já registrados sem erro, pulados na retomada. */
  feitos: Set<string>;
  gravar: (registro: RegistroDaAvaliacao) => Promise<void>;
  semLlm: boolean;
  /** Intervalo mínimo entre o início de duas chamadas ao LLM, para caber na cota gratuita. */
  intervaloMs: number;
  /** Esperas antes de repetir uma pergunta que falhou, além das tentativas do próprio cliente. */
  esperasAposErro: number[];
  esperar: (ms: number) => Promise<void>;
  agora: () => number;
  avisar: (mensagem: string) => void;
}

/** Cota ou limite de taxa do provedor: repetir agora não adianta, e seguir só acumularia falhas. */
export class CotaEsgotada extends Error {
  constructor(causa: unknown) {
    super(`limite de taxa do provedor (429) depois das novas tentativas: ${(causa as Error).message}`, { cause: causa });
    this.name = "CotaEsgotada";
  }
}

const ehLimiteDeTaxa = (erro: unknown) =>
  (erro as { status?: number }).status === 429 || /\b429\b/.test((erro as Error).message ?? "");

export const chaveDoPar = (perguntaId: string, variante: Variante) => `${perguntaId}|${variante}`;

/**
 * Roda cada pergunta em cada variante, uma variante depois da outra na mesma pergunta, e grava
 * um registro por par. Sem fallback: quem monta as variantes desliga (ADR 0002). Falha que não é
 * de cota vira registro com erro, refeito na próxima retomada; 429 persistente interrompe tudo.
 */
export async function executarAvaliacao(
  perguntas: PerguntaDeAvaliacao[],
  deps: DependenciasDoExecutor,
): Promise<{ registrados: number; pulados: number; comErro: number }> {
  const contagem = { registrados: 0, pulados: 0, comErro: 0 };
  let ultimaChamada = Number.NEGATIVE_INFINITY;

  const perguntarNoRitmo = async (variante: VarianteMontada, pergunta: string): Promise<Resposta> => {
    for (let tentativa = 0; ; tentativa++) {
      const espera = ultimaChamada + deps.intervaloMs - deps.agora();
      if (espera > 0) await deps.esperar(espera);
      ultimaChamada = deps.agora();
      try {
        return await variante.perguntar(pergunta);
      } catch (erro) {
        if (erro instanceof SemProvedorDeLlm) throw erro;
        const pausa = deps.esperasAposErro[tentativa];
        if (pausa === undefined) throw ehLimiteDeTaxa(erro) ? new CotaEsgotada(erro) : erro;
        deps.avisar(`  falhou (${(erro as Error).message}); nova tentativa em ${Math.round(pausa / 1000)} s`);
        await deps.esperar(pausa);
      }
    }
  };

  for (const pergunta of perguntas) {
    for (const [variante, montada] of Object.entries(deps.variantes) as [Variante, VarianteMontada][]) {
      if (deps.feitos.has(chaveDoPar(pergunta.id, variante))) {
        contagem.pulados++;
        continue;
      }
      const inicio = deps.agora();
      const trechos = await montada.buscar(pergunta.pergunta, deps.configuracao.profundidade);
      const busca = {
        trechos: trechos.map((t) => ({ referencias: deps.localizar(t), pontuacao: t.pontuacao })),
        ms: deps.agora() - inicio,
      };

      let resposta: Resposta | null = null;
      let erro: string | null = null;
      if (!deps.semLlm) {
        try {
          resposta = await perguntarNoRitmo(montada, pergunta.pergunta);
        } catch (falha) {
          if (falha instanceof CotaEsgotada || falha instanceof SemProvedorDeLlm) throw falha;
          erro = (falha as Error).message;
          contagem.comErro++;
        }
      }

      await deps.gravar({
        execucao: deps.execucao,
        perguntaId: pergunta.id,
        variante,
        registradoEm: new Date(deps.agora()).toISOString(),
        configuracao: deps.configuracao,
        busca,
        resposta,
        erro,
      });
      contagem.registrados++;
      const resumo = erro ? `erro: ${erro}` : resposta ? (resposta.recusa ? "recusou" : "respondeu") : "só busca";
      deps.avisar(`${pergunta.id} ${variante}: ${resumo}`);
    }
  }
  return contagem;
}

/** Registros de um arquivo JSONL; vazio se o arquivo ainda não existe. */
export async function lerRegistros(arquivo: URL): Promise<RegistroDaAvaliacao[]> {
  let conteudo: string;
  try {
    conteudo = await readFile(arquivo, "utf-8");
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw erro;
  }
  return conteudo
    .split("\n")
    .filter((linha) => linha.trim() !== "")
    .map((linha) => JSON.parse(linha) as RegistroDaAvaliacao);
}

/** O registro mais recente de cada par: a retomada acrescenta linhas, não reescreve. */
export function registrosAtuais(registros: RegistroDaAvaliacao[]): RegistroDaAvaliacao[] {
  const porPar = new Map<string, RegistroDaAvaliacao>();
  for (const registro of registros) porPar.set(chaveDoPar(registro.perguntaId, registro.variante), registro);
  return [...porPar.values()];
}
