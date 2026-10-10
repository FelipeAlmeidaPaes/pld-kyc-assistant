# Avaliação: mcp-http

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 36, de 2026-10-10T14:41:00.043Z a 2026-10-10T14:41:00.803Z
- k = 8 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: nenhum (só busca), sem fallback
- Busca do experimento: mcp-http
- Só busca: sem respostas para julgar.

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@8 | acerto@8 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 84% | 93% | 0.71 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.767 / 0.806 / 0.872 | 0.665 / 0.691 / 0.696 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual |
| --- | --- | --- |
| q01 | coberta | 1 |
| q02 | coberta | 2 |
| q03 | coberta | 3 |
| q04 | coberta | 3 |
| q05 | coberta | 1 |
| q06 | coberta | 1 |
| q07 | coberta | 1 |
| q08 | coberta | 1 |
| q09 | coberta | 1 |
| q10 | coberta | 1 |
| q11 | coberta | 1 |
| q12 | coberta | 2 |
| q13 | coberta | 5 |
| q14 | coberta | 2 |
| q15 | coberta | 10 |
| q16 | coberta | 1 |
| q17 | coberta | 2 |
| q18 | coberta | 2 |
| q19 | coberta | 1 |
| q20 | coberta | 2 |
| q21 | coberta | 12 |
| q22 | coberta | 1 |
| q23 | coberta | 1 |
| q24 | coberta | 1 |
| q25 | coberta | 2 |
| q26 | coberta | 5 |
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
