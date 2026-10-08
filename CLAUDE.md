# CLAUDE.md

Contexto do projeto para sessões do Claude Code. A seção "Estado atual" muda a cada sessão; o resto é estável.

## O projeto
Assistente de perguntas e respostas sobre normas brasileiras de PLD/FT e antifraude, com citação obrigatória do dispositivo e recusa quando a base não cobre a pergunta. É portfólio de IA no GitHub e evolui junto com os módulos da pós-graduação do autor:

| Versão | Módulos da pós | Entrega |
|---|---|---|
| v1 | 02 (APIs de LLM), 08 (arquitetura) | RAG com citação e recusa, avaliação e custo por consulta |
| v2 | 03 (MCP) | Servidor MCP expondo a busca, validado com a mesma avaliação |
| v3 | 04, 06 (agentes) | Agente que usa o servidor MCP, comparado com o RAG direto |
| Segurança | 10 | Prompt injection, testes adversariais, governança |

Citação obrigatória e recusa são requisitos da v1, não do módulo 10.

## Comandos
```bash
npm install
npm test                 # Vitest
npm run typecheck        # tsc --noEmit
npm run ingest -- <id>   # baixa e normaliza uma fonte de corpus/fontes.json
npm run ingest -- <id> --arquivo pagina.html   # usa documento salvo (HTML do Planalto ou PDF compilado do BCB)
docker compose up -d     # Qdrant em localhost:6333
npm run indexar          # cria as coleções das três variantes no Qdrant (~70 s; baixa o e5 na primeira vez)
npm run servidor         # POST /<variante>/buscar e /<variante>/perguntar em localhost:3000
npm run avaliacao:revisao   # confere avaliacao/perguntas.json contra o corpus e gera avaliacao/revisao.md
npm run avaliar -- <rótulo>            # roda a avaliação nas três variantes (Gemini, sem fallback); mesmo rótulo retoma
npm run avaliar -- <rótulo> --sem-llm  # só a busca, sem cota (~10 s); também --variantes, --perguntas, --so-relatorio
```

Na sessão na nuvem, o Docker não sobe sozinho e o Docker Hub costuma responder 429 (limite de pulls anônimos):
```bash
dockerd > /tmp/dockerd.log 2>&1 &
docker pull mirror.gcr.io/qdrant/qdrant:v1.19.2 && docker tag mirror.gcr.io/qdrant/qdrant:v1.19.2 qdrant/qdrant:v1.19.2
docker compose up -d
```

