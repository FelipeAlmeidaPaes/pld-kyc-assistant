import { createServer, type Server } from "node:http";
import { localhostHostValidation, localhostOriginValidation, toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, type McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

/** Caminho do endpoint HTTP. */
export const CAMINHO_MCP = "/mcp";

/**
 * No stdio, o stdout é o canal do protocolo, e uma linha que não seja JSON-RPC quebra o cliente.
 * Todo `console.log`, `console.info` e `console.debug` do processo, inclusive de biblioteca, passa
 * a ir para o stderr, que o cliente mostra como log.
 */
export function protegerStdout(): void {
  console.log = console.error;
  console.info = console.error;
  console.debug = console.error;
}

/** stdio: uma conexão por processo, servida pelo servidor que a fábrica cria. */
export function servirPorStdio(fabrica: () => McpServer) {
  protegerStdout();
  return serveStdio(fabrica);
}

/**
 * Streamable HTTP, sem estado: um servidor novo por requisição, criado pela fábrica. Sem
 * autenticação, por isso só em loopback (ADR 0013); Host e Origin são conferidos contra DNS
 * rebinding, em que uma página maliciosa aponta o próprio domínio para 127.0.0.1.
 */
export function criarServidorHttp(fabrica: () => McpServer): Server {
  const handler = createMcpHandler(fabrica);
  const responder = toNodeHandler(handler);
  const validarHost = localhostHostValidation();
  const validarOrigem = localhostOriginValidation();

  const servidor = createServer((requisicao, resposta) => {
    if (!validarHost(requisicao, resposta) || !validarOrigem(requisicao, resposta)) return;
    if (new URL(requisicao.url ?? "/", "http://localhost").pathname !== CAMINHO_MCP) {
      resposta.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end(`Endpoint MCP: ${CAMINHO_MCP}`);
      return;
    }
    // Em requisição recebida pelo servidor, `method` sempre vem; o tipo do Node o deixa opcional.
    responder(requisicao as Parameters<typeof responder>[0], resposta).catch((erro: unknown) => {
      console.error(erro);
      if (!resposta.headersSent) resposta.writeHead(500);
      resposta.end();
    });
  });
  servidor.on("close", () => void handler.close());
  return servidor;
}
