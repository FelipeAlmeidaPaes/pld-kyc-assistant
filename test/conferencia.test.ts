import { describe, expect, it } from "vitest";
import type { Dispositivo, NormaNormalizada } from "../src/corpus/types.js";
import { descreverQuantidade, extrairQuantidades, parentesDoDispositivo, quantidadesSemRespaldo } from "../src/rag/conferencia.js";
import { IndiceDoCorpus } from "../src/rag/corpus.js";
import { concluirResposta } from "../src/rag/resposta.js";
import type { TrechoRecuperado } from "../src/rag/tipos.js";
import { montarTrechos } from "../src/rag/trechos.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const valores = (texto: string) => extrairQuantidades(texto).map((q) => [q.valor, q.unidade]);

describe("extrairQuantidades", () => {
  it("lê algarismos, extenso, percentual, dinheiro e data", () => {
    expect(valores("no prazo de 24 (vinte e quatro) horas")).toEqual([[24, "hora"]]);
    expect(valores("por cinco dias úteis")).toEqual([[5, "dia"]]);
    expect(valores("multa de 20% (vinte por cento)")).toEqual([[20, "%"], [20, "%"]]);
    expect(valores("até R$ 1.500.000,00 (um milhão e quinhentos mil reais)")).toEqual([[1_500_000, "R$"], [1_500_000, "R$"]]);
    expect(valores("acima de R$ 30 mil")).toEqual([[30_000, "R$"]]);
    expect(valores("valor de 2,5 milhões de reais")).toEqual([[2_500_000, "R$"]]);
    expect(valores("até 31 de março e até 1º de julho")).toEqual([[331, "data"], [701, "data"]]);
    expect(valores("dois mil e quinhentos reais")).toEqual([[2_500, "R$"]]);
  });

  it("dá à faixa a unidade do último número", () => {
    expect(valores("reclusão, de 2 (dois) a 6 (seis) anos, e multa")).toEqual([[2, "ano"], [6, "ano"]]);
    expect(valores("de três a cinco meses")).toEqual([[3, "mês"], [5, "mês"]]);
  });

  it("ignora número sem unidade: dispositivo, lei, ordinal, contagem", () => {
    expect(valores("Lei 99.999/2099, art. 12, II, conforme o art. 3º")).toEqual([]);
    expect(valores("dois ou mais saques no mesmo dia")).toEqual([]);
    expect(valores("Lei nº 99.999, de 1º de janeiro de 2099")).toEqual([]);
    expect(valores("um e dois")).toEqual([]);
  });

  it("descreve o valor como na resposta", () => {
    const [p, r, d, a] = [...extrairQuantidades("20% e R$ 5.000,00 até 30 de junho"), ...extrairQuantidades("dez anos")];
    expect([p, r, d, a].map((q) => descreverQuantidade(q!))).toEqual(["20%", "R$ 5.000,00", "30 de junho", "dez (ano)"]);
  });
});

/** Norma fictícia com prazos e valores: o artigo 1º da fixture e um artigo de sanções. */
const d = (tipo: Dispositivo["tipo"], rotulo: string, caminho: string, texto: string): Dispositivo => ({
  tipo,
  rotulo,
  caminho,
  texto,
  notas: [],
  revogado: false,
});
const norma: NormaNormalizada = {
  ...normaFicticia,
  artigos: [
    ...normaFicticia.artigos,
    {
      numero: "3º",
      rotulo: "art. 3º",
      agrupamento: null,
      dispositivos: [
        d("caput", "caput", "art. 3º, caput", "A instituição fictícia que descumprir a regra fica sujeita a:"),
        d("inciso", "I", "art. 3º, I", "multa fictícia não superior:"),
        d("alinea", "a", "art. 3º, I, a", "a R$ 1.000,00 (mil reais); ou"),
        d("alinea", "b", "art. 3º, I, b", "ao triplo do valor fictício;"),
        d("inciso", "II", "art. 3º, II", "suspensão fictícia por até 3 (três) anos."),
        d("paragrafo", "§ 1º", "art. 3º, § 1º", "A multa será paga em 30 (trinta) dias."),
      ],
    },
  ],
};
const indice = new IndiceDoCorpus([norma]);
const trechos = montarTrechos(norma);
const recuperados = (...caminhos: string[]): TrechoRecuperado[] =>
  caminhos.map((c) => ({ ...trechos.find((t) => t.caminho === c)!, pontuacao: 0.9 }));
