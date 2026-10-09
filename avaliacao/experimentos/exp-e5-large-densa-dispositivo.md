# Avaliação: exp-e5-large-densa-dispositivo

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T13:46:25.263Z a 2026-10-08T13:46:26.625Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-large; LLM: nenhum (só busca), sem fallback
- Busca do experimento: densa, só o texto do dispositivo
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 46% | 70% | 0.45 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.829 / 0.850 / 0.873 | 0.817 / 0.830 / 0.841 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 5 |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | – |
| q05 | coberta | 1 |
| q06 | coberta | 3 |
| q07 | coberta | 1 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 2 |
| q11 | coberta | 1 |
| q12 | coberta | 1 |
| q13 | coberta | 6 |
| q14 | coberta | 1 |
| q15 | coberta | 5 |
| q16 | coberta | 2 |
| q17 | coberta | 2 |
| q18 | coberta | 3 |
| q19 | coberta | 2 |
| q20 | coberta | 6 |
| q21 | coberta | 13 |
| q22 | coberta | 4 |
| q23 | coberta | 3 |
| q24 | coberta | 3 |
| q25 | coberta | 19 |
| q26 | coberta | 1 |
| q27 | coberta | 7 |
| q28 | coberta | 2 |
| q29 | coberta | 4 |
| q30 | coberta | 10 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
