import { Embeddings } from "@langchain/core/embeddings";
import type { GeradorDeEmbeddings } from "../embeddings.js";

/**
 * O gerador e5 do projeto no formato de embeddings do LangChain. A integração pronta
 * (`@langchain/community`) exige o transformers.js v3 e não põe os prefixos do e5;
 * com ela, as variantes teriam vetores diferentes (ADR 0007).
 */
export class EmbeddingsE5 extends Embeddings {
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
