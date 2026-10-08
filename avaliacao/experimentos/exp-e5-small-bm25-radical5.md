# Avaliação: exp-e5-small-bm25-radical5

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T14:09:54.880Z a 2026-10-08T14:09:54.936Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: nenhum (só busca), sem fallback
- Busca do experimento: lexical BM25, termos cortados em 5 letras
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 49% | 67% | 0.47 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 10.783 / 17.510 / 32.519 | 6.483 / 7.455 / 11.378 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 18 |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | – |
| q05 | coberta | 3 |
| q06 | coberta | 3 |
| q07 | coberta | 3 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 1 |
| q11 | coberta | – |
| q12 | coberta | 1 |
| q13 | coberta | 6 |
| q14 | coberta | 1 |
| q15 | coberta | 5 |
| q16 | coberta | 2 |
| q17 | coberta | 3 |
| q18 | coberta | 6 |
| q19 | coberta | 1 |
| q20 | coberta | 3 |
| q21 | coberta | 20 |
| q22 | coberta | 6 |
| q23 | coberta | 2 |
| q24 | coberta | 1 |
| q25 | coberta | 5 |
| q26 | coberta | 6 |
| q27 | coberta | 1 |
| q28 | coberta | 1 |
| q29 | coberta | 1 |
| q30 | coberta | 4 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
