import { existsSync } from "node:fs";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { lerConfiguracao } from "../rag/config.js";
import { carregarCorpus } from "../rag/corpus.js";
import { montarVariantes } from "../rag/montar.js";
import { VARIANTES, type Variante } from "../rag/tipos.js";
import { criarLocalizador } from "./cobertura.js";
import { chaveDoPar, executarAvaliacao, lerLinhas, lerRegistros, registrosAtuais } from "./executor.js";
import type { Julgamento } from "./juiz.js";
import { carregarPerguntas, conferirPerguntas } from "./perguntas.js";
import { montarRelatorio } from "./relatorio.js";

if (existsSync(".env")) process.loadEnvFile(".env");

const USO = `Uso: npm run avaliar -- <rótulo> [opções]
  --sem-llm             só a busca (sem chave, sem cota)
  --variantes a,b       subconjunto de ${VARIANTES.join(", ")}
  --perguntas q01,f01   subconjunto das perguntas
  --intervalo <s>       intervalo mínimo entre chamadas ao LLM (padrão: 5)
  --profundidade <n>    posições da busca registradas (padrão: 20)
  --so-relatorio        só refaz o relatório a partir do arquivo da execução
Grava avaliacao/execucoes/<rótulo>.jsonl e .md. Rodar de novo com o mesmo rótulo retoma o que falta.`;

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      "sem-llm": { type: "boolean", default: false },
      variantes: { type: "string" },
      perguntas: { type: "string" },
      intervalo: { type: "string", default: "5" },
      profundidade: { type: "string", default: "20" },
      "so-relatorio": { type: "boolean", default: false },
    },
  });
  const [rotulo] = positionals;
  if (!rotulo || !/^[a-z0-9][a-z0-9-]*$/.test(rotulo)) throw new Error(USO);
  const pasta = new URL("../../avaliacao/execucoes/", import.meta.url);
  const arquivo = new URL(`${rotulo}.jsonl`, pasta);
  const relatorio = new URL(`${rotulo}.md`, pasta);

  const [todas, normas] = await Promise.all([carregarPerguntas(), carregarCorpus()]);
  const problemas = conferirPerguntas(todas, normas);
  if (problemas.length > 0) throw new Error(`Conjunto de avaliação inconsistente:\n${problemas.join("\n")}`);
  const validadas = todas.filter((p) => p.validado);
  if (validadas.length < todas.length) console.warn(`${todas.length - validadas.length} perguntas sem validação ficam de fora.`);
  const escolhidas = values.perguntas?.split(",");
  const desconhecidas = escolhidas?.filter((id) => !validadas.some((p) => p.id === id)) ?? [];
  if (desconhecidas.length > 0) throw new Error(`Pergunta desconhecida ou sem validação: ${desconhecidas.join(", ")}`);
  const perguntas = escolhidas ? validadas.filter((p) => escolhidas.includes(p.id)) : validadas;

  if (!values["so-relatorio"]) {
    const variantes = values.variantes ? values.variantes.split(",") : [...VARIANTES];
    const invalidas = variantes.filter((v) => !(VARIANTES as readonly string[]).includes(v));
    if (invalidas.length > 0) throw new Error(`Variante desconhecida: ${invalidas.join(", ")}\n${USO}`);

    const semLlm = values["sem-llm"];
    const base = lerConfiguracao();
    // A avaliação roda sem fallback e só com o provedor principal (ADR 0002).
    const config = { ...base, usarFallback: false, provedores: semLlm ? [] : base.provedores.slice(0, 1) };
    if (!semLlm && config.provedores.length === 0) throw new Error("Sem provedor de LLM no .env. Use --sem-llm para avaliar só a busca.");

    const montadas = await montarVariantes(config);
    const anteriores = await lerRegistros(arquivo);
    const configuracao = {
      k: config.k,
      profundidade: Number(values.profundidade),
      limiar: config.limiar,
      modeloDeEmbeddings: config.modeloDeEmbeddings,
      modeloDeLlm: config.provedores[0]?.modelo ?? null,
    };
    const divergente = anteriores.find((r) => JSON.stringify(r.configuracao) !== JSON.stringify(configuracao));
    if (divergente) {
      throw new Error(`A execução ${rotulo} foi feita com outra configuração (${JSON.stringify(divergente.configuracao)}). Use outro rótulo.`);
    }
    await mkdir(pasta, { recursive: true });

    const resultado = await executarAvaliacao(perguntas, {
      execucao: rotulo,
      variantes: Object.fromEntries(variantes.map((v) => [v, montadas[v as Variante]])),
      configuracao,
      localizar: criarLocalizador(normas),
      feitos: new Set(registrosAtuais(anteriores).filter((r) => r.erro === null).map((r) => chaveDoPar(r.perguntaId, r.variante))),
      gravar: (registro) => appendFile(arquivo, `${JSON.stringify(registro)}\n`),
      semLlm,
      intervaloMs: Number(values.intervalo) * 1000,
      esperasAposErro: [15_000, 60_000],
      esperar: (ms) => new Promise((resolver) => setTimeout(resolver, ms)),
      agora: () => Date.now(),
      avisar: (mensagem) => console.log(mensagem),
    });
    console.log(`registrados: ${resultado.registrados}; já feitos: ${resultado.pulados}; com erro: ${resultado.comErro}`);
  }

  const registros = registrosAtuais(await lerRegistros(arquivo));
  if (registros.length === 0) throw new Error(`Nada registrado em avaliacao/execucoes/${rotulo}.jsonl.`);
  // Julgamentos de `npm run julgar`, se houver: só valem os da resposta atual de cada par.
  const julgamentos = await lerLinhas<Julgamento>(new URL(`${rotulo}.julgamentos.jsonl`, pasta));
  await writeFile(relatorio, montarRelatorio(registros, perguntas, julgamentos));
  console.log(`relatório em avaliacao/execucoes/${rotulo}.md`);
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