const citar = (...caminhos: string[]) => caminhos.map((caminho) => ({ sigla: "Lei 99.999/2099", caminho }));
const artigo3 = norma.artigos[2]!;

describe("parentesDoDispositivo", () => {
  const caminhos = (caminho: string) =>
    parentesDoDispositivo(artigo3, artigo3.dispositivos.find((x) => x.caminho === caminho)!).map((x) => x.caminho);

  it("o inciso traz o caput e as alíneas dele, não o inciso vizinho nem o parágrafo", () => {
    expect(caminhos("art. 3º, I")).toEqual(["art. 3º, caput", "art. 3º, I", "art. 3º, I, a", "art. 3º, I, b"]);
  });

  it("o caput traz os incisos do artigo, não os parágrafos", () => {
    expect(caminhos("art. 3º, caput")).toEqual(["art. 3º, caput", "art. 3º, I", "art. 3º, I, a", "art. 3º, I, b", "art. 3º, II"]);
  });
});

describe("quantidadesSemRespaldo", () => {
  const sem = (resposta: string, citados: string[], vistos: string[]) =>
    quantidadesSemRespaldo(resposta, citar(...citados), recuperados(...vistos), indice).map(descreverQuantidade);

  it("aceita valor do dispositivo citado, com outra grafia", () => {
    expect(sem("Multa de até mil reais.", ["art. 3º, I, a"], ["art. 3º, I, a"])).toEqual([]);
    expect(sem("Suspensão por até três anos.", ["art. 3º, II"], ["art. 3º, II"])).toEqual([]);
  });

  it("aceita valor de alínea vista quando a citação é o inciso que a abre", () => {
    expect(sem("Multa de até R$ 1.000,00.", ["art. 3º, I"], ["art. 3º, I", "art. 3º, I, a"])).toEqual([]);
  });

  it("recusa valor que não está no que foi citado, mesmo que esteja em outro trecho", () => {
    expect(sem("Multa de até R$ 1.000,00 em 30 dias.", ["art. 3º, I, a"], ["art. 3º, I, a", "art. 3º, § 1º"])).toEqual(["30 (dia)"]);
  });

  it("recusa valor da alínea que não veio na busca, mesmo citando o inciso que a abre", () => {
    expect(sem("Multa de até R$ 1.000,00.", ["art. 3º, I"], ["art. 3º, I"])).toEqual(["R$ 1.000,00"]);
  });

  it("recusa valor que não existe na norma", () => {
    expect(sem("Multa de 20% do valor.", ["art. 3º, I", "art. 3º, I, a"], ["art. 3º, I, a"])).toEqual(["20%"]);
  });
});

describe("concluirResposta com a conferência de valores", () => {
  it("recusa a resposta inteira e diz o valor sem respaldo", () => {
    const r = concluirResposta(
      {
        variante: "manual",
        pergunta: "Pergunta fictícia?",
        trechos: recuperados("art. 3º, I, a", "art. 3º, II"),
        geracao: {
          saida: {
            cobertura: "total",
            resposta: "Multa de até R$ 1.000,00 ou 20% do valor, e suspensão por até 3 anos.",
            naoCoberto: "",
            citacoes: citar("art. 3º, I, a", "art. 3º, II"),
          },
          provedor: "gemini",
          modelo: "modelo-ficticio",
          tokensEntrada: 1,
          tokensSaida: 1,
          custoTabelaUsd: null,
        },
        latenciaMs: { busca: 1, geracao: 1, total: 2 },
      },
      indice,
    );
    expect(r).toMatchObject({ recusa: true, motivoDaRecusa: "valor sem respaldo nos dispositivos citados: 20%", citacoes: [] });
  });
});
