export type Formato = "planalto" | "bcb";

/** Entrada do manifesto corpus/fontes.json. */
export interface Fonte {
  id: string;
  titulo: string;
  /** Forma curta usada nas citações, ex.: "Lei 9.613/1998". */
  sigla: string;
  orgao: string;
  formato: Formato;
  url: string;
  /** false enquanto ninguém conferiu que a URL aponta para o texto vigente. */
  urlVerificada: boolean;
}

export type TipoDispositivo = "caput" | "paragrafo" | "inciso" | "alinea";

export interface Dispositivo {
  tipo: TipoDispositivo;
  /** Rótulo isolado: "caput", "§ 1º", "parágrafo único", "I", "a". */
  rotulo: string;
  /** Caminho citável dentro da norma, ex.: "art. 1º, § 1º, II, a". */
  caminho: string;
  texto: string;
  /** Anotações do texto compilado, ex.: "(Redação dada pela Lei nº 12.683, de 2012)". */
  notas: string[];
  revogado: boolean;
}

export interface Artigo {
  /** "1º", "10", "17-A". */
  numero: string;
  /** "art. 1º". */
  rotulo: string;
  /** Agrupamentos em que o artigo está, do mais amplo ao mais específico, ex.: "CAPÍTULO II - ... > Seção I - ...". */
  agrupamento: string | null;
  dispositivos: Dispositivo[];
}

export interface NormaNormalizada {
  fonte: Fonte;
  /** Data de referência: dia em que o texto compilado foi capturado (AAAA-MM-DD). */
  capturadoEm: string;
  /** SHA-256 do HTML bruto, para auditar de qual versão o texto saiu. */
  sha256: string;
  artigos: Artigo[];
}
