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
npm run indexar          # cria as coleções das três variantes no Qdrant; --variantes manual,langchain indexa só essas
npm run servidor         # POST /<variante>/buscar e /<variante>/perguntar em localhost:3000
npm run avaliacao:revisao   # confere avaliacao/perguntas.json contra o corpus e gera avaliacao/revisao.md
npm run avaliar -- <rótulo>            # roda a avaliação nas três variantes (Gemini, sem fallback); mesmo rótulo retoma
npm run avaliar -- <rótulo> --sem-llm  # só a busca; também --variantes, --perguntas, --so-relatorio
npm run julgar -- <rótulo>             # juiz (OpenRouter :free) julga o conteúdo das respostas; gera <rótulo>.auditoria.md
npm run avaliacao:experimentos -- --modelo <id> [--experimentos densa,bm25-radical5,hibrida,...]   # busca em memória, sem Qdrant
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
- `src/rag/`: base comum das três variantes (ADR 0007): `conferencia.ts` (prazos, percentuais, valores e datas da resposta contra o texto citado, ADR 0012), `trechos.ts` (um trecho por dispositivo, com contexto, e as partes dele; texto corrido para o divisor padrão), `embeddings.ts` (e5 com prefixos e `criarGerador`, que escolhe pelo nome do modelo), `embeddings-gemini.ts` (API do Gemini, em lote, com tipo de tarefa), `cache-de-vetores.ts` (vetor por hash do texto, em `.cache/vetores/`), `bm25.ts` (busca lexical e fusão RRF, usadas nos experimentos), `prompt.ts`, `citacoes.ts` e `resposta.ts` (validação de citação e regras de recusa), `config.ts`, `tipos.ts`
- `src/rag/manual/`: índice e busca com o cliente do Qdrant, cliente de chat sobre `fetch`, pipeline
- `src/rag/langchain/`: `EmbeddingsDoGerador`, documentos e indexação pelo `QdrantVectorStore`, `ChatOpenAI` com saída estruturada e cadeia em LCEL
- `src/rag/montar.ts`, `servidor.ts` (Fastify), `cli-indexar.ts` (repete até 3 vezes a variante que falhar), `cli-servidor.ts`
- `avaliacao/perguntas.json`: conjunto de avaliação (fonte da verdade). `avaliacao/revisao.md`: gerado dele, com o texto de cada dispositivo esperado, para o autor validar pelo celular; um teste falha se estiver desatualizado
- `src/avaliacao/`: esquema e conferência do conjunto (`perguntas.ts`: todo dispositivo citado tem de estar no índice, na grafia exata do corpus), `revisao.ts`, `cli-revisao.ts`; executor com ritmo e retomada (`executor.ts`), dispositivos de cada trecho recuperado, inclusive do divisor padrão, localizado no texto corrido (`cobertura.ts`), `metricas.ts`, `relatorio.ts` (também a auditoria do juiz), `cli-avaliar.ts`; juiz do conteúdo (`juiz.ts`, `cli-julgar.ts`)
- `avaliacao/execucoes/<rótulo>.jsonl` e `.md`: registros de cada execução (só recebem linhas novas; vale a mais recente de cada pergunta e variante) e o relatório; `<rótulo>.julgamentos.jsonl` e `<rótulo>.auditoria.md`: julgamentos do juiz e a amostra para o autor auditar
- `avaliacao/experimentos/exp-<modelo>-<busca>.jsonl` e `.md`: experimentos de busca (`cli-experimentos-busca.ts`), no mesmo formato
- `test/fixtures/llm-falso.ts`: servidor compatível com a API da OpenAI que grava as requisições; testa os dois clientes de chat sem chave
- `test/fixtures/norma-ficticia.ts`: norma normalizada fictícia para os testes do RAG
- `test/fixtures/planalto-ficticia.html`: norma fictícia que imita a estrutura do Planalto
- `test/fixtures/pdf-ficticio.ts`: gera PDF fictício para testar a leitura de posições
- `docs/adr/`: decisões de arquitetura (0001 a 0012)
- `.claude/hooks/session-start.sh` e `.claude/settings.json`: gancho de início de sessão na nuvem (autor dos commits e `npm install`)

