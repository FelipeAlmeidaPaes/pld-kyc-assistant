# CLAUDE.md

Contexto do projeto para sessões do Claude Code. A seção "Estado atual" muda a cada sessão; o resto é estável.

## O projeto
Assistente de perguntas e respostas sobre normas brasileiras de PLD/FT e antifraude, com citação obrigatória do dispositivo e recusa quando a base não cobre a pergunta. É portfólio de IA no GitHub e evolui junto com os módulos da pós-graduação do autor:

| Versão | Módulos da pós | Entrega |
|---|---|---|
| v1 | 02 (APIs de LLM), 08 (arquitetura) | RAG com citação e recusa, avaliação e custo por consulta |
| v2 | 03 (MCP) | Servidor MCP expondo a busca, validado com a mesma avaliação |
| v3 | 04, 06 (agentes) | Agente que usa o servidor MCP, comparado com o RAG direto |
| Segurança | 10 | Prompt injection, testes adversariais, governança |

Citação obrigatória e recusa são requisitos da v1, não do módulo 10.

## Comandos
```bash
npm install
npm test                 # Vitest
npm run typecheck        # tsc --noEmit
npm run ingest -- <id>   # baixa e normaliza uma fonte de corpus/fontes.json
npm run ingest -- <id> --arquivo pagina.html   # usa HTML salvo localmente
docker compose up -d     # Qdrant em localhost:6333
```

## Estrutura
- `corpus/fontes.json`: manifesto das normas (id, sigla, URL oficial, formato do parser, `urlVerificada`)
- `corpus/normalized/`: texto normalizado por norma, versionado no Git. `corpus/raw/` (HTML bruto) é ignorado.
- `src/corpus/types.ts`: `Fonte`, `Artigo`, `Dispositivo`, `NormaNormalizada`
- `src/ingest/planalto.ts`: parser das leis do Planalto (texto compilado)
- `src/ingest/encoding.ts`: detecção de charset (Planalto costuma usar windows-1252)
- `src/ingest/cli.ts`: CLI de ingestão
- `test/fixtures/planalto-ficticia.html`: norma fictícia que imita a estrutura do Planalto
- `docs/adr/`: decisões de arquitetura (0001 a 0005)

## Decisões (detalhes em docs/adr)
- **Stack:** TypeScript, Node 22, ESM, `strict`. Sem framework de RAG na v1 (ADR 0001). O autor ainda não confirmou explicitamente este ponto.
- **LLM:** Gemini nível gratuito como principal, OpenRouter como fallback, os dois pela API compatível com OpenAI (ADR 0002). Avaliação roda sem fallback. Toda resposta registra provedor e modelo.
- **Embeddings:** locais primeiro (família e5 via transformers.js), comparados com API pela avaliação; troca só com ganho de pelo menos 5 p.p. em recall@5 (ADR 0003).
- **Banco vetorial:** Qdrant em Docker, imagem fixada em v1.19.2; busca híbrida a avaliar (ADR 0004).
- **Corpus v1:** Lei 9.613/1998, Lei 7.492/1986, Lei 13.810/2019, Circular BCB 3.978/2020, Carta Circular BCB 4.001/2020, Resolução Conjunta CMN/BCB 6/2023 (ADR 0005).

## Regras do domínio
- Nunca escrever texto de norma de memória, nem em teste ou exemplo. Teste usa a norma fictícia; dado real vem da fonte oficial.
- Sempre o texto compilado. Texto riscado (revogado) é descartado; dispositivo só com "(Revogado)" fica marcado como `revogado`.
- Citação no formato `<sigla>, <caminho>`, ex.: `Lei 9.613/1998, art. 1º, § 2º, I`. Até o 9 o artigo é ordinal (1º); do 10 em diante, cardinal (10).
- O conjunto de avaliação (gabarito) é rascunhado pelo Claude e validado pelo autor, dispositivo por dispositivo. Gabarito gerado por LLM sem revisão não vale.

## Convenções
- Código, comentários, mensagens e documentação em português. Mensagens de commit em inglês, seguindo o histórico.
- Imports com extensão `.js` (ESM com `nodenext`).
- Antes de commitar: `npm run typecheck` e `npm test`.

## Estado atual (2026-10-07)
- **Branch:** o trabalho está em `ccr-a02eebd2-6nvng1`, ainda não mesclado na `main`. Se a sessão começar na `main` sem estes arquivos, rode `git fetch origin ccr-a02eebd2-6nvng1` e parta dessa branch.
- **Pronto:** estrutura do projeto, CI, ADRs, manifesto de fontes, parser do Planalto com 14 testes passando, CLI de ingestão.
- **Não validado:**
  - O parser nunca rodou contra a página real do Planalto; só contra a norma fictícia.
  - O `docker-compose.yml` nunca subiu (a sessão anterior não tinha Docker rodando).
  - Nenhuma URL de `corpus/fontes.json` foi conferida. Títulos e datas das normas do BCB também precisam de conferência.
- **Bloqueio da sessão anterior:** a política de rede negava `www.planalto.gov.br`, `www.bcb.gov.br`, `huggingface.co` e `openrouter.ai`. O Gemini (`generativelanguage.googleapis.com`) respondia. Na primeira ação da sessão, teste esses domínios com `curl`.

## Próximos passos
1. Testar a rede. Com acesso, rodar `npm run ingest -- lei-9613`, ler os avisos e corrigir o parser contra a página real. Conferir e marcar `urlVerificada` nas URLs.
2. Ingerir Lei 7.492 e Lei 13.810 (mesmo parser).
3. Investigar como o BCB publica as normas (a página `exibenormativo` pode carregar o texto via API) e escrever o parser `bcb`. Confirmar se a Circular 3.978 tem texto com as alterações incorporadas.
4. Divisão em trechos, embeddings locais e indexação no Qdrant.
5. Rascunhar as primeiras perguntas de avaliação para o autor revisar.

## Pendências com o autor
- Confirmar a v1 sem framework de RAG (ADR 0001).
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
- Abrir PR e mesclar a branch na `main`.
