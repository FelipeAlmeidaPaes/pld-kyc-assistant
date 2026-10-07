import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parsePlanalto, verificarArtigos } from "../src/ingest/planalto.js";

const html = await readFile(new URL("./fixtures/planalto-ficticia.html", import.meta.url), "utf-8");
const artigos = parsePlanalto(html);
const porNumero = (numero: string) => artigos.find((a) => a.numero === numero)!;
const caminhos = (numero: string) => porNumero(numero).dispositivos.map((d) => d.caminho);

describe("parsePlanalto", () => {
  it("normaliza a numeração dos artigos e para na assinatura", () => {
    expect(artigos.map((a) => a.numero)).toEqual(["1º", "2º", "10", "10-A", "11"]);
  });

  it("descarta texto riscado, por tag ou por estilo", () => {
    const textos = artigos.flatMap((a) => a.dispositivos.map((d) => d.texto)).join(" ");
    expect(textos).not.toContain("Texto original que foi substituído");
    expect(textos).not.toContain("riscado por estilo");
  });

  it("monta o caminho citável de parágrafos, incisos e alíneas", () => {
    expect(caminhos("1º")).toEqual([
      "art. 1º, caput",
      "art. 1º, § 1º",
      "art. 1º, § 1º, I",
      "art. 1º, § 1º, II",
      "art. 1º, § 1º, II, a",
      "art. 1º, § 1º, II, b",
      "art. 1º, § 2º",
    ]);
    expect(caminhos("2º")).toEqual([
      "art. 2º, caput",
      "art. 2º, I",
      "art. 2º, I-A",
      "art. 2º, parágrafo único",
      "art. 2º, parágrafo único, I",
    ]);
  });

  it("anexa linhas sem rótulo, como a pena, ao dispositivo anterior", () => {
    const caput = porNumero("1º").dispositivos[0]!;
    expect(caput.texto).toBe(
      "Texto atual do caput do artigo primeiro. Pena: reclusão, de 1 (um) a 2 (dois) anos, e multa.",
    );
  });

  it("separa as anotações do texto compilado", () => {
    expect(porNumero("1º").dispositivos[0]!.notas).toEqual(["(Redação dada pela Lei nº 88.888, de 2098)"]);
    const incluido = porNumero("10-A").dispositivos[0]!;
    expect(incluido.texto).toBe("Artigo incluído depois.");
    expect(incluido.notas).toEqual(["(Incluído pela Lei nº 88.888, de 2098)"]);
  });

  it("marca como revogado o dispositivo que só tem a anotação de revogação", () => {
    const paragrafo2 = porNumero("1º").dispositivos.find((d) => d.rotulo === "§ 2º")!;
    expect(paragrafo2).toMatchObject({ texto: "", revogado: true });
    expect(porNumero("11").dispositivos[0]).toMatchObject({ texto: "", revogado: true });
    expect(porNumero("10").dispositivos[0]!.revogado).toBe(false);
  });

  it("registra o capítulo de cada artigo", () => {
    expect(porNumero("1º").agrupamento).toBe("CAPÍTULO I - Das Disposições de Teste");
    expect(porNumero("10").agrupamento).toBe("CAPÍTULO II - Das Disposições Finais");
  });
});

describe("verificarArtigos", () => {
  it("aponta lacuna na numeração", () => {
    expect(verificarArtigos(artigos)).toEqual(["lacuna na numeração: do art. 2 para o art. 10"]);
  });

  it("aponta artigo duplicado", () => {
    const duplicado = [...artigos, porNumero("11")];
    expect(verificarArtigos(duplicado)).toContain("art. 11 aparece mais de uma vez");
  });
});
