import { describe, expect, it } from "vitest";
import { criarBuscaBm25, fundirPorPosicao, termos } from "../src/rag/bm25.js";

describe("termos", () => {
  it("tira acento, pontuação e palavra vazia, e corta no radical quando pedido", () => {
    expect(termos("A comunicação ao Coaf, no prazo de 24 horas.")).toEqual(["comunicacao", "coaf", "prazo", "24", "horas"]);
    expect(termos("comunicação comunicar", { radical: 5 })).toEqual(["comun", "comun"]);
  });
});

describe("criarBuscaBm25", () => {
  const textos = [
    "registro fictício de clientes e operações",
    "fragmentação fictícia de depósitos em espécie",
    "depósitos fictícios em conta, depósitos fictícios em caixa, depósitos fictícios no terminal",
    "regra fictícia sem relação",
  ];
  const buscar = criarBuscaBm25(textos, (t) => t);

  it("ordena pelo termo mais raro e ignora item sem termo em comum", () => {
    const resultado = buscar("fragmentação de depósitos", 10).map((r) => r.item);
    expect(resultado[0]).toBe(textos[1]);
    expect(resultado).not.toContain(textos[3]);
  });

  it("satura a repetição do termo: repetir muito não multiplica a nota", () => {
    const [um, tres] = [textos[1]!, textos[2]!].map((t) => buscar("depósitos", 10).find((r) => r.item === t)!.pontuacao);
    expect(tres! / um!).toBeLessThan(2);
  });

  it("junta palavras da mesma família com o radical", () => {
    const comRadical = criarBuscaBm25(["dever de comunicar ao órgão"], (t) => t, { radical: 5 });
    expect(comRadical("comunicação", 1)).toHaveLength(1);
    expect(criarBuscaBm25(["dever de comunicar ao órgão"], (t) => t)("comunicação", 1)).toHaveLength(0);
  });
});

describe("fundirPorPosicao", () => {
  it("soma 1/(c + posição) de cada lista", () => {
    const fundido = fundirPorPosicao([["a", "b"], ["b", "c"]], (x) => x, 60);
    expect(fundido.map((r) => r.item)).toEqual(["b", "a", "c"]);
    expect(fundido[0]!.pontuacao).toBeCloseTo(1 / 62 + 1 / 61);
  });
});
