# pld-kyc-assistant

Assistente de perguntas e respostas sobre normas brasileiras de prevenção à lavagem de dinheiro (PLD) e KYC. Toda resposta se baseia no texto da norma e cita o dispositivo de origem.

> Status: em desenvolvimento (v1).

## Por que este projeto
Normas de PLD/KYC são longas, remetem umas às outras e mudam com frequência. Um assistente que responde com confiança e sem fonte é pior do que nenhum assistente, ainda mais em compliance. Aqui, citação, recusa e custo são requisitos, e cada um é medido.

## Escopo da v1
- Ingestão de normas públicas, com divisão por artigo: Lei 9.613/1998, Circular Bacen 3.978/2020 (com as alterações da Resolução BCB 119/2021) e resoluções do COAF
- Controle de vigência: cada documento guarda a data de referência e usa o texto com as alterações incorporadas
- Busca semântica em banco vetorial local, sem dependência de serviço externo
- Respostas com citação obrigatória do dispositivo (artigo, inciso, parágrafo)
- Recusa explícita quando a base não cobre a pergunta
- Conjunto de avaliação com cerca de 30 perguntas, medindo acerto, citação correta e recusa adequada
- Registro de tokens, custo e latência por consulta

Fora da v1: interface, servidor MCP, agentes e usuários.

## Roadmap
| Versão | Entrega |
|---|---|
| v1 | RAG com avaliação e medição de custo |
| v2 | Servidor MCP expondo a busca como ferramenta |
| v3 | Agente que consulta o servidor MCP |
| Contínuo | Proteção contra prompt injection e governança |

## Stack
TypeScript e Node.js. As demais escolhas serão registradas como decisões de arquitetura em `docs/adr`.

## Fontes
Os documentos são atos oficiais (leis, circulares e resoluções), que não são protegidos por direito autoral (Lei 9.610/1998, art. 8º, IV). Cada documento é versionado com o link da fonte oficial.

## Aviso
Projeto de estudo e portfólio. Não substitui análise jurídica ou de compliance.

## Créditos
Técnicas estudadas na pós-graduação em Engenharia de Software com IA Aplicada (UNIPDS). Código escrito do zero, sem reaproveitar material do curso.
