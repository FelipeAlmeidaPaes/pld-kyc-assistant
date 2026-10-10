import type { Artigo, Dispositivo } from "../corpus/types.js";
import { chaveDaNorma, compactar } from "./citacoes.js";
import type { IndiceDoCorpus } from "./corpus.js";
import type { Citacao, TrechoRecuperado } from "./tipos.js";

/**
 * Conferência de valores (ADR 0012). A validação de citação garante que o dispositivo citado
 * existe e veio na busca, mas não que o conteúdo da resposta saiu dele: com uma lista incompleta
 * nos trechos, o modelo completa de memória e cita o dispositivo vizinho. Aqui, todo prazo,
 * percentual e valor em dinheiro da resposta tem de estar no texto do que foi citado.
 */

/** "data" é dia e mês de calendário ("31 de março"), com valor mês × 100 + dia. */
export type Unidade = "%" | "R$" | "minuto" | "hora" | "dia" | "semana" | "mês" | "ano" | "data";

export interface Quantidade {
  valor: number;
  unidade: Unidade;
  /** Como aparece no texto, para o motivo da recusa. */
  texto: string;
}

const NUMEROS: Record<string, number> = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8,
  nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15, dezesseis: 16,
  dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, cinqüenta: 50,
  sessenta: 60, setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, duzentos: 200, duzentas: 200,
  trezentos: 300, trezentas: 300, quatrocentos: 400, quatrocentas: 400, quinhentos: 500, quinhentas: 500,
  seiscentos: 600, seiscentas: 600, setecentos: 700, setecentas: 700, oitocentos: 800, oitocentas: 800,
  novecentos: 900, novecentas: 900,
};
const MULTIPLICADORES: Record<string, number> = { mil: 1e3, milhão: 1e6, milhões: 1e6, bilhão: 1e9, bilhões: 1e9 };

// Palavras mais longas primeiro, para "dezesseis" não parar em "dez".
const PALAVRA = [...Object.keys(NUMEROS), ...Object.keys(MULTIPLICADORES)].sort((a, b) => b.length - a.length).join("|");
const FORA_DE_PALAVRA_ANTES = "(?<![\\p{L}\\d])";
const FORA_DE_PALAVRA_DEPOIS = "(?![\\p{L}\\d])";
/** Número em algarismos (1.000.000,00 ou 24), fora de ordinal (1º) e de número composto (9.613/1998). */
const EM_ALGARISMOS = new RegExp(
  `(?<![\\p{L}\\d.,/])(\\d{1,3}(?:\\.\\d{3})+(?:,\\d+)?|\\d+(?:,\\d+)?)(?![\\d.,]?\\d|[º°ª/])(?:\\s+(mil|milhões|milhão|bilhões|bilhão)${FORA_DE_PALAVRA_DEPOIS})?`,
  "gu",
);
const POR_EXTENSO = new RegExp(
  `${FORA_DE_PALAVRA_ANTES}(?:${PALAVRA})(?:(?:\\s+e)?\\s+(?:${PALAVRA}))*${FORA_DE_PALAVRA_DEPOIS}`,
  "gu",
);

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
// Data com ano ("de 3 de março de 1998") identifica norma ou fato, não é prazo: fica de fora.
const DATA = new RegExp(`(?<![\\p{L}\\d])(\\d{1,2})[º°]?\\s+de\\s+(${MESES.join("|")})${FORA_DE_PALAVRA_DEPOIS}(?!\\s+de\\s+\\d)`, "gu");

const UNIDADES: [RegExp, Unidade][] = [
  [/^\s*(?:%|por\s+cento)/u, "%"],
  [/^\s*(?:de\s+)?reais(?!\p{L})/u, "R$"],
  [/^\s*minutos?(?!\p{L})/u, "minuto"],
  [/^\s*horas?(?!\p{L})/u, "hora"],
  [/^\s*dias?(?!\p{L})/u, "dia"],
  [/^\s*semanas?(?!\p{L})/u, "semana"],
  [/^\s*(?:mês|meses)(?!\p{L})/u, "mês"],
  [/^\s*anos?(?!\p{L})/u, "ano"],
];

