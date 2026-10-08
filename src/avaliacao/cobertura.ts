import type { NormaNormalizada } from "../corpus/types.js";
import { linhasDoTextoCorrido } from "../rag/trechos.js";
import type { Trecho } from "../rag/tipos.js";

interface LinhaComPosicao {
  inicio: number;
  fim: number;
  caminho: string | null;
}

/**
 * Dispositivos que um trecho recuperado contém, como referências "<sigla>, <caminho>". O trecho
 * de dispositivo contém só o próprio. O pedaço do divisor padrão não tem caminho: é localizado
 * no texto corrido da norma, e contém todo dispositivo cuja linha ele toca, mesmo em parte.
 * Devolve null quando o pedaço não é achado no texto corrido (o índice saiu de outro corpus).
 */
export function criarLocalizador(normas: NormaNormalizada[]): (trecho: Trecho) => string[] | null {
  const porNorma = new Map<string, { sigla: string; texto: string; linhas: LinhaComPosicao[] }>();
  for (const norma of normas) {
    const corrido = linhasDoTextoCorrido(norma);
    const linhas: LinhaComPosicao[] = [];
    let inicio = 0;
    for (const linha of corrido) {
      linhas.push({ inicio, fim: inicio + linha.texto.length, caminho: linha.caminho });
      inicio += linha.texto.length + 1;
    }
    porNorma.set(norma.fonte.id, { sigla: norma.fonte.sigla, texto: corrido.map((l) => l.texto).join("\n"), linhas });
  }

  return (trecho) => {
    if (trecho.caminho) return [`${trecho.sigla}, ${trecho.caminho}`];
    const norma = porNorma.get(trecho.normaId);
    const inicio = norma?.texto.indexOf(trecho.texto.trim()) ?? -1;
    if (!norma || inicio < 0) return null;
    const fim = inicio + trecho.texto.trim().length;
    return norma.linhas
      .filter((l) => l.caminho !== null && l.inicio < fim && l.fim > inicio)
      .map((l) => `${norma.sigla}, ${l.caminho}`);
  };
}
