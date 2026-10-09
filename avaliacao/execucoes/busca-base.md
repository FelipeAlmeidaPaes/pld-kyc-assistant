# Avaliação: busca-base

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-08T12:53:24.699Z a 2026-10-08T12:53:27.239Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: nenhum (só busca), sem fallback
- Só busca: sem respostas para julgar.

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 60% | 0.40 |
| langchain | 30 | 42% | 60% | 0.40 |
| langchain-padrao | 30 | 59% | 70% | 0.53 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.872 / 0.889 / 0.913 | 0.838 / 0.848 / 0.864 |
| langchain | 0.872 / 0.889 / 0.913 | 0.838 / 0.848 / 0.864 |
| langchain-padrao | 0.860 / 0.887 / 0.913 | 0.844 / 0.858 / 0.868 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 | 1 | 1 |
| q02 | coberta | – | – | 13 |
| q03 | coberta | – | – | – |
| q04 | coberta | 13 | 13 | – |
| q05 | coberta | 10 | 10 | 1 |
| q06 | coberta | – | – | 1 |
| q07 | coberta | 3 | 3 | 5 |
| q08 | coberta | 1 | 1 | 10 |
| q09 | coberta | 1 | 1 | 4 |
| q10 | coberta | 5 | 5 | – |
| q11 | coberta | 1 | 1 | 1 |
| q12 | coberta | 2 | 2 | 1 |
| q13 | coberta | 2 | 2 | 5 |
| q14 | coberta | 2 | 2 | 3 |
| q15 | coberta | 6 | 6 | 11 |
| q16 | coberta | 1 | 1 | 1 |
| q17 | coberta | 3 | 3 | 1 |
| q18 | coberta | 12 | 12 | 3 |
| q19 | coberta | 1 | 1 | 1 |
| q20 | coberta | 4 | 4 | 1 |
| q21 | coberta | – | – | 18 |
| q22 | coberta | – | – | 6 |
| q23 | coberta | – | – | 2 |
| q24 | coberta | – | – | 1 |
| q25 | coberta | – | – | 3 |
| q26 | coberta | 4 | 4 | – |
| q27 | coberta | 1 | 1 | 1 |
| q28 | coberta | 1 | 1 | 1 |
| q29 | coberta | 4 | 4 | 1 |
| q30 | coberta | 2 | 2 | 5 |
| f01 | fora | · | · | · |
| f02 | fora | · | · | · |
| f03 | fora | · | · | · |
| f04 | fora | · | · | · |
| f05 | fora | · | · | · |
| f06 | fora | · | · | · |
