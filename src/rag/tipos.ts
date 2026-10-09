import { z } from "zod";

/** Variantes do RAG da v1 (ADR 0007). */
export const VARIANTES = ["manual", "langchain", "langchain-padrao"] as const;
export type Variante = (typeof VARIANTES)[number];

/** Unidade indexada e mostrada ao modelo. */
export interface Trecho {
  /** UUID determinístico, para reindexar sem duplicar pontos. */
  id: string;
  normaId: string;
  sigla: string;
  /** Caminho do dispositivo; null quando o trecho não é um dispositivo (divisor padrão). */
  caminho: string | null;
  texto: string;
}

export interface TrechoRecuperado extends Trecho {
  /** Similaridade de cosseno com a pergunta. */
  pontuacao: number;
}

/** O que o modelo devolve. É o mesmo esquema nas três variantes. */
export const esquemaDaSaida = z.object({
  cobertura: z
    .enum(["total", "parcial", "nenhuma"])
    .describe("total: os trechos respondem a tudo o que a pergunta pede; parcial: a uma parte; nenhuma: a nada"),
  resposta: z.string().describe("resposta em português, vazia quando a cobertura é nenhuma"),
  naoCoberto: z
    .string()
    .describe("o que a pergunta pede e os trechos não respondem; vazio quando a cobertura é total"),
  citacoes: z
    .array(
      z.object({
        sigla: z.string().describe("sigla da norma, como aparece no cabeçalho do trecho"),
        caminho: z.string().describe("caminho do dispositivo, ex.: art. 1º, § 2º, I, a"),
      }),
    )
    .describe("dispositivos que sustentam a resposta"),
});
export type SaidaDoModelo = z.infer<typeof esquemaDaSaida>;

export interface Citacao {
  sigla: string;
  caminho: string;
}

/** Uma chamada ao LLM já interpretada. */
export interface Geracao {
  saida: SaidaDoModelo;
  provedor: string;
  modelo: string;
  tokensEntrada: number | null;
  tokensSaida: number | null;
  /** Custo a preço de tabela (ADR 0002); null se o preço não estiver configurado. */
  custoTabelaUsd: number | null;
}

export interface Resposta {
  variante: Variante;
  pergunta: string;
  recusa: boolean;
  motivoDaRecusa: string | null;
  resposta: string | null;
  /** O que o modelo declarou: total ou parcial; null na recusa. Ausente nas execuções anteriores a 2026-10-09. */
  cobertura?: "total" | "parcial" | null;
  /** Na cobertura parcial, o que a pergunta pede e os trechos não respondem. */
  naoCoberto?: string | null;
  /** Citações conferidas, com sigla e caminho como estão no corpus. */
  citacoes: Citacao[];
  trechos: { sigla: string; caminho: string | null; pontuacao: number }[];
  metricas: {
    provedor: string | null;
    modelo: string | null;
    tokensEntrada: number | null;
    tokensSaida: number | null;
    custoTabelaUsd: number | null;
    latenciaMs: { busca: number; geracao: number | null; total: number };
  };
}

/** Uma variante pronta para responder: a mesma assinatura nas três. */
export type Pipeline = (pergunta: string) => Promise<Resposta>;

/** As duas metades de uma variante: só a busca, sem LLM, e o fluxo completo. */
export interface VarianteMontada {
  /** Sem `k`, devolve o número de trechos da configuração, o mesmo que vai ao modelo. */
  buscar: (pergunta: string, k?: number) => Promise<TrechoRecuperado[]>;
  perguntar: Pipeline;
}
