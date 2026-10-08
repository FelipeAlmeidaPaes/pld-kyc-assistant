# pld-kyc-assistant

Assistente de perguntas e respostas sobre normas brasileiras de prevenção à lavagem de dinheiro (PLD), financiamento do terrorismo e antifraude. Toda resposta se baseia no texto da norma e cita o dispositivo de origem.

> Status: em desenvolvimento (v1). Pronto: estrutura do projeto, decisões de arquitetura e ingestão das seis normas do corpus (Planalto e BCB). Em andamento: indexação, busca e avaliação.

## Por que este projeto
Normas de PLD/KYC são longas, remetem umas às outras e mudam com frequência. Um assistente que responde com confiança e sem fonte é pior do que nenhum assistente, ainda mais em compliance. Aqui, citação, recusa e custo são requisitos, e cada um é medido.

## Escopo da v1
- Ingestão das normas, com divisão por artigo e por dispositivo (caput, parágrafo, inciso, alínea, item)
- Controle de vigência: usa o texto compilado, descarta o texto revogado e guarda a data de referência e o hash de cada captura
- Busca semântica em banco vetorial local
- Respostas com citação obrigatória do dispositivo (ex.: Lei 9.613/1998, art. 1º, § 2º, I)
- Recusa explícita quando a base não cobre a pergunta
- Conjunto de avaliação com cerca de 30 perguntas, medindo recuperação, acerto, citação correta e recusa adequada
- Registro de provedor, modelo, tokens, custo e latência por consulta
- Três variantes do mesmo RAG, comparadas pela mesma avaliação, cada uma com um endpoint HTTP:

| Variante | Endpoint | Como é feita |
|---|---|---|
| `manual` | `POST /manual/perguntar` | Cada etapa escrita no projeto, sem framework |
| `langchain` | `POST /langchain/perguntar` | LangChain.js com os mesmos trechos por dispositivo |
| `langchain-padrao` | `POST /langchain-padrao/perguntar` | LangChain.js com o divisor de texto padrão dele |

Cada variante também tem `POST /<variante>/buscar`, que devolve só os trechos recuperados, sem chamar o LLM.

Fora da v1: interface, servidor MCP, agentes e usuários.

## Corpus da v1
| Norma | Tema |
|---|---|
| Lei 9.613/1998 | Lavagem de dinheiro |
| Lei 7.492/1986 | Crimes contra o sistema financeiro nacional |
| Lei 13.810/2019 | Sanções do Conselho de Segurança da ONU |
| Circular BCB 3.978/2020 | PLD/FT nas instituições autorizadas pelo BCB |
| Carta Circular BCB 4.001/2020 | Operações que podem indicar lavagem |
| Resolução Conjunta CMN/BCB 6/2023 | Compartilhamento de indícios de fraude |

Fontes oficiais e status de conferência em [`corpus/fontes.json`](corpus/fontes.json). Critérios em [ADR 0005](docs/adr/0005-corpus-v1.md).

## Roadmap
O projeto evolui junto com os módulos da pós-graduação.

| Versão | Módulos | Entrega |
|---|---|---|
| v1 | 02 (APIs de LLM), 08 (arquitetura) | RAG com citação e recusa, avaliação e custo por consulta |
| v2 | 03 (MCP) | Servidor MCP expondo a busca como ferramenta, validado com a mesma avaliação |
| v3 | 04, 06 (agentes) | Agente que consulta o servidor MCP, comparado com o RAG direto |
| Segurança | 10 (segurança e governança) | Proteção contra prompt injection, testes adversariais e governança |

## Decisões de arquitetura
| Tema | Decisão | ADR |
|---|---|---|
| Stack | TypeScript e Node.js | [0001](docs/adr/0001-stack.md) |
| LLM | Gemini (nível gratuito) principal, OpenRouter como fallback | [0002](docs/adr/0002-provedor-llm.md) |
| Embeddings | Locais primeiro, comparados com API pela avaliação | [0003](docs/adr/0003-embeddings.md) |
| Banco vetorial | Qdrant local via Docker | [0004](docs/adr/0004-banco-vetorial.md) |
| Corpus | Seis normas, sempre pelo texto compilado | [0005](docs/adr/0005-corpus-v1.md) |
| PDF do BCB | Extraído com pdfjs-dist | [0006](docs/adr/0006-extracao-pdf.md) |
| Variantes | Manual, LangChain e LangChain com divisor padrão | [0007](docs/adr/0007-tres-variantes.md) |

## Como rodar
Requisitos: Node.js 22 ou superior e Docker.

```bash
npm install
cp .env.example .env        # preencha as chaves
docker compose up -d        # sobe o Qdrant em localhost:6333

npm test                    # testes
npm run typecheck           # checagem de tipos

# Indexa o corpus nas três coleções do Qdrant (baixa o modelo de embeddings na primeira vez)
npm run indexar
# Sobe o servidor com as três variantes em localhost:3000
npm run servidor
curl -X POST localhost:3000/manual/perguntar -H 'content-type: application/json' -d '{"pergunta": "..."}'
# Só a busca, sem LLM (funciona sem chave):
curl -X POST localhost:3000/langchain-padrao/buscar -H 'content-type: application/json' -d '{"pergunta": "..."}'

# Baixa a norma e grava o texto normalizado em corpus/normalized/
npm run ingest -- lei-9613             # Planalto: página do texto compilado
npm run ingest -- circular-bcb-3978    # BCB: PDF compilado mais recente, achado pela API do BCB
# Se o download for bloqueado, salve o documento e use:
npm run ingest -- lei-9613 --arquivo caminho/da/pagina.html
npm run ingest -- circular-bcb-3978 --arquivo caminho/do/compilado.pdf
```

## Fontes
Os documentos são atos oficiais (leis, circulares e resoluções), que não são protegidos por direito autoral (Lei 9.610/1998, art. 8º, IV). Cada documento é versionado com o link da fonte oficial.

## Aviso
Projeto de estudo e portfólio. Não substitui análise jurídica ou de compliance.

## Créditos
Técnicas estudadas na pós-graduação em Engenharia de Software com IA Aplicada (UNIPDS). Código escrito do zero, sem reaproveitar material do curso.
