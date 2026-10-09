# Avaliação: exp-e5-base-densa

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-08T13:42:51.885Z a 2026-10-08T13:42:52.615Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-base; LLM: nenhum (só busca), sem fallback
- Busca do experimento: densa, texto completo (a busca atual, em memória)
- Não medido aqui: se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso exige juiz (pessoa ou LLM).

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 60% | 0.42 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.822 / 0.852 / 0.894 | 0.810 / 0.829 / 0.842 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | – |
| q02 | coberta | 20 |
| q03 | coberta | – |
| q04 | coberta | 2 |
| q05 | coberta | 1 |
| q06 | coberta | 8 |
| q07 | coberta | 2 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 3 |
| q11 | coberta | 2 |
| q12 | coberta | 2 |
| q13 | coberta | 6 |
| q14 | coberta | 4 |
| q15 | coberta | 10 |
| q16 | coberta | 2 |
| q17 | coberta | 5 |
| q18 | coberta | 3 |
| q19 | coberta | 1 |
| q20 | coberta | 1 |
| q21 | coberta | – |
| q22 | coberta | 13 |
| q23 | coberta | – |
| q24 | coberta | 13 |
| q25 | coberta | – |
| q26 | coberta | 7 |
| q27 | coberta | 1 |
| q28 | coberta | 1 |
| q29 | coberta | 1 |
| q30 | coberta | 5 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