/** "vinte e cinco" vira 25; "dois mil e quinhentos", 2500. Devolve os grupos de uma sequência de palavras. */
function gruposPorExtenso(sequencia: string): { valor: number; inicio: number; fim: number }[] {
  const palavras = [...sequencia.matchAll(/\p{L}+/gu)].filter((m) => m[0] !== "e");
  const grupos: { valor: number; inicio: number; fim: number }[] = [];
  let total = 0;
  let atual = 0;
  let anterior: number | null = null;
  let inicio = 0;
  let fim = 0;
  const fechar = () => grupos.push({ valor: total + atual, inicio, fim });
  for (const m of palavras) {
    const palavra = m[0];
    const multiplicador = MULTIPLICADORES[palavra];
    const valor = NUMEROS[palavra];
    // Sem multiplicador, só continua o número se a palavra for menor que a anterior (vinte e cinco,
    // cento e vinte); "um e dois" são dois números.
    const continua =
      anterior !== null && (multiplicador !== undefined || anterior >= 1e3 || (valor !== undefined && valor < anterior));
    if (anterior !== null && !continua) {
      fechar();
      total = 0;
      atual = 0;
      anterior = null;
    }
    if (anterior === null) inicio = m.index!;
    if (multiplicador !== undefined) {
      total += (atual || 1) * multiplicador;
      atual = 0;
      anterior = multiplicador;
    } else {
      atual += valor!;
      anterior = valor!;
    }
    fim = m.index! + palavra.length;
  }
  if (anterior !== null) fechar();
  return grupos;
}

const emNumero = (algarismos: string) => Number(algarismos.replace(/\./g, "").replace(",", "."));

/**
 * Prazos, percentuais e valores em dinheiro de um texto. Número sem unidade (artigo, inciso, ano
 * de lei, "dois ou mais saques") fica de fora. O extenso entre parênteses depois do número é
 * pulado; numa faixa ("de 2 (dois) a 6 (seis) anos"), o primeiro número herda a unidade do último.
 * Datas de calendário sem ano ("até 31 de março do ano seguinte") também contam.
 */
export function extrairQuantidades(texto: string): Quantidade[] {
  const minusculo = texto.toLowerCase();
  const numeros: { valor: number; inicio: number; fim: number }[] = [];
  for (const m of minusculo.matchAll(EM_ALGARISMOS)) {
    numeros.push({ valor: emNumero(m[1]!) * (m[2] ? MULTIPLICADORES[m[2]]! : 1), inicio: m.index!, fim: m.index! + m[0].length });
  }
  const emAlgarismos = [...numeros];
  for (const m of minusculo.matchAll(POR_EXTENSO)) {
    for (const g of gruposPorExtenso(m[0])) {
      const [inicio, fim] = [m.index! + g.inicio, m.index! + g.fim];
      // "2,5 milhões": o multiplicador já entrou no número em algarismos.
      if (emAlgarismos.some((n) => inicio < n.fim && fim > n.inicio)) continue;
      numeros.push({ valor: g.valor, inicio, fim });
    }
  }
  numeros.sort((a, b) => a.inicio - b.inicio);
  const datas = [...minusculo.matchAll(DATA)].map((m) => ({
    valor: (MESES.indexOf(m[2]!) + 1) * 100 + Number(m[1]),
    unidade: "data" as const,
    texto: texto.slice(m.index!, m.index! + m[0].length),
  }));

  const unidadeEm = new Map<number, Unidade | null>();
  const quantidades: Quantidade[] = [];
  // De trás para frente: numa faixa, a unidade do número seguinte já é conhecida.
  for (const n of [...numeros].reverse()) {
    const antes = minusculo.slice(0, n.inicio);
    const logoDepois = minusculo.slice(n.fim);
    const depois = logoDepois.replace(/^\s*\([^)]*\)/, "");
    let unidade: Unidade | null = /r\$\s*$/.test(antes) ? "R$" : null;
    unidade ??= UNIDADES.find(([re]) => re.test(logoDepois) || re.test(depois))?.[1] ?? null;
    if (!unidade) {
      const conector = depois.match(/^\s*(?:,|a|e|ou|até)\s+/u);
      if (conector) unidade = unidadeEm.get(n.fim + (logoDepois.length - depois.length) + conector[0].length) ?? null;
    }
    unidadeEm.set(n.inicio, unidade);
    if (unidade) quantidades.push({ valor: n.valor, unidade, texto: texto.slice(n.inicio, n.fim).trim() });
  }
  return [...quantidades.reverse(), ...datas];
}

