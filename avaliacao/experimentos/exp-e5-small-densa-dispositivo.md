# Avaliação: exp-e5-small-densa-dispositivo

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T13:41:30.231Z a 2026-10-08T13:41:30.898Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: nenhum (só busca), sem fallback
- Busca do experimento: densa, só o texto do dispositivo
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 63% | 0.41 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.861 / 0.882 / 0.910 | 0.835 / 0.841 / 0.856 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 12 |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | – |
| q05 | coberta | 1 |
| q06 | coberta | 9 |
| q07 | coberta | 2 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 4 |
| q11 | coberta | 1 |
| q12 | coberta | 2 |
| q13 | coberta | 4 |
| q14 | coberta | 1 |
| q15 | coberta | 13 |
| q16 | coberta | 2 |
| q17 | coberta | 3 |
| q18 | coberta | 1 |
| q19 | coberta | 5 |
| q20 | coberta | 2 |
| q21 | coberta | 15 |
| q22 | coberta | – |
| q23 | coberta | 5 |
| q24 | coberta | 1 |
| q25 | coberta | 19 |
| q26 | coberta | 1 |
| q27 | coberta | 15 |
| q28 | coberta | 4 |
| q29 | coberta | 2 |
| q30 | coberta | – |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
