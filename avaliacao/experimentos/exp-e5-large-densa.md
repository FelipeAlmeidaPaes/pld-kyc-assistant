# Avaliação: exp-e5-large-densa

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T13:45:38.730Z a 2026-10-08T13:45:40.159Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-large; LLM: nenhum (só busca), sem fallback
- Busca do experimento: densa, texto completo (a busca atual, em memória)
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 45% | 63% | 0.51 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.830 / 0.863 / 0.891 | 0.819 / 0.832 / 0.851 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 2 |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | – |
| q05 | coberta | 1 |
| q06 | coberta | 1 |
| q07 | coberta | 2 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 2 |
| q11 | coberta | – |
| q12 | coberta | 1 |
| q13 | coberta | 3 |
| q14 | coberta | 1 |
| q15 | coberta | 6 |
| q16 | coberta | 3 |
| q17 | coberta | 13 |
| q18 | coberta | 1 |
| q19 | coberta | 1 |
| q20 | coberta | 2 |
| q21 | coberta | – |
| q22 | coberta | – |
| q23 | coberta | 3 |
| q24 | coberta | – |
| q25 | coberta | – |
| q26 | coberta | 16 |
| q27 | coberta | 1 |
| q28 | coberta | 1 |
| q29 | coberta | 1 |
| q30 | coberta | 1 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
