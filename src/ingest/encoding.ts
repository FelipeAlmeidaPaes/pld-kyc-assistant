/**
 * Páginas do Planalto costumam vir em windows-1252. Decodificar como UTF-8
 * corrompe todo "ç", "ã" e "º", e o erro só aparece depois, na busca.
 *
 * Sem cabeçalho nem <meta> (caso de l9613compilado.htm, l7492.htm e l13810.htm),
 * só assume UTF-8 se os bytes forem UTF-8 válido; senão, windows-1252.
 */
export function detectarCharset(bytes: Uint8Array, contentType: string | null): string {
  const doCabecalho = contentType?.match(/charset=["']?([\w-]+)/i)?.[1];
  if (doCabecalho) return doCabecalho.toLowerCase();

  // O <meta> está no começo do documento e é ASCII em qualquer charset compatível.
  const inicio = new TextDecoder("latin1").decode(bytes.subarray(0, 4096));
  const doMeta = inicio.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1];
  if (doMeta) return doMeta.toLowerCase();

  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return "utf-8";
  } catch {
    return "windows-1252";
  }
}

// Faixa 0x80-0x9F do windows-1252. Os bytes 0x81, 0x8D, 0x8F, 0x90 e 0x9D não têm caractere.
const WINDOWS_1252: Record<number, string> = {
  0x80: "\u20ac", 0x82: "\u201a", 0x83: "\u0192", 0x84: "\u201e", 0x85: "\u2026", 0x86: "\u2020", 0x87: "\u2021",
  0x88: "\u02c6", 0x89: "\u2030", 0x8a: "\u0160", 0x8b: "\u2039", 0x8c: "\u0152", 0x8e: "\u017d", 0x91: "\u2018",
  0x92: "\u2019", 0x93: "\u201c", 0x94: "\u201d", 0x95: "\u2022", 0x96: "\u2013", 0x97: "\u2014", 0x98: "\u02dc",
  0x99: "\u2122", 0x9a: "\u0161", 0x9b: "\u203a", 0x9c: "\u0153", 0x9e: "\u017e", 0x9f: "\u0178",
};
// Rótulos que a especificação de encodings do WHATWG trata como windows-1252.
const ROTULOS_WINDOWS_1252 = new Set(["windows-1252", "cp1252", "x-cp1252", "latin1", "iso-8859-1", "iso8859-1", "us-ascii", "ascii"]);

/**
 * windows-1252 decodificado à mão. No Node 22.22, `new TextDecoder("windows-1252")` trata
 * 0x80-0x9F como ISO-8859-1 e devolve caracteres de controle: o travessão de "I – as bolsas"
 * (lei 9.613, art. 9º) virava U+0096 e o inciso não era reconhecido.
 */
function decodificarWindows1252(bytes: Uint8Array): string {
  return new TextDecoder("latin1").decode(bytes).replace(/[\u0080-\u009f]/g, (c) => WINDOWS_1252[c.charCodeAt(0)] ?? c);
}

export function decodificar(bytes: Uint8Array, contentType: string | null = null): string {
  const charset = detectarCharset(bytes, contentType);
  if (ROTULOS_WINDOWS_1252.has(charset)) return decodificarWindows1252(bytes);
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    // Rótulo de charset desconhecido pelo TextDecoder.
    return new TextDecoder("utf-8").decode(bytes);
  }
}
