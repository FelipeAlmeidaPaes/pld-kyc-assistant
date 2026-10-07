import * as cheerio from "cheerio";

// Marca de fronteira entre blocos. Fica na área de uso privado do Unicode para não colidir com texto nem com \s.
const QUEBRA = "";
const BLOCOS = "p, div, li, tr, h1, h2, h3, h4, h5, h6, blockquote, center, table";
// Links de anotação sem parênteses no Planalto ("Vigência", "Vigência encerrada").
const LINK_DE_NOTA = /^Vigência(?:\s+encerrada)?$/i;

/**
 * Linhas de texto visível, sem o que está marcado como riscado (texto revogado no Planalto).
 * Só <br> e elementos de bloco quebram linha. Quebra de linha no código-fonte vale espaço,
 * como no navegador: o Planalto quebra "I - <quebra> a perda..." no meio do inciso.
 */
export function extrairLinhas(html: string): string[] {
  const $ = cheerio.load(html);
  $("strike, s, del, script, style, [style*='line-through']").remove();
  $("a").each((_, el) => {
    const texto = $(el).text().trim();
    if (LINK_DE_NOTA.test(texto)) $(el).text(`(${texto})`);
  });
  $("br").replaceWith(QUEBRA);
  $(BLOCOS).prepend(QUEBRA).append(QUEBRA);

  return $("body")
    .text()
    .split(QUEBRA)
    .map((linha) => linha.replace(/\s+/g, " ").trim())
    .filter((linha) => linha.length > 0);
}
