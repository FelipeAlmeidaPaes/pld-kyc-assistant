import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parsePlanalto, removerRuidoDoFirewall, verificarArtigos } from "../src/ingest/planalto.js";

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

  it("aceita a letra do artigo colada no número, sem confundir com a primeira palavra do texto", () => {
    const html = "<p>Art. 1º A regra fictícia.</p><p>Art. 1A. Artigo incluído.</p><p>§ 2A. Parágrafo incluído.</p>";
    const [primeiro, incluido] = parsePlanalto(html);
    expect(primeiro).toMatchObject({ numero: "1º", dispositivos: [{ texto: "A regra fictícia." }] });
    expect(incluido!.numero).toBe("1º-A");
    expect(incluido!.dispositivos.map((d) => [d.caminho, d.texto])).toEqual([
      ["art. 1º-A, caput", "Artigo incluído."],
      ["art. 1º-A, § 2º-A", "Parágrafo incluído."],
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

// Padrões encontrados nas páginas reais do Planalto (leis 9.613, 7.492 e 13.810), com texto fictício.
describe("parsePlanalto com o HTML real do Planalto", () => {
  const dispositivos = (trecho: string) =>
    parsePlanalto(trecho).flatMap((a) => a.dispositivos.map((d) => [d.caminho, d.texto]));

  it("trata quebra de linha do código-fonte como espaço, inclusive logo depois do rótulo", () => {
    const trecho = "<p>Art. 1º Regra fictícia:</p>\n<p>I - \n\tprimeira\n hipótese;</p>";
    expect(dispositivos(trecho)).toEqual([
      ["art. 1º, caput", "Regra fictícia:"],
      ["art. 1º, I", "primeira hipótese;"],
    ]);
  });

  it("separa o parágrafo que vem na mesma linha do texto anterior", () => {
    const trecho = "<p>Art. 1º Regra fictícia. Parágrafo único. Exceção fictícia.</p><p>Art. 2º Outra regra; § 1º Detalhe.</p>";
    expect(dispositivos(trecho)).toEqual([
      ["art. 1º, caput", "Regra fictícia."],
      ["art. 1º, parágrafo único", "Exceção fictícia."],
      ["art. 2º, caput", "Outra regra;"],
      ["art. 2º, § 1º", "Detalhe."],
    ]);
  });

  it("não separa referência a parágrafo no meio da frase", () => {
    const trecho = "<p>Art. 1º Aplica-se o disposto no § 2º do art. 5º. § 1º do art. 6º também.</p>";
    expect(dispositivos(trecho)).toEqual([["art. 1º, caput", "Aplica-se o disposto no § 2º do art. 5º. § 1º do art. 6º também."]]);
  });

  it("dá à cabeça a pena que vem depois do último inciso, e ao inciso a pena que vem entre incisos", () => {
    const trecho = [
      "<p>Art. 1º Conduta fictícia:</p><p>I - primeira forma;</p><p>II - segunda forma:</p><p>Pena - multa fictícia.</p>",
      "<p>Art. 2º Conduta fictícia:</p><p>I - primeira forma.</p><p>Pena - pena do inciso.</p><p>II - segunda forma.</p>",
    ].join("");
    expect(dispositivos(trecho)).toEqual([
      ["art. 1º, caput", "Conduta fictícia: Pena - multa fictícia."],
      ["art. 1º, I", "primeira forma;"],
      ["art. 1º, II", "segunda forma:"],
      ["art. 2º, caput", "Conduta fictícia:"],
      ["art. 2º, I", "primeira forma. Pena - pena do inciso."],
      ["art. 2º, II", "segunda forma."],
    ]);
  });

  it("marca como revogado o inciso em que só sobra pontuação depois da nota", () => {
    const [artigo] = parsePlanalto("<p>Art. 1º Regra fictícia:</p><p>I - (revogado); (Redação dada pela Lei nº 88.888, de 2098)</p>");
    expect(artigo!.dispositivos[1]).toMatchObject({ texto: "", revogado: true });
  });

  it("guarda o link de vigência como nota, e não como texto", () => {
    const [artigo] = parsePlanalto('<p>Art. 1º Regra fictícia. <a href="#">(Incluído pela Lei nº 88.888, de 2098)</a> <a href="#">Vigência</a></p>');
    expect(artigo!.dispositivos[0]).toMatchObject({
      texto: "Regra fictícia.",
      notas: ["(Incluído pela Lei nº 88.888, de 2098)", "(Vigência)"],
    });
  });

  it("mantém o capítulo junto da seção e aceita título solto em caixa alta", () => {
    const trecho = [
      "<p>CAPÍTULO I</p><p>DAS REGRAS FICTÍCIAS</p><p>Seção I</p><p>Da Primeira Parte</p><p>Art. 1º Regra.</p>",
      "<p>Seção II</p><p>Da Segunda Parte</p><p>Art. 2º Regra.</p>",
      "<p>DOS PROCEDIMENTOS FICTÍCIOS</p><p>Art. 3º Regra.</p>",
      "<p>CAPÍTULO II</p><p>(Incluído pela Lei nº 88.888, de 2098)</p><p>DISPOSIÇÕES FICTÍCIAS</p><p>Art. 4º Regra.</p>",
    ].join("");
    expect(parsePlanalto(trecho).map((a) => a.agrupamento)).toEqual([
      "CAPÍTULO I - DAS REGRAS FICTÍCIAS > Seção I - Da Primeira Parte",
      "CAPÍTULO I - DAS REGRAS FICTÍCIAS > Seção II - Da Segunda Parte",
      "DOS PROCEDIMENTOS FICTÍCIOS",
      "CAPÍTULO II - DISPOSIÇÕES FICTÍCIAS",
    ]);
  });
});

describe("removerRuidoDoFirewall", () => {
  it("tira o script do F5 sem tocar no resto, nem em bytes de windows-1252", () => {
    const pagina = (token: string) =>
      new Uint8Array([
        ...Buffer.from(`<p>Art. 1º</p><script id="f5_cspm">(function(){var t='${token}';})();</script>`, "latin1"),
        0xe7, 0xe3,
      ]);
    const limpa = removerRuidoDoFirewall(pagina("AAA"));
    expect(limpa.equals(removerRuidoDoFirewall(pagina("BBB")))).toBe(true);
    expect(limpa.toString("latin1")).toBe("<p>Art. 1º</p>çã");
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
