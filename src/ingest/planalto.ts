import * as cheerio from "cheerio";
import type { Artigo, Dispositivo, TipoDispositivo } from "../corpus/types.js";

// Ordinal ("1º", "1o") só quando seguido de separador, para não engolir a primeira letra do texto.
const ORDINAL = String.raw`(?:\s*[º°o](?=[\s.\-–—]|$))?`;
// Sufixo de dispositivo incluído depois, ex.: "17-A", "I-A".
const SUFIXO = String.raw`(?:\s*-\s*([A-Z])(?![a-z]))?`;
// Em artigo e parágrafo o Planalto também cola a letra no número ("Art. 10A.", lei 9.613).
// Sem hífen, só vale colada: "Art. 1º A pessoa" não é art. 1º-A.
const SUFIXO_NUMERICO = String.raw`(?:(?:\s*-\s*|(?=[A-Z]))([A-Z])(?![a-z]))?`;

const ARTIGO = new RegExp(String.raw`^Art\.\s*(\d+)${ORDINAL}${SUFIXO_NUMERICO}\.?\s*`);
const PARAGRAFO = new RegExp(String.raw`^§\s*(\d+)${ORDINAL}${SUFIXO_NUMERICO}\.?\s*`);
const PARAGRAFO_UNICO = /^Parágrafo\s+único\.?\s*[-–—]?\s*/i;
const INCISO = new RegExp(String.raw`^([IVXLCDM]+)${SUFIXO}\s*[-–—]\s+`);
const ALINEA = /^([a-z])\)\s*/;
const AGRUPAMENTO = /^(?:LIVRO|Livro|TÍTULO|Título|CAPÍTULO|Capítulo|SEÇÃO|Seção|SUBSEÇÃO|Subseção)\s+(?:[IVXLCDM]+|ÚNIC[OA]|Únic[oa])\b/;
// Níveis de agrupamento, do mais amplo ao mais específico.
const NIVEIS = ["livro", "título", "capítulo", "seção", "subseção"];
const NIVEL_CAPITULO = NIVEIS.indexOf("capítulo");
// Título sem rótulo de capítulo, todo em caixa alta (lei 7.492: "DOS CRIMES CONTRA O SISTEMA FINANCEIRO NACIONAL").
const TITULO_SOLTO = /^(?:DAS?|DOS?)\s+[^a-z]+$/;
const PENA = /^Pena\b/;
// Parágrafo na mesma linha do texto anterior, depois de fim de frase (lei 13.810, arts. 12, 14, 16, 19 e 25).
const PARAGRAFO_NA_LINHA = /(?<=[.;:)]\s+)(?=Parágrafo\s+único\b|§\s*\d+\s*[º°o]?\.?\s+[A-ZÀ-Ú(])/;
const ASSINATURA = /^Brasília,\s/;
const NOTA =
  /\((?:Redação dada|Incluíd[oa]|Acrescid[oa]|Revogad[oa]|Renumerad[oa]|Vide|Vigência|Regulamento|Promulgação)[^)]*\)/gi;

// Script que o firewall (F5) do Planalto injeta com um token aleatório a cada resposta.
const SCRIPT_DO_FIREWALL = /<script id="f5_cspm">[\s\S]*?<\/script>/g;

/**
 * Tira do HTML bruto o que muda a cada download sem mudar a norma. Sem isso, o SHA-256
 * de NormaNormalizada muda em toda captura e deixa de servir para auditar a versão.
 * Opera em latin1, que preserva qualquer byte, para não depender do charset da página.
 */
export function removerRuidoDoFirewall(bytes: Uint8Array): Buffer {
  return Buffer.from(Buffer.from(bytes).toString("latin1").replace(SCRIPT_DO_FIREWALL, ""), "latin1");
}

// Marca de fronteira entre blocos. Fica na área de uso privado do Unicode para não colidir com texto nem com \s.
const QUEBRA = "\uE000";
const BLOCOS = "p, div, li, tr, h1, h2, h3, h4, h5, h6, blockquote, center, table";
// Links de anotação sem parênteses no Planalto ("Vigência", "Vigência encerrada").
const LINK_DE_NOTA = /^Vigência(?:\s+encerrada)?$/i;

