import type { NormaNormalizada } from "../corpus/types.js";
import { type PerguntaDeAvaliacao, trechosPorReferencia } from "./perguntas.js";

const SITUACOES: Record<PerguntaDeAvaliacao["situacao"], string> = {
  confere: "confere",
  ajustado: "ajustado",
  errado: "errado",
  "sem-base-no-texto": "sem base no texto",
  nova: "nova",
};

const citado = (texto: string) => texto.split("\n").map((linha) => `> ${linha}`).join("\n");

/**
 * Documento para o autor validar o gabarito dispositivo por dispositivo: cada pergunta com o
 * original, o gabarito novo e o texto dos dispositivos como a busca o vê (com caput e capítulo).
 * Gerado de avaliacao/perguntas.json; não editar à mão.
 */
export function montarRevisao(perguntas: PerguntaDeAvaliacao[], normas: NormaNormalizada[]): string {
  const indice = trechosPorReferencia(normas);
  const textoDe = (ref: string) => {
    const trecho = indice.get(ref);
    // A primeira linha do trecho repete a referência.
    return trecho ? citado(trecho.texto.split("\n").slice(1).join("\n")) : "> (não está no índice)";
  };
  const contagem = Object.entries(SITUACOES)
    .map(([chave, rotulo]) => [rotulo, perguntas.filter((p) => p.situacao === chave).length] as const)
    .filter(([, n]) => n > 0)
    .map(([rotulo, n]) => `${rotulo}: ${n}`)
    .join(" · ");

  const linhas = [
    "# Revisão do conjunto de avaliação",
    "",
    "Gerado de `avaliacao/perguntas.json` por `npm run avaliacao:revisao`. Não editar à mão.",
    "",
    `${perguntas.length} perguntas · validadas: ${perguntas.filter((p) => p.validado).length} · ${contagem}`,
    "",
    "| id | situação | validada |",
    "|---|---|---|",
    ...perguntas.map((p) => `| ${p.id} | ${SITUACOES[p.situacao]} | ${p.validado ? "sim" : "não"} |`),
  ];
  for (const p of perguntas) {
    linhas.push("", `## ${p.id} · ${SITUACOES[p.situacao]}${p.validado ? " · validada" : ""}`, "");
    linhas.push(`**Pergunta:** ${p.pergunta}`, "");
    if (p.perguntaOriginal) linhas.push(`**Original (${p.origem}):** ${p.perguntaOriginal}`, "");
    if (p.gabaritoOriginal) linhas.push(`**Gabarito original:** ${p.gabaritoOriginal}`, "");
    linhas.push(`**Gabarito:** ${p.gabarito}`, "");
    if (p.recusaAceita) linhas.push("**Recusa aceita:** sim", "");
    for (const item of p.naoDeve) linhas.push(`**Não deve:** ${item}`, "");
    linhas.push(`**Observação:** ${p.observacao}`);
    if (p.dispositivos.length > 0) {
      linhas.push("", "**Dispositivos exigidos**");
      for (const ref of p.dispositivos) linhas.push("", `**${ref}**`, textoDe(ref));
    }
    if (p.aceitos.length > 0) {
      linhas.push("", "**Também aceitos**");
      for (const ref of p.aceitos) linhas.push("", `${ref}`, textoDe(ref));
    }
  }
  return `${linhas.join("\n")}\n`;
}
