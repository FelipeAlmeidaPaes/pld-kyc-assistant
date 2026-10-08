# Avaliação: exp-e5-small-densa

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T14:09:54.057Z a 2026-10-08T14:09:54.591Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: nenhum (só busca), sem fallback
- Busca do experimento: densa, texto completo (a busca atual, em memória)
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 60% | 0.40 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.872 / 0.889 / 0.913 | 0.838 / 0.848 / 0.864 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 1 |
| q02 | coberta | – |
| q03 | coberta | – |
| q04 | coberta | 13 |
| q05 | coberta | 10 |
| q06 | coberta | – |
| q07 | coberta | 3 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 5 |
| q11 | coberta | 1 |
| q12 | coberta | 2 |
| q13 | coberta | 2 |
| q14 | coberta | 2 |
| q15 | coberta | 6 |
| q16 | coberta | 1 |
| q17 | coberta | 3 |
| q18 | coberta | 12 |
| q19 | coberta | 1 |
| q20 | coberta | 4 |
| q21 | coberta | – |
| q22 | coberta | – |
| q23 | coberta | – |
| q24 | coberta | – |
| q25 | coberta | – |
| q26 | coberta | 4 |
| q27 | coberta | 1 |
| q28 | coberta | 1 |
| q29 | coberta | 4 |
| q30 | coberta | 2 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