## Estrutura
- `corpus/fontes.json`: manifesto das normas (id, sigla, URL oficial, formato do parser, `urlVerificada`)
- `corpus/normalized/`: texto normalizado por norma, versionado no Git, com `documento` (de onde veio) e `sha256`. `corpus/raw/` (HTML, PDF e JSON brutos) é ignorado. Hoje: as seis normas do corpus.
- `src/corpus/types.ts`: `Fonte`, `Artigo`, `Dispositivo`, `NormaNormalizada`
- `src/ingest/dispositivos.ts`: parser de dispositivos (artigo, parágrafo, inciso, alínea, item), comum ao Planalto e ao BCB, e `verificarArtigos`
- `src/ingest/html.ts`: linhas de texto visível de um HTML, sem texto riscado
- `src/ingest/planalto.ts`: ruído do firewall do Planalto e `parsePlanalto`
- `src/ingest/pdf.ts`: linhas do PDF (pdfjs) e remontagem dos parágrafos pela geometria
- `src/ingest/bcb.ts`: API do BCB, escolha do PDF compilado, corte da assinatura, `paragrafosSoltos`
- `src/ingest/encoding.ts`: detecção de charset (Planalto costuma usar windows-1252) e decodificação manual da faixa 0x80-0x9F, que o `TextDecoder` do Node 22.22 entrega como controle C1
- `src/ingest/cli.ts`: CLI de ingestão
- `src/rag/`: base comum das três variantes (ADR 0007): `trechos.ts` (um trecho por dispositivo, com contexto; texto corrido para o divisor padrão), `embeddings.ts` (e5 com prefixos), `prompt.ts`, `citacoes.ts` e `resposta.ts` (validação de citação e regras de recusa), `config.ts`, `tipos.ts`
- `src/rag/manual/`: índice e busca com o cliente do Qdrant, cliente de chat sobre `fetch`, pipeline
- `src/rag/langchain/`: `EmbeddingsE5`, documentos e indexação pelo `QdrantVectorStore`, `ChatOpenAI` com saída estruturada e cadeia em LCEL
- `src/rag/montar.ts`, `servidor.ts` (Fastify), `cli-indexar.ts` (repete até 3 vezes a variante que falhar), `cli-servidor.ts`
- `avaliacao/perguntas.json`: conjunto de avaliação (fonte da verdade). `avaliacao/revisao.md`: gerado dele, com o texto de cada dispositivo esperado, para o autor validar pelo celular; um teste falha se estiver desatualizado
- `src/avaliacao/`: esquema e conferência do conjunto (`perguntas.ts`: todo dispositivo citado tem de estar no índice, na grafia exata do corpus), `revisao.ts`, `cli-revisao.ts`; executor com ritmo e retomada (`executor.ts`), dispositivos de cada trecho recuperado, inclusive do divisor padrão, localizado no texto corrido (`cobertura.ts`), `metricas.ts`, `relatorio.ts`, `cli-avaliar.ts`
- `avaliacao/execucoes/<rótulo>.jsonl` e `.md`: registros de cada execução (só recebem linhas novas; vale a mais recente de cada pergunta e variante) e o relatório
- `test/fixtures/llm-falso.ts`: servidor compatível com a API da OpenAI que grava as requisições; testa os dois clientes de chat sem chave
- `test/fixtures/norma-ficticia.ts`: norma normalizada fictícia para os testes do RAG
- `test/fixtures/planalto-ficticia.html`: norma fictícia que imita a estrutura do Planalto
- `test/fixtures/pdf-ficticio.ts`: gera PDF fictício para testar a leitura de posições
- `docs/adr/`: decisões de arquitetura (0001 a 0007)

## Decisões (detalhes em docs/adr)
- **Stack:** TypeScript, Node 22, ESM, `strict` (ADR 0001).
- **LLM:** Gemini nível gratuito como principal, OpenRouter como fallback, os dois pela API compatível com OpenAI (ADR 0002). Avaliação roda sem fallback. Toda resposta registra provedor e modelo.
- **Custo zero (exigência do autor, ADR 0002):** `GEMINI_MODEL=gemini-3.5-flash-lite`; no OpenRouter só modelo `:free` (a configuração recusa outro, salvo `OPENROUTER_PERMITIR_PAGO=sim`; a conta tem crédito comprado). Nada de apelido `-latest`. Nunca trocar para modelo pago sem o autor pedir.
- **Embeddings:** locais primeiro (família e5 via transformers.js), comparados com API pela avaliação; troca só com ganho de pelo menos 5 p.p. em recall@5 (ADR 0003).
- **Banco vetorial:** Qdrant em Docker, imagem fixada em v1.19.2; busca híbrida a avaliar (ADR 0004).
- **Corpus v1:** Lei 9.613/1998, Lei 7.492/1986, Lei 13.810/2019, Circular BCB 3.978/2020, Carta Circular BCB 4.001/2020, Resolução Conjunta CMN/BCB 6/2023 (ADR 0005).
- **PDF do BCB:** `pdfjs-dist` em versão exata, parágrafos remontados pela geometria (ADR 0006). Aceito pelo autor "por enquanto"; revisar se aparecer PDF que não leia bem.
- **Variantes (ADR 0007):** `manual` (sem framework), `langchain` (LangChain.js com os nossos trechos) e `langchain-padrao` (divisor padrão do LangChain). Iguais: corpus, embeddings e5, LLM, instruções, esquema da saída, regra de recusa e citação. Muda: a orquestração e, no padrão, a divisão do texto. Dependências do RAG em versão exata.
- **Avaliação (ADR 0008):** só perguntas validadas; só o provedor principal, sem fallback; 5 s entre chamadas; busca registrada até a posição 20; recall@5, acerto@5, MRR@20, falsa recusa, recusa correta, citações pertinentes e cobertura, tokens, custo e latência. Acerto do conteúdo e `naoDeve` ainda não são medidos (pedem juiz).
- **Índice:** dispositivo sem texto próprio (revogado, vigência encerrada, só "(VETADO)") fica no texto normalizado e não entra no índice (ADR 0005). "(Vetado)" no meio de texto válido fica.

