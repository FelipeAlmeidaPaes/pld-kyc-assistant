import { existsSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { criarBuscaBm25, fundirPorPosicao } from "../rag/bm25.js";
import { lerConfiguracao } from "../rag/config.js";
import { carregarCorpus } from "../rag/corpus.js";
import { arquivoDoCache, comCacheDeVetores } from "../rag/cache-de-vetores.js";
import { criarGerador } from "../rag/embeddings.js";
import type { Trecho, TrechoRecuperado, VarianteMontada } from "../rag/tipos.js";
import { idDeterministico, type PartesDoTrecho, partesDosTrechos } from "../rag/trechos.js";
import { criarLocalizador } from "./cobertura.js";
import { executarAvaliacao, lerRegistros } from "./executor.js";
import { calcularMetricas } from "./metricas.js";
import { carregarPerguntas } from "./perguntas.js";
import { montarRelatorio } from "./relatorio.js";

/**
 * Experimentos de busca sobre os trechos por dispositivo, em memória: não mexem no Qdrant nem nas
 * variantes. Cada experimento vira uma execução só de busca (avaliacao/experimentos/exp-*.jsonl),
 * comparável com `busca-base`. O que ganhar vai para as variantes depois.
 */

type TextoIndexado = "completo" | "dispositivo" | "pai";

const TEXTOS: Record<TextoIndexado, (p: PartesDoTrecho) => string> = {
  // O mesmo texto que o Qdrant indexa hoje: cabeçalho, capítulo, ascendentes e o dispositivo.
  completo: (p) => [`${p.sigla}, ${p.caminho}`, ...(p.agrupamento ? [p.agrupamento] : []), ...p.ascendentes, p.dispositivo].join("\n"),
  dispositivo: (p) => p.dispositivo,
  pai: (p) => [...p.ascendentes.slice(-1), p.dispositivo].join("\n"),
};

interface Experimento {
  descricao: string;
  /** Lista ordenada de índices de trechos, até `profundidade`, com a pontuação de cada um. */
  ordenar: (pergunta: string, profundidade: number) => Promise<{ indice: number; pontuacao: number }[]>;
}

if (existsSync(".env")) process.loadEnvFile(".env");

const produtoInterno = (a: number[], b: number[]) => a.reduce((soma, x, i) => soma + x * b[i]!, 0);

async function main() {
  const { values } = parseArgs({
    options: {
      modelo: { type: "string", default: "Xenova/multilingual-e5-small" },
      experimentos: { type: "string" },
      radical: { type: "string", default: "5" },
      // Trechos que vão ao modelo: o k das variantes (RAG_K). O resumo mostra também k = 5, para
      // comparar com os experimentos anteriores.
      k: { type: "string" },
    },
  });
  const k = Number(values.k ?? lerConfiguracao().k);
  const [perguntas, normas] = await Promise.all([carregarPerguntas(), carregarCorpus()]);
  const validadas = perguntas.filter((p) => p.validado);
  const partes = normas.flatMap(partesDosTrechos);
  const trechos: Trecho[] = partes.map((p) => ({
    id: idDeterministico(`${p.normaId}|${p.caminho}`),
    normaId: p.normaId,
    sigla: p.sigla,
    caminho: p.caminho,
    texto: TEXTOS.completo(p),
  }));
  // Com cache também no e5: o e5-large leva minutos para os 939 trechos. O Gemini já vem com cache.
  const base = await criarGerador(values.modelo, process.env.GEMINI_API_KEY ?? null);
  const gerador = values.modelo.startsWith("gemini-") ? base : await comCacheDeVetores(base, arquivoDoCache(values.modelo));
  const nomeDoModelo = values.modelo.split("/").pop()!.replace("multilingual-", "");

  const densa = (texto: TextoIndexado): Experimento["ordenar"] => {
    let vetores: Promise<number[][]> | null = null;
    return async (pergunta, profundidade) => {
      vetores ??= gerador.trechos(partes.map(TEXTOS[texto]));
      const [consulta] = await gerador.consultas([pergunta]);
      return (await vetores)
        .map((v, indice) => ({ indice, pontuacao: produtoInterno(consulta!, v) }))
        .sort((x, y) => y.pontuacao - x.pontuacao)
        .slice(0, profundidade);
    };
  };
  const lexica = (radical: number | null): Experimento["ordenar"] => {
    const buscar = criarBuscaBm25(
      partes.map((_, i) => i),
      (i) => TEXTOS.completo(partes[i]!),
      { radical },
    );
    return async (pergunta, profundidade) => buscar(pergunta, profundidade).map((r) => ({ indice: r.item, pontuacao: r.pontuacao }));
  };
  const hibrida = (ordens: Experimento["ordenar"][], pesos: number[] = []): Experimento["ordenar"] => async (pergunta, profundidade) => {
    const listas = await Promise.all(ordens.map((ordenar) => ordenar(pergunta, 100)));
    return fundirPorPosicao(
      listas.map((l) => l.map((r) => r.indice)),
      String,
      60,
      pesos,
    )
      .slice(0, profundidade)
      .map((r) => ({ indice: r.item, pontuacao: r.pontuacao }));
  };

  const radical = Number(values.radical);
  const catalogo: Record<string, Experimento> = {
    densa: { descricao: "densa, texto completo (a busca atual, em memória)", ordenar: densa("completo") },
    "densa-dispositivo": { descricao: "densa, só o texto do dispositivo", ordenar: densa("dispositivo") },
    "densa-pai": { descricao: "densa, dispositivo e o dispositivo que o abre", ordenar: densa("pai") },
    bm25: { descricao: "lexical BM25, texto completo", ordenar: lexica(null) },
    [`bm25-radical${radical}`]: { descricao: `lexical BM25, termos cortados em ${radical} letras`, ordenar: lexica(radical) },
    hibrida: { descricao: "híbrida: densa (texto completo) + BM25, fusão RRF c=60", ordenar: hibrida([densa("completo"), lexica(null)]) },
    [`hibrida-radical${radical}`]: {
      descricao: `híbrida: densa (texto completo) + BM25 com radical de ${radical}, fusão RRF c=60`,
      ordenar: hibrida([densa("completo"), lexica(radical)]),
    },
    "hibrida-pai": { descricao: "híbrida: densa (dispositivo e pai) + BM25, fusão RRF c=60", ordenar: hibrida([densa("pai"), lexica(null)]) },
    "hibrida-densa2": {
      descricao: "híbrida: densa (texto completo, peso 2) + BM25 (peso 1), fusão RRF c=60",
      ordenar: hibrida([densa("completo"), lexica(null)], [2, 1]),
    },
    [`hibrida-radical${radical}-densa2`]: {
      descricao: `híbrida: densa (texto completo, peso 2) + BM25 com radical de ${radical} (peso 1), fusão RRF c=60`,
      ordenar: hibrida([densa("completo"), lexica(radical)], [2, 1]),
    },
  };
  const escolhidos = values.experimentos?.split(",") ?? Object.keys(catalogo);
  const desconhecidos = escolhidos.filter((e) => !catalogo[e]);
  if (desconhecidos.length > 0) throw new Error(`Experimento desconhecido: ${desconhecidos.join(", ")}. Há: ${Object.keys(catalogo).join(", ")}`);

  const pasta = new URL("../../avaliacao/experimentos/", import.meta.url);
  const localizar = criarLocalizador(normas);
  const linhas: string[] = [];
  for (const nome of escolhidos) {
    const experimento = catalogo[nome]!;
    const rotulo = `exp-${nomeDoModelo}-${nome}`;
    const arquivo = new URL(`${rotulo}.jsonl`, pasta);
    // Experimento é refeito do zero: não há cota a poupar.
    await rm(arquivo, { force: true });
    const variante: VarianteMontada = {
      buscar: async (pergunta, profundidade = 20): Promise<TrechoRecuperado[]> =>
        (await experimento.ordenar(pergunta, profundidade)).map(({ indice, pontuacao }) => ({ ...trechos[indice]!, pontuacao })),
      perguntar: async () => {
        throw new Error("experimento só de busca");
      },
    };
    await executarAvaliacao(validadas, {
      execucao: rotulo,
      variantes: { manual: variante },
      configuracao: { k, profundidade: 20, limiar: null, modeloDeEmbeddings: values.modelo, modeloDeLlm: null, busca: experimento.descricao },
      localizar,
      feitos: new Set(),
      gravar: (registro) => writeFile(arquivo, `${JSON.stringify(registro)}\n`, { flag: "a" }),
      semLlm: true,
      intervaloMs: 0,
      esperasAposErro: [],
      esperar: async () => {},
      agora: () => Date.now(),
      avisar: () => {},
    });
    const registros = await lerRegistros(arquivo);
    await writeFile(new URL(`${rotulo}.md`, pasta), montarRelatorio(registros, validadas));
    const porId = new Map(validadas.map((p) => [p.id, p]));
    const m5 = calcularMetricas("manual", registros, porId, 5);
    const m = calcularMetricas("manual", registros, porId, k);
    const faixa = m.busca.melhorPontuacao;
    linhas.push(
      `| ${rotulo} | ${pct(m5.busca.recallNoK)} | ${pct(m5.busca.acertoNoK)} | ${pct(m.busca.recallNoK)} | ${pct(m.busca.acertoNoK)} | ` +
        `${m.busca.mrr?.toFixed(2)} | ${faixa.coberta.min?.toFixed(3)} | ${faixa["fora-do-corpus"].max?.toFixed(3)} |`,
    );
    console.log(linhas.at(-1));
  }
  console.log(
    ["", `| execução | recall@5 | acerto@5 | recall@${k} | acerto@${k} | MRR@20 | mín. coberta | máx. fora |`, "|---|---|---|---|---|---|---|---|", ...linhas].join("\n"),
  );
}

const pct = (v: number | null) => (v === null ? "–" : `${Math.round(v * 100)}%`);

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
