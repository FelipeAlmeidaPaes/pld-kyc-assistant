import type { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { type Runnable, RunnableBranch, RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { custoTabela, type Provedor, SemProvedorDeLlm } from "../config.js";
import type { IndiceDoCorpus } from "../corpus.js";
import { esquemaJson, NOME_DO_ESQUEMA } from "../manual/llm.js";
import { formatarContexto, INSTRUCOES, MODELO_DA_PERGUNTA } from "../prompt.js";
import { abaixoDoLimiar, concluirResposta } from "../resposta.js";
import { esquemaDaSaida, type Geracao, type Pipeline, type SaidaDoModelo, type TrechoRecuperado } from "../tipos.js";
import { trechoDoDocumento } from "./indice.js";

interface EntradaDoModelo {
  contexto: string;
  pergunta: string;
}

/** Parte usada da mensagem bruta do modelo (`includeRaw`). */
interface MensagemBruta {
  usage_metadata?: { input_tokens?: number; output_tokens?: number };
  response_metadata?: { model_name?: string };
}

/**
 * Um ChatOpenAI por provedor, apontado para a URL compatível com a da OpenAI, com saída
 * estruturada pelo mesmo esquema e nome da variante manual. Com fallback ligado, o LangChain
 * passa ao provedor seguinte quando o anterior falha (`withFallbacks`).
 *
 * O esquema vai como JSON Schema, não como zod: com zod, o LangChain acrescenta "$schema" e
 * põe o título "resposta" em todos os campos, e o modelo receberia um pedido diferente do da
 * variante manual. A saída continua validada pelo zod logo abaixo.
 */
export function criarModeloDeChat(provedores: Provedor[], usarFallback: boolean): Runnable<EntradaDoModelo, Geracao> {
  if (provedores.length === 0) throw new SemProvedorDeLlm();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", INSTRUCOES],
    ["human", MODELO_DA_PERGUNTA],
  ]);
  const cadeias = provedores.map((provedor) => {
    const modelo = new ChatOpenAI({
      model: provedor.modelo,
      apiKey: provedor.chave,
      temperature: 0,
      // Até três tentativas, como na variante manual. Mas em 429 o LangChain só repete se a
      // resposta disser quanto esperar (Retry-After); sem isso, falha logo (ADR 0007).
      maxRetries: 2,
      configuration: { baseURL: provedor.urlBase },
    }).withStructuredOutput<SaidaDoModelo>(esquemaJson(), {
      name: NOME_DO_ESQUEMA,
      method: "jsonSchema",
      strict: true,
      includeRaw: true,
    });

    return prompt.pipe(modelo).pipe(
      RunnableLambda.from(({ raw, parsed }: { raw: MensagemBruta; parsed: SaidaDoModelo }): Geracao => {
        const tokensEntrada = raw.usage_metadata?.input_tokens ?? null;
        const tokensSaida = raw.usage_metadata?.output_tokens ?? null;
        return {
          saida: esquemaDaSaida.parse(parsed),
          provedor: provedor.nome,
          modelo: raw.response_metadata?.model_name ?? provedor.modelo,
          tokensEntrada,
          tokensSaida,
          custoTabelaUsd: custoTabela(provedor, tokensEntrada, tokensSaida),
        };
      }),
    );
  });
  const [principal, ...reservas] = cadeias;
  return usarFallback && reservas.length > 0 ? principal!.withFallbacks(reservas) : principal!;
}

export interface DependenciasLangchain {
  variante: "langchain" | "langchain-padrao";
  /** Em produção, `loja.similaritySearchWithScore` do QdrantVectorStore. */
  buscar: (pergunta: string, k: number) => Promise<[Document, number][]>;
  modelo: Runnable<EntradaDoModelo, Geracao>;
  indice: IndiceDoCorpus;
  k: number;
  limiar: number | null;
}

/**
 * Variantes LangChain, compostas em LCEL: a busca acrescenta os trechos ao estado, e um desvio
 * (`RunnableBranch`) decide se vale chamar o modelo. Depois, a regra comum de recusa e citação.
 * Cada passo mede o próprio tempo para a resposta trazer a latência por etapa.
 */
export function criarPipelineLangchain(deps: DependenciasLangchain): Pipeline {
  interface Busca {
    trechos: TrechoRecuperado[];
    msBusca: number;
  }
  interface Resultado {
    geracao: Geracao | null;
    msGeracao: number | null;
  }
  type AposBusca = { pergunta: string; busca: Busca };
  type Final = AposBusca & { resultado: Resultado };

  const buscar = RunnableLambda.from(async ({ pergunta }: { pergunta: string }): Promise<AposBusca> => {
    const inicio = performance.now();
    const resultados = await deps.buscar(pergunta, deps.k);
    const trechos = resultados.map(([doc, pontuacao]) => trechoDoDocumento(doc, pontuacao));
    return { pergunta, busca: { trechos, msBusca: performance.now() - inicio } };
  });

  const semGeracao = RunnableLambda.from(
    (estado: AposBusca): Final => ({ ...estado, resultado: { geracao: null, msGeracao: null } }),
  );

  const gerar = RunnableLambda.from(async (estado: AposBusca): Promise<Final> => {
    const inicio = performance.now();
    const geracao = await deps.modelo.invoke({ contexto: formatarContexto(estado.busca.trechos), pergunta: estado.pergunta });
    return { ...estado, resultado: { geracao, msGeracao: performance.now() - inicio } };
  });

  const cadeia = RunnableSequence.from<{ pergunta: string }, Final>([
    buscar,
    RunnableBranch.from<AposBusca, Final>([
      [(estado) => abaixoDoLimiar(estado.busca.trechos, deps.limiar), semGeracao],
      gerar,
    ]),
  ]);

  return async (pergunta) => {
    const inicio = performance.now();
    const { busca, resultado } = await cadeia.invoke({ pergunta });
    const latenciaMs = { busca: busca.msBusca, geracao: resultado.msGeracao, total: performance.now() - inicio };
    return concluirResposta(
      { variante: deps.variante, pergunta, trechos: busca.trechos, geracao: resultado.geracao, latenciaMs },
      deps.indice,
    );
  };
}
