import type { AddressInfo } from "node:net";
import { fileURLToPath } from "node:url";
import { Client, InMemoryTransport, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { afterEach, describe, expect, it } from "vitest";
import type { Dispositivo, NormaNormalizada } from "../src/corpus/types.js";
import { criarBuscaViaMcp } from "../src/mcp/cliente.js";
import { criarServidorMcp, type RecursosDoMcp } from "../src/mcp/servidor.js";
import { criarServidorHttp } from "../src/mcp/transportes.js";
import { IndiceDoCorpus } from "../src/rag/corpus.js";
import { formatarContexto } from "../src/rag/prompt.js";
import type { TrechoRecuperado } from "../src/rag/tipos.js";
import { montarTrechos } from "../src/rag/trechos.js";
import { normaFicticia } from "./fixtures/norma-ficticia.js";

const d = (tipo: Dispositivo["tipo"], rotulo: string, caminho: string, texto: string): Dispositivo => ({
  tipo,
  rotulo,
  caminho,
  texto,
  notas: [],
  revogado: false,
});
/** A fixture com um artigo de valores, para a conferência. */
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
        d("inciso", "II", "art. 3º, II", "suspensão fictícia por até 3 (três) anos."),
        d("paragrafo", "§ 1º", "art. 3º, § 1º", "A multa será paga em 30 (trinta) dias."),
      ],
    },
  ],
};
const trechos = montarTrechos(norma);
const pontuados: TrechoRecuperado[] = trechos.map((t, i) => ({ ...t, pontuacao: 0.9 - i / 100 }));

function recursos(buscas: { consulta: string; k: number }[] = []): RecursosDoMcp {
  return {
    buscar: async (consulta, k) => {
      buscas.push({ consulta, k });
      return pontuados.slice(0, k);
    },
    normas: [norma],
    indice: new IndiceDoCorpus([norma]),
    k: 3,
  };
}

let fechar: (() => Promise<unknown>)[] = [];
afterEach(async () => {
  for (const f of fechar.reverse()) await f();
  fechar = [];
});

/** Cliente ligado ao servidor em processo: 2026-07-28 pelo handler HTTP, 2025 por par em memória. */
async function conectar(era: "2026" | "2025", rec = recursos()): Promise<Client> {
  const cliente = new Client({ name: "teste", version: "1.0.0" }, { versionNegotiation: { mode: era === "2026" ? "auto" : "legacy" } });
  if (era === "2026") {
    const handler = createMcpHandler(() => criarServidorMcp(rec));
    await cliente.connect(
      new StreamableHTTPClientTransport(new URL("http://teste.local/mcp"), { fetch: (url, init) => handler.fetch(new Request(url, init)) }),
    );
    fechar.push(() => handler.close());
  } else {
    const [lado, outro] = InMemoryTransport.createLinkedPair();
    const servidor = criarServidorMcp(rec);
    await servidor.connect(outro);
    await cliente.connect(lado);
    fechar.push(() => servidor.close());
  }
  fechar.push(() => cliente.close());
  return cliente;
}

const texto = (resultado: { content: unknown }) =>
  (resultado.content as { type: string; text?: string }[]).map((c) => c.text ?? "").join("\n");