## Decisões (detalhes em docs/adr)
- **Stack:** TypeScript, Node 22, ESM, `strict` (ADR 0001).
- **LLM:** Gemini nível gratuito como principal, OpenRouter como fallback, os dois pela API compatível com OpenAI (ADR 0002). Avaliação roda sem fallback. Toda resposta registra provedor e modelo.
- **Custo zero (exigência do autor, ADR 0002):** `GEMINI_MODEL=gemini-3.5-flash-lite`; no OpenRouter só modelo `:free` (a configuração recusa outro, salvo `OPENROUTER_PERMITIR_PAGO=sim`; a conta tem crédito comprado). Nada de apelido `-latest`. Nunca trocar para modelo pago sem o autor pedir.
- **Embeddings:** `gemini-embedding-2` pela API do Gemini (ADR 0009), que ganhou do e5-small por 38 p.p. em recall@5 (80% contra 42%). Cota gratuita de 1.000 textos por dia e por modelo, cada item de lote contando; todo vetor fica em cache por hash do texto, e reindexar ou repetir avaliação não gasta cota. O e5 local continua disponível pelo `EMBEDDINGS_MODELO` (ADR 0003).
- **Banco vetorial:** Qdrant em Docker, imagem fixada em v1.19.2; busca híbrida a avaliar (ADR 0004).
- **Corpus v1:** Lei 9.613/1998, Lei 7.492/1986, Lei 13.810/2019, Circular BCB 3.978/2020, Carta Circular BCB 4.001/2020, Resolução Conjunta CMN/BCB 6/2023 (ADR 0005).
- **PDF do BCB:** `pdfjs-dist` em versão exata, parágrafos remontados pela geometria (ADR 0006). Aceito pelo autor "por enquanto"; revisar se aparecer PDF que não leia bem.
- **Variantes (ADR 0007):** `manual` (sem framework), `langchain` (LangChain.js com os nossos trechos) e `langchain-padrao` (divisor padrão do LangChain). Iguais: corpus, embeddings, LLM, instruções, esquema da saída, regra de recusa e citação. Muda: a orquestração e, no padrão, a divisão do texto. Dependências do RAG em versão exata.
- **Avaliação (ADR 0008):** só perguntas validadas; só o provedor principal, sem fallback; 5 s entre chamadas; busca registrada até a posição 20; recall@5, acerto@5, MRR@20, falsa recusa, recusa correta, citações pertinentes e cobertura, tokens, custo e latência. Acerto do conteúdo e `naoDeve` pelo juiz (ADR 0010).
- **Juiz (ADR 0010):** modelo `:free` do OpenRouter (`OPENROUTER_MODEL`), outra família que não a do Gemini; compara com o gabarito e dá correta, parcial ou incorreta, mais os itens de `naoDeve` afirmados. Só julga resposta a pergunta coberta. Amostra de 20 auditada pelo autor no chat; registrar a concordância.
- **Resposta (ADR 0011):** o modelo declara `cobertura` (total, parcial, nenhuma) e `naoCoberto`; só "nenhuma" vira recusa, e a parcial sai com o que falta. Instruções: identificar o que a pergunta pede, enumerar tudo o que os trechos dizem sobre isso, nada além. `VERSAO_DO_PROMPT` (hash de instruções, mensagem e esquema) vai em cada execução. k = 8 trechos (`RAG_K`).
- **Conferência de valores (ADR 0012):** todo prazo, percentual, valor em dinheiro e data sem ano da resposta tem de estar no texto do dispositivo citado, dos que o abrem ou dos que vêm abaixo dele, e esse texto tem de ter vindo na busca; senão, recusa (`valor sem respaldo nos dispositivos citados`). Comparação pelo valor ("24 horas" = "vinte e quatro horas"), sem LLM.
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
- Autor dos commits é o autor do projeto, com a coautoria do Claude na linha `Co-Authored-By` (pedido do autor). A sessão na nuvem começa com `git config user.name` "Claude"; o gancho `.claude/hooks/session-start.sh` troca para `Felipe de Almeida Paes <41527579+FelipeAlmeidaPaes@users.noreply.github.com>` (o e-mail privado do GitHub, o mesmo dos commits dele na `main`) e roda `npm install`. Só vale para sessões abertas numa branch que tenha o gancho; até ele chegar à `main`, conferir `git config user.name` antes do primeiro commit.
- Branch com nome legível, que diga o que ela faz, sem "claude" e sem sufixo aleatório (pedido do autor). A plataforma cria a sessão numa branch `claude/...-<sufixo>`: trabalhar numa branch nova com nome descritivo.

