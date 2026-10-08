import { describe, expect, it } from "vitest";
import { criarGeradorGemini } from "../src/rag/embeddings-gemini.js";

interface Pedido {
  url: string;
  chave: string | null;
  corpo: { requests: { model: string; content: { parts: { text: string }[] }; taskType: string; outputDimensionality: number }[] };
}

function apiFalsa(respostas: ((pedido: Pedido) => Response)[]) {
  const pedidos: Pedido[] = [];
  const fetch = (async (url: string, init: RequestInit) => {
    const pedido = {
      url,
      chave: new Headers(init.headers).get("x-goog-api-key"),
      corpo: JSON.parse(String(init.body)) as Pedido["corpo"],
    };
    pedidos.push(pedido);
    return (respostas[pedidos.length - 1] ?? respostas.at(-1)!)(pedido);
  }) as unknown as typeof globalThis.fetch;
  return { fetch, pedidos };
}

const vetores = (pedido: Pedido) =>
  Response.json({ embeddings: pedido.corpo.requests.map(() => ({ values: [3, 4] })) });

describe("criarGeradorGemini", () => {
  it("pede em lotes de 100, com o tipo de tarefa e a dimensão, e normaliza o vetor", async () => {
    const { fetch, pedidos } = apiFalsa([vetores]);
    const gerador = criarGeradorGemini("modelo-ficticio", { chave: "chave-ficticia", dimensao: 2, fetch });

    const trechos = await gerador.trechos(Array.from({ length: 150 }, (_, i) => `trecho ${i}`));
    const [consulta] = await gerador.consultas(["pergunta"]);

    expect(trechos).toHaveLength(150);
    expect(trechos[0]).toEqual([0.6, 0.8]);
    expect(consulta).toEqual([0.6, 0.8]);
    expect(pedidos.map((p) => p.corpo.requests.length)).toEqual([100, 50, 1]);
    expect(pedidos[0]!.url).toBe("https://generativelanguage.googleapis.com/v1beta/models/modelo-ficticio:batchEmbedContents");
    expect(pedidos[0]!.chave).toBe("chave-ficticia");
    expect(pedidos[0]!.corpo.requests[0]).toEqual({
      model: "models/modelo-ficticio",
      content: { parts: [{ text: "trecho 0" }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 2,
    });
    expect(pedidos[2]!.corpo.requests[0]!.taskType).toBe("RETRIEVAL_QUERY");
  });

  it("repete 429 com espera crescente e desiste de erro definitivo", async () => {
    const esperas: number[] = [];
    const esperar = async (ms: number) => void esperas.push(ms);
    const limite = apiFalsa([() => new Response("", { status: 429 }), () => new Response("", { status: 429 }), vetores]);
    await criarGeradorGemini("m", { chave: "c", fetch: limite.fetch, esperar, esperaInicialMs: 10 }).trechos(["a"]);
    expect(esperas).toEqual([10, 20]);

    const definitivo = apiFalsa([() => new Response("", { status: 400 })]);
    await expect(criarGeradorGemini("m", { chave: "c", fetch: definitivo.fetch, esperar }).trechos(["a"])).rejects.toThrow(
      "HTTP 400 após 1 tentativas",
    );
  });
});
