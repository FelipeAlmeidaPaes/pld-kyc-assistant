# ADR 0003: Embeddings locais primeiro, comparados com API pela avaliação

- Status: Aceita
- Data: 2026-10-07

## Contexto
O corpus tem algumas centenas de trechos, então o custo de embeddings por API seria baixo de qualquer forma. A escolha depende de qualidade de recuperação em português jurídico, reprodutibilidade e dependências.

## Decisão
- Começar com um modelo local multilíngue da família e5, rodando no Node via transformers.js.
- O gerador de embeddings fica atrás de uma interface, para trocar sem mexer no resto.
- Trocar para API só se a avaliação mostrar ganho claro de recuperação.

## Protocolo de comparação
- Mesmo conjunto de avaliação, mesma divisão de texto, mesmo banco.
- Métricas: recall@5 (o dispositivo esperado está entre os 5 trechos recuperados) e MRR.
- Critério proposto: adotar a API se o ganho de recall@5 for de pelo menos 5 pontos percentuais. O limite pode ser revisto antes da medição, nunca depois.

## Consequências
- O modelo é baixado uma vez (dezenas a centenas de MB) e roda na CPU.
- Modelos e5 exigem os prefixos `query: ` na pergunta e `passage: ` no trecho. Esquecer os prefixos piora a busca sem gerar erro.
- O índice fica preso ao modelo. A coleção no Qdrant leva o nome do modelo, e trocar de modelo significa reindexar.
