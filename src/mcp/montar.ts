import { QdrantClient } from "@qdrant/js-client-rest";
import { type Configuracao, nomeDaColecao } from "../rag/config.js";
import { carregarCorpus, IndiceDoCorpus } from "../rag/corpus.js";
import { criarGerador } from "../rag/embeddings.js";
import { criarBuscaManual } from "../rag/manual/qdrant.js";
import type { RecursosDoMcp } from "./servidor.js";

/**
 * Recursos do servidor MCP, montados uma vez por processo: a busca da variante manual, que é a
 * mesma da avaliação (ADR 0013), e o corpus. A coleção precisa ter sido criada por `npm run indexar`.
 */
export async function montarRecursosDoMcp(config: Configuracao): Promise<RecursosDoMcp> {
  const cliente = new QdrantClient({ url: config.qdrantUrl });
  const colecao = nomeDaColecao("manual", config.modeloDeEmbeddings);
  if (!(await cliente.collectionExists(colecao)).exists) {
    throw new Error(`Coleção ${colecao} não existe no Qdrant. Rode npm run indexar -- --variantes manual.`);
  }
  const normas = await carregarCorpus();
  const gerador = await criarGerador(config.modeloDeEmbeddings, config.chaveGemini);
  return { buscar: criarBuscaManual(cliente, colecao, gerador), normas, indice: new IndiceDoCorpus(normas), k: config.k };
}
