import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import { parseArgs } from "node:util";
import { buscarFonte } from "../corpus/fontes.js";
import type { Artigo, Fonte, NormaNormalizada } from "../corpus/types.js";
import {
  escolherFonteDoTexto,
  identificarNorma,
  type NormativoBcb,
  paragrafosSoltos,
  parseBcb,
  urlDoAnexo,
  urlDoNormativo,
} from "./bcb.js";
import { verificarArtigos } from "./dispositivos.js";
import { decodificar } from "./encoding.js";
import { extrairLinhas } from "./html.js";
import { lerLinhasDoPdf, montarParagrafos } from "./pdf.js";
import { parsePlanalto, removerRuidoDoFirewall } from "./planalto.js";

const USO = `Uso: npm run ingest -- <id-da-fonte> [--arquivo documento] [--data AAAA-MM-DD]

  --arquivo  lê o documento de um arquivo local em vez de baixar: HTML do Planalto,
             PDF compilado do BCB ou HTML do campo Texto da API do BCB
  --data     data de referência do texto; padrão: hoje`;

const RAIZ = new URL("../../", import.meta.url);

// O firewall do Planalto derruba a conexão quando o User-Agent não começa com "Mozilla/5.0".
const USER_AGENT = "Mozilla/5.0 (compatible; pld-kyc-assistant; projeto de estudo)";

/** Documento bruto de onde o texto saiu, já convertido em artigos. */
interface Captura {
  bytes: Uint8Array;
  documento: string;
  artigos: Artigo[];
  avisos: string[];
}

async function baixar(url: string): Promise<Buffer> {
  const resposta = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!resposta.ok) throw new Error(`Falha ao baixar ${url}: HTTP ${resposta.status}`);
  return Buffer.from(await resposta.arrayBuffer());
}

async function salvarBruto(nome: string, bytes: Uint8Array) {
  const pasta = new URL("corpus/raw/", RAIZ);
  await mkdir(pasta, { recursive: true });
  await writeFile(new URL(nome, pasta), bytes);
}

async function capturarPlanalto(fonte: Fonte, arquivo: string | undefined): Promise<Captura> {
  const bytes = removerRuidoDoFirewall(arquivo ? await readFile(arquivo) : await baixar(fonte.url));
  if (!arquivo) await salvarBruto(`${fonte.id}.html`, bytes);
  // O Planalto não declara charset no cabeçalho; decodificar() detecta pelos bytes.
  return { bytes, documento: arquivo ?? fonte.url, artigos: parsePlanalto(decodificar(bytes)), avisos: [] };
}

function artigosDoBcb(paragrafos: string[], avisos: string[] = []): Pick<Captura, "artigos" | "avisos"> {
  const soltos = paragrafosSoltos(paragrafos).map((p) => `parágrafo sem rótulo, colado no dispositivo anterior: "${p.slice(0, 80)}"`);
  return { artigos: parseBcb(paragrafos), avisos: [...avisos, ...soltos] };
}

async function artigosDoPdf(bytes: Uint8Array): Promise<Pick<Captura, "artigos" | "avisos">> {
  const linhas = await lerLinhasDoPdf(bytes);
  const { paragrafos, descartadas } = montarParagrafos(linhas);
  const paginas = new Set(linhas.map((l) => l.pagina)).size;
  // Cabeçalho e rodapé dão no máximo duas linhas por página; mais que isso pode ser texto perdido.
  const avisos =
    descartadas.length > 2 * paginas
      ? [`${descartadas.length} linhas com fonte menor descartadas em ${paginas} páginas; confira se alguma é texto da norma`]
      : [];
  return artigosDoBcb(paragrafos, avisos);
}

async function capturarBcb(fonte: Fonte, arquivo: string | undefined): Promise<Captura> {
  if (arquivo) {
    const bytes = await readFile(arquivo);
    if (extname(arquivo).toLowerCase() === ".pdf") return { bytes, documento: arquivo, ...(await artigosDoPdf(bytes)) };
    return { bytes, documento: arquivo, ...artigosDoBcb(extrairLinhas(decodificar(bytes))) };
  }

  const { tipo, numero } = identificarNorma(fonte.url);
  const urlDaApi = urlDoNormativo(tipo, numero);
  const resposta = await baixar(urlDaApi);
  await salvarBruto(`${fonte.id}.json`, resposta);
  const normativo = (JSON.parse(resposta.toString("utf-8")) as { conteudo: NormativoBcb[] }).conteudo[0];
  if (!normativo) throw new Error(`O BCB não devolveu a norma ${tipo} ${numero}.`);

  const origem = escolherFonteDoTexto(normativo);
  if ("pdf" in origem) {
    const url = urlDoAnexo(normativo.Id, origem.pdf);
    const bytes = await baixar(url);
    await salvarBruto(`${fonte.id}.pdf`, bytes);
    return { bytes, documento: url, ...(await artigosDoPdf(bytes)) };
  }
  const bytes = Buffer.from(origem.html, "utf-8");
  await salvarBruto(`${fonte.id}.html`, bytes);
  return { bytes, documento: urlDaApi, ...artigosDoBcb(extrairLinhas(origem.html)) };
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
  const captura =
    fonte.formato === "planalto" ? await capturarPlanalto(fonte, values.arquivo) : await capturarBcb(fonte, values.arquivo);
  const { artigos } = captura;
  if (artigos.length === 0) throw new Error("Nenhum artigo encontrado. Confira se o documento é o texto da norma.");

  const norma: NormaNormalizada = {
    fonte,
    capturadoEm: values.data ?? new Date().toISOString().slice(0, 10),
    documento: captura.documento,
    sha256: createHash("sha256").update(captura.bytes).digest("hex"),
    artigos,
  };
  const pastaNormalizada = new URL("corpus/normalized/", RAIZ);
  await mkdir(pastaNormalizada, { recursive: true });
  const destino = new URL(`${fonte.id}.json`, pastaNormalizada);
  await writeFile(destino, `${JSON.stringify(norma, null, 2)}\n`);

  const dispositivos = artigos.flatMap((a) => a.dispositivos);
  console.log(`${fonte.sigla}: ${artigos.length} artigos, ${dispositivos.length} dispositivos`);
  console.log(`  revogados: ${dispositivos.filter((d) => d.revogado).length}`);
  console.log(`  documento: ${captura.documento}`);
  console.log(`  salvo em ${destino.pathname}`);

  const avisos = [...captura.avisos, ...verificarArtigos(artigos)];
  if (!fonte.urlVerificada) avisos.unshift("URL da fonte ainda não verificada em corpus/fontes.json");
  for (const aviso of avisos) console.warn(`  aviso: ${aviso}`);
}

main().catch((erro: unknown) => {
  console.error(erro instanceof Error ? erro.message : erro);
  process.exit(1);
});
