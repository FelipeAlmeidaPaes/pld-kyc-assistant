import * as cheerio from "cheerio";
import type { Artigo, Dispositivo, TipoDispositivo } from "../corpus/types.js";

// Ordinal ("1º", "1o") só quando seguido de separador, para não engolir a primeira letra do texto.
const ORDINAL = String.raw`(?:\s*[º°o](?=[\s.\-–—]|$))?`;
// Sufixo de dispositivo incluído depois, ex.: "17-A", "I-A".
const SUFIXO = String.raw`(?:\s*-\s*([A-Z])(?![a-z]))?`;

const ARTIGO = new RegExp(String.raw`^Art\.\s*(\d+)${ORDINAL}${SUFIXO}\.?\s*`);
const PARAGRAFO = new RegExp(String.raw`^§\s*(\d+)${ORDINAL}${SUFIXO}\.?\s*`);
const PARAGRAFO_UNICO = /^Parágrafo\s+único\.?\s*[-–—]?\s*/i;
const INCISO = new RegExp(String.raw`^([IVXLCDM]+)${SUFIXO}\s*[-–—]\s+`);
const ALINEA = /^([a-z])\)\s*/;
const AGRUPAMENTO = /^(?:LIVRO|Livro|TÍTULO|Título|CAPÍTULO|Capítulo|SEÇÃO|Seção|SUBSEÇÃO|Subseção)\s+(?:[IVXLCDM]+|ÚNIC[OA]|Únic[oa])\b/;
const ASSINATURA = /^Brasília,\s/;
const NOTA =
  /\((?:Redação dada|Incluíd[oa]|Acrescid[oa]|Revogad[oa]|Renumerad[oa]|Vide|Vigência|Regulamento|Promulgação)[^)]*\)/gi;

/** Texto visível de cada parágrafo HTML, sem o que o Planalto marca como riscado (texto revogado). */
export function extrairLinhas(html: string): string[] {
  const $ = cheerio.load(html);
  $("strike, s, del, script, style, [style*='line-through']").remove();
  $("br").replaceWith("\n");

  const blocos = $("p").length > 0 ? $("p").toArray().map((el) => $(el).text()) : [$("body").text()];
  return blocos
    .flatMap((bloco) => bloco.split("\n"))
    .map((linha) => linha.replace(/ /g, " ").replace(/\s+/g, " ").trim())
    .filter((linha) => linha.length > 0);
}

/** Até o 9 a lei usa ordinal (1º); do 10 em diante, cardinal (10). */
function numeroLegal(digitos: string, sufixo: string | undefined): string {
  const n = Number(digitos);
  return `${n < 10 ? `${n}º` : n}${sufixo ? `-${sufixo}` : ""}`;
}

interface Rascunho {
  tipo: TipoDispositivo;
  rotulo: string;
  caminho: string;
  partes: string[];
}

function finalizar(rascunho: Rascunho): Dispositivo {
  const bruto = rascunho.partes.join(" ");
  const notas = bruto.match(NOTA) ?? [];
  const texto = bruto.replace(NOTA, " ").replace(/\s+/g, " ").trim();
  return {
    tipo: rascunho.tipo,
    rotulo: rascunho.rotulo,
    caminho: rascunho.caminho,
    texto,
    notas,
    revogado: texto === "" && notas.some((nota) => /^\(revogad/i.test(nota)),
  };
}

/**
 * Converte uma página de lei do Planalto (texto compilado) em artigos e dispositivos.
 * Linhas que não abrem um dispositivo, como "Pena: reclusão...", continuam o dispositivo anterior.
 */
export function parsePlanalto(html: string): Artigo[] {
  const artigos: Artigo[] = [];
  let artigo: Artigo | null = null;
  let atual: Rascunho | null = null;
  let paragrafo: string | null = null;
  let inciso: string | null = null;
  let agrupamento: string | null = null;
  let aguardandoNomeDoAgrupamento = false;

  const fecharDispositivo = () => {
    if (artigo && atual) artigo.dispositivos.push(finalizar(atual));
    atual = null;
  };

  const abrir = (tipo: TipoDispositivo, rotulo: string, caminho: string, resto: string) => {
    fecharDispositivo();
    atual = { tipo, rotulo, caminho, partes: [resto] };
  };

  const continuar = (linha: string) => {
    atual?.partes.push(linha);
  };

  for (const linha of extrairLinhas(html)) {
    if (ASSINATURA.test(linha)) break;

    if (AGRUPAMENTO.test(linha)) {
      fecharDispositivo();
      agrupamento = linha;
      aguardandoNomeDoAgrupamento = true;
      continue;
    }

    let m: RegExpMatchArray | null;
    if ((m = linha.match(ARTIGO))) {
      fecharDispositivo();
      const numero = numeroLegal(m[1]!, m[2]);
      artigo = { numero, rotulo: `art. ${numero}`, agrupamento, dispositivos: [] };
      artigos.push(artigo);
      paragrafo = inciso = null;
      aguardandoNomeDoAgrupamento = false;
      abrir("caput", "caput", `${artigo.rotulo}, caput`, linha.slice(m[0].length));
      continue;
    }

    if (aguardandoNomeDoAgrupamento) {
      agrupamento = `${agrupamento} - ${linha}`;
      aguardandoNomeDoAgrupamento = false;
      continue;
    }

    // Antes do primeiro artigo ficam ementa e preâmbulo, que não são dispositivos.
    if (!artigo) continue;

    if ((m = linha.match(PARAGRAFO)) || (m = linha.match(PARAGRAFO_UNICO))) {
      paragrafo = m[1] ? `§ ${numeroLegal(m[1], m[2])}` : "parágrafo único";
      inciso = null;
      abrir("paragrafo", paragrafo, `${artigo.rotulo}, ${paragrafo}`, linha.slice(m[0].length));
    } else if ((m = linha.match(INCISO))) {
      inciso = `${m[1]}${m[2] ? `-${m[2]}` : ""}`;
      const base = paragrafo ? `${artigo.rotulo}, ${paragrafo}` : artigo.rotulo;
      abrir("inciso", inciso, `${base}, ${inciso}`, linha.slice(m[0].length));
    } else if ((m = linha.match(ALINEA))) {
      const base = [artigo.rotulo, paragrafo, inciso].filter(Boolean).join(", ");
      abrir("alinea", m[1]!, `${base}, ${m[1]}`, linha.slice(m[0].length));
    } else {
      continuar(linha);
    }
  }
  fecharDispositivo();
  return artigos;
}

/**
 * Sinais de que o parser perdeu ou duplicou texto. No texto compilado, artigo revogado
 * continua listado como "(Revogado)", então lacuna na numeração indica falha de extração.
 */
export function verificarArtigos(artigos: Artigo[]): string[] {
  const avisos: string[] = [];
  const vistos = new Set<string>();
  let anterior: number | null = null;

  for (const artigo of artigos) {
    if (vistos.has(artigo.numero)) avisos.push(`${artigo.rotulo} aparece mais de uma vez`);
    vistos.add(artigo.numero);

    const n = Number.parseInt(artigo.numero, 10);
    if (anterior !== null && n > anterior + 1) {
      avisos.push(`lacuna na numeração: do art. ${anterior} para o ${artigo.rotulo}`);
    }
    anterior = n;

    if (artigo.dispositivos.every((d) => d.texto === "" && !d.revogado)) {
      avisos.push(`${artigo.rotulo} ficou sem texto`);
    }
  }
  return avisos;
}
