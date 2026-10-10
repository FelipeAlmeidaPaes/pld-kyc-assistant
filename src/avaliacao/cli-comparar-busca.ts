import { parseArgs } from "node:util";
import { VARIANTES, type Variante } from "../rag/tipos.js";
import { compararBuscas } from "./comparacao-de-busca.js";
import { lerRegistros, registrosAtuais } from "./executor.js";

const USO = `Uso: npm run avaliacao:comparar-busca -- <rótulo-a> <rótulo-b> [--variante manual]
Compara a busca da variante nas duas execuções de avaliacao/execucoes; sai com erro se divergirem.`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { variante: { type: "string", default: "manual" } },
  });
  const [a, b] = positionals;
  const variante = values.variante as Variante;
  if (!a || !b || !VARIANTES.includes(variante)) throw new Error(USO);
  const pasta = new URL("../../avaliacao/execucoes/", import.meta.url);
  const [ra, rb] = await Promise.all([a, b].map(async (rotulo) => registrosAtuais(await lerRegistros(new URL(`${rotulo}.jsonl`, pasta)))));

  const { iguais, diferentes, soNumaExecucao } = compararBuscas(ra!, rb!, variante);
  console.log(`${variante}: ${iguais.length} perguntas com a mesma busca em ${a} e ${b}; ${diferentes.length} diferentes`);
  for (const d of diferentes) console.log(`  ${d.perguntaId}, posição ${d.posicao}: ${a} ${d.a}; ${b} ${d.b}`);
  if (soNumaExecucao.length > 0) console.log(`  só numa das execuções: ${soNumaExecucao.join(", ")}`);
  if (iguais.length === 0 || diferentes.length > 0) process.exitCode = 1;
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
