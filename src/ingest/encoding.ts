/**
 * Páginas do Planalto costumam vir em windows-1252. Decodificar como UTF-8
 * corrompe todo "ç", "ã" e "º", e o erro só aparece depois, na busca.
 */
export function detectarCharset(bytes: Uint8Array, contentType: string | null): string {
  const doCabecalho = contentType?.match(/charset=["']?([\w-]+)/i)?.[1];
  if (doCabecalho) return doCabecalho.toLowerCase();

  // O <meta> está no começo do documento e é ASCII em qualquer charset compatível.
  const inicio = new TextDecoder("latin1").decode(bytes.subarray(0, 4096));
  const doMeta = inicio.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1];
  if (doMeta) return doMeta.toLowerCase();

  return "utf-8";
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
