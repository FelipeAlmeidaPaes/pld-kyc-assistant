import { describe, expect, it } from "vitest";
import { type LinhaPdf, lerLinhasDoPdf, montarParagrafos } from "../src/ingest/pdf.js";
import { gerarPdf, type LinhaFicticia } from "./fixtures/pdf-ficticio.js";

// Geometria dos PDFs do BCB: margem em 85, recuo de parágrafo em 156, linhas a 15 pt e parágrafos a 21 pt.
const corpo = (y: number, texto: string, x = 85): LinhaFicticia => ({ x, y, tamanho: 12, texto });
const recuo = (y: number, texto: string) => corpo(y, texto, 156);
const rodape = (pagina: number): LinhaFicticia => ({ x: 85, y: 31, tamanho: 10, texto: `Norma fictícia Página ${pagina} de 2` });

const pdf = gerarPdf([
  [
    { x: 546, y: 817, tamanho: 10, texto: "Público" },
    corpo(717, "CAPÍTULO I", 290),
    corpo(703, "DAS REGRAS FICTÍCIAS", 230),
    recuo(682, "Art. 1º Regra fictícia que ocupa"),
    corpo(667, "duas linhas, com composto 99-"),
    corpo(652, "A no meio."),
    recuo(631, "I - primeiro inciso, que continua"),
    rodape(1),
  ],
  [
    { x: 546, y: 817, tamanho: 10, texto: "Público" },
    corpo(717, "na página seguinte;"),
    recuo(696, "II - segundo inciso."),
    corpo(640, "Fulano de Tal", 263),
    rodape(2),
  ],
]);

describe("lerLinhasDoPdf", () => {
  it("lê texto, posição e altura da fonte de cada linha, página a página", async () => {
    const linhas = await lerLinhasDoPdf(pdf);
    expect(linhas.map((l) => [l.pagina, Math.round(l.x), Math.round(l.y), Math.round(l.altura), l.texto])).toEqual([
      [1, 546, 817, 10, "Público"],
      [1, 290, 717, 12, "CAPÍTULO I"],
      [1, 230, 703, 12, "DAS REGRAS FICTÍCIAS"],
      [1, 156, 682, 12, "Art. 1º Regra fictícia que ocupa"],
      [1, 85, 667, 12, "duas linhas, com composto 99-"],
      [1, 85, 652, 12, "A no meio."],
      [1, 156, 631, 12, "I - primeiro inciso, que continua"],
      [1, 85, 31, 10, "Norma fictícia Página 1 de 2"],
      [2, 546, 817, 10, "Público"],
      [2, 85, 717, 12, "na página seguinte;"],
      [2, 156, 696, 12, "II - segundo inciso."],
      [2, 263, 640, 12, "Fulano de Tal"],
      [2, 85, 31, 10, "Norma fictícia Página 2 de 2"],
    ]);
  });

  it("não altera os bytes recebidos", async () => {
    const copia = new Uint8Array(pdf);
    await lerLinhasDoPdf(pdf);
    expect(pdf).toEqual(copia);
  });
});

describe("montarParagrafos", () => {
  it("remonta parágrafos pelo espaço entre linhas e, na virada de página, pelo recuo", async () => {
    const { paragrafos, descartadas } = montarParagrafos(await lerLinhasDoPdf(pdf));
    expect(paragrafos).toEqual([
      "CAPÍTULO I DAS REGRAS FICTÍCIAS",
      "Art. 1º Regra fictícia que ocupa duas linhas, com composto 99-A no meio.",
      "I - primeiro inciso, que continua na página seguinte;",
      "II - segundo inciso.",
      "Fulano de Tal",
    ]);
    expect(descartadas).toEqual(["Público", "Norma fictícia Página 1 de 2", "Público", "Norma fictícia Página 2 de 2"]);
  });

  it("na virada de página, continua o parágrafo se a linha está na margem e abre outro se tem recuo", () => {
    const linha = (pagina: number, x: number, y: number, texto: string): LinhaPdf => ({ pagina, x, y, altura: 12, texto });
    const linhas = [
      linha(1, 156, 700, "Art. 1º Primeira regra"),
      linha(1, 85, 685, "que continua"),
      linha(2, 85, 717, "na outra página."),
      linha(3, 156, 717, "Art. 2º Segunda regra."),
    ];
    expect(montarParagrafos(linhas).paragrafos).toEqual([
      "Art. 1º Primeira regra que continua na outra página.",
      "Art. 2º Segunda regra.",
    ]);
  });
});
