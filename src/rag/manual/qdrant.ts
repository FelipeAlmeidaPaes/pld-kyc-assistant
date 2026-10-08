import type { QdrantClient } from "@qdrant/js-client-rest";
import type { GeradorDeEmbeddings } from "../embeddings.js";
import type { Trecho, TrechoRecuperado } from "../tipos.js";

const LOTE = 128;

/** Apaga e recria a coleção, para a reindexação não misturar pontos antigos. */
export async function recriarColecao(cliente: QdrantClient, colecao: string, dimensao: number): Promise<void> {
  if ((await cliente.collectionExists(colecao)).exists) await cliente.deleteCollection(colecao);
  await cliente.createCollection(colecao, { vectors: { size: dimensao, distance: "Cosine" } });
}

/** Indexa os trechos: embeddings em lote e um ponto por trecho, com o trecho inteiro no payload. */
export async function indexarManual(
  cliente: QdrantClient,
  colecao: string,
  trechos: Trecho[],
  gerador: GeradorDeEmbeddings,
): Promise<void> {
  await recriarColecao(cliente, colecao, gerador.dimensao);
  for (let i = 0; i < trechos.length; i += LOTE) {
    const lote = trechos.slice(i, i + LOTE);
    const vetores = await gerador.trechos(lote.map((t) => t.texto));
    await cliente.upsert(colecao, {
      wait: true,
      points: lote.map(({ id, ...payload }, j) => ({ id, vector: vetores[j]!, payload: { ...payload } })),
    });
  }
}

/** Busca vetorial: embedding da pergunta e os k pontos mais próximos. */
export function criarBuscaManual(cliente: QdrantClient, colecao: string, gerador: GeradorDeEmbeddings) {
  return async (pergunta: string, k: number): Promise<TrechoRecuperado[]> => {
    const [vetor] = await gerador.consultas([pergunta]);
    const { points } = await cliente.query(colecao, { query: vetor!, limit: k, with_payload: true });
    return points.map((ponto) => {
      const payload = ponto.payload as Omit<Trecho, "id">;
      return {
        id: String(ponto.id),
        normaId: payload.normaId,
        sigla: payload.sigla,
        caminho: payload.caminho,
        texto: payload.texto,
        pontuacao: ponto.score,
      };
    });
  };
}
