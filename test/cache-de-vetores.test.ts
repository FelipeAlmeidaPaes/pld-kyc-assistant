import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { comCacheDeVetores, semearCache } from "../src/rag/cache-de-vetores.js";
import type { GeradorDeEmbeddings } from "../src/rag/embeddings.js";

function geradorContado() {
  const pedidos: { tipo: string; textos: string[] }[] = [];
  const vetor = (tipo: string, texto: string) => [tipo === "consulta" ? 1 : 0, texto.length];
  const gerador: GeradorDeEmbeddings = {
    modelo: "modelo-ficticio",
    dimensao: 2,
    consultas: async (textos) => (pedidos.push({ tipo: "consulta", textos }), textos.map((t) => vetor("consulta", t))),
    trechos: async (textos) => (pedidos.push({ tipo: "trecho", textos }), textos.map((t) => vetor("trecho", t))),
  };
  return { gerador, pedidos };
}

const arquivoTemporario = async () => pathToFileURL(join(await mkdtemp(join(tmpdir(), "cache-")), "vetores.jsonl"));

describe("comCacheDeVetores", () => {
  it("só pede o que falta, uma vez por texto, e devolve na ordem pedida", async () => {
    const { gerador, pedidos } = geradorContado();
    const comCache = await comCacheDeVetores(gerador, await arquivoTemporario());

    expect(await comCache.trechos(["aa", "b"])).toEqual([[0, 2], [0, 1]]);
    expect(await comCache.trechos(["b", "ccc", "ccc"])).toEqual([[0, 1], [0, 3], [0, 3]]);
    expect(pedidos).toEqual([
      { tipo: "trecho", textos: ["aa", "b"] },
      { tipo: "trecho", textos: ["ccc"] },
    ]);
  });

  it("separa consulta de trecho com o mesmo texto, e guarda em disco para a próxima execução", async () => {
    const arquivo = await arquivoTemporario();
    const primeira = geradorContado();
    const cache = await comCacheDeVetores(primeira.gerador, arquivo);
    await cache.trechos(["x"]);
    await cache.consultas(["x"]);
    expect(primeira.pedidos).toHaveLength(2);

    const segunda = geradorContado();
    const recarregado = await comCacheDeVetores(segunda.gerador, arquivo);
    expect(await recarregado.consultas(["x"])).toEqual([[1, 1]]);
    expect(await recarregado.trechos(["x"])).toEqual([[0, 1]]);
    expect(segunda.pedidos).toEqual([]);
  });

  it("aceita vetores semeados de fora", async () => {
    const arquivo = await arquivoTemporario();
    await semearCache(arquivo, "trecho", ["semeado"], [[9, 9]]);
    const { gerador, pedidos } = geradorContado();
    expect(await (await comCacheDeVetores(gerador, arquivo)).trechos(["semeado"])).toEqual([[9, 9]]);
    expect(pedidos).toEqual([]);
  });
});
