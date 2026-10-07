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
- A data de referência de cada norma é o dia da captura. O hash SHA-256 do HTML bruto fica registrado para auditar a versão.
- O texto normalizado (`corpus/normalized/`) é versionado no Git. O HTML bruto não.
- No BCB, o texto compilado vem do PDF "limpo" (`_v<N>_L.pdf`) da versão mais recente. O texto em HTML da API do BCB é o original, sem as alterações, e não serve para normas alteradas.

## Pendências
- URLs do Planalto conferidas em 2026-10-07. As do BCB não: número, título e data batem com a API do BCB, mas a fonte da ingestão será o PDF.
- Falta o parser do BCB (PDF). O BCB publica a Circular 3.978 e a Carta Circular 4.001 compiladas, então não é preciso consolidar à mão.

## Fora da v1, a avaliar
- Lei 13.260/2016 (terrorismo e seu financiamento). Sem ela, perguntas sobre o tipo penal de financiamento do terrorismo devem ser recusadas.
- Regulamentação do BCB para a Lei 13.810/2019. Sem ela, perguntas sobre os procedimentos das instituições para cumprir as sanções devem ser recusadas.
- Resoluções do COAF.
