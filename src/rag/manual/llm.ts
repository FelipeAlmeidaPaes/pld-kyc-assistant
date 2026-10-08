import { z } from "zod";
import { custoTabela, type Provedor, SemProvedorDeLlm } from "../config.js";
import { esquemaDaSaida, type Geracao } from "../tipos.js";

/** Nome do esquema na requisição; o mesmo que a variante LangChain usa. */
export const NOME_DO_ESQUEMA = "resposta";

/** Esquema JSON da saída, sem o "$schema", que alguns provedores recusam. */
export function esquemaJson(): Record<string, unknown> {
  const { $schema: _, ...esquema } = z.toJSONSchema(esquemaDaSaida);
  return esquema;
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

/**
 * Cliente de chat escrito à mão sobre `fetch`, pela API compatível com a da OpenAI (ADR 0002):
 * saída estruturada por JSON Schema, nova tentativa com espera crescente em erro temporário
 * e, se permitido, fallback para o próximo provedor.
 */
export function criarClienteDeChat(provedores: Provedor[], opcoes: OpcoesDoCliente) {
  const { usarFallback, tentativas = 3, esperaInicialMs = 1000 } = opcoes;
  if (provedores.length === 0) throw new SemProvedorDeLlm();

  const chamar = async (provedor: Provedor, instrucoes: string, mensagem: string): Promise<Geracao> => {
    const url = `${provedor.urlBase.replace(/\/$/, "")}/chat/completions`;
    const corpo = {
      model: provedor.modelo,
      temperature: 0,
      messages: [
        { role: "system", content: instrucoes },
        { role: "user", content: mensagem },
      ],
      response_format: { type: "json_schema", json_schema: { name: NOME_DO_ESQUEMA, schema: esquemaJson(), strict: true } },
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
      const saida = esquemaDaSaida.parse(JSON.parse(conteudo));
      const tokensEntrada = dados.usage?.prompt_tokens ?? null;
      const tokensSaida = dados.usage?.completion_tokens ?? null;
      return {
        saida,
        provedor: provedor.nome,
        modelo: dados.model ?? provedor.modelo,
        tokensEntrada,
        tokensSaida,
        custoTabelaUsd: custoTabela(provedor, tokensEntrada, tokensSaida),
      };
    }
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
