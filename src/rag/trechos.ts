import { createHash } from "node:crypto";
import type { Artigo, Dispositivo, NormaNormalizada } from "../corpus/types.js";
import type { Trecho } from "./tipos.js";

/** UUID determinístico (o Qdrant só aceita inteiro ou UUID como id de ponto). */
export function idDeterministico(chave: string): string {
  const h = createHash("sha256").update(chave).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/**
 * Regra do índice (ADR 0005): fica de fora o dispositivo sem texto próprio, ou seja, revogado,
 * com vigência encerrada ou só "(VETADO)". "(Vetado)" no meio de texto válido fica.
 */
export function temTextoProprio(dispositivo: Dispositivo): boolean {
  return dispositivo.texto !== "" && !/^\(vetado\)\.?$/i.test(dispositivo.texto);
}

/** Dispositivo escrito como na norma: "Art. 1º ...", "§ 2º ...", "I - ...", "a) ...", "1. ...". */
function comRotulo(artigo: Artigo, dispositivo: Dispositivo): string {
  switch (dispositivo.tipo) {
    case "caput":
      return `Art. ${artigo.numero} ${dispositivo.texto}`;
    case "paragrafo":
      return dispositivo.rotulo === "parágrafo único"
        ? `Parágrafo único. ${dispositivo.texto}`
        : `${dispositivo.rotulo} ${dispositivo.texto}`;
    case "inciso":
      return `${dispositivo.rotulo} - ${dispositivo.texto}`;
    case "alinea":
      return `${dispositivo.rotulo}) ${dispositivo.texto}`;
    case "item":
      return `${dispositivo.rotulo}. ${dispositivo.texto}`;
  }
}

/**
 * Dispositivos acima deste na hierarquia: o caput do artigo e, se houver, o parágrafo, o inciso e
 * a alínea que o abrem. Sem eles, "I - dos clientes;" não diz nada sozinho.
 */
function ascendentes(artigo: Artigo, dispositivo: Dispositivo): Dispositivo[] {
  if (dispositivo.tipo === "caput") return [];
  const partes = dispositivo.caminho.split(", ");
  const caminhos = [`${partes[0]}, caput`, ...partes.slice(1, -1).map((_, i) => partes.slice(0, i + 2).join(", "))];
  return caminhos.flatMap((caminho) => artigo.dispositivos.filter((d) => d.caminho === caminho && temTextoProprio(d)));
}

/** Um trecho por dispositivo com texto próprio, com o contexto que o torna legível sozinho. */
export function montarTrechos(norma: NormaNormalizada): Trecho[] {
  const { id: normaId, sigla } = norma.fonte;
  return norma.artigos.flatMap((artigo) =>
    artigo.dispositivos.filter(temTextoProprio).map((dispositivo) => ({
      id: idDeterministico(`${normaId}|${dispositivo.caminho}`),
      normaId,
      sigla,
      caminho: dispositivo.caminho,
      texto: [
        `${sigla}, ${dispositivo.caminho}`,
        ...(artigo.agrupamento ? [artigo.agrupamento] : []),
        ...ascendentes(artigo, dispositivo).map((d) => comRotulo(artigo, d)),
        comRotulo(artigo, dispositivo),
      ].join("\n"),
    })),
  );
}

/**
 * Texto corrido da norma, para a variante com o divisor padrão do LangChain: título, agrupamentos
 * e dispositivos com texto próprio, um por linha, na ordem da norma. Sem caminho de citação:
 * o modelo tem de deduzir o dispositivo pelo texto, como faria com a norma impressa.
 */
export function textoCorrido(norma: NormaNormalizada): string {
  return linhasDoTextoCorrido(norma)
    .map((linha) => linha.texto)
    .join("\n");
}

/** Linhas do texto corrido, com o caminho do dispositivo de cada uma (null no título e nos agrupamentos). */
export function linhasDoTextoCorrido(norma: NormaNormalizada): { texto: string; caminho: string | null }[] {
  const linhas: { texto: string; caminho: string | null }[] = [{ texto: norma.fonte.titulo, caminho: null }];
  let agrupamento: string | null = null;
  for (const artigo of norma.artigos) {
    if (artigo.agrupamento && artigo.agrupamento !== agrupamento) linhas.push({ texto: artigo.agrupamento, caminho: null });
    agrupamento = artigo.agrupamento;
    for (const d of artigo.dispositivos.filter(temTextoProprio)) linhas.push({ texto: comRotulo(artigo, d), caminho: d.caminho });
  }
  return linhas;
}