## Fontes oficiais: como baixar
- **Planalto:** o firewall (F5) derruba a conexão se o User-Agent não começar com `Mozilla/5.0`; com `curl` padrão a resposta é vazia, o que parece bloqueio de rede e não é. O F5 também injeta `<script id="f5_cspm">` com token aleatório em cada resposta; `removerRuidoDoFirewall` tira o script antes do hash. As páginas não declaram charset (nem cabeçalho nem `<meta>`) e vêm em windows-1252.
- **Planalto, HTML:** `<p>` sem fechar e quebras de linha no meio do dispositivo ("I - <quebra> texto"). Às vezes o "Parágrafo único." vem no mesmo `<p>` do caput (lei 13.810). Link "Vigência" sem parênteses é anotação. A lei 7.492 usa título em caixa alta sem "CAPÍTULO".
- **BCB:** `exibenormativo` é uma SPA. Os dados vêm de `https://www.bcb.gov.br/api/conteudo/app/normativos/exibenormativo?p1=<tipo>&p2=<número>` (JSON). O campo `Texto` é o **texto original**, sem as alterações (Circular 3.978: não tem o art. 23-A e traz o art. 68 revogado com a redação antiga).
- **BCB, texto compilado:** só em PDF, em `https://normativos.bcb.gov.br/Lists/Normativos/Attachments/<Id>/<arquivo>`. O campo `Documentos` lista `<nome>;<KB>#;<nome>;<KB>#;...`, com nomes `<prefixo>_v<N>_<O|L|P>.pdf`: `O` original, `L` compilado limpo (só o vigente), `P` compilado com a redação anterior junto. O CLI usa o `L` da maior versão; sem PDF, usa o HTML da API só se `Atualizacoes` estiver vazio, e recusa norma revogada ou cancelada. Normas com versões em HTML aparecem em `buscaversoes?p1=<Id>` e `exibeversao?p1=<Id>&p2=<versão>&p3=Vigente`.
- **BCB, PDF:** margem em x≈85, recuo de parágrafo em x≈156, linhas a ~15 pt e parágrafos a ~21 pt, cabeçalho e rodapé com fonte menor. Depois do último artigo vêm assinatura e "Este texto não substitui o publicado no DOU", cortados por `cortarFecho`. Há itens ("1.") dentro de alínea (Circular 3.978, art. 24) e alíneas de duas letras ("aa)", Carta Circular 4.001, art. 1º, IV).

## Regras do domínio
- Nunca escrever texto de norma de memória, nem em teste ou exemplo. Teste usa a norma fictícia; dado real vem da fonte oficial.
- Sempre o texto compilado. Texto riscado (revogado) é descartado; dispositivo só com "(Revogado)" fica marcado como `revogado`.
- Citação no formato `<sigla>, <caminho>`, ex.: `Lei 9.613/1998, art. 1º, § 2º, I`; com item, `Circular BCB 3.978/2020, art. 24, § 3º, VI, g, 1`. Até o 9 o artigo é ordinal (1º); do 10 em diante, cardinal (10).
- O conjunto de avaliação (gabarito) é rascunhado pelo Claude e validado pelo autor, dispositivo por dispositivo. Gabarito gerado por LLM sem revisão não vale.
- No conjunto: `dispositivos` são os exigidos (base do recall e do MRR), `aceitos` são relevantes que podem ser citados sem erro, `naoDeve` é o que a resposta não pode afirmar. Pergunta sem o nome da norma nem o número do artigo; o original fica em `perguntaOriginal`. Só o autor marca `validado`.

## Convenções
- Código, comentários, mensagens e documentação em português. Mensagens de commit em inglês, seguindo o histórico.
- Imports com extensão `.js` (ESM com `nodenext`).
- Antes de commitar: `npm run typecheck` e `npm test`.
- Branch com nome legível, que diga o que ela faz, sem "claude" e sem sufixo aleatório (pedido do autor). A plataforma cria a sessão numa branch `claude/...-<sufixo>`: trabalhar numa branch nova com nome descritivo.