## Estado atual (2026-10-09, terceira sessão)
- **Branch:** `avaliacao-v1`, a partir da `main` depois do PR #2: correções do corpus, retentativa da indexação, conjunto de avaliação, executor e avaliação de base. Sem PR: o autor não pediu. No GitHub só existem `main` e `avaliacao-v1` (o autor apagou as antigas; esta sessão não consegue apagar branch remota).
- **Histórico reescrito (2026-10-08, a pedido do autor):** `main` e `avaliacao-v1` passaram por `git filter-branch` para trocar autor e committer "Claude" pelo autor; conteúdo, datas e mensagens iguais. Os PRs #1 e #2 no GitHub ainda mostram os commits antigos.
- **Chaves:** o autor passou as chaves do Gemini e do OpenRouter pelo chat; estão no `.env` (fora do Git, permissão 600). Foram expostas no histórico da conversa: recomendado gerar novas e apagar estas.
- **Rede e ambiente:** como na sessão anterior. O `.npmrc` evita o download de binários CUDA do `onnxruntime-node`. As coleções do Qdrant ficam no volume do Docker e sobrevivem ao reinício da sessão; o Docker precisa ser religado (ver Comandos).
- **Pronto:**
  - Corpus da v1 (seis normas) e ingestão. Corrigidos nesta sessão: travessão em windows-1252 perdido pelo Node (a Lei 9.613, art. 9º, parágrafo único, I, estava colado no parágrafo) e nota "(Transformado em § 1º ...)" no texto da Circular 3.978, art. 49, § 1º. Índice refeito: 939 pontos em `manual` e `langchain`, 196 no padrão, nenhum truncado.
  - As três variantes do RAG, com `/buscar` e `/perguntar`, testadas de ponta a ponta com o Gemini real (`gemini-3.5-flash-lite`) e com o reserva do OpenRouter (`nvidia/nemotron-3-super-120b-a12b:free`). Uso do OpenRouter: US$ 0.
  - Custo zero conferido: projeto do Gemini no nível gratuito, sem faturamento (AI Studio, 2026-10-08); chave do OpenRouter com limite total de US$ 0, e os modelos `:free` funcionam com ela. Trava também na configuração (só `:free` no OpenRouter, sem `-latest` no Gemini).
  - Conjunto de avaliação: as 30 perguntas do autor, reescritas sem o nome da norma, mais 6 fora do corpus (f01 a f06). Gabaritos conferidos no texto: 11 conferem, 12 ajustados, 1 errado (q19), 6 sem base no texto. Validado pelo autor em bloco ("Tudo ok").
  - Executor e relatório (ADR 0008). Execuções gravadas: `busca-base` (só busca) e `base` (Gemini, 108 chamadas, 16 min, nenhum erro; um 503 absorvido pela nova tentativa), ambas com e5-small.
  - Correções de gabarito aprovadas pelo autor (q22, q23; recusa aceita em q07 e q08, campo `recusaAceita`).
  - Experimentos de busca (ADR 0009): e5 small, base e large, texto completo ou enxuto, BM25, híbrida, e os dois embeddings do Gemini. `gemini-embedding-2` adotado; `.env` local já aponta para ele.
  - Qdrant: as três coleções do `gemini-embedding-2` indexadas (`manual` e `langchain` a partir do cache; `langchain-padrao` em 2026-10-09, 196 textos em 113 s). As coleções do e5-small continuam lá. O cache tem os 1.135 trechos e as 36 perguntas: repetir a avaliação ou os experimentos com o Gemini não gasta cota.
  - **Cota de embedding:** o `retryDelay` do 429 não é confiável (apontava meia-noite UTC). A cota renovou entre 00:17 e 07:21 UTC de 2026-10-09, o que bate com a meia-noite do Pacífico (07:00 UTC). Para testar, um lote de 25: um pedido só passa com a sobra do dia anterior.
  - Avaliação `gemini2` (2026-10-09): 108 chamadas ao Gemini em 10 min, nenhum erro; juiz em 58 respostas.
  - Juiz revisado (ADR 0010, revisão 1, versão `ba1252a1`): a pergunta define o que é exigido, e só conteúdo conta (número de artigo e remissão, não). `base` e `gemini2` julgadas de novo; julgamentos guardam a versão, e versão antiga não vale.
  - Juiz do conteúdo (ADR 0010). Auditoria: o autor concordou, em geral, que a primeira versão era rigorosa demais; a conferência item a item (`<rótulo>.auditoria.md`) não foi feita.
  - Cobertura declarada e k = 8 (ADR 0011): execuções `cobertura-k5` e `cobertura-k8` (108 chamadas cada, nenhum erro), julgadas com o juiz `ba1252a1`. Prompt versão `932e4dad`.
  - Conferência de valores (ADR 0012) e q22 com a alínea I, f, em `aceitos` (aprovado pelo autor; relatórios regenerados). Execução `conferencia-k8` (108 chamadas, nenhum erro; 79 respostas julgadas).
  - 141 testes.
