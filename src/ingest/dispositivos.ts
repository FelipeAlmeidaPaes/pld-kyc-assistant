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
// Depois do "z)" vêm "aa)", "ab)"... (Carta Circular BCB 4.001, art. 1º).
const ALINEA = /^([a-z]{1,2})\)\s*/;
// Item, o nível abaixo da alínea (LC 95/1998, art. 10). Só vale dentro de alínea (Circular BCB 3.978, art. 24).
const ITEM = /^(\d+)\.\s+/;
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
  /\((?:Redação dada|Incluíd[oa]|Acrescid[oa]|Revogad[oa]|Renumerad[oa]|Denominação alterada|Vide|Vigência|Regulamento|Promulgação)[^)]*\)/gi;

const semNotas = (linha: string) => linha.replace(NOTA, " ").replace(/\s+/g, " ").trim();

export const abreArtigo = (linha: string) => ARTIGO.test(linha);

export const abreAgrupamento = (linha: string) => AGRUPAMENTO.test(linha) || TITULO_SOLTO.test(semNotas(linha));

export const abreDispositivo = (linha: string) =>
  [ARTIGO, PARAGRAFO, PARAGRAFO_UNICO, INCISO, ALINEA, ITEM].some((padrao) => padrao.test(linha));

/** Linha só com anotações, ex.: "(Incluído pela Lei nº 12.683, de 2012)". */
export const soNotas = (linha: string) => semNotas(linha) === "";

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
  const texto = semNotas(bruto);
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
 * Converte as linhas de uma norma (um parágrafo do documento por linha) em artigos e dispositivos.
 * Linhas que não abrem um dispositivo continuam o dispositivo anterior. A exceção é a pena
 * depois do último inciso, que pertence ao caput ou parágrafo que abriu os incisos.
 */
export function parseDispositivos(linhasDoDocumento: string[]): Artigo[] {
  const linhas = linhasDoDocumento.flatMap((linha) => linha.split(PARAGRAFO_NA_LINHA));
  const artigos: Artigo[] = [];
  let artigo: Artigo | null = null;
  let rascunhos: Rascunho[] = [];
  // Atribuídos dentro de abrir(); o "as" evita que o TypeScript os estreite para null no laço.
  let atual = null as Rascunho | null;
  // Caput ou parágrafo em vigor: é quem recebe a pena que vem depois dos incisos.
  let cabeca = null as Rascunho | null;
  let paragrafo: string | null = null;
  let inciso: string | null = null;
  let alinea: string | null = null;
  // Agrupamentos em vigor por nível: capítulo, seção etc.
  let agrupamentos: string[] = [];
  let aguardandoNomeDoNivel: number | null = null;

  // Título de agrupamento encerra o dispositivo em curso: nada depois dele continua o artigo anterior.
  const entrarNoAgrupamento = (nivel: number, titulo: string) => {
    agrupamentos = agrupamentos.slice(0, nivel);
    agrupamentos[nivel] = titulo;
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
    linha !== undefined && (INCISO.test(linha) || ALINEA.test(linha) || (alinea !== null && ITEM.test(linha)));

  for (const [i, linha] of linhas.entries()) {
    if (ASSINATURA.test(linha)) break;

    let m: RegExpMatchArray | null;
    if ((m = linha.match(AGRUPAMENTO))) {
      const nivel = NIVEIS.indexOf(m[0].split(" ")[0]!.toLowerCase());
      // No PDF do BCB, rótulo e nome vêm na mesma linha ("CAPÍTULO I DO OBJETO").
      const nome = semNotas(linha.slice(m[0].length)).replace(/^[-–—]\s*/, "");
      entrarNoAgrupamento(nivel, nome ? `${m[0]} - ${nome}` : m[0]);
      aguardandoNomeDoNivel = nome ? null : nivel;
      continue;
    }

    if ((m = linha.match(ARTIGO))) {
      fecharArtigo();
      const numero = numeroLegal(m[1]!, m[2]);
      const agrupamento = agrupamentos.filter(Boolean).join(" > ") || null;
      artigo = { numero, rotulo: `art. ${numero}`, agrupamento, dispositivos: [] };
      artigos.push(artigo);
      paragrafo = inciso = alinea = null;
      aguardandoNomeDoNivel = null;
      abrir("caput", "caput", `${artigo.rotulo}, caput`, linha.slice(m[0].length));
      continue;
    }

    if (aguardandoNomeDoNivel !== null) {
      // Nota sozinha na linha, ex.: "(Incluído pela Lei nº 12.683, de 2012)", não é o nome do agrupamento.
      if (soNotas(linha)) continue;
      agrupamentos[aguardandoNomeDoNivel] += ` - ${semNotas(linha)}`;
      aguardandoNomeDoNivel = null;
      continue;
    }

    if (TITULO_SOLTO.test(semNotas(linha))) {
      entrarNoAgrupamento(NIVEL_CAPITULO, semNotas(linha));
      continue;
    }

    // Antes do primeiro artigo ficam ementa e preâmbulo, que não são dispositivos.
    if (!artigo) continue;

    if ((m = linha.match(PARAGRAFO)) || (m = linha.match(PARAGRAFO_UNICO))) {
      paragrafo = m[1] ? `§ ${numeroLegal(m[1], m[2])}` : "parágrafo único";
      inciso = alinea = null;
      abrir("paragrafo", paragrafo, `${artigo.rotulo}, ${paragrafo}`, linha.slice(m[0].length));
    } else if ((m = linha.match(INCISO))) {
      inciso = `${m[1]}${m[2] ? `-${m[2]}` : ""}`;
      alinea = null;
      const base = paragrafo ? `${artigo.rotulo}, ${paragrafo}` : artigo.rotulo;
      abrir("inciso", inciso, `${base}, ${inciso}`, linha.slice(m[0].length));
    } else if ((m = linha.match(ALINEA))) {
      alinea = m[1]!;
      const base = [artigo.rotulo, paragrafo, inciso].filter(Boolean).join(", ");
      abrir("alinea", alinea, `${base}, ${alinea}`, linha.slice(m[0].length));
    } else if (alinea !== null && (m = linha.match(ITEM))) {
      const base = [artigo.rotulo, paragrafo, inciso, alinea].filter(Boolean).join(", ");
      abrir("item", m[1]!, `${base}, ${m[1]}`, linha.slice(m[0].length));
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