/**
 * Linhas de texto visível, sem o que o Planalto marca como riscado (texto revogado).
 * Só <br> e elementos de bloco quebram linha. Quebra de linha no código-fonte vale espaço,
 * como no navegador: o Planalto quebra "I - <quebra> a perda..." no meio do inciso.
 */
export function extrairLinhas(html: string): string[] {
  const $ = cheerio.load(html);
  $("strike, s, del, script, style, [style*='line-through']").remove();
  $("a").each((_, el) => {
    const texto = $(el).text().trim();
    if (LINK_DE_NOTA.test(texto)) $(el).text(`(${texto})`);
  });
  $("br").replaceWith(QUEBRA);
  $(BLOCOS).prepend(QUEBRA).append(QUEBRA);

  return $("body")
    .text()
    .split(QUEBRA)
    .map((linha) => linha.replace(/\s+/g, " ").trim())
    .filter((linha) => linha.length > 0);
}

/** Até o 9 a lei usa ordinal (1º); do 10 em diante, cardinal (10). */
function numeroLegal(digitos: string, sufixo: string | undefined): string {
  const n = Number(digitos);
  return `${n < 10 ? `${n}º` : n}${sufixo ? `-${sufixo}` : ""}`;
}

interface Rascunho {
  tipo: TipoDispositivo;
  rotulo: string;
  caminho: string;
  partes: string[];
}