describe.each(["2026", "2025"] as const)("servidor MCP, protocolo %s", (era) => {
  it("anuncia as três ferramentas, só de leitura, e as instruções com as normas", async () => {
    const cliente = await conectar(era);
    const { tools } = await cliente.listTools();
    expect(tools.map((t) => t.name)).toEqual(["buscar", "ler_dispositivo", "conferir_resposta"]);
    for (const tool of tools) {
      expect(tool.annotations).toMatchObject({ readOnlyHint: true, destructiveHint: false, openWorldHint: false });
      expect(tool.outputSchema).toBeDefined();
    }
    expect(tools[1]!.description).toContain("Lei 99.999/2099");
    expect(cliente.getInstructions()).toContain("Lei 99.999/2099");
  });

  it("buscar devolve os trechos como a v1 os mostra ao modelo, com o k padrão ou o pedido", async () => {
    const buscas: { consulta: string; k: number }[] = [];
    const cliente = await conectar(era, recursos(buscas));

    const padrao = await cliente.callTool({ name: "buscar", arguments: { consulta: "  cadastro  " } });
    expect(texto(padrao)).toBe(formatarContexto(pontuados.slice(0, 3)));
    expect(padrao.structuredContent).toEqual({
      trechos: pontuados.slice(0, 3).map(({ sigla, caminho, texto, pontuacao }) => ({ sigla, caminho, texto, pontuacao })),
    });
    await cliente.callTool({ name: "buscar", arguments: { consulta: "cadastro", k: 5 } });
    expect(buscas).toEqual([
      { consulta: "cadastro", k: 3 },
      { consulta: "cadastro", k: 5 },
    ]);
  });

  it("buscar recusa k fora do limite e consulta vazia antes de buscar", async () => {
    const buscas: { consulta: string; k: number }[] = [];
    const cliente = await conectar(era, recursos(buscas));
    for (const argumentos of [{ consulta: "cadastro", k: 21 }, { consulta: "cadastro", k: 0 }, { consulta: "   " }]) {
      const resultado = await cliente.callTool({ name: "buscar", arguments: argumentos });
      expect(resultado.isError).toBe(true);
    }
    expect(buscas).toEqual([]);
  });

  it("a busca pelo MCP devolve os mesmos trechos que a busca direta", async () => {
    const cliente = await conectar(era);
    expect(await criarBuscaViaMcp(cliente, [norma])("cadastro", 20)).toEqual(pontuados);
  });

  it("ler_dispositivo traz o que abre o dispositivo, ele e o que vem abaixo, aceitando a grafia do modelo", async () => {
    const cliente = await conectar(era);
    const resultado = await cliente.callTool({
      name: "ler_dispositivo",
      arguments: { sigla: "Lei nº 99.999", caminho: "art. 1º, § 1º, inciso I" },
    });
    expect(resultado.structuredContent).toEqual({
      sigla: "Lei 99.999/2099",
      caminho: "art. 1º, § 1º, I",
      agrupamento: "CAPÍTULO I - DAS REGRAS FICTÍCIAS",
      abertura: ["Art. 1º A instituição fictícia deve manter cadastro dos clientes:", "§ 1º O cadastro fictício será revisto:"],
      texto: "I - a cada ano; ou",
      semTextoProprio: false,
      notas: [],
      abaixo: [
        { caminho: "art. 1º, § 1º, I, a", texto: "a) quando houver mudança relevante, desde que:" },
        { caminho: "art. 1º, § 1º, I, a, 1", texto: "1. a mudança seja comunicada." },
      ],
    });
    expect(texto(resultado)).toContain("[Lei 99.999/2099, art. 1º, § 1º, I, a, 1] 1. a mudança seja comunicada.");
  });

  it("ler_dispositivo com o artigo sozinho traz o artigo inteiro; com o caput, só os incisos dele", async () => {
    const cliente = await conectar(era);
    const caminhos = async (caminho: string) => {
      const r = await cliente.callTool({ name: "ler_dispositivo", arguments: { sigla: "Lei 99.999/2099", caminho } });
      return (r.structuredContent as { abaixo: { caminho: string }[] }).abaixo.map((a) => a.caminho);
    };
    expect(await caminhos("art. 3º")).toEqual(["art. 3º, I", "art. 3º, I, a", "art. 3º, II", "art. 3º, § 1º"]);
    expect(await caminhos("art. 3º, caput")).toEqual(["art. 3º, I", "art. 3º, I, a", "art. 3º, II"]);
    // O inciso II do art. 1º é revogado: não aparece abaixo do caput.
    expect(await caminhos("art. 1º")).toEqual(["art. 1º, I", "art. 1º, § 1º", "art. 1º, § 1º, I", "art. 1º, § 1º, I, a", "art. 1º, § 1º, I, a, 1"]);
  });

  it("ler_dispositivo marca o revogado e responde erro para norma ou dispositivo que não existe", async () => {
    const cliente = await conectar(era);
    const ler = (sigla: string, caminho: string) => cliente.callTool({ name: "ler_dispositivo", arguments: { sigla, caminho } });

    const revogado = await ler("Lei 99.999/2099", "art. 1º, II");
    expect(revogado.structuredContent).toMatchObject({ texto: "", semTextoProprio: true });

    const semNorma = await ler("Lei 1.234/2000", "art. 1º");
    expect(semNorma.isError).toBe(true);
    expect(texto(semNorma)).toContain("Normas da base: Lei 99.999/2099");

    const semDispositivo = await ler("Lei 99.999/2099", "art. 9º, IV");
    expect(semDispositivo.isError).toBe(true);
  });

  it("conferir_resposta aprova citação existente e valor que está no texto citado", async () => {
    const cliente = await conectar(era);
    const resultado = await cliente.callTool({
      name: "conferir_resposta",
      arguments: {
        resposta: "Multa de até mil reais, paga em trinta dias.",
        citacoes: [
          { sigla: "Lei 99.999", caminho: "art. 3º, inciso I" },
          { sigla: "Lei 99.999/2099", caminho: "art. 3º, § 1º" },
        ],
      },
    });
    expect(resultado.structuredContent).toEqual({
      aprovada: true,
      citacoes: [
        { sigla: "Lei 99.999/2099", caminho: "art. 3º, I" },
        { sigla: "Lei 99.999/2099", caminho: "art. 3º, § 1º" },
      ],
      problemas: [],
    });
  });

  it("conferir_resposta aponta citação inexistente, revogada, valor sem respaldo e falta de citação", async () => {
    const cliente = await conectar(era);
    const conferir = async (resposta: string, ...caminhos: string[]) => {
      const citacoes = caminhos.map((caminho) => ({ sigla: "Lei 99.999/2099", caminho }));
      const r = await cliente.callTool({ name: "conferir_resposta", arguments: { resposta, citacoes } });
      return r.structuredContent as { aprovada: boolean; problemas: string[] };
    };

    expect(await conferir("Suspensão por até 3 anos.", "art. 3º, II", "art. 7º")).toEqual({
      aprovada: false,
      citacoes: [{ sigla: "Lei 99.999/2099", caminho: "art. 3º, II" }],
      problemas: ["citação não confere: Lei 99.999/2099, art. 7º (dispositivo não existe no corpus)"],
    });
    expect((await conferir("Cadastro com o endereço.", "art. 1º, II")).problemas).toEqual([
      "citação não confere: Lei 99.999/2099, art. 1º, II (dispositivo sem texto próprio (revogado ou vetado))",
    ]);
    // O valor da alínea não respalda o prazo do parágrafo, que não foi citado.
    expect((await conferir("Multa de R$ 1.000,00 em 30 dias.", "art. 3º, I, a")).problemas).toEqual([
      "valor sem respaldo nos dispositivos citados: 30 (dia)",
    ]);
    expect((await conferir("A instituição mantém cadastro.")).problemas).toEqual(["resposta sem citação"]);
  });
});

