import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import type { NormaNormalizada } from "../corpus/types.js";
import type { TrechoRecuperado } from "../rag/tipos.js";
import { idDeterministico } from "../rag/trechos.js";
import { saidaDaBusca } from "./servidor.js";

const RAIZ = fileURLToPath(new URL("../../", import.meta.url));
const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

/**
 * Cliente MCP ligado ao servidor do projeto: "stdio" inicia `src/mcp/cli.ts` como processo filho,
 * como faria um cliente como o Claude Code; uma URL fala com um servidor HTTP já no ar.
 */
export async function conectarAoServidorMcp(alvo: string): Promise<Client> {
  const transporte =
    alvo === "stdio"
      ? new StdioClientTransport({ command: process.execPath, args: ["--import", "tsx", CLI], cwd: RAIZ, stderr: "inherit" })
      : new StreamableHTTPClientTransport(new URL(alvo));
  const cliente = new Client({ name: "pld-kyc-assistant-avaliacao", version: "0.2.0" }, { versionNegotiation: { mode: "auto" } });
  await cliente.connect(transporte);
  return cliente;
}

/**
 * A busca da ferramenta `buscar`, com a assinatura da busca das variantes, para a avaliação medir
 * o caminho pelo MCP (ADR 0013). O id e a norma do trecho saem da sigla e do caminho, como no índice.
 */
export function criarBuscaViaMcp(cliente: Client, normas: NormaNormalizada[]) {
  const idDaNorma = new Map(normas.map((n) => [n.fonte.sigla, n.fonte.id]));
  return async (consulta: string, k: number): Promise<TrechoRecuperado[]> => {
    const resultado = await cliente.callTool({ name: "buscar", arguments: { consulta, k } });
    if (resultado.isError) {
      const texto = resultado.content.map((c) => (c.type === "text" ? c.text : "")).join(" ");
      throw new Error(`A ferramenta buscar falhou: ${texto}`);
    }
    return saidaDaBusca.parse(resultado.structuredContent).trechos.map((t) => {
      const normaId = idDaNorma.get(t.sigla);
      if (!normaId) throw new Error(`Sigla fora do corpus na resposta do servidor MCP: ${t.sigla}`);
      return { id: idDeterministico(`${normaId}|${t.caminho}`), normaId, ...t };
    });
  };
}
