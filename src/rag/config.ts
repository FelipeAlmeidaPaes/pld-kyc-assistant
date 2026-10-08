/** Nenhum provedor de LLM configurado: a busca funciona, a pergunta completa não. */
export class SemProvedorDeLlm extends Error {
  constructor() {
    super("Nenhum provedor de LLM configurado: defina GEMINI_API_KEY e GEMINI_MODEL (ou OPENROUTER_*).");
    this.name = "SemProvedorDeLlm";
  }
}

/** Provedor de LLM acessado pela API compatível com a da OpenAI (ADR 0002). */
export interface Provedor {
  nome: "gemini" | "openrouter";
  urlBase: string;
  chave: string;
  modelo: string;
  /** Preço de tabela em USD por milhão de tokens; null se não configurado. */
  precoEntradaUsd: number | null;
  precoSaidaUsd: number | null;
}

export interface Configuracao {
  qdrantUrl: string;
  modeloDeEmbeddings: string;
  /** Quantos trechos a busca devolve. */
  k: number;
  /** Pontuação mínima do melhor trecho para chamar o LLM; null desliga (calibrar na avaliação). */
  limiar: number | null;
  /** Provedores com chave e modelo, na ordem de preferência: Gemini, depois OpenRouter. */
  provedores: Provedor[];
  /** Fallback para o próximo provedor. A avaliação roda sem (ADR 0002, regra 2). */
  usarFallback: boolean;
  porta: number;
}

const URL_GEMINI = "https://generativelanguage.googleapis.com/v1beta/openai/";
const URL_OPENROUTER = "https://openrouter.ai/api/v1";

function numero(valor: string | undefined): number | null {
  if (valor === undefined || valor.trim() === "") return null;
  const n = Number(valor);
  if (!Number.isFinite(n)) throw new Error(`Valor numérico inválido: ${valor}`);
  return n;
}

function provedor(
  env: NodeJS.ProcessEnv,
  nome: Provedor["nome"],
  prefixo: string,
  urlBase: string,
): Provedor[] {
  const chave = env[`${prefixo}_API_KEY`];
  const modelo = env[`${prefixo}_MODEL`];
  if (!chave || !modelo) return [];
  return [
    {
      nome,
      urlBase,
      chave,
      modelo,
      precoEntradaUsd: numero(env[`${prefixo}_PRECO_ENTRADA_USD_MILHAO`]),
      precoSaidaUsd: numero(env[`${prefixo}_PRECO_SAIDA_USD_MILHAO`]),
    },
  ];
}

export function lerConfiguracao(env: NodeJS.ProcessEnv = process.env): Configuracao {
  return {
    qdrantUrl: env.QDRANT_URL || "http://localhost:6333",
    modeloDeEmbeddings: env.EMBEDDINGS_MODELO || "Xenova/multilingual-e5-small",
    k: numero(env.RAG_K) ?? 5,
    limiar: numero(env.RAG_LIMIAR),
    provedores: [
      ...provedor(env, "gemini", "GEMINI", URL_GEMINI),
      ...provedor(env, "openrouter", "OPENROUTER", URL_OPENROUTER),
    ],
    usarFallback: env.RAG_FALLBACK !== "nao",
    porta: numero(env.PORTA) ?? 3000,
  };
}

/** Custo a preço de tabela; null se faltar contagem de tokens ou preço. */
export function custoTabela(provedor: Provedor, tokensEntrada: number | null, tokensSaida: number | null): number | null {
  if (tokensEntrada === null || tokensSaida === null) return null;
  if (provedor.precoEntradaUsd === null || provedor.precoSaidaUsd === null) return null;
  return (tokensEntrada * provedor.precoEntradaUsd + tokensSaida * provedor.precoSaidaUsd) / 1e6;
}

/** Nome da coleção no Qdrant: variante e modelo de embeddings (ADR 0003). */
export function nomeDaColecao(variante: string, modeloDeEmbeddings: string): string {
  return `${variante}__${modeloDeEmbeddings.split("/").pop()!.replace(/[^\w.-]/g, "_")}`;
}
