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
npm run ingest -- <id> --arquivo pagina.html   # usa documento salvo (HTML do Planalto ou PDF compilado do BCB)
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
- `corpus/normalized/`: texto normalizado por norma, versionado no Git, com `documento` (de onde veio) e `sha256`. `corpus/raw/` (HTML, PDF e JSON brutos) é ignorado. Hoje: as seis normas do corpus.
- `src/corpus/types.ts`: `Fonte`, `Artigo`, `Dispositivo`, `NormaNormalizada`
- `src/ingest/dispositivos.ts`: parser de dispositivos (artigo, parágrafo, inciso, alínea, item), comum ao Planalto e ao BCB, e `verificarArtigos`
- `src/ingest/html.ts`: linhas de texto visível de um HTML, sem texto riscado
- `src/ingest/planalto.ts`: ruído do firewall do Planalto e `parsePlanalto`
- `src/ingest/pdf.ts`: linhas do PDF (pdfjs) e remontagem dos parágrafos pela geometria
- `src/ingest/bcb.ts`: API do BCB, escolha do PDF compilado, corte da assinatura, `paragrafosSoltos`
- `src/ingest/encoding.ts`: detecção de charset (Planalto costuma usar windows-1252)
- `src/ingest/cli.ts`: CLI de ingestão
- `test/fixtures/planalto-ficticia.html`: norma fictícia que imita a estrutura do Planalto
- `test/fixtures/pdf-ficticio.ts`: gera PDF fictício para testar a leitura de posições
- `docs/adr/`: decisões de arquitetura (0001 a 0006)

## Decisões (detalhes em docs/adr)
- **Stack:** TypeScript, Node 22, ESM, `strict`. Sem framework de RAG na v1 (ADR 0001). O autor ainda não confirmou explicitamente este ponto.
- **LLM:** Gemini nível gratuito como principal, OpenRouter como fallback, os dois pela API compatível com OpenAI (ADR 0002). Avaliação roda sem fallback. Toda resposta registra provedor e modelo.
- **Embeddings:** locais primeiro (família e5 via transformers.js), comparados com API pela avaliação; troca só com ganho de pelo menos 5 p.p. em recall@5 (ADR 0003).
- **Banco vetorial:** Qdrant em Docker, imagem fixada em v1.19.2; busca híbrida a avaliar (ADR 0004).
- **Corpus v1:** Lei 9.613/1998, Lei 7.492/1986, Lei 13.810/2019, Circular BCB 3.978/2020, Carta Circular BCB 4.001/2020, Resolução Conjunta CMN/BCB 6/2023 (ADR 0005).
- **PDF do BCB:** `pdfjs-dist` em versão exata, parágrafos remontados pela geometria (ADR 0006). Aceito pelo autor "por enquanto"; revisar se aparecer PDF que não leia bem.
- **Índice:** dispositivo sem texto próprio (revogado, vigência encerrada, só "(VETADO)") fica no texto normalizado e não entra no índice (ADR 0005). "(Vetado)" no meio de texto válido fica.

## Fontes oficiais: como baixar
- **Planalto:** o firewall (F5) derruba a conexão se o User-Agent não começar com `Mozilla/5.0`; com `curl` padrão a resposta é vazia, o que parece bloqueio de rede e não é. O F5 também injeta `<script id="f5_cspm">` com token aleatório em cada resposta; `removerRuidoDoFirewall` tira o script antes do hash. As páginas não declaram charset (nem cabeçalho nem `<meta>`) e vêm em windows-1252.
- **Planalto, HTML:** `<p>` sem fechar e quebras de linha no meio do dispositivo ("I - <quebra> texto"). Às vezes o "Parágrafo único." vem no mesmo `<p>` do caput (lei 13.810). Link "Vigência" sem parênteses é anotação. A lei 7.492 usa título em caixa alta sem "CAPÍTULO".
- **BCB:** `exibenormativo` é uma SPA. Os dados vêm de `https://www.bcb.gov.br/api/conteudo/app/normativos/exibenormativo?p1=<tipo>&p2=<número>` (JSON). O campo `Texto` é o **texto original**, sem as alterações (Circular 3.978: não tem o art. 23-A e traz o art. 68 revogado com a redação antiga).
- **BCB, texto compilado:** só em PDF, em `https://normativos.bcb.gov.br/Lists/Normativos/Attachments/<Id>/<arquivo>`. O campo `Documentos` lista `<nome>;<KB>#;<nome>;<KB>#;...`, com nomes `<prefixo>_v<N>_<O|L|P>.pdf`: `O` original, `L` compilado limpo (só o vigente), `P` compilado com a redação anterior junto. O CLI usa o `L` da maior versão; sem PDF, usa o HTML da API só se `Atualizacoes` estiver vazio, e recusa norma revogada ou cancelada. Normas com versões em HTML aparecem em `buscaversoes?p1=<Id>` e `exibeversao?p1=<Id>&p2=<versão>&p3=Vigente`.
- **BCB, PDF:** margem em x≈85, recuo de parágrafo em x≈156, linhas a ~15 pt e parágrafos a ~21 pt, cabeçalho e rodapé com fonte menor. Depois do último artigo vêm assinatura e "Este texto não substitui o publicado no DOU", cortados por `cortarFecho`. Há itens ("1.") dentro de alínea (Circular 3.978, art. 24) e alíneas de duas letras ("aa)", Carta Circular 4.001, art. 1º, IV).

