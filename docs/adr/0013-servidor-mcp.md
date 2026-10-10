# ADR 0013: Servidor MCP com busca, leitura de dispositivo e conferência da resposta

- Status: Aceita
- Data: 2026-10-10
- Complementa: ADR 0007 (variantes), ADR 0012 (conferência de valores)

## Contexto
A v2 (módulo 03 da pós) expõe o assistente por MCP (Model Context Protocol), para que um cliente como o Claude Code, o Claude Desktop ou o agente da v3 o use como ferramenta. O roadmap dizia "servidor MCP expondo a busca, validado com a mesma avaliação". Dois problemas nessa formulação:

- **Quem escreve a resposta muda.** Na v1, o Gemini escreve dentro do pipeline, e a validação de citação, a conferência de valores e a recusa (`concluirResposta`) rodam depois dele. Num servidor MCP, quem escreve é o modelo do cliente, e nada do que a v1 confere sem IA chega até ele. Expor só a busca devolveria o problema da q04 (ADR 0012): multa de "20%" que não existe, com citação válida.
- **A avaliação não mede nada novo.** O servidor transporta a mesma busca (mesma coleção, mesmo modelo de embeddings, mesmo cache). Os trechos têm de ser os mesmos da variante `manual`; o que a avaliação pode provar é que o transporte não perde nem altera nada. Rodar as 36 perguntas com o Gemini por trás do MCP só mediria o ruído do modelo, já medido (até 2 perguntas, ADR 0012).

## Decisão
**Três ferramentas, todas só de leitura** (`readOnlyHint`, `idempotentHint`, `openWorldHint: false`), com esquema de entrada e de saída (`structuredContent`):

| Ferramenta | Entrada | O que devolve |
|---|---|---|
| `buscar` | `consulta`, `k` (1 a 20; padrão 8, o da v1) | Os trechos da busca da `manual`, no mesmo formato que a v1 mostra ao modelo, com sigla, caminho e pontuação |
| `ler_dispositivo` | `sigla`, `caminho` | Os dispositivos que abrem o pedido, ele e os que vêm abaixo, cada um com o caminho; só com o artigo (`art. 12`), o artigo inteiro. Aceita a grafia do modelo ("Lei nº 9.613", "inciso I") |
| `conferir_resposta` | `resposta`, `citacoes` | `aprovada` e os problemas: citação que não existe, citação de dispositivo sem texto próprio, prazo, percentual, valor ou data sem respaldo no texto citado (ADR 0012), resposta sem citação |

- **Instruções do servidor** (campo `instructions` do MCP) com o roteiro: buscar, ler o dispositivo quando o trecho remete a outro ou a lista parece incompleta, responder só com o texto citando cada afirmação, conferir antes de entregar, dizer o que a base não cobre. Os trechos são dados, não instruções.
- **Só a busca da `manual`.** Recupera os mesmos trechos da `langchain` (ADR 0007), sem framework. A `langchain-padrao` não tem caminho de dispositivo, e o caminho é o que o cliente cita.
- **A conferência perde uma regra da v1.** Na v1, a citação só vale se o texto do dispositivo veio nos trechos recuperados, e o valor só tem respaldo no texto que veio. O servidor não sabe o que o cliente leu (é sem estado, e o cliente pode ter lido pelo `ler_dispositivo`), então confere contra todo o texto do dispositivo citado, dos que o abrem e dos que vêm abaixo dele. `validarCitacoes` e `quantidadesSemRespaldo` recebem `null` no lugar dos trechos para isso; a v1 continua com a regra inteira.
- **Sem a ferramenta `perguntar`** (o pipeline inteiro da v1): poria um LLM dentro de uma ferramenta chamada por outro LLM, gastaria a cota do Gemini a cada chamada, e o cliente já é um modelo.
- **Dois transportes**, pelo SDK oficial v2 (`@modelcontextprotocol/server`, `/client` e `/node`, versões exatas), que implementa a especificação 2026-07-28 e atende também clientes da de 2025:
  - **stdio** (`npm run --silent mcp`): o cliente inicia o processo. O stdout é o canal do protocolo: antes de montar os recursos, `console.log`, `console.info` e `console.debug` passam a ir para o stderr. O `.env` é lido da raiz do projeto, não da pasta de onde o cliente iniciou o processo.
  - **Streamable HTTP** (`npm run mcp -- --http`, porta 3001, caminho `/mcp`): sem estado, um servidor novo por requisição sobre recursos montados uma vez. **Só em 127.0.0.1 e sem autenticação**: a CLI não aceita outro endereço. Host e Origin são conferidos contra DNS rebinding (página maliciosa que aponta o próprio domínio para 127.0.0.1). Expor na rede exigiria autenticação (OAuth, pela especificação), fora do escopo do módulo.
