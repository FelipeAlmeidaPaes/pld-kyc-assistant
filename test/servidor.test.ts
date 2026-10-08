import { describe, expect, it } from "vitest";
import { SemProvedorDeLlm } from "../src/rag/config.js";
import { criarServidor } from "../src/rag/servidor.js";
import { type Resposta, VARIANTES, type Variante, type VarianteMontada } from "../src/rag/tipos.js";

const trecho = { id: "1", normaId: "lei-99999", sigla: "Lei 99.999/2099", caminho: "art. 1º, caput", texto: "Art. 1º Regra.", pontuacao: 0.9 };

/** Variante falsa que registra quem foi chamado. */
function falsa(variante: Variante, chamadas: string[], perguntar?: (p: string) => Promise<Resposta>): VarianteMontada {
  return {
    buscar: async (pergunta) => (chamadas.push(`${variante}:buscar:${pergunta}`), [trecho]),
    perguntar:
      perguntar ??
      (async (pergunta) => {
        chamadas.push(`${variante}:perguntar:${pergunta}`);
        return { variante, pergunta, recusa: false } as Resposta;
      }),
  };
}

function servidor(perguntar?: (p: string) => Promise<Resposta>) {
  const chamadas: string[] = [];
  const variantes = Object.fromEntries(VARIANTES.map((v) => [v, falsa(v, chamadas, perguntar)])) as Record<Variante, VarianteMontada>;
  return { app: criarServidor(variantes), chamadas };
}

describe("criarServidor", () => {
  it("lista os dois endpoints de cada variante", async () => {
    const { app } = servidor();
    const resposta = await app.inject({ method: "GET", url: "/saude" });
    expect(resposta.json()).toEqual({
      ok: true,
      endpoints: [
        "/manual/buscar",
        "/manual/perguntar",
        "/langchain/buscar",
        "/langchain/perguntar",
        "/langchain-padrao/buscar",
        "/langchain-padrao/perguntar",
      ],
    });
  });

  it("encaminha cada endpoint à sua variante, com a pergunta sem espaços nas pontas", async () => {
    const { app, chamadas } = servidor();
    const perguntar = await app.inject({ method: "POST", url: "/langchain/perguntar", payload: { pergunta: "  P?  " } });
    const buscar = await app.inject({ method: "POST", url: "/langchain-padrao/buscar", payload: { pergunta: "B?" } });

    expect(perguntar.json()).toEqual({ variante: "langchain", pergunta: "P?", recusa: false });
    expect(buscar.json()).toMatchObject({ variante: "langchain-padrao", pergunta: "B?", trechos: [trecho], latenciaMs: expect.any(Number) });
    expect(chamadas).toEqual(["langchain:perguntar:P?", "langchain-padrao:buscar:B?"]);
  });

  it.each([
    [{}, "sem pergunta"],
    [{ pergunta: "" }, "pergunta vazia"],
    [{ pergunta: "   " }, "só espaços"],
    [{ pergunta: "P?", extra: 1 }, "campo a mais"],
    [{ pergunta: "x".repeat(2001) }, "pergunta longa demais"],
  ])("recusa entrada inválida com 400 (%j, %s)", async (payload, _motivo) => {
    const { app, chamadas } = servidor();
    const resposta = await app.inject({ method: "POST", url: "/manual/perguntar", payload });
    expect(resposta.statusCode).toBe(400);
    expect(chamadas).toEqual([]);
  });

  it("responde 503 sem provedor de LLM e 502 em outra falha de dependência", async () => {
    const semLlm = servidor(async () => {
      throw new SemProvedorDeLlm();
    });
    const r503 = await semLlm.app.inject({ method: "POST", url: "/manual/perguntar", payload: { pergunta: "P?" } });
    expect(r503.statusCode).toBe(503);
    expect(r503.json().erro).toMatch(/GEMINI_API_KEY/);

    const foraDoAr = servidor(async () => {
      throw new Error("Qdrant fora do ar");
    });
    const r502 = await foraDoAr.app.inject({ method: "POST", url: "/manual/perguntar", payload: { pergunta: "P?" } });
    expect(r502.statusCode).toBe(502);
    expect(r502.json()).toEqual({ erro: "Qdrant fora do ar" });
  });
});
