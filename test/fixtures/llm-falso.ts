import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import type { SaidaDoModelo } from "../../src/rag/tipos.js";

export interface RequisicaoRecebida {
  caminho: string;
  autorizacao: string | undefined;
  corpo: Record<string, any>;
}

export type Responder = (
  requisicao: RequisicaoRecebida,
  indice: number,
) => { status: number; corpo: unknown; cabecalhos?: Record<string, string> };

/** Resposta de chat no formato da API da OpenAI, com a saída estruturada no conteúdo. */
export function respostaDeChat(saida: SaidaDoModelo, modelo = "modelo-falso", tokens = { entrada: 120, saida: 30 }) {
  return {
    status: 200,
    corpo: {
      id: "chatcmpl-falso",
      object: "chat.completion",
      created: 0,
      model: modelo,
      choices: [{ index: 0, finish_reason: "stop", message: { role: "assistant", content: JSON.stringify(saida) } }],
      usage: { prompt_tokens: tokens.entrada, completion_tokens: tokens.saida, total_tokens: tokens.entrada + tokens.saida },
    },
  };
}

/** Servidor HTTP local compatível com /chat/completions, que grava cada requisição recebida. */
export async function iniciarLlmFalso(responder: Responder) {
  const requisicoes: RequisicaoRecebida[] = [];
  const servidor: Server = createServer((req, res) => {
    let dados = "";
    req.on("data", (pedaco) => (dados += pedaco));
    req.on("end", () => {
      const requisicao = { caminho: req.url ?? "", autorizacao: req.headers.authorization, corpo: JSON.parse(dados || "{}") };
      requisicoes.push(requisicao);
      const { status, corpo, cabecalhos } = responder(requisicao, requisicoes.length - 1);
      res.writeHead(status, { "Content-Type": "application/json", ...cabecalhos });
      res.end(JSON.stringify(corpo));
    });
  });
  await new Promise<void>((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  const { port } = servidor.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}/v1`,
    requisicoes,
    fechar: () => new Promise<void>((resolve) => servidor.close(() => resolve())),
  };
}
