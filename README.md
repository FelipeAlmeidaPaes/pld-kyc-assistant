# pld-kyc-assistant

Assistente de perguntas e respostas sobre normas brasileiras de prevenção à lavagem de dinheiro (PLD), financiamento do terrorismo e antifraude. Toda resposta se baseia no texto da norma e cita o dispositivo de origem.

> Status: v2 em andamento. O servidor MCP expõe a busca, a leitura de dispositivo e a conferência da resposta, por stdio e por HTTP local, e devolve exatamente a mesma busca da v1 nas 36 perguntas da avaliação. Na v1, 20 a 21 respostas certas em 30 perguntas (eram 11 no início), as 6 perguntas fora da base recusadas em todas as rodadas, e custo zero.
>
> **O que aprendemos na v1, e o porquê de cada escolha:** [docs/aprendizados-v1.md](docs/aprendizados-v1.md).

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

## Servidor MCP (v2)
Expõe o assistente como ferramentas MCP para um cliente como o Claude Code, o Claude Desktop ou um agente. Quem escreve a resposta passa a ser o modelo do cliente; por isso, além da busca, o servidor oferece as conferências da v1 como ferramenta ([ADR 0013](docs/adr/0013-servidor-mcp.md)).

| Ferramenta | O que faz |
|---|---|
| `buscar` | Os trechos mais próximos da consulta (padrão 8, até 20), cada um começando pela citação; a mesma busca da variante `manual` |
| `ler_dispositivo` | O dispositivo pela citação, com os que o abrem e os que vêm abaixo; só com o artigo (`art. 12`), o artigo inteiro |
| `conferir_resposta` | Confere, sem IA, se as citações existem e têm texto vigente e se cada prazo, percentual, valor e data está no texto citado |

As instruções do servidor pedem ao cliente que busque, leia o dispositivo quando preciso, responda só com o texto citando cada afirmação e confira antes de entregar. Nada obriga o cliente a seguir: medir isso é a v3.

Transportes: stdio, para o cliente iniciar o servidor como processo filho, e Streamable HTTP só em `127.0.0.1`, sem autenticação, com Host e Origin conferidos contra DNS rebinding.

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
| v2 | 03 (MCP) | Servidor MCP com a busca, a leitura de dispositivo e a conferência da resposta como ferramentas, validado pela mesma avaliação (paridade da busca) |
| v3 | 04, 06 (agentes) | Agente que consulta o servidor MCP, comparado com o RAG direto |
| Segurança | 10 (segurança e governança) | Proteção contra prompt injection, testes adversariais e governança |

## Decisões de arquitetura
| Tema | Decisão | ADR |
|---|---|---|
| Stack | TypeScript e Node.js | [0001](docs/adr/0001-stack.md) |
| LLM | Gemini (nível gratuito) principal, OpenRouter como fallback | [0002](docs/adr/0002-provedor-llm.md) |
| Embeddings | Locais primeiro, comparados com API pela avaliação; trocados pelo Gemini, que ganhou por 38 p.p. em recall@5 | [0003](docs/adr/0003-embeddings.md), [0009](docs/adr/0009-embeddings-gemini.md) |
| Banco vetorial | Qdrant local via Docker | [0004](docs/adr/0004-banco-vetorial.md) |
| Corpus | Seis normas, sempre pelo texto compilado | [0005](docs/adr/0005-corpus-v1.md) |
| PDF do BCB | Extraído com pdfjs-dist | [0006](docs/adr/0006-extracao-pdf.md) |
| Variantes | Manual, LangChain e LangChain com divisor padrão | [0007](docs/adr/0007-tres-variantes.md) |
| Avaliação | 30 perguntas cobertas e 6 fora da base, gabarito validado pelo autor, execução retomável | [0008](docs/adr/0008-avaliacao.md) |
| Embeddings do Gemini | `gemini-embedding-2`, com cache em disco; busca híbrida medida e descartada | [0009](docs/adr/0009-embeddings-gemini.md) |
| Juiz | LLM gratuito de outra família julga o conteúdo, com versão e auditoria do autor | [0010](docs/adr/0010-juiz.md) |
| Resposta parcial | O modelo declara o que a base não cobre, em vez de recusar; 8 trechos | [0011](docs/adr/0011-cobertura-declarada.md) |
| Conferência de valores | Prazos, percentuais e valores conferidos contra o texto citado | [0012](docs/adr/0012-conferencia-de-valores.md) |
| Servidor MCP | Busca, leitura de dispositivo e conferência da resposta, por stdio e HTTP local; validado por paridade com a busca da v1 | [0013](docs/adr/0013-servidor-mcp.md) |

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
# Só a busca, sem LLM (sem chave só com EMBEDDINGS_MODELO=Xenova/multilingual-e5-small):
curl -X POST localhost:3000/langchain-padrao/buscar -H 'content-type: application/json' -d '{"pergunta": "..."}'

# Confere avaliacao/perguntas.json contra o corpus e gera avaliacao/revisao.md
npm run avaliacao:revisao
# Roda a avaliação nas três variantes (rótulo novo começa; o mesmo rótulo retoma) e gera o relatório
npm run avaliar -- base
npm run avaliar -- busca --sem-llm   # só a busca, sem LLM
# Experimentos de busca em memória (modelos de embedding, BM25, híbrida), sem mexer no Qdrant
npm run avaliacao:experimentos -- --modelo Xenova/multilingual-e5-base

# Servidor MCP (precisa do Qdrant e da coleção da variante manual)
npm run --silent mcp                 # stdio; --silent tira o cabeçalho do npm do stdout
npm run mcp -- --http                # Streamable HTTP em http://127.0.0.1:3001/mcp
npx @modelcontextprotocol/inspector node_modules/.bin/tsx src/mcp/cli.ts   # testar no navegador
# No Claude Code, com o caminho absoluto do projeto:
claude mcp add pld-kyc -- /caminho/do/projeto/node_modules/.bin/tsx /caminho/do/projeto/src/mcp/cli.ts
claude mcp add --transport http pld-kyc http://127.0.0.1:3001/mcp   # ou pelo HTTP, com o servidor no ar
# Paridade: a mesma avaliação, com a busca passando pelo servidor, comparada com a busca direta
npm run avaliar -- mcp-stdio --sem-llm --mcp stdio
npm run avaliacao:comparar-busca -- conferencia-k8 mcp-stdio

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
