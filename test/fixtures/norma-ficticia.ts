import type { Artigo, Dispositivo, NormaNormalizada } from "../../src/corpus/types.js";

/** Norma fictícia já normalizada, para testar o RAG sem texto real de norma. */
const d = (
  tipo: Dispositivo["tipo"],
  rotulo: string,
  caminho: string,
  texto: string,
  extra: Partial<Dispositivo> = {},
): Dispositivo => ({ tipo, rotulo, caminho, texto, notas: [], revogado: false, ...extra });

const artigos: Artigo[] = [
  {
    numero: "1º",
    rotulo: "art. 1º",
    agrupamento: "CAPÍTULO I - DAS REGRAS FICTÍCIAS",
    dispositivos: [
      d("caput", "caput", "art. 1º, caput", "A instituição fictícia deve manter cadastro dos clientes:"),
      d("inciso", "I", "art. 1º, I", "com nome completo;"),
      d("inciso", "II", "art. 1º, II", "", { revogado: true, notas: ["(Revogado pela Lei nº 88.888, de 2098)"] }),
      d("paragrafo", "§ 1º", "art. 1º, § 1º", "O cadastro fictício será revisto:"),
      d("inciso", "I", "art. 1º, § 1º, I", "a cada ano; ou"),
      d("alinea", "a", "art. 1º, § 1º, I, a", "quando houver mudança relevante, desde que:"),
      d("item", "1", "art. 1º, § 1º, I, a, 1", "a mudança seja comunicada."),
    ],
  },
  {
    numero: "2º",
    rotulo: "art. 2º",
    agrupamento: "CAPÍTULO II - DAS DISPOSIÇÕES FINAIS",
    dispositivos: [
      d("caput", "caput", "art. 2º, caput", "(VETADO)."),
      d("paragrafo", "parágrafo único", "art. 2º, parágrafo único", "O gerente (Vetado) responde pela regra fictícia."),
    ],
  },
];

export const normaFicticia: NormaNormalizada = {
  fonte: {
    id: "lei-99999",
    titulo: "Lei nº 99.999, de 1º de janeiro de 2099",
    sigla: "Lei 99.999/2099",
    orgao: "Presidência da República",
    formato: "planalto",
    url: "https://exemplo.invalid/l99999.htm",
    urlVerificada: true,
  },
  capturadoEm: "2099-01-01",
  documento: "https://exemplo.invalid/l99999.htm",
  sha256: "0".repeat(64),
  artigos,
};