## Regras do domínio
- Nunca escrever texto de norma de memória, nem em teste ou exemplo. Teste usa a norma fictícia; dado real vem da fonte oficial.
- Sempre o texto compilado. Texto riscado (revogado) é descartado; dispositivo só com "(Revogado)" fica marcado como `revogado`.
- Citação no formato `<sigla>, <caminho>`, ex.: `Lei 9.613/1998, art. 1º, § 2º, I`; com item, `Circular BCB 3.978/2020, art. 24, § 3º, VI, g, 1`. Até o 9 o artigo é ordinal (1º); do 10 em diante, cardinal (10).
- O conjunto de avaliação (gabarito) é rascunhado pelo Claude e validado pelo autor, dispositivo por dispositivo. Gabarito gerado por LLM sem revisão não vale.

## Convenções
- Código, comentários, mensagens e documentação em português. Mensagens de commit em inglês, seguindo o histórico.
- Imports com extensão `.js` (ESM com `nodenext`).
- Antes de commitar: `npm run typecheck` e `npm test`.

## Estado atual (2026-10-07, fim da segunda sessão)
- **Branch:** o trabalho das duas primeiras sessões (branches `ccr-a02eebd2-6nvng1` e `claude/test-domain-connection-7yur2q`) foi mesclado na `main` por PR em 2026-10-07. A próxima sessão parte da `main`.
- **Rede (testada com `curl`):** respondem `www.planalto.gov.br` (só com User-Agent `Mozilla/5.0...`), `www.bcb.gov.br`, `normativos.bcb.gov.br`, `huggingface.co` (inclusive os pesos via `us.aws.cdn.hf.co`), `openrouter.ai`, `generativelanguage.googleapis.com`, `registry.npmjs.org`, `mirror.gcr.io`. `cdn-lfs.huggingface.co` é negado pela política, mas o download de modelo não passa por ele hoje. Docker Hub responde 429. Não há `GEMINI_API_KEY` nem `OPENROUTER_API_KEY` no ambiente.
- **Pronto:**
  - As seis normas do corpus ingeridas e com `urlVerificada: true` (título do documento baixado bate com o manifesto). Capturas determinísticas: o hash não muda entre downloads.

    | Norma | Fonte do texto | Artigos | Dispositivos |
    |---|---|---|---|
    | Lei 9.613/1998 | HTML do Planalto | 29 | 158 |
    | Lei 7.492/1986 | HTML do Planalto | 35 | 62 |
    | Lei 13.810/2019 | HTML do Planalto | 36 | 92 |
    | Circular BCB 3.978/2020 | PDF compilado v6 (inclui Res. BCB 591, de 30/9/2026) | 71 | 379 |
    | Carta Circular BCB 4.001/2020 | PDF compilado v4 | 2 | 189 |
    | Resolução Conjunta CMN/BCB 6/2023 | HTML da API (nunca alterada) | 13 | 78 |
  - Parser do Planalto corrigido contra a página real (charset, "Art. 10A.", quebras de linha, parágrafo na mesma linha, revogados, pena, "Vigência", hierarquia de agrupamento).
  - Parser do BCB: API, escolha do PDF `L`, remontagem de parágrafos, corte da assinatura, itens e alíneas de duas letras. Avisos no CLI para parágrafo sem rótulo e para descarte excessivo de linhas.
  - 41 testes, todos com texto fictício. Os testes novos falham quando a correção correspondente é desfeita.
  - Qdrant v1.19.2 subiu pelo `docker-compose.yml` (com a imagem vinda do mirror).
- **Como foi validado:**
  - PDFs do BCB: cada dispositivo foi procurado literalmente no texto do `pdftotext`, outro extrator: 379/379 (3.978) e 187/189 (4.001; as 2 diferenças são espaço antes de ";").
  - As seis normas: nenhum caminho de citação duplicado; nenhuma lacuna na numeração de artigos.
- **Não validado:**
  - Leis do Planalto e Res. Conjunta 6: conferidas por heurística (dispositivo colado, título vazando, assinatura, texto vazio, numeração), não contra um segundo extrator nem dispositivo por dispositivo.
  - Lei 13.810 não tem nenhuma nota de alteração na página do Planalto. Pode nunca ter sido alterada; não foi conferido em outra fonte.

## Próximos passos
1. Divisão em trechos, embeddings locais e indexação no Qdrant, aplicando a regra do índice (ADR 0005).
2. Rascunhar as primeiras perguntas de avaliação para o autor revisar.

## Pendências com o autor
- Confirmar a v1 sem framework de RAG (ADR 0001). Em 2026-10-07 o autor leu como "v1 sem RAG"; foi explicado que o RAG fica, só que escrito à mão. Aguarda resposta.
- Decidir se entram a Lei 13.260/2016 (financiamento do terrorismo) e a regulamentação do BCB para a Lei 13.810 (possivelmente a Resolução BCB 44/2020, a confirmar).
