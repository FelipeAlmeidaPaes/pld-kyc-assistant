import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";

/** Gerador de embeddings usado pelas três variantes (ADR 0003 e 0007). */
export interface GeradorDeEmbeddings {
  readonly modelo: string;
  readonly dimensao: number;
  consultas(textos: string[]): Promise<number[][]>;
  trechos(textos: string[]): Promise<number[][]>;
}

const LOTE = 32;

/**
 * Modelo e5 local (transformers.js), quantizado em 8 bits. O e5 exige "query: " na pergunta e
 * "passage: " no trecho; sem os prefixos a busca piora sem dar erro. Pooling pela média e vetor
 * normalizado, como no cartão do modelo. Textos acima do limite do modelo (512 tokens) são
 * truncados pelo tokenizador.
 */
export async function criarGeradorE5(modelo: string): Promise<GeradorDeEmbeddings> {
  env.cacheDir = fileURLToPath(new URL("../../.cache/modelos/", import.meta.url));
  const extrator = await pipeline("feature-extraction", modelo, { dtype: "q8" });

  const embutir = async (textos: string[]): Promise<number[][]> => {
    const vetores: number[][] = [];
    for (let i = 0; i < textos.length; i += LOTE) {
      const saida = await extrator(textos.slice(i, i + LOTE), { pooling: "mean", normalize: true });
      vetores.push(...(saida.tolist() as number[][]));
    }
    return vetores;
  };

  const [amostra] = await embutir(["query: teste"]);
  return {
    modelo,
    dimensao: amostra!.length,
    consultas: (textos) => embutir(textos.map((t) => `query: ${t}`)),
    trechos: (textos) => embutir(textos.map((t) => `passage: ${t}`)),
  };
}
