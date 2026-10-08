import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { type Configuracao, nomeDaColecao, SemProvedorDeLlm } from "./config.js";
import { carregarCorpus, IndiceDoCorpus } from "./corpus.js";
import { criarGeradorE5 } from "./embeddings.js";
import { EmbeddingsE5 } from "./langchain/embeddings.js";
import { trechoDoDocumento } from "./langchain/indice.js";
import { criarModeloDeChat, criarPipelineLangchain } from "./langchain/pipeline.js";
import { criarClienteDeChat } from "./manual/llm.js";
import { criarPipelineManual } from "./manual/pipeline.js";
import { criarBuscaManual } from "./manual/qdrant.js";
import { type Pipeline, VARIANTES, type Variante, type VarianteMontada } from "./tipos.js";

const semLlm: Pipeline = async () => {
  throw new SemProvedorDeLlm();
};

/**
 * Monta as três variantes sobre os mesmos recursos: corpus, gerador de embeddings e provedores.
 * As coleções precisam ter sido criadas por `npm run indexar`. Sem provedor de LLM, a busca
 * funciona e a pergunta completa responde 503.
 */
export async function montarVariantes(config: Configuracao): Promise<Record<Variante, VarianteMontada>> {
  const cliente = new QdrantClient({ url: config.qdrantUrl });
  const colecao = (variante: Variante) => nomeDaColecao(variante, config.modeloDeEmbeddings);
  for (const variante of VARIANTES) {
    if (!(await cliente.collectionExists(colecao(variante))).exists) {
      throw new Error(`Coleção ${colecao(variante)} não existe no Qdrant. Rode npm run indexar.`);
    }
  }

  const indice = new IndiceDoCorpus(await carregarCorpus());
  const gerador = await criarGeradorE5(config.modeloDeEmbeddings);
  const comLlm = config.provedores.length > 0;
  const comuns = { indice, k: config.k, limiar: config.limiar };

  const buscarManual = criarBuscaManual(cliente, colecao("manual"), gerador);
  const chat = comLlm ? criarClienteDeChat(config.provedores, { usarFallback: config.usarFallback }) : null;
  const manual: VarianteMontada = {
    buscar: (pergunta) => buscarManual(pergunta, config.k),
    perguntar: chat
      ? criarPipelineManual({ ...comuns, buscar: buscarManual, gerar: (instrucoes, mensagem) => chat.gerar(instrucoes, mensagem) })
      : semLlm,
  };

  const embeddings = new EmbeddingsE5(gerador);
  const modelo = comLlm ? criarModeloDeChat(config.provedores, config.usarFallback) : null;
  const langchain = async (variante: "langchain" | "langchain-padrao"): Promise<VarianteMontada> => {
    const loja = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: config.qdrantUrl,
      collectionName: colecao(variante),
    });
    const buscar = (pergunta: string, k: number) => loja.similaritySearchWithScore(pergunta, k);
    return {
      buscar: async (pergunta) => (await buscar(pergunta, config.k)).map(([doc, pontuacao]) => trechoDoDocumento(doc, pontuacao)),
      perguntar: modelo ? criarPipelineLangchain({ ...comuns, variante, buscar, modelo }) : semLlm,
    };
  };

  return { manual, langchain: await langchain("langchain"), "langchain-padrao": await langchain("langchain-padrao") };
}
