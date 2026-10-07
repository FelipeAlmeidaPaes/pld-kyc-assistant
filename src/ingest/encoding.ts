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

export function decodificar(bytes: Uint8Array, contentType: string | null = null): string {
  const charset = detectarCharset(bytes, contentType);
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    // Rótulo de charset desconhecido pelo TextDecoder.
    return new TextDecoder("utf-8").decode(bytes);
  }
}
