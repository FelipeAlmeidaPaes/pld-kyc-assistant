import { z } from "zod";
import { custoTabela, type Provedor, SemProvedorDeLlm } from "../config.js";
import { esquemaDaSaida, type Geracao } from "../tipos.js";

/** Nome do esquema na requisição; o mesmo que a variante LangChain usa. */
export const NOME_DO_ESQUEMA = "resposta";

/** Esquema JSON de um esquema zod, sem o "$schema", que alguns provedores recusam. */
export function esquemaJsonDe(esquema: z.ZodType): Record<string, unknown> {
  const { $schema: _, ...resto } = z.toJSONSchema(esquema);
  return resto;
}

/** Esquema JSON da resposta do RAG. */
export function esquemaJson(): Record<string, unknown> {
  return esquemaJsonDe(esquemaDaSaida);
}

export interface OpcoesDoCliente {
  usarFallback: boolean;
  /** Tentativas por provedor em erro temporário (429, 5xx, rede). */
  tentativas?: number;
  esperaInicialMs?: number;
}

interface RespostaDoChat {
  model?: string;
  choices?: { message?: { content?: string | null } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PedidoEstruturado<T> {
  instrucoes: string;
  mensagem: string;
  /** Nome do esquema na requisição. */
  nome: string;
  esquema: z.ZodType<T>;
}

export interface SaidaEstruturada<T> {
  saida: T;
  modelo: string;
  tokensEntrada: number | null;
  tokensSaida: number | null;
}

/**
 * Uma chamada de chat a um provedor, com a saída presa a um JSON Schema e validada pelo zod.
 * Repete com espera crescente em erro temporário (429, 5xx, rede); erro definitivo sobe na hora.
 * Serve ao RAG e ao juiz da avaliação, cada um com o seu esquema.
 */
export async function pedirSaidaEstruturada<T>(
  provedor: Provedor,
  pedido: PedidoEstruturado<T>,
  { tentativas = 3, esperaInicialMs = 1000 }: Pick<OpcoesDoCliente, "tentativas" | "esperaInicialMs"> = {},
): Promise<SaidaEstruturada<T>> {
  const url = `${provedor.urlBase.replace(/\/$/, "")}/chat/completions`;
  const corpo = {
    model: provedor.modelo,
    temperature: 0,
    messages: [
      { role: "system", content: pedido.instrucoes },
      { role: "user", content: pedido.mensagem },
    ],
    response_format: { type: "json_schema", json_schema: { name: pedido.nome, schema: esquemaJsonDe(pedido.esquema), strict: true } },
  };

  for (let tentativa = 1; ; tentativa++) {
    let resposta: Response;
    try {
      resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${provedor.chave}` },
        body: JSON.stringify(corpo),
      });
    } catch (erro) {
      if (tentativa >= tentativas) throw erro;
      await esperar(esperaInicialMs * 2 ** (tentativa - 1));
      continue;
    }
    if (resposta.status === 429 || resposta.status >= 500) {
      if (tentativa >= tentativas) throw new Error(`${provedor.nome}: HTTP ${resposta.status} após ${tentativa} tentativas`);
      await esperar(esperaInicialMs * 2 ** (tentativa - 1));
      continue;
    }
    if (!resposta.ok) throw new Error(`${provedor.nome}: HTTP ${resposta.status}: ${await resposta.text()}`);

    const dados = (await resposta.json()) as RespostaDoChat;
    const conteudo = dados.choices?.[0]?.message?.content;
    if (!conteudo) throw new Error(`${provedor.nome}: resposta sem conteúdo`);
    return {
      saida: pedido.esquema.parse(JSON.parse(conteudo)),
      modelo: dados.model ?? provedor.modelo,
      tokensEntrada: dados.usage?.prompt_tokens ?? null,
      tokensSaida: dados.usage?.completion_tokens ?? null,
    };
  }
}

/**
 * Cliente de chat escrito à mão sobre `fetch`, pela API compatível com a da OpenAI (ADR 0002):
 * saída estruturada por JSON Schema, nova tentativa com espera crescente em erro temporário
 * e, se permitido, fallback para o próximo provedor.
 */
export function criarClienteDeChat(provedores: Provedor[], opcoes: OpcoesDoCliente) {
  const { usarFallback, tentativas = 3, esperaInicialMs = 1000 } = opcoes;
  if (provedores.length === 0) throw new SemProvedorDeLlm();

  const chamar = async (provedor: Provedor, instrucoes: string, mensagem: string): Promise<Geracao> => {
    const pedido = { instrucoes, mensagem, nome: NOME_DO_ESQUEMA, esquema: esquemaDaSaida };
    const { saida, modelo, tokensEntrada, tokensSaida } = await pedirSaidaEstruturada(provedor, pedido, { tentativas, esperaInicialMs });
    return {
      saida,
      provedor: provedor.nome,
      modelo,
      tokensEntrada,
      tokensSaida,
      custoTabelaUsd: custoTabela(provedor, tokensEntrada, tokensSaida),
    };
  };

  return {
    async gerar(instrucoes: string, mensagem: string): Promise<Geracao> {
      const candidatos = usarFallback ? provedores : provedores.slice(0, 1);
      let ultimoErro: unknown;
      for (const provedor of candidatos) {
        try {
          return await chamar(provedor, instrucoes, mensagem);
        } catch (erro) {
          ultimoErro = erro;
        }
      }
      throw ultimoErro;
    },
  };
}

export type ClienteDeChat = ReturnType<typeof criarClienteDeChat>;