describe("servidor MCP por HTTP", () => {
  async function iniciar() {
    const servidor = criarServidorHttp(() => criarServidorMcp(recursos()));
    await new Promise<void>((resolver) => servidor.listen(0, "127.0.0.1", resolver));
    fechar.push(() => new Promise((resolver) => servidor.close(resolver)));
    return `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
  }

  it("atende o cliente MCP em /mcp", async () => {
    const url = await iniciar();
    const cliente = new Client({ name: "teste", version: "1.0.0" }, { versionNegotiation: { mode: "auto" } });
    await cliente.connect(new StreamableHTTPClientTransport(new URL(`${url}/mcp`)));
    fechar.push(() => cliente.close());
    expect(await criarBuscaViaMcp(cliente, [norma])("cadastro", 2)).toEqual(pontuados.slice(0, 2));
  });

  it("recusa Host e Origin de fora (DNS rebinding) e caminho que não é /mcp", async () => {
    const url = await iniciar();
    const { request } = await import("node:http");
    const status = (caminho: string, cabecalhos: Record<string, string>) =>
      new Promise<number>((resolver, rejeitar) => {
        const pedido = request(`${url}${caminho}`, { method: "POST", headers: { "content-type": "application/json", ...cabecalhos } }, (r) => {
          r.resume();
          resolver(r.statusCode!);
        });
        pedido.on("error", rejeitar);
        pedido.end("{}");
      });
    expect(await status("/mcp", { host: "malicioso.example" })).toBe(403);
    expect(await status("/mcp", { origin: "https://malicioso.example" })).toBe(403);
    expect(await status("/outro", {})).toBe(404);
  });
});

describe("servidor MCP por stdio", () => {
  it("atende pelo processo filho mesmo com console.log no servidor", async () => {
    const fixture = fileURLToPath(new URL("./fixtures/servidor-mcp-stdio.ts", import.meta.url));
    const cliente = new Client({ name: "teste", version: "1.0.0" });
    await cliente.connect(new StdioClientTransport({ command: process.execPath, args: ["--import", "tsx", fixture], stderr: "ignore" }));
    fechar.push(() => cliente.close());
    const resultado = await cliente.callTool({ name: "buscar", arguments: { consulta: "cadastro", k: 1 } });
    expect(resultado.structuredContent).toEqual({
      trechos: [{ sigla: "Lei 99.999/2099", caminho: "art. 1º, caput", texto: trechos[0]!.texto, pontuacao: 0.5 }],
    });
  }, 30_000);
});
