import { VARIANTES } from "../rag/tipos.js";
import { chaveDoPar, type RegistroDaAvaliacao } from "./executor.js";
import { amostraParaAuditoria, type Julgamento, julgamentosValidos, mensagemDoJulgamento } from "./juiz.js";
import { calcularAcerto, calcularMetricas, categoriaDaRecusa, type MetricasDaVariante, primeiraPosicao } from "./metricas.js";
import type { PerguntaDeAvaliacao } from "./perguntas.js";

const pct = (valor: number | null) => (valor === null ? "–" : `${Math.round(valor * 100)}%`);
const fracao = ({ quantas, de }: { quantas: number; de: number }) => (de === 0 ? "–" : `${quantas}/${de} (${pct(quantas / de)})`);
const dec = (valor: number | null, casas = 2) => (valor === null ? "–" : valor.toFixed(casas));
const seg = (ms: number | null) => (ms === null ? "–" : `${(ms / 1000).toFixed(1)} s`);
const linha = (celulas: (string | number)[]) => `| ${celulas.join(" | ")} |`;
const cabecalho = (titulos: string[]) => [linha(titulos), linha(titulos.map(() => "---"))];

/**
 * Relatório em Markdown de uma execução: métricas por variante e o resultado de cada pergunta.
 * Com julgamentos (`npm run julgar`), também o acerto do conteúdo das respostas.
 */