/** Para o motivo da recusa: "20%", "R$ 20.000.000,00", "10 (ano)", "31 de março". */
export function descreverQuantidade(q: Quantidade): string {
  if (q.unidade === "%") return /\d$/.test(q.texto) ? `${q.texto}%` : `${q.texto} por cento`;
  if (q.unidade === "R$") return /^\d/.test(q.texto) ? `R$ ${q.texto}` : `${q.texto} de reais`;
  if (q.unidade === "data") return q.texto;
  return `${q.texto} (${q.unidade})`;
}

const chaveDaQuantidade = (q: Quantidade) => `${q.unidade}|${Math.round(q.valor * 1e6) / 1e6}`;

/**
 * O que conta como texto do dispositivo citado: ele, os que o abrem (caput, parágrafo, inciso) e
 * os que vêm abaixo dele. O caput abre os incisos do artigo, não os parágrafos.
 */
export function parentesDoDispositivo(artigo: Artigo, dispositivo: Dispositivo): Dispositivo[] {
  const partes = dispositivo.caminho.split(", ");
  return artigo.dispositivos.filter((d) => {
    if (d === dispositivo || d.tipo === "caput") return true;
    const outras = d.caminho.split(", ");
    if (dispositivo.tipo === "caput") return !/^(?:§|parágrafo)/.test(outras[1] ?? "");
    const comum = Math.min(partes.length, outras.length);
    return partes.slice(0, comum).join(", ") === outras.slice(0, comum).join(", ");
  });
}

/**
 * Quantidades da resposta sem respaldo: nenhum dispositivo citado, nem os que o abrem ou vêm
 * abaixo dele, traz o mesmo valor na mesma unidade. Só vale texto que veio nos trechos: o que o
 * modelo não viu não sustenta a resposta, mesmo que esteja certo. Sem trechos (null), vale todo o
 * texto desses dispositivos: o servidor MCP não sabe o que o cliente leu (ADR 0013).
 */
export function quantidadesSemRespaldo(
  resposta: string,
  citacoes: Citacao[],
  trechos: TrechoRecuperado[] | null,
  indice: IndiceDoCorpus,
): Quantidade[] {
  const daResposta = extrairQuantidades(resposta);
  if (daResposta.length === 0) return [];
  const vistos = trechos?.map((t) => ({ norma: chaveDaNorma(t.sigla), texto: compactar(t.texto) })) ?? null;
  const respaldo = new Set<string>();
  for (const citacao of citacoes) {
    const encontrado = indice.buscar(citacao.sigla, citacao.caminho);
    if (!encontrado) continue;
    const norma = chaveDaNorma(encontrado.sigla);
    for (const d of parentesDoDispositivo(encontrado.artigo, encontrado.dispositivo)) {
      const texto = compactar(d.texto);
      if (texto === "" || (vistos && !vistos.some((t) => t.norma === norma && t.texto.includes(texto)))) continue;
      for (const q of extrairQuantidades(d.texto)) respaldo.add(chaveDaQuantidade(q));
    }
  }
  const semRespaldo = daResposta.filter((q) => !respaldo.has(chaveDaQuantidade(q)));
  return semRespaldo.filter((q, i) => semRespaldo.findIndex((o) => chaveDaQuantidade(o) === chaveDaQuantidade(q)) === i);
}
