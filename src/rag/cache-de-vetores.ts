import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import type { GeradorDeEmbeddings } from "./embeddings.js";

type Tipo = "consulta" | "trecho";

/** Arquivo do cache de um modelo, fora do Git. */
export const arquivoDoCache = (modelo: string) =>
  new URL(`../../.cache/vetores/${modelo.replace(/[^\w.-]+/g, "_")}.jsonl`, import.meta.url);

const chave = (tipo: Tipo, texto: string) => createHash("sha256").update(`${tipo}\n${texto}`).digest("hex");

/**
 * Guarda em disco cada vetor já calculado, pelo hash do tipo e do texto, num arquivo por modelo.
 * Com embedding por API no nível gratuito (1.000 textos por dia e por modelo no Gemini),
 * reindexar ou repetir uma avaliação não pode gastar a cota de novo com o mesmo texto.
 */
export async function comCacheDeVetores(gerador: GeradorDeEmbeddings, arquivo: URL): Promise<GeradorDeEmbeddings> {
  const vetores = new Map<string, number[]>();
  try {
    for (const linha of (await readFile(arquivo, "utf-8")).split("\n")) {
      if (linha.trim() === "") continue;
      const { chave: k, vetor } = JSON.parse(linha) as { chave: string; vetor: number[] };
      vetores.set(k, vetor);
    }
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code !== "ENOENT") throw erro;
  }

  const comCache = (tipo: Tipo, calcular: (textos: string[]) => Promise<number[][]>) => async (textos: string[]) => {
    const chaves = textos.map((t) => chave(tipo, t));
    const faltam = [...new Set(chaves.filter((k) => !vetores.has(k)))];
    if (faltam.length > 0) {
      const textoDe = new Map(chaves.map((k, i) => [k, textos[i]!]));
      const novos = await calcular(faltam.map((k) => textoDe.get(k)!));
      await mkdir(new URL(".", arquivo), { recursive: true });
      await appendFile(arquivo, faltam.map((k, i) => `${JSON.stringify({ chave: k, vetor: novos[i] })}\n`).join(""));
      faltam.forEach((k, i) => vetores.set(k, novos[i]!));
    }
    return chaves.map((k) => vetores.get(k)!);
  };

  return {
    modelo: gerador.modelo,
    dimensao: gerador.dimensao,
    consultas: comCache("consulta", (t) => gerador.consultas(t)),
    trechos: comCache("trecho", (t) => gerador.trechos(t)),
  };
}

/** Grava vetores já calculados no cache, como se tivessem passado por ele. */
export async function semearCache(arquivo: URL, tipo: Tipo, textos: string[], vetores: number[][]): Promise<void> {
  await mkdir(new URL(".", arquivo), { recursive: true });
  await appendFile(arquivo, textos.map((t, i) => `${JSON.stringify({ chave: chave(tipo, t), vetor: vetores[i] })}\n`).join(""));
}