export function montarRelatorio(
  registros: RegistroDaAvaliacao[],
  perguntas: PerguntaDeAvaliacao[],
  todosOsJulgamentos: Julgamento[] = [],
): string {
  const porId = new Map(perguntas.map((p) => [p.id, p]));
  const julgamentos = julgamentosValidos(registros, todosOsJulgamentos);
  const juiz = [...julgamentos.values()][0]?.juiz;
  const variantes = VARIANTES.filter((v) => registros.some((r) => r.variante === v));
  const config = registros[0]?.configuracao;
  const k = config?.k ?? 5;
  const metricas = variantes.map((v) => calcularMetricas(v, registros, porId, k));
  const comResposta = registros.some((r) => r.resposta !== null);
  const datas = registros.map((r) => r.registradoEm).sort();

  const linhas = [
    `# Avaliação: ${registros[0]?.execucao ?? "(vazia)"}`,
    "",
    "Gerado por `npm run avaliar`. Não editar à mão.",
    "",
    `- Registros: ${registros.length}, de ${datas[0] ?? "–"} a ${datas.at(-1) ?? "–"}`,
    `- k = ${k} trechos ao modelo; busca registrada até a posição ${config?.profundidade ?? "–"}; limiar: ${config?.limiar ?? "desligado"}`,
    `- Embeddings: ${config?.modeloDeEmbeddings ?? "–"}; LLM: ${config?.modeloDeLlm ?? "nenhum (só busca)"}, sem fallback`,
    ...(config?.busca ? [`- Busca do experimento: ${config.busca}`] : []),
    juiz
      ? `- Conteúdo das respostas julgado por ${juiz.provedor}/${juiz.modelo} (\`npm run julgar\`), comparando com o gabarito`
      : "- Conteúdo das respostas ainda não julgado (`npm run julgar`).",
    "",
    `## Busca (perguntas cobertas)`,
    "",
    "Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.",
    "",
    ...cabecalho(["variante", "perguntas", `recall@${k}`, `acerto@${k}`, `MRR@${config?.profundidade ?? "–"}`]),
    ...metricas.map((m) => linha([m.variante, m.busca.cobertas, pct(m.busca.recallNoK), pct(m.busca.acertoNoK), dec(m.busca.mrr)])),
    "",
    "Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.",
    "",
    ...cabecalho(["variante", "cobertas", "fora do corpus"]),
    ...metricas.map((m) => {
      const faixa = (f: { min: number | null; mediana: number | null; max: number | null }) =>
        `${dec(f.min, 3)} / ${dec(f.mediana, 3)} / ${dec(f.max, 3)}`;
      return linha([m.variante, faixa(m.busca.melhorPontuacao.coberta), faixa(m.busca.melhorPontuacao["fora-do-corpus"])]);
    }),
  ];

  if (comResposta) {
    const categorias = [...new Set(metricas.flatMap((m) => Object.keys(m.resposta.motivosDeRecusa)))].sort();
    linhas.push(
      "",
      "## Resposta",
      "",
      ...cabecalho(["variante", "falsa recusa", "recusa correta (fora)", "citações pertinentes", "cobertura das citações", "erros"]),
      ...metricas.map((m) =>
        linha([
          m.variante,
          fracao(m.resposta.falsaRecusa),
          fracao(m.resposta.recusaCorreta),
          fracao(m.resposta.citacoesPertinentes),
          pct(m.resposta.coberturaDasCitacoes),
          m.comErro,
        ]),
      ),
      "",
      ...cabecalho(["variante", "tokens de entrada (média)", "tokens de saída (média)", "custo de tabela", "geração p50 / p95", "total p50 / p95"]),
      ...metricas.map((m) =>
        linha([
          m.variante,
          dec(m.resposta.tokensEntradaMedio, 0),
          dec(m.resposta.tokensSaidaMedio, 0),
          custo(m),
          `${seg(m.resposta.latenciaMs.geracaoP50)} / ${seg(m.resposta.latenciaMs.geracaoP95)}`,
          `${seg(m.resposta.latenciaMs.totalP50)} / ${seg(m.resposta.latenciaMs.totalP95)}`,
        ]),
      ),
    );
    if (categorias.length > 0) {
      linhas.push(
        "",
        "Motivos de recusa (todas as perguntas):",
        "",
        ...cabecalho(["variante", ...categorias]),
        ...metricas.map((m) => linha([m.variante, ...categorias.map((c) => m.resposta.motivosDeRecusa[c] ?? 0)])),
      );
    }
  }

  if (julgamentos.size > 0) {
    const acertos = variantes.map((v) => ({ variante: v, ...calcularAcerto(v, registros, porId, julgamentos) }));
    linhas.push(
      "",
      `## Conteúdo (juiz: ${juiz!.modelo})`,
      "",
      "Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.",
      "",
      ...cabecalho(["variante", "julgadas", "corretas", "parciais", "incorretas", "acerto fim a fim", "afirmou o que não devia"]),
      ...acertos.map((a) =>
        linha([
          a.variante,
          a.julgadas < a.aJulgar ? `${a.julgadas} de ${a.aJulgar}` : a.julgadas,
          a.corretas,
          a.parciais,
          a.incorretas,
          fracao(a.acertoFimAFim),
          a.afirmaramNaoDeve,
        ]),
      ),
    );
  }

  const doPar = new Map(registros.map((r) => [`${r.perguntaId}|${r.variante}`, r]));
  linhas.push(
    "",
    "## Por pergunta",
    "",
    "Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em \"respondeu\", citações pertinentes / feitas.",
    "",
    ...cabecalho(["id", "tipo", ...variantes]),
  );
  for (const p of perguntas) {
    const celulas = variantes.map((v) => celula(doPar.get(`${p.id}|${v}`), p, julgamentos.get(chaveDoPar(p.id, v))));
    if (celulas.every((c) => c === "")) continue;
    linhas.push(linha([p.id, p.tipo === "coberta" ? "coberta" : "fora", ...celulas]));
  }

  if (comResposta) {
    linhas.push("", "## Respostas");
    for (const p of perguntas) {
      const doPergunta = variantes.map((v) => [v, doPar.get(`${p.id}|${v}`)] as const).filter(([, r]) => r?.resposta || r?.erro);
      if (doPergunta.length === 0) continue;
      linhas.push("", `### ${p.id}: ${p.pergunta}`, "", `**Gabarito:** ${p.gabarito}`);
      for (const [variante, r] of doPergunta) {
        linhas.push("", `**${variante}:** ${textoDaResposta(r!)}`);
        const julgamento = julgamentos.get(chaveDoPar(p.id, variante));
        if (julgamento) linhas.push("", `> juiz: **${julgamento.veredito}**. ${julgamento.justificativa}${naoDeve(julgamento)}`);
      }
    }
  }
  return `${linhas.join("\n")}\n`;
}

