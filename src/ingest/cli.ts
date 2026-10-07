import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { buscarFonte } from "../corpus/fontes.js";
import type { Fonte, NormaNormalizada } from "../corpus/types.js";
import { decodificar } from "./encoding.js";
import { parsePlanalto, removerRuidoDoFirewall, verificarArtigos } from "./planalto.js";

const USO = `Uso: npm run ingest -- <id-da-fonte> [--arquivo pagina.html] [--data AAAA-MM-DD]

  --arquivo  lê o HTML de um arquivo local em vez de baixar (útil se o site bloquear o download)
  --data     data de referência do texto; padrão: hoje`;

const RAIZ = new URL("../../", import.meta.url);

// O firewall do Planalto derruba a conexão quando o User-Agent não começa com "Mozilla/5.0".
const USER_AGENT = "Mozilla/5.0 (compatible; pld-kyc-assistant; projeto de estudo)";

async function obterHtml(fonte: Fonte, arquivo: string | undefined) {
  if (arquivo) {
    const bytes = removerRuidoDoFirewall(await readFile(arquivo));
    return { bytes, html: decodificar(bytes) };
  }

  const resposta = await fetch(fonte.url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!resposta.ok) throw new Error(`Falha ao baixar ${fonte.url}: HTTP ${resposta.status}`);
  const bytes = removerRuidoDoFirewall(new Uint8Array(await resposta.arrayBuffer()));

  const pastaBruta = new URL("corpus/raw/", RAIZ);
  await mkdir(pastaBruta, { recursive: true });
  await writeFile(new URL(`${fonte.id}.html`, pastaBruta), bytes);

  return { bytes, html: decodificar(bytes, resposta.headers.get("content-type")) };
}

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { arquivo: { type: "string" }, data: { type: "string" } },
  });
  const id = positionals[0];
  if (!id) {
    console.error(USO);
    process.exit(1);
  }

  const fonte = await buscarFonte(id);
  if (fonte.formato !== "planalto") {
    throw new Error(`Formato "${fonte.formato}" ainda não tem parser (fonte ${fonte.id}).`);
  }

  const { bytes, html } = await obterHtml(fonte, values.arquivo);
  const artigos = parsePlanalto(html);
  if (artigos.length === 0) throw new Error("Nenhum artigo encontrado. Confira se a página é o texto da norma.");

  const norma: NormaNormalizada = {
    fonte,
    capturadoEm: values.data ?? new Date().toISOString().slice(0, 10),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    artigos,
  };
  const pastaNormalizada = new URL("corpus/normalized/", RAIZ);
  await mkdir(pastaNormalizada, { recursive: true });
  const destino = new URL(`${fonte.id}.json`, pastaNormalizada);
  await writeFile(destino, `${JSON.stringify(norma, null, 2)}\n`);

  const dispositivos = artigos.flatMap((a) => a.dispositivos);
  console.log(`${fonte.sigla}: ${artigos.length} artigos, ${dispositivos.length} dispositivos`);
  console.log(`  revogados: ${dispositivos.filter((d) => d.revogado).length}`);
  console.log(`  salvo em ${destino.pathname}`);

  const avisos = verificarArtigos(artigos);
  if (!fonte.urlVerificada) avisos.unshift("URL da fonte ainda não verificada em corpus/fontes.json");
  for (const aviso of avisos) console.warn(`  aviso: ${aviso}`);
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
