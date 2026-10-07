# ADR 0004: Qdrant local via Docker

- Status: Aceita
- Data: 2026-10-07

## Contexto
A busca precisa filtrar por metadados (norma, data de referência, revogação) e, provavelmente, combinar busca vetorial com busca por palavra-chave. Perguntas como "o que diz o art. 10" ou siglas como "PEP" são mal atendidas só por similaridade semântica.

## Decisão
- Qdrant rodando em Docker, definido em `docker-compose.yml`, com a versão da imagem fixada.
- Cada ponto guarda no payload: fonte, artigo, caminhos dos dispositivos e data de referência.
- Dispositivos revogados não são indexados.
- A busca híbrida (vetor denso mais vetor esparso) será comparada com a busca só vetorial na avaliação.

## Alternativas consideradas
- **sqlite-vec**: um arquivo só, sem Docker. Descartado porque o Qdrant traz busca híbrida e filtros prontos e é mais usado no mercado.
- **pgvector**: exigiria operar um PostgreSQL só para isso.

## Consequências
- O cliente JavaScript do Qdrant só fala com um servidor; o modo embutido existe apenas no cliente Python. Quem clonar o repositório precisa de Docker.
