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

Na sessão na nuvem, o Docker não sobe sozinho e o Docker Hub costuma responder 429 (limite de pulls anônimos):
```bash
dockerd > /tmp/dockerd.log 2>&1 &
docker pull mirror.gcr.io/qdrant/qdrant:v1.19.2 && docker tag mirror.gcr.io/qdrant/qdrant:v1.19.2 qdrant/qdrant:v1.19.2
docker compose up -d
```

## Estrutura
- `corpus/fontes.json`: manifesto das normas (id, sigla, URL oficial, formato do parser, `urlVerificada`)
- `corpus/normalized/`: texto normalizado por norma, versionado no Git. `corpus/raw/` (HTML bruto) é ignorado. Hoje: `lei-9613`, `lei-7492`, `lei-13810`.
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

## Fontes oficiais: como baixar
- **Planalto:** o firewall (F5) derruba a conexão se o User-Agent não começar com `Mozilla/5.0`; com `curl` padrão a resposta é vazia, o que parece bloqueio de rede e não é. O F5 também injeta `<script id="f5_cspm">` com token aleatório em cada resposta; `removerRuidoDoFirewall` tira o script antes do hash. As páginas não declaram charset (nem cabeçalho nem `<meta>`) e vêm em windows-1252.
- **Planalto, HTML:** `<p>` sem fechar e quebras de linha no meio do dispositivo ("I - <quebra> texto"). Às vezes o "Parágrafo único." vem no mesmo `<p>` do caput (lei 13.810). Link "Vigência" sem parênteses é anotação. A lei 7.492 usa título em caixa alta sem "CAPÍTULO".
- **BCB:** `exibenormativo` é uma SPA. Os dados vêm de `https://www.bcb.gov.br/api/conteudo/app/normativos/exibenormativo?p1=<tipo>&p2=<número>` (JSON). O campo `Texto` é o **texto original**, sem as alterações (Circular 3.978: não tem o art. 23-A e traz o art. 68 revogado com a redação antiga).
- **BCB, texto compilado:** só em PDF, em `https://normativos.bcb.gov.br/Lists/Normativos/Attachments/<Id>/<arquivo>`. O campo `Documentos` lista `<prefixo>_v<N>_<O|L|P>.pdf`: `O` original, `L` compilado limpo (só o vigente), `P` compilado com a redação anterior junto. Usar o `L` da maior versão. Normas com versões em HTML aparecem em `buscaversoes?p1=<Id>` e `exibeversao?p1=<Id>&p2=<versão>&p3=Vigente`.

## Regras do domínio
- Nunca escrever texto de norma de memória, nem em teste ou exemplo. Teste usa a norma fictícia; dado real vem da fonte oficial.
- Sempre o texto compilado. Texto riscado (revogado) é descartado; dispositivo só com "(Revogado)" fica marcado como `revogado`.
- Citação no formato `<sigla>, <caminho>`, ex.: `Lei 9.613/1998, art. 1º, § 2º, I`. Até o 9 o artigo é ordinal (1º); do 10 em diante, cardinal (10).
- O conjunto de avaliação (gabarito) é rascunhado pelo Claude e validado pelo autor, dispositivo por dispositivo. Gabarito gerado por LLM sem revisão não vale.

## Convenções
- Código, comentários, mensagens e documentação em português. Mensagens de commit em inglês, seguindo o histórico.
- Imports com extensão `.js` (ESM com `nodenext`).
- Antes de commitar: `npm run typecheck` e `npm test`.

## Estado atual (2026-10-07, segunda sessão)
- **Branch:** `claude/test-domain-connection-7yur2q`, que contém a `ccr-a02eebd2-6nvng1` e o trabalho desta sessão. Nada foi mesclado na `main`.
- **Rede (testada com `curl`):** respondem `www.planalto.gov.br` (só com User-Agent `Mozilla/5.0...`), `www.bcb.gov.br`, `normativos.bcb.gov.br`, `huggingface.co` (inclusive os pesos via `us.aws.cdn.hf.co`), `openrouter.ai`, `generativelanguage.googleapis.com`, `registry.npmjs.org`, `mirror.gcr.io`. `cdn-lfs.huggingface.co` é negado pela política, mas o download de modelo não passa por ele hoje. Docker Hub responde 429. Não há `GEMINI_API_KEY` nem `OPENROUTER_API_KEY` no ambiente.
- **Pronto:**
  - Leis 9.613, 7.492 e 13.810 ingeridas da página real e com `urlVerificada: true` (título conferido; 9.613 e 7.492 trazem alterações até 2026 e 2022). Hash estável entre capturas.
  - Parser do Planalto corrigido contra a página real: charset sem declaração, letra colada no número ("Art. 10A."), quebra de linha do código-fonte, parágrafo na mesma linha, inciso "(revogado);", pena depois do último inciso, link "Vigência", hierarquia capítulo > seção, título solto em caixa alta, nota sozinha confundida com nome de capítulo. 24 testes; os testes novos falham no parser antigo.
  - Qdrant v1.19.2 subiu pelo `docker-compose.yml` (com a imagem vinda do mirror).
  - Investigação do BCB (seção "Fontes oficiais").
- **Não validado:**
  - Lei 13.810 não tem nenhuma nota de alteração na página do Planalto. Pode nunca ter sido alterada; não foi conferido em outra fonte.
  - URLs do BCB continuam `urlVerificada: false`: número, título e data batem com a API, mas a ingestão vai usar o PDF, não a URL da página.
  - Conferência por amostragem do texto normalizado contra a página: feita por heurística (dispositivo colado, título vazando, assinatura, texto vazio), não dispositivo por dispositivo.

## Próximos passos
1. Parser `bcb`: buscar `exibenormativo` na API, escolher o `_v<N>_L.pdf` mais recente e extrair o texto. Circular 3.978 (v6, inclui a Res. BCB 591, de 30/9/2026) e Carta Circular 4.001 (v4) só existem compiladas em PDF. A Resolução Conjunta 6 não tem alteração e pode usar o HTML do campo `Texto`. Tirar cabeçalho e rodapé do PDF ("Circular nº 3.978, de 23 de janeiro de 2020 Página N de 26", "Público").
2. Divisão em trechos, embeddings locais e indexação no Qdrant.
3. Rascunhar as primeiras perguntas de avaliação para o autor revisar.

## Pendências com o autor
- Confirmar a v1 sem framework de RAG (ADR 0001).
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
- Extração de PDF do BCB: `pdftotext` (poppler, dependência de sistema, também no CI) ou biblioteca npm (`pdfjs-dist`/`unpdf`, só Node, layout precisa ser reconstruído). Vale ADR.
- Art. 17-F da Lei 9.613: incluído pela MP 1.158/2023, com "Vigência encerrada" e texto riscado. Hoje fica sem texto e não marcado como `revogado`, e o CLI avisa. Decidir se vira um estado próprio (ex.: `semEficacia`) ou se sai do índice.
- Dispositivos "(VETADO)" (lei 7.492) ficam com o texto "(VETADO)." e não são marcados. Decidir se entram no índice.
- Abrir PR e mesclar a branch na `main`.