- **Validação por paridade, sem LLM:** `npm run avaliar -- <rótulo> --sem-llm --mcp stdio|<URL>` roda a avaliação com a busca da `manual` passando pelo servidor, e `npm run avaliacao:comparar-busca` compara trecho a trecho, com a pontuação exata.

## Alternativas consideradas
- **Só `buscar`:** literal ao roadmap, mas o cliente escreve sem nenhuma das conferências da v1.
- **`buscar` e `perguntar`:** mantém as garantias, ao custo de cota e de um modelo dentro do outro (acima).
- **Só stdio:** cobre o Claude Code, o Claude Desktop e o MCP Inspector. O autor pediu também HTTP; o custo foi pequeno porque o SDK separa a fábrica do servidor do transporte.
- **Montar o MCP no servidor Fastify da v1:** um processo só, mas o servidor da v1 exige as três coleções e o LLM, e não confere Host nem Origin. O MCP sobe à parte, com `node:http` e os guardas do SDK.
- **SDK v1 (`@modelcontextprotocol/sdk` 1.32):** ainda publicado, mas o próprio projeto aponta a v2 como a linha estável.

## Resultado
**Paridade** contra a `conferencia-k8` (a última avaliação da v1, mesma busca da `manual`), as 36 perguntas até a posição 20:

| Execução | Transporte | Perguntas com a mesma busca | recall@8 | acerto@8 | MRR@20 | Cota gasta |
|---|---|---|---|---|---|---|
| `mcp-stdio` | stdio, processo filho | 36 de 36 | 84% | 93% | 0,71 | nenhuma (cache) |
| `mcp-http` | Streamable HTTP, 127.0.0.1 | 36 de 36 | 84% | 93% | 0,71 | nenhuma (cache) |

Mesmos trechos, na mesma ordem, com a mesma pontuação: o transporte não altera a busca. Como esperado, isso não diz nada sobre a qualidade das respostas de um cliente; essa é a pergunta da v3.

**As ferramentas novas no caso da q04** (corpus real, por stdio): `ler_dispositivo` com `Lei 9.613, art. 12` traz as alíneas II, a, b e c, cada uma com o caminho; a alínea b é a que a busca não põe entre os 8 primeiros. `conferir_resposta` reprova "multa de 20% (vinte por cento) do valor corrigido da operação" citando o art. 12, II, b (`valor sem respaldo nos dispositivos citados: 20%`) e aprova "inabilitação pelo prazo de até dez anos" citando o art. 12, III.

**Correção na v1 achada no caminho:** a validação de citação aceitava dispositivo revogado ou só "(VETADO)" quando qualquer trecho da mesma norma tinha vindo na busca, porque o texto vazio está contido em qualquer texto. Agora a citação de dispositivo sem texto próprio é recusada nas duas regras. Nas execuções gravadas, nenhuma das 801 citações aceitas era desse tipo: nenhum resultado da v1 muda.

## Consequências
- **As garantias dependem do cliente.** Nada obriga o modelo do cliente a chamar `conferir_resposta`, nem a seguir o que ela aponta; as instruções pedem, e o cliente pode ignorar. Se ele segue, e quanto isso custa, só se mede com um modelo chamando as ferramentas: é a v3.
- **A conferência sem trechos é mais fraca que a da v1:** o cliente pode citar dispositivo que não leu, e o texto sem número não é conferido.
- **Descrições das ferramentas e instruções do servidor são prompt:** mudam o comportamento do cliente, e a v2 não mede isso.
- **Cota de embeddings:** cada consulta nova à `buscar` gasta 1 dos 1.000 textos por dia do `gemini-embedding-2` (ADR 0009); consulta repetida sai do cache. Um cliente que reformula a busca várias vezes gasta mais.
- **HTTP sem autenticação:** qualquer processo da máquina pode chamar o servidor e gastar a cota de embeddings.
- **Dependências novas:** três pacotes do SDK, em versão exata; o `/node` traz o `hono` e o `@hono/node-server` para adaptar o handler ao `node:http`.