## Estado atual (2026-10-08, terceira sessão)
- **Branch:** `avaliacao-v1`, a partir da `main` depois do PR #2: correções do corpus, retentativa da indexação, conjunto de avaliação, executor e avaliação de base. Sem PR: o autor não pediu. A branch remota antiga `claude/test-domain-connection-7yur2q` aponta para um commit já contido nesta; apagá-la foi bloqueado pela permissão da sessão.
- **Chaves:** o autor passou as chaves do Gemini e do OpenRouter pelo chat; estão no `.env` (fora do Git, permissão 600). Foram expostas no histórico da conversa: recomendado gerar novas e apagar estas.
- **Rede e ambiente:** como na sessão anterior. O `.npmrc` evita o download de binários CUDA do `onnxruntime-node`. As coleções do Qdrant ficam no volume do Docker e sobrevivem ao reinício da sessão; o Docker precisa ser religado (ver Comandos).
- **Pronto:**
  - Corpus da v1 (seis normas) e ingestão. Corrigidos nesta sessão: travessão em windows-1252 perdido pelo Node (a Lei 9.613, art. 9º, parágrafo único, I, estava colado no parágrafo) e nota "(Transformado em § 1º ...)" no texto da Circular 3.978, art. 49, § 1º. Índice refeito: 939 pontos em `manual` e `langchain`, 196 no padrão, nenhum truncado.
  - As três variantes do RAG, com `/buscar` e `/perguntar`, testadas de ponta a ponta com o Gemini real (`gemini-3.5-flash-lite`) e com o reserva do OpenRouter (`nvidia/nemotron-3-super-120b-a12b:free`). Uso do OpenRouter: US$ 0.
  - Custo zero conferido: projeto do Gemini no nível gratuito, sem faturamento (AI Studio, 2026-10-08); chave do OpenRouter com limite total de US$ 0, e os modelos `:free` funcionam com ela. Trava também na configuração (só `:free` no OpenRouter, sem `-latest` no Gemini).
  - Conjunto de avaliação: as 30 perguntas do autor, reescritas sem o nome da norma, mais 6 fora do corpus (f01 a f06). Gabaritos conferidos no texto: 11 conferem, 12 ajustados, 1 errado (q19), 6 sem base no texto. Validado pelo autor em bloco ("Tudo ok").
  - Executor e relatório (ADR 0008). Execuções gravadas: `busca-base` (só busca) e `base` (Gemini, 108 chamadas, 16 min, nenhum erro; um 503 absorvido pela nova tentativa).
  - 107 testes.