- **Achados:**
  - `manual` e `langchain` mandam o mesmo pedido (mesmos tokens com o Gemini real) e recuperam os mesmos trechos; detalhes na ADR 0007.
  - **Falha de busca:** incisos do mesmo artigo carregam o mesmo caput como contexto e ocupam todas as vagas. Em "Por quanto tempo a instituição deve conservar os registros das operações?", os 5 primeiros são do art. 28 da Circular 3.978 (o que o registro deve conter); o trecho que responde (art. 67, III) está em 12º, e a Lei 9.613, art. 10, § 2º, fora dos 40 primeiros. O modelo recusou corretamente. É a q05 do conjunto. Candidatos a correção, a medir na avaliação: limitar trechos por artigo, MMR (o LangChain tem `maxMarginalRelevanceSearch`), busca híbrida, k maior.
  - **Avaliação de base** (`avaliacao/execucoes/base.md`):

    | variante | recall@5 | acerto@5 | MRR@20 | falsa recusa | recusa correta | citações pertinentes | tokens de entrada |
    |---|---|---|---|---|---|---|---|
    | manual | 42% | 60% | 0,40 | 13/30 | 6/6 | 28/31 | 1.008 |
    | langchain | 42% | 60% | 0,40 | 12/30 | 6/6 | 30/33 | 1.008 |
    | langchain-padrao | 59% | 70% | 0,53 | 15/30 | 6/6 | 18/24 | 1.394 |
  - **Avaliação com `gemini-embedding-2` (`gemini2`) contra a `base`** (e5-small). Falsa recusa já com `recusaAceita`; juiz revisado (`ba1252a1`): corretas/parciais/incorretas, das respostas julgadas:

    | variante | recall@5 | acerto@5 | falsa recusa | recusa correta | citações pertinentes | juiz | acerto fim a fim | tokens de entrada |
    |---|---|---|---|---|---|---|---|---|
    | manual, base | 42% | 60% | 12/30 | 6/6 | 29/31 | 10/7/0 | 11/30 | 1.008 |
    | manual, gemini2 | 80% | 93% | 6/30 | 6/6 | 45/46 | 15/7/0 | 17/30 | 890 |
    | langchain, base | 42% | 60% | 11/30 | 6/6 | 31/33 | 12/6/0 | 13/30 | 1.008 |
    | langchain, gemini2 | 80% | 93% | 6/30 | 6/6 | 46/47 | 15/8/0 | 16/30 | 890 |
    | langchain-padrao, base | 59% | 70% | 13/30 | 6/6 | 21/24 | 10/5/0 | 12/30 | 1.394 |
    | langchain-padrao, gemini2 | 76% | 83% | 15/30 | 6/6 | 23/26 | 11/1/1 | 13/30 | 1.381 |
  - **A busca nova sobe o acerto fim a fim em 3 a 6 perguntas** (`manual` de 11 para 17 de 30). Com a primeira versão do juiz o ganho parecia de 1 a 3: ele tratava número de artigo e remissão como contradição (q16, q30) e cobrava o gabarito inteiro em vez do que a pergunta pede. Ao julgar de novo, nenhum veredito piorou.
  - **Única "incorreta" que sobrou:** q10 (`langchain-padrao`), caso de fronteira: a resposta traz outros crimes da Lei 7.492 (arts. 9º e 10) e atribui à conduta perguntada a pena deles (1 a 5 anos), e não a do art. 6º (2 a 6).
  - **Cobertura declarada e k = 8** (ADR 0011, tabela completa lá). Acerto fim a fim (de 30):

    | variante | gemini2 | cobertura-k5 | cobertura-k8 | falsa recusa (k8) | parcial declarada / não declarada (k8) | citações pertinentes (k8) | tokens de entrada (k8) |
    |---|---|---|---|---|---|---|---|
    | manual | 17 | 17 | **21** | 1/30 | 4/5 | 91% | 1.469 |
    | langchain | 16 | 16 | **19** | 1/30 | 4/6 | 85% | 1.469 |
    | langchain-padrao | 13 | 15 | **20** | 6/30 | 2/3 | 79% | 2.222 |
  - **Prompt e esquema, sozinhos, não subiram o acerto** em `manual` e `langchain`: as recusas indevidas caíram de 6 para 3, mas viraram parciais declaradas; o ganho de corretas (15 para 17) só compensou q07 e q08, que eram recusa aceita e agora respondem. O ganho veio do k = 8, com causa mecânica (q15, q20, q28: dispositivo nas posições 6 a 8).
  - **A instrução de enumerar não resolveu a omissão:** com k = 5, 6 das 10 parciais da `manual` foram declaradas "total"; em 4 o item faltante não veio na busca (o modelo não sabe que existe), em 2 (q16, q29) veio e foi omitido.
  - **Conteúdo de memória com citação válida:** q04 (sanções da Lei 9.613, art. 12). A alínea II, b, não vem na busca; a `langchain` (k = 8) escreveu multa de "20% (vinte por cento) do valor corrigido da operação", texto que não existe no corpus, e a `manual` (`gemini2` e k = 8) trouxe o conteúdo certo da alínea b atribuído à c. A validação de citação confere o dispositivo, não o conteúdo. O juiz pegou; o usuário não pegaria.
  - **k = 8 custa** 41% mais tokens de entrada e alguma precisão de citação (92–93% para 85–91%). Parte das "não pertinentes" é gabarito incompleto (q22, alínea f; ver pendências).
  - **Conferência de valores:** sobre 342 respostas (as 263 gravadas antes, simuladas, e as 79 da `conferencia-k8`), recusa exatamente 2, as duas da q04 com valor de memória, e nenhuma falsa. Na própria `conferencia-k8` não agiu: na q04 o modelo citou a alínea II, b, que não veio na busca, e a validação de citação recusou antes.
  - **Ruído medido:** `conferencia-k8` repete a configuração da `cobertura-k8`, e a conferência não agiu. Acerto fim a fim 21→20 (`manual`), 19→18 (`langchain`), 20→18 (padrão); 11 pares mudaram de desfecho. Diferença de até 2 perguntas entre execuções é ruído do modelo e do juiz. O ganho do k = 8 sobre o k = 5 (17, 16, 15) continua acima disso: 20 a 21, 18 a 19, 18 a 20.
  - **q04 é falha de busca:** a Lei 9.613, art. 12, II, b, não fica entre os 8 primeiros em `manual` nem em `langchain` (no padrão vem, dentro do pedaço do art. 12, e o modelo erra o caminho ao citar). Sem ela, o modelo recusa (citando a alínea que não viu) ou completa de memória (barrado pela conferência).
  - O juiz às vezes devolve justificativa de uma palavra ("parcial" na q28 da `base`; "incorreta" na q21 da `manual`, `conferencia-k8`, resposta que trata da relação do art. 11, § 1º, da Lei 9.613, e não da Carta Circular 4.001). Esses vereditos valem menos.
  - **No divisor padrão, a busca melhor não ajudou a resposta:** 10 das 15 recusas são "citação não confere" (o modelo escreve "alínea d" sem artigo, ou "art. 2º, II" sem o § 2º). É limite da variante, que não traz o caminho no texto.
  - **Juiz na `base`:** nenhuma resposta incorreta e nenhuma afirmou item de `naoDeve`; das 50, 28 corretas e 22 parciais. Acerto fim a fim: 10/30 (`manual`), 11/30 (`langchain`), 11/30 (`langchain-padrao`). As parciais são omissões: parte por busca incompleta (q27 sem o inciso II, q28 sem o III), parte por pergunta ampla em que o juiz cobra o gabarito inteiro (q16, q17). Se o juiz é rigoroso demais é o que a auditoria vai dizer. Uma justificativa veio só com a palavra "parcial" (q28, `langchain`).
  - **A busca é o gargalo:** em `manual`, 9 das 13 recusas indevidas são de perguntas sem nenhum dispositivo exigido entre os 5 trechos; 2 trouxeram só parte (q12, q13: a definição do art. 2º da Lei 13.810 não veio, e a regra 3 do prompt manda recusar resposta parcial); 2 trouxeram tudo (q08, ver pendências; q10, ruído do modelo). No divisor padrão, 6 recusas com tudo recuperado, quase todas "citação não confere": o modelo erra o caminho ao deduzi-lo do texto.
  - **O modelo não é determinístico:** `manual` e `langchain` mandam o mesmo pedido (749 tokens em q10, mesma busca), e em q10 um recusou e o outro respondeu; em q18 citaram conjuntos diferentes. Diferença de uma pergunta entre variantes é ruído.
  - **Latência não compara variantes:** nas três, cada geração leva ~1 s ou ~10 s, sem padrão por variante. Provável fila ou limite do nível gratuito do Gemini. Nas perguntas da Carta Circular 4.001 (q21 a q25), `manual` e `langchain` não acham o dispositivo exigido entre os 20 primeiros: as alíneas do art. 39, I, da Circular 3.978 tomam as vagas, e o contexto longo repetido (caput e inciso) dilui o texto curto da alínea. Hipótese, não provada.
  - **Limitar trechos por artigo piora:** simulado sobre os 20 primeiros gravados, recall@5 cai de 42% para 32% (limite 1) e 39% (limite 2). Várias perguntas exigem incisos do mesmo artigo, e o que falta nem está entre os 20.
  - **Experimentos de busca** (ADR 0009, tabela completa lá): com e5, nada passou de 53% de recall@5 (e5-base ou e5-large, BM25 com radical, híbrida); híbrida simples com e5-small piorou (38%). `gemini-embedding-001` deu 69% e `gemini-embedding-2`, 80% (acerto@5 93%). Foram 20 configurações nas mesmas 30 perguntas: só a diferença do Gemini está bem acima do risco de ajuste ao conjunto.
  - Pontuação do melhor trecho: com e5-small, cobertas de 0,872 a 0,913 e fora do corpus de 0,838 a 0,864; com `gemini-embedding-2`, cobertas de 0,767 para cima e fora até 0,696. Um limiar separaria estas 36, mas com 6 perguntas fora do corpus ficaria ajustado a elas.
  - No divisor padrão o modelo deduz o caminho do dispositivo pelo texto e às vezes erra (ex.: "parágrafo único, I, I-A", ou a Lei 9.613 citada com o artigo errado); a validação recusa a resposta inteira.
  - Res. Conjunta 6, art. 8º, II, remete ao "art. 2º, § 6º, inciso II", mas o § 6º não tem incisos no texto do BCB (conferido no JSON bruto da API). É da norma, não do parser.
  - Carta Circular 4.001, art. 1º, III, f, termina em "et c." (espaço do PDF dentro de "etc."). Cosmético; não corrigido.
- **Não validado:**
  - A falha "fetch failed" da indexação apareceu em 2 de ~7 rodadas, sempre a primeira depois de tempo parado. Hipótese: conexão ociosa fechada pelo Qdrant. Há retentativa no CLI; a causa não foi provada.
  - Leis do Planalto e Res. Conjunta 6 conferidas por heurística, não contra um segundo extrator.

## Próximos passos
1. Busca híbrida com o Gemini (`npm run avaliacao:experimentos -- --modelo gemini-embedding-2 --experimentos hibrida,hibrida-radical5`): sem custo de embedding.
2. Limiar de recusa sem LLM, depois de ter mais perguntas fora do corpus.
3. v2: servidor MCP expondo a busca.

## Pendências com o autor
- Gerar chaves novas: as do `.env` são as que passaram pelo chat.
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
- Opcional: auditar o juiz revisado item a item (`avaliacao/execucoes/gemini2.auditoria.md`), para medir a concordância.
- Opcional: auditar os julgamentos de `conferencia-k8` (`conferencia-k8.auditoria.md`).
