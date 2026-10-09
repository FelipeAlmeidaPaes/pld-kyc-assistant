import { writeFile } from "node:fs/promises";
import { carregarCorpus } from "../rag/corpus.js";
import { carregarPerguntas, conferirPerguntas } from "./perguntas.js";
import { montarRevisao } from "./revisao.js";

/** Confere avaliacao/perguntas.json contra o corpus e gera avaliacao/revisao.md. */
async function main() {
  const [perguntas, normas] = await Promise.all([carregarPerguntas(), carregarCorpus()]);
  const problemas = conferirPerguntas(perguntas, normas);
  if (problemas.length > 0) {
    console.error(problemas.join("\n"));
    process.exitCode = 1;
    return;
  }
  const destino = new URL("../../avaliacao/revisao.md", import.meta.url);
  await writeFile(destino, montarRevisao(perguntas, normas));
  console.log(`${perguntas.length} perguntas conferidas; revisão em avaliacao/revisao.md`);
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
