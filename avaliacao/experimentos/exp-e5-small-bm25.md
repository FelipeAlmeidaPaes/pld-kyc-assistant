# Avaliação: exp-e5-small-bm25

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T13:41:46.346Z a 2026-10-08T13:41:46.391Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: nenhum (só busca), sem fallback
- Busca do experimento: lexical BM25, texto completo
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 60% | 0.43 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 8.671 / 17.030 / 36.108 | 6.119 / 9.109 / 10.647 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | – |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | – |
| q05 | coberta | 1 |
| q06 | coberta | – |
| q07 | coberta | 3 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 4 |
| q11 | coberta | – |
| q12 | coberta | 5 |
| q13 | coberta | 12 |
| q14 | coberta | 7 |
| q15 | coberta | 14 |
| q16 | coberta | 2 |
| q17 | coberta | 3 |
| q18 | coberta | 8 |
| q19 | coberta | 1 |
| q20 | coberta | 4 |
| q21 | coberta | – |
| q22 | coberta | 2 |
| q23 | coberta | 2 |
| q24 | coberta | 1 |
| q25 | coberta | 1 |
| q26 | coberta | 20 |
| q27 | coberta | 2 |
| q28 | coberta | 1 |
| q29 | coberta | 1 |
| q30 | coberta | 1 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