function custo(m: MetricasDaVariante): string {
  if (m.resposta.custoTabelaUsd !== null) return `US$ ${m.resposta.custoTabelaUsd.toFixed(4)}`;
  return "sem preço configurado";
}

const naoDeve = (j: Julgamento) => (j.naoDeveAfirmados.length > 0 ? ` Afirmou o que não devia: ${j.naoDeveAfirmados.join("; ")}.` : "");

function celula(registro: RegistroDaAvaliacao | undefined, pergunta: PerguntaDeAvaliacao, julgamento?: Julgamento): string {
  if (!registro) return "";
  // Fora do corpus não há dispositivo exigido: só o desfecho.
  const posicao = pergunta.tipo === "coberta" ? `${primeiraPosicao(registro, pergunta) ?? "–"} · ` : "";
  const resposta = registro.resposta;
  if (registro.erro) return `${posicao}erro`;
  if (!resposta) return posicao.replace(/ · $/, "") || "·";
  if (resposta.recusa) {
    return `${posicao}recusou (${categoriaDaRecusa(resposta.motivoDaRecusa)}${pergunta.recusaAceita ? "; aceita" : ""})`;
  }
  const validas = new Set([...pergunta.dispositivos, ...pergunta.aceitos]);
  const citadas = resposta.citacoes.map((c) => `${c.sigla}, ${c.caminho}`);
  const veredito = julgamento ? `, ${julgamento.veredito}${julgamento.naoDeveAfirmados.length > 0 ? ", afirmou o que não devia" : ""}` : "";
  return `${posicao}respondeu ${citadas.filter((c) => validas.has(c)).length}/${citadas.length}${veredito}`;
}

function textoDaResposta(registro: RegistroDaAvaliacao): string {
  if (registro.erro) return `erro: ${registro.erro}`;
  const r = registro.resposta!;
  if (r.recusa) return `recusou (${r.motivoDaRecusa})`;
  return `${r.resposta} — citações: ${r.citacoes.map((c) => `${c.sigla}, ${c.caminho}`).join("; ")}`;
}

/**
 * Amostra para o autor auditar o juiz: cada item com a pergunta, o gabarito, a resposta e o
 * veredito. O autor responde no chat se concorda; a concordância mede quanto confiar no juiz.
 */
export function montarAuditoria(
  registros: RegistroDaAvaliacao[],
  perguntas: PerguntaDeAvaliacao[],
  todosOsJulgamentos: Julgamento[],
  tamanho: number,
): string {
  const porId = new Map(perguntas.map((p) => [p.id, p]));
  const doPar = new Map(registros.map((r) => [chaveDoPar(r.perguntaId, r.variante), r]));
  const julgamentos = [...julgamentosValidos(registros, todosOsJulgamentos).values()];
  const execucao = registros[0]?.execucao ?? "";
  const amostra = amostraParaAuditoria(julgamentos, tamanho, execucao);
  const linhas = [
    `# Auditoria do juiz: ${execucao}`,
    "",
    "Gerado por `npm run julgar`. Para cada item, diga no chat se concorda com o veredito (ex.: \"A3 discordo, é parcial\").",
    `Amostra de ${amostra.length} dos ${julgamentos.length} julgamentos: metade não "correta", metade "correta", sorteio fixo.`,
  ];
  amostra.forEach((j, i) => {
    const pergunta = porId.get(j.perguntaId)!;
    const resposta = doPar.get(chaveDoPar(j.perguntaId, j.variante))!.resposta!;
    linhas.push(
      "",
      `## A${i + 1} · ${j.perguntaId} · ${j.variante} · juiz: ${j.veredito}`,
      "",
      ...mensagemDoJulgamento(pergunta, resposta)
        .split("\n\n")
        .flatMap((parte) => [parte.replace(/^([^:]+):/, "**$1:**"), ""]),
      `**Justificativa do juiz:** ${j.justificativa}${naoDeve(j)}`,
    );
  });
  return `${linhas.join("\n")}\n`;
}