- **Achados:**
  - `manual` e `langchain` mandam o mesmo pedido (mesmos tokens com o Gemini real) e recuperam os mesmos trechos; detalhes na ADR 0007.
  - **Falha de busca:** incisos do mesmo artigo carregam o mesmo caput como contexto e ocupam todas as vagas. Em "Por quanto tempo a instituição deve conservar os registros das operações?", os 5 primeiros são do art. 28 da Circular 3.978 (o que o registro deve conter); o trecho que responde (art. 67, III) está em 12º, e a Lei 9.613, art. 10, § 2º, fora dos 40 primeiros. O modelo recusou corretamente. É a q05 do conjunto. Candidatos a correção, a medir na avaliação: limitar trechos por artigo, MMR (o LangChain tem `maxMarginalRelevanceSearch`), busca híbrida, k maior.
  - **Avaliação de base** (`avaliacao/execucoes/base.md`):

    | variante | recall@5 | acerto@5 | MRR@20 | falsa recusa | recusa correta | citações pertinentes | tokens de entrada |
    |---|---|---|---|---|---|---|---|
    | manual | 42% | 60% | 0,40 | 13/30 | 6/6 | 28/31 | 1.008 |
    | langchain | 42% | 60% | 0,40 | 12/30 | 6/6 | 30/33 | 1.008 |
    | langchain-padrao | 59% | 70% | 0,53 | 15/30 | 6/6 | 18/24 | 1.394 |
  - **A busca é o gargalo:** em `manual`, 9 das 13 recusas indevidas são de perguntas sem nenhum dispositivo exigido entre os 5 trechos; 2 trouxeram só parte (q12, q13: a definição do art. 2º da Lei 13.810 não veio, e a regra 3 do prompt manda recusar resposta parcial); 2 trouxeram tudo (q08, ver pendências; q10, ruído do modelo). No divisor padrão, 6 recusas com tudo recuperado, quase todas "citação não confere": o modelo erra o caminho ao deduzi-lo do texto.
  - **O modelo não é determinístico:** `manual` e `langchain` mandam o mesmo pedido (749 tokens em q10, mesma busca), e em q10 um recusou e o outro respondeu; em q18 citaram conjuntos diferentes. Diferença de uma pergunta entre variantes é ruído.
  - **Latência não compara variantes:** nas três, cada geração leva ~1 s ou ~10 s, sem padrão por variante. Provável fila ou limite do nível gratuito do Gemini. Nas perguntas da Carta Circular 4.001 (q21 a q25), `manual` e `langchain` não acham o dispositivo exigido entre os 20 primeiros: as alíneas do art. 39, I, da Circular 3.978 tomam as vagas, e o contexto longo repetido (caput e inciso) dilui o texto curto da alínea. Hipótese, não provada.
  - **Limitar trechos por artigo piora:** simulado sobre os 20 primeiros gravados, recall@5 cai de 42% para 32% (limite 1) e 39% (limite 2). Várias perguntas exigem incisos do mesmo artigo, e o que falta nem está entre os 20. Candidatos que sobram: busca híbrida (termos como "fragmentação" casariam), texto indexado com menos contexto, embedding maior ou por API (ADR 0003).
  - Pontuação do melhor trecho em `manual`: cobertas de 0,872 a 0,913, fora do corpus de 0,838 a 0,864. Um limiar perto de 0,868 separaria estas 36, mas com 6 perguntas fora do corpus ficaria ajustado a elas.
  - No divisor padrão o modelo deduz o caminho do dispositivo pelo texto e às vezes erra (ex.: "parágrafo único, I, I-A", ou a Lei 9.613 citada com o artigo errado); a validação recusa a resposta inteira.
  - Res. Conjunta 6, art. 8º, II, remete ao "art. 2º, § 6º, inciso II", mas o § 6º não tem incisos no texto do BCB (conferido no JSON bruto da API). É da norma, não do parser.
  - Carta Circular 4.001, art. 1º, III, f, termina em "et c." (espaço do PDF dentro de "etc."). Cosmético; não corrigido.
- **Não validado:**
  - A falha "fetch failed" da indexação apareceu em 2 de ~7 rodadas, sempre a primeira depois de tempo parado. Hipótese: conexão ociosa fechada pelo Qdrant. Há retentativa no CLI; a causa não foi provada.
  - Leis do Planalto e Res. Conjunta 6 conferidas por heurística, não contra um segundo extrator.

## Próximos passos
1. Aplicar as correções de gabarito que o autor aprovar (ver pendências) e refazer o relatório (`npm run avaliar -- base --so-relatorio`).
2. Corrigir a busca, medindo com `--sem-llm` contra `busca-base` (recall@5 de 42% em `manual`): busca híbrida, texto indexado com menos contexto, embedding maior. Limite por artigo já foi descartado.
3. Com a busca melhor, nova execução com LLM e comparação com `base`. Repetir uma execução para medir o ruído do modelo.
4. Decidir o juiz do conteúdo da resposta e do `naoDeve` (pessoa ou LLM de outra família, fixo, ADR 0002).
5. Limiar de recusa sem LLM, depois de ter mais perguntas fora do corpus.

## Pendências com o autor
- Gerar chaves novas: as do `.env` são as que passaram pelo chat.
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
- Correções de gabarito achadas na avaliação de base (erros do rascunho do Claude, a aprovar):
  - q22: a Carta Circular 4.001, art. 1º, I, k, l e m, também trata de fracionamento (saques abaixo do limite em cinco dias úteis; dois ou mais saques ou depósitos para evitar a identificação). A observação dizia que a norma não fala em burlar a identificação: errado. Proposta: incluir os três no gabarito e em `aceitos`.
  - q23: a Circular 3.978, art. 39, I, c (operações incompatíveis com a capacidade financeira, renda, faturamento e patrimônio) responde à pergunta. Proposta: incluir em `aceitos`.
  - q07 e q08: a regra 3 do prompt manda recusar quando os trechos respondem só em parte, e a lei não define gestão fraudulenta nem temerária. Proposta: aceitar a recusa como resposta correta nessas duas.
