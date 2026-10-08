import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { SemProvedorDeLlm } from "./config.js";
import { VARIANTES, type Variante, type VarianteMontada } from "./tipos.js";

const ENTRADA = {
  body: {
    type: "object",
    required: ["pergunta"],
    additionalProperties: false,
    properties: { pergunta: { type: "string", minLength: 1, maxLength: 2000 } },
  },
} as const;

type Requisicao = FastifyRequest<{ Body: { pergunta: string } }>;

/** Executa a etapa e traduz falha de dependência em 503 (sem LLM configurado) ou 502. */
async function responder(requisicao: Requisicao, resposta: FastifyReply, etapa: (pergunta: string) => Promise<unknown>) {
  const pergunta = requisicao.body.pergunta.trim();
  if (!pergunta) return resposta.code(400).send({ erro: "pergunta vazia" });
  try {
    return await etapa(pergunta);
  } catch (erro) {
    requisicao.log.error(erro);
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    return resposta.code(erro instanceof SemProvedorDeLlm ? 503 : 502).send({ erro: mensagem });
  }
}

/**
 * Dois endpoints por variante, com a mesma entrada e a mesma saída nas três (ADR 0007):
 * `/<variante>/buscar` devolve só os trechos recuperados, sem LLM; `/<variante>/perguntar`
 * faz o fluxo completo.
 */
export function criarServidor(variantes: Record<Variante, VarianteMontada>, opcoes: { log?: boolean } = {}): FastifyInstance {
  // Por padrão o Fastify apaga em silêncio campo não declarado; aqui ele vira erro 400.
  const app = Fastify({ logger: opcoes.log ?? false, ajv: { customOptions: { removeAdditional: false } } });

  app.get("/saude", async () => ({
    ok: true,
    endpoints: VARIANTES.flatMap((v) => [`/${v}/buscar`, `/${v}/perguntar`]),
  }));

  for (const variante of VARIANTES) {
    const { buscar, perguntar } = variantes[variante];
    app.post(`/${variante}/buscar`, { schema: ENTRADA }, (requisicao: Requisicao, resposta) =>
      responder(requisicao, resposta, async (pergunta) => {
        const inicio = performance.now();
        const trechos = await buscar(pergunta);
        return { variante, pergunta, trechos, latenciaMs: performance.now() - inicio };
      }),
    );
    app.post(`/${variante}/perguntar`, { schema: ENTRADA }, (requisicao: Requisicao, resposta) =>
      responder(requisicao, resposta, perguntar),
    );
  }
  return app;
}
