import type { IndiceDoCorpus } from "./corpus.js";
import type { Citacao, TrechoRecuperado } from "./tipos.js";

/**
 * Chave da norma a partir da sigla, tolerante a "nº", órgão e ano:
 * "Lei nº 9.613/1998" e "Lei 9.613" viram "lei 9613"; "Circular BCB 3.978/2020" vira "circular 3978".
 */
export function chaveDaNorma(sigla: string): string {
  const texto = sigla
    .toLowerCase()
    .replace(/\bn\.?\s*[º°o]\.?(?=\s|\d)/g, " ")
    .replace(/\b(?:cmn\/bcb|bcb|cmn)\b/g, " ");
  const numero = texto.match(/\d[\d.]*/);
  if (!numero) return texto.replace(/\s+/g, " ").trim();
  const tipo = texto.slice(0, numero.index).replace(/\s+/g, " ").trim();
  return `${tipo} ${numero[0].replace(/\./g, "")}`;
}

/**
 * Caminho em forma canônica para comparar citações: sem ordinal, sem as palavras "inciso",
 * "alínea" e "item", com espaço padronizado; "art. 5º" sozinho vale como o caput.
 */
export function normalizarCaminho(caminho: string): string {
  const partes = caminho
    .replace(/\bArt\./g, "art.")
    .replace(/\bParágrafo\b/g, "parágrafo")
    .replace(/(\d)\s*[º°]/g, "$1")
    .replace(/(\d)o\b/g, "$1")
    .replace(/\b(?:inciso|alínea|alinea|item)\s+/gi, "")
    .replace(/["“”']/g, "")
    .replace(/§\s*/g, "§ ")
    .replace(/art\.\s*/g, "art. ")
    .split(",")
    .map((parte) => parte.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (partes.length === 1 && partes[0]!.startsWith("art.")) partes.push("caput");
  return partes.join(", ");
}

const compactar = (texto: string) => texto.replace(/\s+/g, " ").trim();

export interface ResultadoDaValidacao {
  /** Citações conferidas, com sigla e caminho como estão no corpus. */
  validas: Citacao[];
  invalidas: { citacao: Citacao; motivo: string }[];
}

/**
 * Uma citação vale se o dispositivo existe no corpus e o texto dele está nos trechos recuperados
 * da mesma norma. Assim o modelo não cita de memória nem um dispositivo que não viu.
 */
export function validarCitacoes(
  citacoes: Citacao[],
  trechos: TrechoRecuperado[],
  indice: IndiceDoCorpus,
): ResultadoDaValidacao {
  const resultado: ResultadoDaValidacao = { validas: [], invalidas: [] };
  for (const citacao of citacoes) {
    const encontrado = indice.buscar(citacao.sigla, citacao.caminho);
    if (!encontrado) {
      resultado.invalidas.push({ citacao, motivo: "dispositivo não existe no corpus" });
      continue;
    }
    const texto = compactar(encontrado.dispositivo.texto);
    const visto = trechos.some(
      (t) => chaveDaNorma(t.sigla) === chaveDaNorma(encontrado.sigla) && compactar(t.texto).includes(texto),
    );
    if (!visto) {
      resultado.invalidas.push({ citacao, motivo: "texto do dispositivo não está nos trechos recuperados" });
      continue;
    }
    const canonica = { sigla: encontrado.sigla, caminho: encontrado.dispositivo.caminho };
    if (!resultado.validas.some((c) => c.sigla === canonica.sigla && c.caminho === canonica.caminho)) {
      resultado.validas.push(canonica);
    }
  }
  return resultado;
}
