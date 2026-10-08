# ADR 0001: TypeScript e Node.js, sem framework de RAG na v1

- Status: Aceita; a parte "sem framework de RAG" foi substituída pela ADR 0007
- Data: 2026-10-07

## Contexto
O projeto acompanha a pós-graduação e serve de portfólio. Cada etapa do RAG (ingestão, divisão, embeddings, busca, geração, avaliação) precisa ser visível e medível, porque a avaliação vai comparar alternativas em cada uma delas.

## Decisão
- TypeScript com Node.js 22, ESM e `strict` ligado.
- `tsx` para executar, Vitest para testes, `tsc --noEmit` para checagem de tipos.
- Na v1, cada etapa é escrita diretamente, sem LangChain, LlamaIndex ou similar.

## Alternativas consideradas
- **Python**: ecossistema de RAG mais maduro. Descartado porque a stack em TypeScript já foi definida para o projeto.
- **Framework de RAG**: acelera o protótipo, mas esconde as etapas que a avaliação precisa isolar e trocar.

## Consequências
- Mais código próprio nas etapas simples.
- Algumas ferramentas só existem em Python, como o modo embutido do Qdrant. Ver ADR 0004.
- Um framework pode entrar depois, se a avaliação mostrar ganho que justifique.
