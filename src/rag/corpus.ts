import { readdir, readFile } from "node:fs/promises";
import type { Artigo, Dispositivo, NormaNormalizada } from "../corpus/types.js";
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
  /** O artigo inteiro, para chegar aos dispositivos que abrem este e aos que vêm abaixo dele. */
  artigo: Artigo;
}

/** Busca de dispositivo por sigla e caminho, tolerante à grafia que o modelo usa na citação. */
export class IndiceDoCorpus {
  private readonly porChave = new Map<string, DispositivoNoCorpus>();

  constructor(normas: NormaNormalizada[]) {
    for (const norma of normas) {
      for (const artigo of norma.artigos) {
        for (const dispositivo of artigo.dispositivos) {
          const chave = `${chaveDaNorma(norma.fonte.sigla)}|${normalizarCaminho(dispositivo.caminho)}`;
          this.porChave.set(chave, { sigla: norma.fonte.sigla, dispositivo, artigo });
        }
      }
    }
  }

  buscar(sigla: string, caminho: string): DispositivoNoCorpus | undefined {
    return this.porChave.get(`${chaveDaNorma(sigla)}|${normalizarCaminho(caminho)}`);
  }
}
