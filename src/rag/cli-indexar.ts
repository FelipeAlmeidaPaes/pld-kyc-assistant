import { existsSync } from "node:fs";
import { AutoTokenizer } from "@huggingface/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import { lerConfiguracao, nomeDaColecao } from "./config.js";
import { carregarCorpus } from "./corpus.js";
import { criarGeradorE5 } from "./embeddings.js";
import { EmbeddingsE5 } from "./langchain/embeddings.js";
import { documentosDoDivisorPadrao, documentosDosTrechos, indexarLangchain } from "./langchain/indice.js";
import { indexarManual } from "./manual/qdrant.js";
import { montarTrechos } from "./trechos.js";

if (existsSync(".env")) process.loadEnvFile(".env");

/** Quantos textos passam do limite do modelo e seriam truncados no embedding, sem aviso. */
async function contarTruncados(modelo: string, textos: string[]): Promise<{ truncados: number; maior: number; limite: number }> {
  const tokenizador = await AutoTokenizer.from_pretrained(modelo);
  const tamanhos = textos.map((t) => tokenizador.encode(`passage: ${t}`).length);
  const limite = tokenizador.model_max_length;
  return { truncados: tamanhos.filter((n) => n > limite).length, maior: Math.max(...tamanhos), limite };
}

const TENTATIVAS = 3;

/**
 * A indexação falhou com "fetch failed" (conexão encerrada pelo Qdrant) em 2 de ~7 execuções,
 * sempre na primeira depois de um tempo parado; a hipótese é conexão ociosa fechada pelo
 * servidor e reaproveitada pelo cliente. Cada tentativa recria a coleção, então repetir é seguro.
 */
async function comNovasTentativas(variante: string, indexar: () => Promise<unknown>): Promise<void> {
  for (let tentativa = 1; ; tentativa++) {
    try {
      await indexar();
      return;
    } catch (erro) {
      if (tentativa >= TENTATIVAS) throw erro;
      const causa = (erro as { cause?: { code?: string; message?: string } }).cause;
      console.warn(`  ${variante}: falhou (${(erro as Error).message}; ${causa?.code ?? causa?.message ?? "sem causa"}), tentativa ${tentativa + 1}`);
    }
  }
}

async function main() {
  const config = lerConfiguracao();
  const cliente = new QdrantClient({ url: config.qdrantUrl });
  const normas = await carregarCorpus();
  const trechos = normas.flatMap(montarTrechos);
  const padrao = await documentosDoDivisorPadrao(normas);
  const gerador = await criarGeradorE5(config.modeloDeEmbeddings);
  const embeddings = new EmbeddingsE5(gerador);
  const conexao = (variante: string) => ({ url: config.qdrantUrl, collectionName: nomeDaColecao(variante, config.modeloDeEmbeddings) });

  const etapas: [string, number, () => Promise<unknown>][] = [
    ["manual", trechos.length, () => indexarManual(cliente, conexao("manual").collectionName, trechos, gerador)],
    ["langchain", trechos.length, () => indexarLangchain(documentosDosTrechos(trechos), embeddings, conexao("langchain"))],
    ["langchain-padrao", padrao.length, () => indexarLangchain(padrao, embeddings, conexao("langchain-padrao"))],
  ];
  for (const [variante, esperado, indexar] of etapas) {
    const inicio = performance.now();
    await comNovasTentativas(variante, indexar);
    const { collectionName } = conexao(variante);
    const { count } = await cliente.count(collectionName, { exact: true });
    const segundos = ((performance.now() - inicio) / 1000).toFixed(1);
    console.log(`${collectionName}: ${count} pontos em ${segundos} s`);
    if (count !== esperado) console.warn(`  aviso: esperados ${esperado} pontos`);
  }

  for (const [nome, textos] of [
    ["trechos por dispositivo", trechos.map((t) => t.texto)],
    ["divisor padrão", padrao.map((d) => d.pageContent)],
  ] as const) {
    const { truncados, maior, limite } = await contarTruncados(config.modeloDeEmbeddings, textos);
    console.log(`${nome}: maior texto com ${maior} tokens (limite ${limite}); truncados: ${truncados}`);
  }
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro, (erro as { cause?: unknown })?.cause ?? "");
  process.exit(1);
});
