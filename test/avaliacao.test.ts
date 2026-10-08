import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { carregarPerguntas, conferirPerguntas, lerPerguntas, type PerguntaDeAvaliacao } from "../src/avaliacao/perguntas.js";
import { montarRevisao } from "../src/avaliacao/revisao.js";
import { carregarCorpus } from "../src/rag/corpus.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const pergunta = (extra: Partial<PerguntaDeAvaliacao> = {}): PerguntaDeAvaliacao => ({
  id: "q01",
  origem: "autor, pergunta 1",
  perguntaOriginal: "Pergunta fictícia com o nome da norma?",
  gabaritoOriginal: "Gabarito fictício.",
  situacao: "ajustado",
  pergunta: "Pergunta fictícia?",
  tipo: "coberta",
  gabarito: "Com nome completo.",
  dispositivos: ["Lei 99.999/2099, art. 1º, I"],
  aceitos: ["Lei 99.999/2099, art. 1º, caput"],
  naoDeve: [],
  observacao: "Ajustado.",
  validado: false,
  ...extra,
});

describe("lerPerguntas", () => {
  const arquivo = (perguntas: unknown[]) => ({ descricao: "teste", perguntas });

  it("aceita pergunta coberta com dispositivos e fora do corpus sem nenhum", () => {
    const fora = pergunta({ id: "f01", tipo: "fora-do-corpus", situacao: "nova", dispositivos: [], aceitos: [] });
    expect(lerPerguntas(arquivo([pergunta(), fora]))).toHaveLength(2);
  });

  it("recusa coberta sem dispositivo, fora do corpus com dispositivo e referência sem sigla", () => {
    expect(() => lerPerguntas(arquivo([pergunta({ dispositivos: [] })]))).toThrow("exige dispositivos");
    expect(() => lerPerguntas(arquivo([pergunta({ tipo: "fora-do-corpus", dispositivos: [] })]))).toThrow("exige dispositivos");
    expect(() => lerPerguntas(arquivo([pergunta({ dispositivos: ["art. 1º, I"] })]))).toThrow("<sigla>");
  });

  it("recusa campo desconhecido", () => {
    expect(() => lerPerguntas(arquivo([{ ...pergunta(), resposta: "x" }]))).toThrow();
  });
});

describe("conferirPerguntas", () => {
  it("aponta dispositivo inexistente, sem texto próprio, repetido e id repetido", () => {
    const problemas = conferirPerguntas(
      [
        pergunta({ dispositivos: ["Lei 99.999/2099, art. 9º, caput", "Lei 99.999/2099, art. 1º, II"], aceitos: ["Lei 99.999/2099, art. 2º, caput"] }),
        pergunta({ dispositivos: ["Lei 99.999/2099, art. 1º, I"], aceitos: ["Lei 99.999/2099, art. 1º, I"] }),
      ],
      [normaFicticia],
    );
    expect(problemas).toEqual([
      "q01: Lei 99.999/2099, art. 9º, caput não está no índice",
      "q01: Lei 99.999/2099, art. 1º, II não está no índice",
      "q01: Lei 99.999/2099, art. 2º, caput não está no índice",
      "q01: id repetido",
      "q01: Lei 99.999/2099, art. 1º, I aparece mais de uma vez",
    ]);
  });

  it("exige a grafia exata do corpus", () => {
    expect(conferirPerguntas([pergunta({ dispositivos: ["Lei 99.999/2099, art. 1, I"] })], [normaFicticia])).toEqual([
      "q01: Lei 99.999/2099, art. 1, I não está no índice",
    ]);
  });
});

describe("montarRevisao", () => {
  it("mostra o dispositivo com o caput que lhe dá sentido, sem repetir a referência", () => {
    const revisao = montarRevisao([pergunta()], [normaFicticia]);
    expect(revisao).toContain(
      [
        "**Lei 99.999/2099, art. 1º, I**",
        "> CAPÍTULO I - DAS REGRAS FICTÍCIAS",
        "> Art. 1º A instituição fictícia deve manter cadastro dos clientes:",
        "> I - com nome completo;",
      ].join("\n"),
    );
    expect(revisao).toContain("1 perguntas · validadas: 0 · ajustado: 1");
  });
});

// O conjunto real é dado, não texto de norma escrito à mão: só confere que ele bate com o corpus.
describe("avaliacao/perguntas.json", () => {
  it("só referencia dispositivos que estão no índice", async () => {
    const [perguntas, normas] = await Promise.all([carregarPerguntas(), carregarCorpus()]);
    expect(conferirPerguntas(perguntas, normas)).toEqual([]);
  });

  it("tem a revisão gerada em dia", async () => {
    const [perguntas, normas] = await Promise.all([carregarPerguntas(), carregarCorpus()]);
    const gerada = await readFile(new URL("../avaliacao/revisao.md", import.meta.url), "utf-8");
    expect(gerada, "rode npm run avaliacao:revisao").toBe(montarRevisao(perguntas, normas));
  });
});
