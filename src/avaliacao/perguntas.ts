import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { NormaNormalizada } from "../corpus/types.js";
import { montarTrechos } from "../rag/trechos.js";
import type { Trecho } from "../rag/tipos.js";

const ARQUIVO = new URL("../../avaliacao/perguntas.json", import.meta.url);

/** Dispositivo no formato da citação: "<sigla>, <caminho>", ex.: "Lei 9.613/1998, art. 1º, § 2º, I". */
const referencia = z.string().regex(/^.+?, art\. \S/, "use o formato '<sigla>, art. ...'");

const esquemaDaPergunta = z
  .object({
    id: z.string().regex(/^[qf]\d{2}$/),
    /** "autor, pergunta N" ou "Claude". */
    origem: z.string().min(1),
    /** Como o autor escreveu, com o nome da norma e o artigo; null para as perguntas do Claude. */
    perguntaOriginal: z.string().nullable(),
    gabaritoOriginal: z.string().nullable(),
    /** Veredito sobre o gabarito original, conferido no texto do corpus. */
    situacao: z.enum(["confere", "ajustado", "errado", "sem-base-no-texto", "nova"]),
    /** Como vai para o RAG: sem o nome da norma nem o número do artigo. */
    pergunta: z.string().min(1),
    tipo: z.enum(["coberta", "fora-do-corpus"]),
    gabarito: z.string().min(1),
    /** Dispositivos de que a resposta depende; base do recall e do MRR. */
    dispositivos: z.array(referencia),
    /** Também relevantes: citar um deles não é erro, mas não é exigido. */
    aceitos: z.array(referencia),
    /** O que a resposta não pode afirmar, para pegar alucinação. */
    naoDeve: z.array(z.string().min(1)),
    /** O que mudou em relação ao original do autor e por quê. */
    observacao: z.string(),
    /** Só o autor marca, depois de conferir dispositivo por dispositivo. */
    validado: z.boolean(),
  })
  .strict()
  .refine((p) => (p.tipo === "coberta" ? p.dispositivos.length > 0 : p.dispositivos.length + p.aceitos.length === 0), {
    message: "pergunta coberta exige dispositivos; fora do corpus não pode ter nenhum",
  });

const esquemaDoArquivo = z.object({ descricao: z.string(), perguntas: z.array(esquemaDaPergunta) }).strict();

export type PerguntaDeAvaliacao = z.infer<typeof esquemaDaPergunta>;

export function lerPerguntas(conteudo: unknown): PerguntaDeAvaliacao[] {
  return esquemaDoArquivo.parse(conteudo).perguntas;
}

export async function carregarPerguntas(arquivo: URL = ARQUIVO): Promise<PerguntaDeAvaliacao[]> {
  return lerPerguntas(JSON.parse(await readFile(arquivo, "utf-8")));
}

/** Trechos indexados por referência ("<sigla>, <caminho>"), na forma exata do corpus. */
export function trechosPorReferencia(normas: NormaNormalizada[]): Map<string, Trecho> {
  const mapa = new Map<string, Trecho>();
  for (const trecho of normas.flatMap(montarTrechos)) mapa.set(`${trecho.sigla}, ${trecho.caminho}`, trecho);
  return mapa;
}

/**
 * Problemas do conjunto: id repetido, dispositivo repetido ou fora do índice. Fora do índice é
 * dispositivo que não existe no corpus, escrito em outra grafia, ou sem texto próprio (revogado,
 * vetado), que a busca nunca pode recuperar.
 */
export function conferirPerguntas(perguntas: PerguntaDeAvaliacao[], normas: NormaNormalizada[]): string[] {
  const indice = trechosPorReferencia(normas);
  const problemas: string[] = [];
  const ids = new Set<string>();
  for (const p of perguntas) {
    if (ids.has(p.id)) problemas.push(`${p.id}: id repetido`);
    ids.add(p.id);
    const vistas = new Set<string>();
    for (const ref of [...p.dispositivos, ...p.aceitos]) {
      if (vistas.has(ref)) problemas.push(`${p.id}: ${ref} aparece mais de uma vez`);
      vistas.add(ref);
      if (!indice.has(ref)) problemas.push(`${p.id}: ${ref} não está no índice`);
    }
  }
  return problemas;
}
