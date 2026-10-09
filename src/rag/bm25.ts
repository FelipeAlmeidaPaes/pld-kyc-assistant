/**
 * Palavras que não ajudam a achar o dispositivo: artigos, preposições, conjunções, pronomes e
 * verbos que aparecem em quase toda norma. Escritas já sem acento, como os termos.
 */
const PALAVRAS_VAZIAS = new Set(
  (
    "a o as os um uma uns umas de do da dos das em no na nos nas num numa por pelo pela pelos pelas para pra " +
    "com sem sob sobre ao aos e ou nem mas que se como mais menos muito ja nao sim seu sua seus suas lhe lhes " +
    "ele ela eles elas este esta estes estas esse essa esses essas isso isto aquele aquela qual quais quando " +
    "onde quem cujo cuja ser sao sera foi deve devem pode podem ter tem tenha haver ha caso"
  ).split(" "),
);

export interface OpcoesDosTermos {
  /** Corta cada termo neste número de letras: um radical grosseiro ("comunicar" e "comunicação" juntos). */
  radical?: number | null;
}

/** Termos de um texto: minúsculas, sem acento, sem pontuação e sem palavra vazia. */
export function termos(texto: string, { radical = null }: OpcoesDosTermos = {}): string[] {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !PALAVRAS_VAZIAS.has(t))
    .map((t) => (radical && t.length > radical ? t.slice(0, radical) : t));
}

export interface ResultadoLexico<T> {
  item: T;
  pontuacao: number;
}

/**
 * Busca lexical BM25 em memória: pontua os itens pelos termos da consulta, com peso maior para
 * termo raro no corpus (IDF) e saturação da frequência no item (k1), descontando item longo (b).
 * O corpus da v1 tem menos de mil trechos; não precisa de índice externo.
 */
export function criarBuscaBm25<T>(
  itens: T[],
  texto: (item: T) => string,
  { k1 = 1.2, b = 0.75, radical = null }: { k1?: number; b?: number } & OpcoesDosTermos = {},
): (consulta: string, k: number) => ResultadoLexico<T>[] {
  const frequencias = itens.map((item) => {
    const contagem = new Map<string, number>();
    for (const termo of termos(texto(item), { radical })) contagem.set(termo, (contagem.get(termo) ?? 0) + 1);
    return contagem;
  });
  const tamanhos = frequencias.map((f) => [...f.values()].reduce((a, n) => a + n, 0));
  const tamanhoMedio = tamanhos.reduce((a, n) => a + n, 0) / Math.max(1, itens.length);
  const documentosComTermo = new Map<string, number>();
  for (const f of frequencias) for (const termo of f.keys()) documentosComTermo.set(termo, (documentosComTermo.get(termo) ?? 0) + 1);
  const idf = (termo: string) => {
    const df = documentosComTermo.get(termo) ?? 0;
    return Math.log(1 + (itens.length - df + 0.5) / (df + 0.5));
  };

  return (consulta, k) => {
    const daConsulta = [...new Set(termos(consulta, { radical }))].filter((t) => documentosComTermo.has(t));
    const pontuados = frequencias.map((f, i) => {
      let pontuacao = 0;
      for (const termo of daConsulta) {
        const tf = f.get(termo);
        if (!tf) continue;
        pontuacao += (idf(termo) * tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * tamanhos[i]!) / tamanhoMedio));
      }
      return { item: itens[i]!, pontuacao };
    });
    return pontuados
      .filter((r) => r.pontuacao > 0)
      .sort((x, y) => y.pontuacao - x.pontuacao)
      .slice(0, k);
  };
}

/**
 * Fusão por posição recíproca (RRF): cada lista dá a um item 1/(c + posição), e as notas somam.
 * Junta buscas de escalas diferentes (cosseno e BM25) sem calibrar uma contra a outra. c = 60 é o
 * valor do artigo original e o padrão de bibliotecas como o Qdrant. Com `pesos`, a nota de cada
 * lista é multiplicada pelo peso dela (1 se faltar): a busca mais confiável pesa mais.
 */
export function fundirPorPosicao<T>(listas: T[][], chave: (item: T) => string, c = 60, pesos: number[] = []): ResultadoLexico<T>[] {
  const notas = new Map<string, ResultadoLexico<T>>();
  for (const [l, lista] of listas.entries()) {
    lista.forEach((item, i) => {
      const id = chave(item);
      const atual = notas.get(id) ?? { item, pontuacao: 0 };
      atual.pontuacao += (pesos[l] ?? 1) / (c + i + 1);
      notas.set(id, atual);
    });
  }
  return [...notas.values()].sort((x, y) => y.pontuacao - x.pontuacao);
}
