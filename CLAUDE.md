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
- `src/ingest/encoding.ts`: detecção de charset (Planalto costuma usar windows-1252)
- `src/ingest/cli.ts`: CLI de ingestão
- `src/rag/`: base comum das três variantes (ADR 0007): `trechos.ts` (um trecho por dispositivo, com contexto; texto corrido para o divisor padrão), `embeddings.ts` (e5 com prefixos), `prompt.ts`, `citacoes.ts` e `resposta.ts` (validação de citação e regras de recusa), `config.ts`, `tipos.ts`
- `src/rag/manual/`: índice e busca com o cliente do Qdrant, cliente de chat sobre `fetch`, pipeline
- `src/rag/langchain/`: `EmbeddingsE5`, documentos e indexação pelo `QdrantVectorStore`, `ChatOpenAI` com saída estruturada e cadeia em LCEL
- `src/rag/montar.ts`, `servidor.ts` (Fastify), `cli-indexar.ts`, `cli-servidor.ts`
- `test/fixtures/llm-falso.ts`: servidor compatível com a API da OpenAI que grava as requisições; testa os dois clientes de chat sem chave
- `test/fixtures/norma-ficticia.ts`: norma normalizada fictícia para os testes do RAG
- `test/fixtures/planalto-ficticia.html`: norma fictícia que imita a estrutura do Planalto
- `test/fixtures/pdf-ficticio.ts`: gera PDF fictício para testar a leitura de posições
- `docs/adr/`: decisões de arquitetura (0001 a 0006)

## Decisões (detalhes em docs/adr)
- **Stack:** TypeScript, Node 22, ESM, `strict` (ADR 0001).
- **LLM:** Gemini nível gratuito como principal, OpenRouter como fallback, os dois pela API compatível com OpenAI (ADR 0002). Avaliação roda sem fallback. Toda resposta registra provedor e modelo.
- **Embeddings:** locais primeiro (família e5 via transformers.js), comparados com API pela avaliação; troca só com ganho de pelo menos 5 p.p. em recall@5 (ADR 0003).
- **Banco vetorial:** Qdrant em Docker, imagem fixada em v1.19.2; busca híbrida a avaliar (ADR 0004).
- **Corpus v1:** Lei 9.613/1998, Lei 7.492/1986, Lei 13.810/2019, Circular BCB 3.978/2020, Carta Circular BCB 4.001/2020, Resolução Conjunta CMN/BCB 6/2023 (ADR 0005).
- **PDF do BCB:** `pdfjs-dist` em versão exata, parágrafos remontados pela geometria (ADR 0006). Aceito pelo autor "por enquanto"; revisar se aparecer PDF que não leia bem.
- **Variantes (ADR 0007):** `manual` (sem framework), `langchain` (LangChain.js com os nossos trechos) e `langchain-padrao` (divisor padrão do LangChain). Iguais: corpus, embeddings e5, LLM, instruções, esquema da saída, regra de recusa e citação. Muda: a orquestração e, no padrão, a divisão do texto. Dependências do RAG em versão exata.
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

## Convenções
- Código, comentários, mensagens e documentação em português. Mensagens de commit em inglês, seguindo o histórico.
- Imports com extensão `.js` (ESM com `nodenext`).
- Antes de commitar: `npm run typecheck` e `npm test`.

## Estado atual (2026-10-08, terceira sessão)
- **Branch:** `claude/test-domain-connection-7yur2q`, recomeçada da `main` depois do PR #1. Trabalho desta sessão ainda não mesclado.
- **Rede e ambiente:** como na sessão anterior. O `onnxruntime-node` tenta baixar binários de CUDA na instalação e falha com ECONNRESET; o `.npmrc` desliga isso. Não há `GEMINI_API_KEY` nem `OPENROUTER_API_KEY` no ambiente.
- **Pronto:**
  - Corpus da v1 (seis normas) e ingestão, como antes.
  - As três variantes do RAG, cada uma com `/buscar` e `/perguntar`, sobre a mesma base. Indexadas no Qdrant: 938 trechos por dispositivo (manual e langchain) e 196 pedaços do divisor padrão. Nenhum texto passa de 512 tokens (maior: 292).
  - Servidor testado de ponta a ponta: sobe, busca nas três variantes (~60 ms) e responde 503 em `/perguntar` sem chave.
  - 82 testes. O teste de paridade garante que manual e LangChain mandam o mesmo pedido ao modelo.
- **Achados (detalhes na ADR 0007):** o LangChain altera o esquema zod que manda ao modelo e não repete 429 sem `Retry-After`; `manual` e `langchain` recuperaram os mesmos trechos em 12/12 perguntas de diagnóstico; o divisor padrão contém inteiros só 72% dos dispositivos que a variante manual achou; com o e5, a pontuação de pergunta fora do corpus (0,858) fica colada nas do tema (0,873 a 0,903).
- **Não validado:**
  - A geração real: os dois clientes de chat só rodaram contra o LLM falso. Falta confirmar que o Gemini aceita `response_format` com `json_schema` e `strict: true` pela API compatível com a da OpenAI.
  - Uma indexação falhou com "fetch failed" no meio (256 de 938 pontos) e não se repetiu em quatro rodadas seguintes. Causa desconhecida; a indexação recria as coleções, então rodar de novo resolve.
  - Leis do Planalto e Res. Conjunta 6 conferidas por heurística, não contra um segundo extrator.

## Próximos passos
1. Configurar `GEMINI_API_KEY` e `GEMINI_MODEL` (`.env`) e testar `/perguntar` nas três variantes com o provedor real.
2. Rascunhar ~30 perguntas de avaliação, com os dispositivos esperados, para o autor validar dispositivo por dispositivo. Incluir perguntas fora do corpus para medir a recusa.
3. Executor da avaliação: roda as perguntas nas três variantes, sem fallback, com retomada (ADR 0002), e mede recall@5, MRR, acerto, citação correta, recusa, tokens, custo e latência.

## Pendências com o autor
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
- Escolher o modelo do Gemini para `GEMINI_MODEL` e fornecer a chave.
