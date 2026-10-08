import { readdir, readFile } from "node:fs/promises";
import type { Dispositivo, NormaNormalizada } from "../corpus/types.js";
import { chaveDaNorma, normalizarCaminho } from "./citacoes.js";

const PASTA_NORMALIZADA = new URL("../../corpus/normalized/", import.meta.url);

export async function carregarCorpus(pasta: URL = PASTA_NORMALIZADA): Promise<NormaNormalizada[]> {
  const arquivos = (await readdir(pasta)).filter((nome) => nome.endsWith(".json")).sort();
  return Promise.all(
    arquivos.map(async (nome) => JSON.parse(await readFile(new URL(nome, pasta), "utf-8")) as NormaNormalizada),
  );
}

export interface DispositivoNoCorpus {
  sigla: string;
  dispositivo: Dispositivo;
}

/** Busca de dispositivo por sigla e caminho, tolerante à grafia que o modelo usa na citação. */
export class IndiceDoCorpus {
  private readonly porChave = new Map<string, DispositivoNoCorpus>();

  constructor(normas: NormaNormalizada[]) {
    for (const norma of normas) {
      for (const dispositivo of norma.artigos.flatMap((a) => a.dispositivos)) {
        const chave = `${chaveDaNorma(norma.fonte.sigla)}|${normalizarCaminho(dispositivo.caminho)}`;
        this.porChave.set(chave, { sigla: norma.fonte.sigla, dispositivo });
      }
    }
  }

  buscar(sigla: string, caminho: string): DispositivoNoCorpus | undefined {
    return this.porChave.get(`${chaveDaNorma(sigla)}|${normalizarCaminho(caminho)}`);
  }
}
