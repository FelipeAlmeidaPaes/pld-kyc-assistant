import { existsSync } from "node:fs";
import { appendFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { lerConfiguracao } from "../rag/config.js";
import { pedirSaidaEstruturada } from "../rag/manual/llm.js";
import { lerLinhas, lerRegistros, registrosAtuais } from "./executor.js";
import { esquemaDoJulgamento, type Julgamento, julgamentosValidos, julgarExecucao, NOME_DO_ESQUEMA_DO_JUIZ } from "./juiz.js";
import { carregarPerguntas } from "./perguntas.js";
import { montarAuditoria, montarRelatorio } from "./relatorio.js";

if (existsSync(".env")) process.loadEnvFile(".env");

const USO = `Uso: npm run julgar -- <rótulo> [--intervalo <s>] [--amostra <n>]
Julga o conteúdo das respostas de avaliacao/execucoes/<rótulo>.jsonl com o modelo gratuito do OpenRouter
(outra família que não a do Gemini, que gera as respostas), refaz o relatório e gera a amostra para auditoria.
Rodar de novo retoma: só julga o que falta ou o que mudou.`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { intervalo: { type: "string", default: "5" }, amostra: { type: "string", default: "20" } },
  });
  const [rotulo] = positionals;
  if (!rotulo || !/^[a-z0-9][a-z0-9-]*$/.test(rotulo)) throw new Error(USO);
  const pasta = new URL("../../avaliacao/execucoes/", import.meta.url);
  const arquivoDosJulgamentos = new URL(`${rotulo}.julgamentos.jsonl`, pasta);

  // Juiz fixo e de outra família (ADR 0002, regra 3; ADR 0010). A trava de custo da configuração
  // já recusa modelo do OpenRouter que não seja ":free".
  const provedor = lerConfiguracao().provedores.find((p) => p.nome === "openrouter");
  if (!provedor) throw new Error("O juiz usa o OpenRouter: defina OPENROUTER_API_KEY e OPENROUTER_MODEL (:free) no .env.");

  const perguntas = (await carregarPerguntas()).filter((p) => p.validado);
  const porId = new Map(perguntas.map((p) => [p.id, p]));
  const registros = registrosAtuais(await lerRegistros(new URL(`${rotulo}.jsonl`, pasta)));
  if (registros.length === 0) throw new Error(`Nada registrado em avaliacao/execucoes/${rotulo}.jsonl.`);
  const anteriores = await lerLinhas<Julgamento>(arquivoDosJulgamentos);

  const resultado = await julgarExecucao(registros, porId, {
    execucao: rotulo,
    juiz: { provedor: provedor.nome, modelo: provedor.modelo },
    julgar: (instrucoes, mensagem) =>
      pedirSaidaEstruturada(provedor, { instrucoes, mensagem, nome: NOME_DO_ESQUEMA_DO_JUIZ, esquema: esquemaDoJulgamento }, { tentativas: 4, esperaInicialMs: 5000 }),
    feitos: new Set(julgamentosValidos(registros, anteriores).keys()),
    gravar: (julgamento) => appendFile(arquivoDosJulgamentos, `${JSON.stringify(julgamento)}\n`),
    intervaloMs: Number(values.intervalo) * 1000,
    esperar: (ms) => new Promise((resolver) => setTimeout(resolver, ms)),
    agora: () => Date.now(),
    avisar: (mensagem) => console.log(mensagem),
  });
  console.log(`julgados: ${resultado.julgados}; já julgados: ${resultado.pulados}`);

  const julgamentos = await lerLinhas<Julgamento>(arquivoDosJulgamentos);
  await writeFile(new URL(`${rotulo}.md`, pasta), montarRelatorio(registros, perguntas, julgamentos));
  await writeFile(new URL(`${rotulo}.auditoria.md`, pasta), montarAuditoria(registros, perguntas, julgamentos, Number(values.amostra)));
  const validos = julgamentosValidos(registros, julgamentos);
  console.log(`relatório em avaliacao/execucoes/${rotulo}.md; auditoria em ${rotulo}.auditoria.md (${validos.size} julgamentos)`);
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
