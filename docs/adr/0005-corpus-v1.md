# ADR 0005: Seis normas no corpus da v1, sempre pelo texto compilado

- Status: Aceita
- Data: 2026-10-07

## Contexto
O escopo é PLD/FT e antifraude no sistema financeiro. Sem uma lista fechada de normas, não dá para medir recusa: o sistema precisa saber o que está fora da base.

## Decisão
O corpus da v1 tem estas normas, registradas em `corpus/fontes.json`:

| Norma | Por que entra |
|---|---|
| Lei 9.613/1998 | Lei de lavagem de dinheiro: crime, obrigações e COAF |
| Lei 7.492/1986 | Crimes contra o sistema financeiro nacional |
| Lei 13.810/2019 | Cumprimento de sanções do Conselho de Segurança da ONU |
| Circular BCB 3.978/2020 | Política, procedimentos e controles de PLD/FT nas instituições autorizadas pelo BCB |
| Carta Circular BCB 4.001/2020 | Operações e situações que podem indicar lavagem de dinheiro |
| Resolução Conjunta CMN/BCB 6/2023 | Compartilhamento de dados sobre indícios de fraude |

## Política de texto
- Usa-se sempre o texto compilado, com as alterações incorporadas. O texto riscado (revogado) é descartado na ingestão.
- A data de referência de cada norma é o dia da captura. O hash SHA-256 do documento bruto (HTML ou PDF) e o endereço de onde ele veio ficam registrados para auditar a versão.
- O texto normalizado (`corpus/normalized/`) é versionado no Git. O HTML bruto não.
- Dispositivo sem texto próprio fica no texto normalizado, para a numeração continuar completa, mas não entra no índice de busca. São eles: os revogados, os de vigência encerrada (Lei 9.613, art. 17-F) e os que dizem só "(VETADO)" (Lei 7.492, arts. 24 e 32 e §§ 1º a 3º do art. 32; Lei 13.810, art. 6º, parágrafo único). O "(Vetado)" no meio de um texto válido, como na Lei 7.492, fica: é parte do texto oficial.
- No BCB, o texto compilado vem do PDF "limpo" (`_v<N>_L.pdf`) da versão mais recente. O texto em HTML da API do BCB é o original, sem as alterações, e não serve para normas alteradas.

## Pendências
- Nenhuma. As seis URLs foram conferidas em 2026-10-07: o título do documento baixado bate com `corpus/fontes.json`. A Circular 3.978 e a Carta Circular 4.001 vêm do PDF compilado (ADR 0006); a Resolução Conjunta 6 nunca foi alterada e vem do HTML da API.

## Fora da v1, a avaliar
- Lei 13.260/2016 (terrorismo e seu financiamento). Sem ela, perguntas sobre o tipo penal de financiamento do terrorismo devem ser recusadas.
- Regulamentação do BCB para a Lei 13.810/2019. Sem ela, perguntas sobre os procedimentos das instituições para cumprir as sanções devem ser recusadas.
- Resoluções do COAF.
