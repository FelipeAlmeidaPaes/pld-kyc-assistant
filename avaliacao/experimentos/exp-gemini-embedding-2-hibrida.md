# Avaliação: exp-gemini-embedding-2-hibrida

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-09T13:45:44.087Z a 2026-10-09T13:45:44.250Z
- k = 8 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: nenhum (só busca), sem fallback
- Busca do experimento: híbrida: densa (texto completo) + BM25, fusão RRF c=60
- Só busca: sem respostas para julgar.

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@8 | acerto@8 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 69% | 80% | 0.58 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.027 / 0.033 / 0.033 | 0.025 / 0.031 / 0.033 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 7 |
| q02 | coberta | 11 |
| q03 | coberta | – |
| q04 | coberta | 16 |
| q05 | coberta | 1 |
| q06 | coberta | 7 |
| q07 | coberta | 1 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 1 |
| q11 | coberta | 8 |
| q12 | coberta | 3 |
| q13 | coberta | 5 |
| q14 | coberta | 2 |
| q15 | coberta | 12 |
| q16 | coberta | 1 |
| q17 | coberta | 7 |
| q18 | coberta | 3 |
| q19 | coberta | 1 |
| q20 | coberta | 2 |
| q21 | coberta | 11 |
| q22 | coberta | 1 |
| q23 | coberta | 1 |
| q24 | coberta | 1 |
| q25 | coberta | 1 |
| q26 | coberta | 12 |
| q27 | coberta | 1 |
| q28 | coberta | 1 |
| q29 | coberta | 1 |
| q30 | coberta | 2 |
| f01 | fora | · |
| f02 | fora | · |
| f03 | fora | · |
| f04 | fora | · |
| f05 | fora | · |
| f06 | fora | · |
