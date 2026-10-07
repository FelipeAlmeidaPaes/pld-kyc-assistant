import { readFile } from "node:fs/promises";
import type { Fonte } from "./types.js";

export const CAMINHO_FONTES = new URL("../../corpus/fontes.json", import.meta.url);

export async function carregarFontes(caminho: URL = CAMINHO_FONTES): Promise<Fonte[]> {
  const fontes = JSON.parse(await readFile(caminho, "utf-8")) as Fonte[];
  const ids = new Set<string>();
  for (const fonte of fontes) {
    if (ids.has(fonte.id)) throw new Error(`Fonte duplicada em fontes.json: ${fonte.id}`);
    ids.add(fonte.id);
  }
  return fontes;
}

export async function buscarFonte(id: string): Promise<Fonte> {
  const fontes = await carregarFontes();
  const fonte = fontes.find((f) => f.id === id);
  if (!fonte) {
    throw new Error(`Fonte "${id}" não existe. Disponíveis: ${fontes.map((f) => f.id).join(", ")}`);
  }
  return fonte;
}
