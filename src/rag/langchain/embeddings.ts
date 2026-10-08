import { Embeddings } from "@langchain/core/embeddings";
import type { GeradorDeEmbeddings } from "../embeddings.js";

/**
 * O gerador de embeddings do projeto (e5 local ou Gemini, com o cache) no formato do LangChain.
 * A integração pronta do e5 (`@langchain/community`) exige o transformers.js v3 e não põe os
 * prefixos; com ela, as variantes teriam vetores diferentes (ADR 0007).
 */
export class EmbeddingsDoGerador extends Embeddings {
  private readonly gerador: GeradorDeEmbeddings;

  constructor(gerador: GeradorDeEmbeddings) {
    super({});
    this.gerador = gerador;
  }

  embedDocuments(textos: string[]): Promise<number[][]> {
    return this.gerador.trechos(textos);
  }

  async embedQuery(texto: string): Promise<number[]> {
    const [vetor] = await this.gerador.consultas([texto]);
    return vetor!;
  }
}
