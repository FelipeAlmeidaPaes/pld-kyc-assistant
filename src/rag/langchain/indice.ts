import { Document } from "@langchain/core/documents";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import type { NormaNormalizada } from "../../corpus/types.js";
import type { Trecho, TrechoRecuperado } from "../tipos.js";
import { idDeterministico, textoCorrido } from "../trechos.js";

/** Variante `langchain`: um documento por trecho, os mesmos da variante manual. */
export function documentosDosTrechos(trechos: Trecho[]): Document[] {
  return trechos.map(
    (t) =>
      new Document({ id: t.id, pageContent: t.texto, metadata: { normaId: t.normaId, sigla: t.sigla, caminho: t.caminho } }),
  );
}

/**
 * Variante `langchain-padrao`: o texto corrido de cada norma partido pelo divisor padrão do
 * LangChain (1.000 caracteres, 200 de sobreposição). O documento só sabe de que norma veio.
 */
export async function documentosDoDivisorPadrao(normas: NormaNormalizada[]): Promise<Document[]> {
  const divisor = new RecursiveCharacterTextSplitter();
  const documentos: Document[] = [];
  for (const norma of normas) {
    const pedacos = await divisor.splitDocuments([
      new Document({ pageContent: textoCorrido(norma), metadata: { normaId: norma.fonte.id, sigla: norma.fonte.sigla } }),
    ]);
    pedacos.forEach((pedaco, i) => {
      pedaco.id = idDeterministico(`${norma.fonte.id}|padrao|${i}`);
      documentos.push(pedaco);
    });
  }
  return documentos;
}

/** Recria a coleção e indexa os documentos pelo vector store do LangChain. */
export async function indexarLangchain(
  documentos: Document[],
  embeddings: EmbeddingsInterface,
  conexao: { url: string; collectionName: string },
): Promise<QdrantVectorStore> {
  const loja = new QdrantVectorStore(embeddings, conexao);
  if ((await loja.client.collectionExists(conexao.collectionName)).exists) {
    await loja.client.deleteCollection(conexao.collectionName);
  }
  return QdrantVectorStore.fromDocuments(documentos, embeddings, conexao);
}

/** Documento recuperado no formato comum das variantes. */
export function trechoDoDocumento(documento: Document, pontuacao: number): TrechoRecuperado {
  const { normaId, sigla, caminho } = documento.metadata as { normaId: string; sigla: string; caminho?: string | null };
  return { id: documento.id ?? "", normaId, sigla, caminho: caminho ?? null, texto: documento.pageContent, pontuacao };
}
