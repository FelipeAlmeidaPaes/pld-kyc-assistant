import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { lerConfiguracao } from "../rag/config.js";
import { montarRecursosDoMcp } from "./montar.js";
import { criarServidorMcp } from "./servidor.js";
import { CAMINHO_MCP, criarServidorHttp, protegerStdout, servirPorStdio } from "./transportes.js";

const USO = `Uso: npm run --silent mcp -- [--http [--porta <n>]]
  sem opção    stdio, para o cliente iniciar o servidor como processo filho
  --http       Streamable HTTP em 127.0.0.1 (padrão: porta 3001), sem autenticação`;

// O cliente MCP pode iniciar o processo em outra pasta: o .env é o da raiz do projeto.
const env = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(env)) process.loadEnvFile(env);

async function main() {
  const { values } = parseArgs({
    options: { http: { type: "boolean", default: false }, porta: { type: "string", default: "3001" } },
  });
  const porta = Number(values.porta);
  if (!Number.isInteger(porta) || porta < 0 || porta > 65535) throw new Error(USO);

  // Antes de montar: nada que a montagem escreva pode ir para o canal do protocolo.
  if (!values.http) protegerStdout();
  const recursos = await montarRecursosDoMcp(lerConfiguracao());
  const fabrica = () => criarServidorMcp(recursos);

  if (!values.http) {
    const conexao = servirPorStdio(fabrica);
    process.on("SIGINT", () => void conexao.close());
    console.error("servidor MCP pronto (stdio)");
    return;
  }
  const servidor = criarServidorHttp(fabrica);
  servidor.listen(porta, "127.0.0.1", () => console.error(`servidor MCP em http://127.0.0.1:${porta}${CAMINHO_MCP}`));
  process.on("SIGINT", () => {
    servidor.close(() => process.exit(0));
    servidor.closeAllConnections();
  });
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
