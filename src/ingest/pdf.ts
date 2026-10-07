import { getDocument, VerbosityLevel } from "pdfjs-dist/legacy/build/pdf.mjs";

/** Linha de texto de uma página do PDF, com a posição do primeiro caractere. */
export interface LinhaPdf {
  pagina: number;
  x: number;
  /** Medido da base da página para cima, como no PDF. */
  y: number;
  /** Altura da fonte. */
  altura: number;
  texto: string;
}

interface Trecho {
  str: string;
  transform: number[];
  width: number;
  height: number;
}

/** Junta os trechos de uma linha na ordem horizontal, com espaço onde há distância entre eles. */
function juntarTrechos(trechos: Trecho[]): string {
  let texto = "";
  let fim: number | null = null;
  for (const t of [...trechos].sort((a, b) => a.transform[4]! - b.transform[4]!)) {
    const distante = fim !== null && t.transform[4]! - fim > t.height * 0.15;
    texto += distante && !/\s$/.test(texto) && !/^\s/.test(t.str) ? ` ${t.str}` : t.str;
    fim = t.transform[4]! + t.width;
  }
  return texto.replace(/\s+/g, " ").trim();
}

/** Linhas de texto de cada página, de cima para baixo. */
export async function lerLinhasDoPdf(bytes: Uint8Array): Promise<LinhaPdf[]> {
  // O pdfjs transfere o buffer recebido; a cópia preserva os bytes de quem chamou.
  const tarefa = getDocument({ data: new Uint8Array(bytes), verbosity: VerbosityLevel.ERRORS });
  const documento = await tarefa.promise;
  const linhas: LinhaPdf[] = [];
  try {
    for (let pagina = 1; pagina <= documento.numPages; pagina++) {
      const conteudo = await (await documento.getPage(pagina)).getTextContent();
      const trechos: Trecho[] = conteudo.items
        .flatMap((item) => ("str" in item && item.str !== "" ? [item] : []))
        .sort((a, b) => b.transform[5] - a.transform[5]);

      let grupo: Trecho[] = [];
      const fecharGrupo = () => {
        const texto = juntarTrechos(grupo);
        if (texto) {
          const [primeiro] = [...grupo].sort((a, b) => a.transform[4]! - b.transform[4]!);
          const altura = Math.max(...grupo.map((t) => t.height));
          linhas.push({ pagina, x: primeiro!.transform[4]!, y: grupo[0]!.transform[5]!, altura, texto });
        }
        grupo = [];
      };
      for (const t of trechos) {
        // Mesma linha: base a menos de 40% da altura da fonte.
        if (grupo.length > 0 && Math.abs(grupo[0]!.transform[5]! - t.transform[5]!) > t.height * 0.4) fecharGrupo();
        grupo.push(t);
      }
      fecharGrupo();
    }
  } finally {
    await tarefa.destroy();
  }
  return linhas;
}

function moda(valores: number[]): number {
  const contagem = new Map<number, number>();
  for (const v of valores) contagem.set(v, (contagem.get(v) ?? 0) + 1);
  return [...contagem].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]![0];
}

export interface ParagrafosDoPdf {
  paragrafos: string[];
  /** Linhas descartadas por terem fonte menor que a do corpo (cabeçalho, rodapé, número de página). */
  descartadas: string[];
}

/**
 * Remonta os parágrafos a partir das linhas. Nos PDFs do BCB, linhas do mesmo parágrafo
 * ficam a ~15 pt uma da outra e parágrafos, a ~21 pt; a primeira linha do parágrafo tem recuo
 * e as demais começam na margem. Na mesma página, decide o espaço; na virada de página,
 * o recuo. Hífen no fim da linha é de palavra composta ("11-A", "Procuradores-Gerais"),
 * não de hifenização, e é mantido.
 */
export function montarParagrafos(linhas: LinhaPdf[]): ParagrafosDoPdf {
  if (linhas.length === 0) return { paragrafos: [], descartadas: [] };
  const alturaDoCorpo = moda(linhas.map((l) => Math.round(l.altura * 10) / 10));
  const corpo = linhas.filter((l) => l.altura >= alturaDoCorpo * 0.9);
  const descartadas = linhas.filter((l) => l.altura < alturaDoCorpo * 0.9).map((l) => l.texto);

  // Margem: o menor x que se repete; linhas soltas (assinatura, aviso) não contam.
  // Em documento curto demais para haver repetição, o menor x.
  const frequencia = new Map<number, number>();
  for (const l of corpo) frequencia.set(Math.round(l.x), (frequencia.get(Math.round(l.x)) ?? 0) + 1);
  const repetidos = [...frequencia].filter(([, n]) => n >= 3).map(([x]) => x);
  const margem = Math.min(...(repetidos.length > 0 ? repetidos : corpo.map((l) => Math.round(l.x))));

  const paragrafos: string[] = [];
  let anterior: LinhaPdf | null = null;
  for (const linha of corpo) {
    const novo =
      anterior === null ||
      (linha.pagina === anterior.pagina
        ? anterior.y - linha.y > alturaDoCorpo * 1.5
        : Math.abs(linha.x - margem) > alturaDoCorpo);
    if (novo) paragrafos.push(linha.texto);
    else {
      const atual = paragrafos.pop()!;
      paragrafos.push(atual.endsWith("-") ? `${atual}${linha.texto}` : `${atual} ${linha.texto}`);
    }
    anterior = linha;
  }
  return { paragrafos, descartadas };
}
