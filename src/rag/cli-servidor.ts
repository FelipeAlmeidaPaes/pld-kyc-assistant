import { existsSync } from "node:fs";
import { lerConfiguracao } from "./config.js";
import { montarVariantes } from "./montar.js";
import { criarServidor } from "./servidor.js";

if (existsSync(".env")) process.loadEnvFile(".env");

async function main() {
  const config = lerConfiguracao();
  const app = criarServidor(await montarVariantes(config), { log: true });
  await app.listen({ port: config.porta, host: "127.0.0.1" });
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
