import { criarServidorMcp } from "../../src/mcp/servidor.js";
import { servirPorStdio } from "../../src/mcp/transportes.js";
import { IndiceDoCorpus } from "../../src/rag/corpus.js";
import { montarTrechos } from "../../src/rag/trechos.js";
import { normaFicticia } from "./norma-ficticia.js";

/** Servidor MCP por stdio com a norma fictícia, para o teste iniciar como processo filho. */
const trechos = montarTrechos(normaFicticia);
servirPorStdio(() =>
  criarServidorMcp({
    buscar: async (consulta, k) => {
      // Ruído de propósito: sem a proteção do stdout, esta linha quebraria o protocolo.
      console.log(`buscando ${consulta}`);
      return trechos.slice(0, k).map((t) => ({ ...t, pontuacao: 0.5 }));
    },
    normas: [normaFicticia],
    indice: new IndiceDoCorpus([normaFicticia]),
    k: 8,
  }),
);
console.log("servidor fictício pronto");
