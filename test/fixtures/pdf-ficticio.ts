/** Linha a escrever no PDF, na posição do PDF (y medido da base da página). */
export interface LinhaFicticia {
  x: number;
  y: number;
  tamanho: number;
  texto: string;
}

const escapar = (texto: string) => texto.replace(/[\\()]/g, (c) => `\\${c}`);

/**
 * Gera um PDF mínimo, uma página por lista de linhas, com Helvetica em WinAnsiEncoding.
 * Serve para testar a leitura de posições sem depender de PDF real de norma.
 */
export function gerarPdf(paginas: LinhaFicticia[][]): Uint8Array {
  const objetos: string[] = [];
  const fonte = 3;
  const primeiraPagina = 4;
  const kids = paginas.map((_, i) => `${primeiraPagina + 2 * i} 0 R`).join(" ");
  objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objetos[2] = `<< /Type /Pages /Kids [${kids}] /Count ${paginas.length} >>`;
  objetos[fonte] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  paginas.forEach((linhas, i) => {
    const pagina = primeiraPagina + 2 * i;
    const conteudo = linhas
      .map((l) => `BT /F1 ${l.tamanho} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${escapar(l.texto)}) Tj ET`)
      .join("\n");
    objetos[pagina] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ` +
      `/Resources << /Font << /F1 ${fonte} 0 R >> >> /Contents ${pagina + 1} 0 R >>`;
    objetos[pagina + 1] = `<< /Length ${Buffer.byteLength(conteudo, "latin1")} >>\nstream\n${conteudo}\nendstream`;
  });

  // latin1: um caractere por byte, então o tamanho da string é o deslocamento no arquivo.
  let pdf = "%PDF-1.4\n";
  const deslocamentos: number[] = [];
  for (let n = 1; n < objetos.length; n++) {
    deslocamentos[n] = pdf.length;
    pdf += `${n} 0 obj\n${objetos[n]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objetos.length}\n0000000000 65535 f \n`;
  for (let n = 1; n < objetos.length; n++) pdf += `${String(deslocamentos[n]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new Uint8Array(Buffer.from(pdf, "latin1"));
}
