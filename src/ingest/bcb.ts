import type { Artigo } from "../corpus/types.js";
import { abreAgrupamento, abreArtigo, abreDispositivo, parseDispositivos, soNotas } from "./dispositivos.js";

const API_NORMATIVOS = "https://www.bcb.gov.br/api/conteudo/app/normativos";
const ANEXOS = "https://normativos.bcb.gov.br/Lists/Normativos/Attachments";

/** Campos usados da resposta de `exibenormativo`. */
export interface NormativoBcb {
  Id: number;
  Titulo: string;
  /** Arquivos da norma: "<nome>;<tamanho em KB>#;<nome>;<tamanho>#;...". */
  Documentos: string | null;
  /** Alterações sofridas, separadas por ";#". Vazio quando a norma nunca foi alterada. */
  Atualizacoes: string | null;
  /** HTML da redação original, sem as alterações. */
  Texto: string | null;
  Revogado: boolean;
  Cancelado: boolean;
}

/** Tipo e número da norma a partir da URL pública (`exibenormativo?tipo=Circular&numero=3978`). */
export function identificarNorma(url: string): { tipo: string; numero: string } {
  const parametros = new URL(url).searchParams;
  const tipo = parametros.get("tipo");
  const numero = parametros.get("numero");
  if (!tipo || !numero) throw new Error(`URL do BCB sem tipo ou número: ${url}`);
  return { tipo, numero };
}

export function urlDoNormativo(tipo: string, numero: string): string {
  return `${API_NORMATIVOS}/exibenormativo?p1=${encodeURIComponent(tipo)}&p2=${encodeURIComponent(numero)}`;
}

export function urlDoAnexo(id: number, arquivo: string): string {
  return `${ANEXOS}/${id}/${encodeURIComponent(arquivo)}`;
}

/**
 * PDF compilado "limpo" (`_v<N>_L.pdf`) da maior versão, ou null se não houver.
 * `O` é a redação original e `P` traz a redação anterior junto da nova; nenhum dos dois serve.
 */
export function escolherPdfCompilado(documentos: string | null): string | null {
  const versoes = (documentos ?? "")
    .split("#;")
    .map((entrada) => entrada.split(";")[0]!.trim())
    .flatMap((nome) => {
      const m = nome.match(/_v(\d+)_L\.pdf$/i);
      return m ? [{ nome, versao: Number(m[1]) }] : [];
    });
  if (versoes.length === 0) return null;
  return versoes.reduce((maior, v) => (v.versao > maior.versao ? v : maior)).nome;
}

/**
 * De onde vem o texto vigente: o PDF compilado, se existir; senão o HTML da API, que é a
 * redação original e só vale para norma nunca alterada.
 */
export function escolherFonteDoTexto(normativo: NormativoBcb): { pdf: string } | { html: string } {
  if (normativo.Revogado || normativo.Cancelado) {
    throw new Error(`${normativo.Titulo} está revogada ou cancelada no BCB e não pode entrar no corpus.`);
  }
  const pdf = escolherPdfCompilado(normativo.Documentos);
  if (pdf) return { pdf };
  if (normativo.Atualizacoes?.trim()) {
    throw new Error(`${normativo.Titulo} foi alterada e não tem PDF compilado; o HTML da API é a redação original.`);
  }
  if (!normativo.Texto) throw new Error(`${normativo.Titulo} não tem texto nem PDF compilado.`);
  return { html: normativo.Texto };
}

/**
 * Descarta o fecho da norma: assinatura e o aviso "Este texto não substitui o publicado no DOU".
 * Depois da linha do último artigo, o texto termina na primeira linha que não abre dispositivo
 * nem é só anotação. Por construção, nenhum artigo é cortado.
 */
export function cortarFecho(linhas: string[]): string[] {
  const ultimoArtigo = linhas.findLastIndex(abreArtigo);
  if (ultimoArtigo < 0) return linhas;
  const fim = linhas.findIndex((linha, i) => i > ultimoArtigo && !abreDispositivo(linha) && !soNotas(linha));
  return fim < 0 ? linhas : linhas.slice(0, fim);
}

/**
 * Parágrafos depois do primeiro artigo que não abrem dispositivo, não são título nem só anotação.
 * Nas normas do BCB todo parágrafo tem rótulo; um solto foi colado no dispositivo anterior e
 * indica estrutura que o parser não conhece (foi assim com as alíneas "aa)" da Carta Circular 4.001).
 */
export function paragrafosSoltos(linhas: string[]): string[] {
  const corpo = cortarFecho(linhas);
  return corpo
    .slice(Math.max(corpo.findIndex(abreArtigo), 0))
    .filter((linha) => !abreDispositivo(linha) && !abreAgrupamento(linha) && !soNotas(linha));
}

/** Converte os parágrafos de uma norma do BCB (do PDF ou do HTML da API) em artigos. */
export function parseBcb(linhas: string[]): Artigo[] {
  return parseDispositivos(cortarFecho(linhas));
}
