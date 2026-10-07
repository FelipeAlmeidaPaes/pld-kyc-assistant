import type { Artigo } from "../corpus/types.js";
import { parseDispositivos } from "./dispositivos.js";
import { extrairLinhas } from "./html.js";

// Script que o firewall (F5) do Planalto injeta com um token aleatório a cada resposta.
const SCRIPT_DO_FIREWALL = /<script id="f5_cspm">[\s\S]*?<\/script>/g;

/**
 * Tira do HTML bruto o que muda a cada download sem mudar a norma. Sem isso, o SHA-256
 * de NormaNormalizada muda em toda captura e deixa de servir para auditar a versão.
 * Opera em latin1, que preserva qualquer byte, para não depender do charset da página.
 */
export function removerRuidoDoFirewall(bytes: Uint8Array): Buffer {
  return Buffer.from(Buffer.from(bytes).toString("latin1").replace(SCRIPT_DO_FIREWALL, ""), "latin1");
}

/** Converte uma página de lei do Planalto (texto compilado) em artigos e dispositivos. */
export function parsePlanalto(html: string): Artigo[] {
  return parseDispositivos(extrairLinhas(html));
}
