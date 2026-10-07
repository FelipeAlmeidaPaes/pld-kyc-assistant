import { describe, expect, it } from "vitest";
import {
  cortarFecho,
  escolherFonteDoTexto,
  escolherPdfCompilado,
  identificarNorma,
  type NormativoBcb,
  paragrafosSoltos,
  parseBcb,
  urlDoNormativo,
} from "../src/ingest/bcb.js";

// Metadados e textos fictícios, no formato da API do BCB.
const normativo = (campos: Partial<NormativoBcb>): NormativoBcb => ({
  Id: 1,
  Titulo: "Circular N° 9.999",
  Documentos: null,
  Atualizacoes: null,
  Texto: null,
  Revogado: false,
  Cancelado: false,
  ...campos,
});

describe("identificarNorma", () => {
  it("lê tipo e número da URL pública e monta a URL da API", () => {
    const { tipo, numero } = identificarNorma(
      "https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Carta%20Circular&numero=9999",
    );
    expect({ tipo, numero }).toEqual({ tipo: "Carta Circular", numero: "9999" });
    expect(urlDoNormativo(tipo, numero)).toBe(
      "https://www.bcb.gov.br/api/conteudo/app/normativos/exibenormativo?p1=Carta%20Circular&p2=9999",
    );
  });

  it("recusa URL sem tipo ou número", () => {
    expect(() => identificarNorma("https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo")).toThrow();
  });
});

describe("escolherPdfCompilado", () => {
  it("escolhe o PDF limpo (L) da maior versão, comparando o número e não o texto", () => {
    const documentos = "Circ_9999_v1_O.pdf;700#;Circ_9999_v2_L.pdf;700#;Circ_9999_v2_P.pdf;701#;Circ_9999_v10_L.pdf;300#;Circ_9999_v10_P.pdf;310#;";
    expect(escolherPdfCompilado(documentos)).toBe("Circ_9999_v10_L.pdf");
  });

  it("devolve null sem PDF compilado", () => {
    expect(escolherPdfCompilado(null)).toBeNull();
    expect(escolherPdfCompilado("Circ_9999_v1_O.pdf;700#;")).toBeNull();
  });
});

describe("escolherFonteDoTexto", () => {
  it("prefere o PDF compilado", () => {
    expect(escolherFonteDoTexto(normativo({ Documentos: "C_v1_O.pdf;1#;C_v2_L.pdf;1#;", Texto: "<p>Original</p>" }))).toEqual({
      pdf: "C_v2_L.pdf",
    });
  });

  it("usa o HTML da API só quando a norma nunca foi alterada", () => {
    expect(escolherFonteDoTexto(normativo({ Texto: "<p>Art. 1º Regra.</p>" }))).toEqual({ html: "<p>Art. 1º Regra.</p>" });
    expect(() => escolherFonteDoTexto(normativo({ Texto: "<p>Original</p>", Atualizacoes: "Circular nº 1 - Alteração" }))).toThrow(
      /redação original/,
    );
  });

  it("recusa norma revogada ou cancelada", () => {
    expect(() => escolherFonteDoTexto(normativo({ Revogado: true, Texto: "<p>x</p>" }))).toThrow(/revogada ou cancelada/);
    expect(() => escolherFonteDoTexto(normativo({ Cancelado: true, Texto: "<p>x</p>" }))).toThrow(/revogada ou cancelada/);
  });
});

describe("cortarFecho", () => {
  it("descarta assinatura e aviso do DOU depois do último artigo, mantendo seus dispositivos e notas", () => {
    const linhas = [
      "Art. 1º Regra fictícia:",
      "I - hipótese.",
      "Art. 2º Esta Circular entra em vigor na data de sua publicação.",
      "Parágrafo único. Exceção fictícia.",
      "(Incluído pela Resolução BCB nº 9.999, de 1º/1/2099.)",
      "Fulano de Tal Diretor de Regulação",
      "Este texto não substitui o publicado no DOU.",
    ];
    expect(cortarFecho(linhas)).toEqual(linhas.slice(0, 5));
  });

  it("não mexe em linhas sem artigo", () => {
    expect(cortarFecho(["Ementa", "Preâmbulo"])).toEqual(["Ementa", "Preâmbulo"]);
  });
});

describe("paragrafosSoltos", () => {
  it("aponta parágrafo sem rótulo depois do primeiro artigo, ignorando preâmbulo, títulos, notas e fecho", () => {
    const linhas = [
      "Preâmbulo fictício.",
      "Art. 1º Regra fictícia:",
      "I - hipótese;",
      "Texto sem rótulo.",
      "CAPÍTULO II DAS DISPOSIÇÕES FINAIS",
      "(Incluído pela Resolução BCB nº 9.999, de 1º/1/2099.)",
      "Art. 2º Vigência fictícia.",
      "Fulano de Tal",
    ];
    expect(paragrafosSoltos(linhas)).toEqual(["Texto sem rótulo."]);
  });
});

describe("parseBcb", () => {
  it("separa título e nome do capítulo que vêm na mesma linha, sem a nota", () => {
    const [artigo] = parseBcb([
      "CAPÍTULO I DAS REGRAS FICTÍCIAS",
      "Seção II Da Parte Fictícia (Denominação alterada pela Resolução BCB nº 9.999, de 1º/1/2099.)",
      "Art. 1º Regra.",
    ]);
    expect(artigo!.agrupamento).toBe("CAPÍTULO I - DAS REGRAS FICTÍCIAS > Seção II - Da Parte Fictícia");
  });

  it("reconhece item dentro de alínea e alínea de duas letras", () => {
    const caminhos = parseBcb([
      "Art. 1º Regra fictícia:",
      "I - hipóteses:",
      "z) última letra simples;",
      "aa) primeira letra dupla, desde que:",
      "1. primeira condição; e",
      "2. segunda condição.",
      "II - outra hipótese.",
    ]).flatMap((a) => a.dispositivos.map((d) => [d.caminho, d.texto]));
    expect(caminhos).toEqual([
      ["art. 1º, caput", "Regra fictícia:"],
      ["art. 1º, I", "hipóteses:"],
      ["art. 1º, I, z", "última letra simples;"],
      ["art. 1º, I, aa", "primeira letra dupla, desde que:"],
      ["art. 1º, I, aa, 1", "primeira condição; e"],
      ["art. 1º, I, aa, 2", "segunda condição."],
      ["art. 1º, II", "outra hipótese."],
    ]);
  });

  it("não trata como item a linha numerada fora de alínea", () => {
    const [artigo] = parseBcb(["Art. 1º Regra fictícia:", "2099. Linha que continua o caput."]);
    expect(artigo!.dispositivos.map((d) => d.texto)).toEqual(["Regra fictícia: 2099. Linha que continua o caput."]);
  });
});