function finalizar(rascunho: Rascunho): Dispositivo {
  const bruto = rascunho.partes.join(" ");
  const notas = bruto.match(NOTA) ?? [];
  const texto = bruto.replace(NOTA, " ").replace(/\s+/g, " ").trim();
  // "I - (revogado);" deixa só a pontuação depois que a nota sai.
  const semTexto = /^[\s.,;:]*$/.test(texto);
  return {
    tipo: rascunho.tipo,
    rotulo: rascunho.rotulo,
    caminho: rascunho.caminho,
    texto: semTexto ? "" : texto,
    notas,
    revogado: semTexto && notas.some((nota) => /^\(revogad/i.test(nota)),
  };
}

/**
 * Converte uma página de lei do Planalto (texto compilado) em artigos e dispositivos.
 * Linhas que não abrem um dispositivo continuam o dispositivo anterior. A exceção é a pena
 * depois do último inciso, que pertence ao caput ou parágrafo que abriu os incisos.
 */
export function parsePlanalto(html: string): Artigo[] {
  const linhas = extrairLinhas(html).flatMap((linha) => linha.split(PARAGRAFO_NA_LINHA));
  const artigos: Artigo[] = [];
  let artigo: Artigo | null = null;
  let rascunhos: Rascunho[] = [];
  // Atribuídos dentro de abrir(); o "as" evita que o TypeScript os estreite para null no laço.
  let atual = null as Rascunho | null;
  // Caput ou parágrafo em vigor: é quem recebe a pena que vem depois dos incisos.
  let cabeca = null as Rascunho | null;
  let paragrafo: string | null = null;
  let inciso: string | null = null;
  // Agrupamentos em vigor por nível: capítulo, seção etc.
  let agrupamentos: string[] = [];
  let aguardandoNomeDoNivel: number | null = null;

  // Título de agrupamento encerra o dispositivo em curso: nada depois dele continua o artigo anterior.
  const entrarNoAgrupamento = (nivel: number, linha: string) => {
    agrupamentos = agrupamentos.slice(0, nivel);
    agrupamentos[nivel] = linha;
    atual = cabeca = null;
  };

  const fecharArtigo = () => {
    if (artigo) artigo.dispositivos = rascunhos.map(finalizar);
    rascunhos = [];
    atual = cabeca = null;
  };

  const abrir = (tipo: TipoDispositivo, rotulo: string, caminho: string, resto: string) => {
    atual = { tipo, rotulo, caminho, partes: [resto] };
    rascunhos.push(atual);
    if (tipo === "caput" || tipo === "paragrafo") cabeca = atual;
  };

  const abreSubdivisao = (linha: string | undefined) =>
    linha !== undefined && (INCISO.test(linha) || ALINEA.test(linha));

  for (const [i, linha] of linhas.entries()) {
    if (ASSINATURA.test(linha)) break;

    if (AGRUPAMENTO.test(linha)) {
      const nivel = NIVEIS.indexOf(linha.split(" ")[0]!.toLowerCase());
      entrarNoAgrupamento(nivel, linha);
      aguardandoNomeDoNivel = nivel;
      continue;
    }

    let m: RegExpMatchArray | null;
    if ((m = linha.match(ARTIGO))) {
      fecharArtigo();
      const numero = numeroLegal(m[1]!, m[2]);
      const agrupamento = agrupamentos.filter(Boolean).join(" > ") || null;
      artigo = { numero, rotulo: `art. ${numero}`, agrupamento, dispositivos: [] };
      artigos.push(artigo);
      paragrafo = inciso = null;
      aguardandoNomeDoNivel = null;
      abrir("caput", "caput", `${artigo.rotulo}, caput`, linha.slice(m[0].length));
      continue;
    }

    if (aguardandoNomeDoNivel !== null) {
      // Nota sozinha na linha, ex.: "(Incluído pela Lei nº 12.683, de 2012)", não é o nome do agrupamento.
      if (linha.replace(NOTA, "").trim() === "") continue;
      agrupamentos[aguardandoNomeDoNivel] += ` - ${linha}`;
      aguardandoNomeDoNivel = null;
      continue;
    }

    if (TITULO_SOLTO.test(linha)) {
      entrarNoAgrupamento(NIVEL_CAPITULO, linha);
      continue;
    }

    // Antes do primeiro artigo ficam ementa e preâmbulo, que não são dispositivos.
    if (!artigo) continue;

    if ((m = linha.match(PARAGRAFO)) || (m = linha.match(PARAGRAFO_UNICO))) {
      paragrafo = m[1] ? `§ ${numeroLegal(m[1], m[2])}` : "parágrafo único";
      inciso = null;
      abrir("paragrafo", paragrafo, `${artigo.rotulo}, ${paragrafo}`, linha.slice(m[0].length));
    } else if ((m = linha.match(INCISO))) {
      inciso = `${m[1]}${m[2] ? `-${m[2]}` : ""}`;
      const base = paragrafo ? `${artigo.rotulo}, ${paragrafo}` : artigo.rotulo;
      abrir("inciso", inciso, `${base}, ${inciso}`, linha.slice(m[0].length));
    } else if ((m = linha.match(ALINEA))) {
      const base = [artigo.rotulo, paragrafo, inciso].filter(Boolean).join(", ");
      abrir("alinea", m[1]!, `${base}, ${m[1]}`, linha.slice(m[0].length));
    } else if (PENA.test(linha) && atual !== cabeca && !abreSubdivisao(linhas[i + 1])) {
      cabeca?.partes.push(linha);
    } else {
      atual?.partes.push(linha);
    }
  }
  fecharArtigo();
  return artigos;
}

/**
 * Sinais de que o parser perdeu ou duplicou texto. No texto compilado, artigo revogado
 * continua listado como "(Revogado)", então lacuna na numeração indica falha de extração.
 */
export function verificarArtigos(artigos: Artigo[]): string[] {
  const avisos: string[] = [];
  const vistos = new Set<string>();
  let anterior: number | null = null;

  for (const artigo of artigos) {
    if (vistos.has(artigo.numero)) avisos.push(`${artigo.rotulo} aparece mais de uma vez`);
    vistos.add(artigo.numero);

    const n = Number.parseInt(artigo.numero, 10);
    if (anterior !== null && n > anterior + 1) {
      avisos.push(`lacuna na numeração: do art. ${anterior} para o ${artigo.rotulo}`);
    }
    anterior = n;

    if (artigo.dispositivos.every((d) => d.texto === "" && !d.revogado)) {
      avisos.push(`${artigo.rotulo} ficou sem texto`);
    }
  }
  return avisos;
}
