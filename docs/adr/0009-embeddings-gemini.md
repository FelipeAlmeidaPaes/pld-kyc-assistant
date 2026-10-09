# ADR 0009: Embeddings pela API do Gemini

- Status: Aceita
- Data: 2026-10-08
- Substitui em parte: ADR 0003 (o embedding local deixa de ser o padrão)

## Contexto
A avaliação de base (ADR 0008) mostrou que a busca é o gargalo: com o e5-small, só 42% dos dispositivos exigidos chegam aos 5 trechos que vão ao modelo (recall@5), e 9 das 13 recusas indevidas da variante manual vêm de busca sem nenhum dispositivo exigido. A ADR 0003 previa comparar o modelo local com embedding por API e trocar com ganho de pelo menos 5 p.p. em recall@5.

Experimentos só de busca, em memória, sobre os 939 trechos por dispositivo e as 30 perguntas cobertas (`npm run avaliacao:experimentos`, resultados em `avaliacao/experimentos/`):

| busca | recall@5 | acerto@5 | MRR@20 |
|---|---|---|---|
| e5-small, texto completo (a de hoje) | 42% | 60% | 0,40 |
| e5-small, só o dispositivo | 42% | 63% | 0,41 |
| e5-small, dispositivo e o que o abre | 41% | 60% | 0,45 |
| BM25 | 42% | 60% | 0,43 |
| BM25 com radical de 5 letras | 49% | 67% | 0,47 |
| híbrida e5-small + BM25 (RRF) | 38% | 50% | 0,36 |
| e5-base, dispositivo e o que o abre | 51% | 70% | 0,53 |
| híbrida e5-base + BM25 com radical | 53% | 73% | 0,48 |
| e5-large, melhor configuração | 53% | 70% | 0,47 |
| gemini-embedding-001, texto completo | 69% | 87% | 0,66 |
| **gemini-embedding-2, texto completo** | **80%** | **93%** | **0,71** |

## Decisão
- Embeddings pelo `gemini-embedding-2`, pela API do Gemini, no mesmo projeto do nível gratuito do LLM (custo zero, ADR 0002). Vetor de 768 dimensões, normalizado aqui; tipo de tarefa `RETRIEVAL_DOCUMENT` no trecho e `RETRIEVAL_QUERY` na pergunta, no lugar dos prefixos do e5.
- Vale para as três variantes; o texto indexado continua o mesmo.
- Todo vetor calculado fica num cache em disco, pelo hash do tipo e do texto (`.cache/vetores/<modelo>.jsonl`, fora do Git). Reindexar ou repetir uma avaliação não gasta cota com texto já visto.
- O e5 local continua disponível: `EMBEDDINGS_MODELO=Xenova/multilingual-e5-small` volta ao modelo anterior, sem chave. As coleções do Qdrant levam o nome do modelo, então as duas convivem.
- Busca híbrida e texto indexado mais curto ficam de fora por ora: com o e5, ganharam no máximo 11 p.p. e às vezes perderam; com o Gemini, não foram medidos (ver consequências).

## Alternativas consideradas
- **e5-base ou e5-large locais:** sem chave nem cota, mas param entre 45% e 53%, menos da metade do ganho do Gemini.
- **BM25 com radical:** o melhor resultado sem modelo novo (49%), mas ainda longe.
- **gemini-embedding-001:** 11 p.p. abaixo do `gemini-embedding-2`, com a mesma cota.

## Consequências
- **Cota do nível gratuito** [conferida no erro da API]: 1.000 textos por dia e por modelo, e cada item de um lote conta como um pedido (`EmbedContentRequestsPerDayPerProjectPerModel-FreeTier`). Indexar os 939 trechos gasta quase toda a cota do dia; as três variantes precisam de 939 + 196 textos, então indexar do zero, sem cache, leva dois dias. Com o cache, reindexar custa zero.
- Cada pergunta nova gasta um pedido. Uma avaliação gasta 36 (as três variantes usam o mesmo vetor da pergunta, pelo cache); repetir a mesma avaliação, zero.
- A busca passa a exigir a chave e a rede: `/buscar` e a avaliação `--sem-llm` deixam de funcionar sem chave, salvo voltando ao e5.
- A pergunta do usuário vai à API do Google também para a busca. Já ia para o LLM; o corpus é de normas públicas.
- O `QdrantVectorStore` do LangChain chama `embedQuery("test")` ao criar a coleção, para descobrir a dimensão do vetor: um pedido escondido, que o cache absorve.
- **Risco de ajuste ao conjunto:** 20 configurações foram testadas nas mesmas 30 perguntas, sem conjunto separado. A diferença do Gemini (+38 p.p., cerca de 11 perguntas) está muito acima desse risco; as diferenças entre as configurações locais (de 1 a 11 p.p.) não.
- Pontuação do melhor trecho com o `gemini-embedding-2`: cobertas de 0,767 para cima, fora do corpus até 0,696. Base para o limiar de recusa, com a ressalva da ADR 0008 (só 6 perguntas fora do corpus).
- A avaliação com o LLM sobre a busca nova ficou para depois que a cota renovar (a do dia acabou nos experimentos).

## Resultado com o LLM (2026-10-09)
Avaliação `gemini2` contra a `base` (e5-small), mesmo LLM e mesmo conjunto (relatórios em `avaliacao/execucoes/`):

| variante | recall@5 | acerto@5 | falsa recusa | acerto fim a fim (juiz revisado) |
|---|---|---|---|---|
| manual | 42% → 80% | 60% → 93% | 12 → 6 de 30 | 11 → 17 de 30 |
| langchain | 42% → 80% | 60% → 93% | 11 → 6 de 30 | 13 → 16 de 30 |
| langchain-padrao | 59% → 76% | 70% → 83% | 13 → 15 de 30 | 12 → 13 de 30 |

A busca nova reduziu à metade as recusas indevidas nas variantes por dispositivo e subiu o acerto do conteúdo em 3 a 6 perguntas. Com a primeira versão do juiz o ganho parecia menor (de 10–11 para 12–14), porque ele tratava número de artigo como contradição; a revisão está na ADR 0010. No divisor padrão a busca melhorou, mas o modelo continua errando o caminho do dispositivo ao citar.
