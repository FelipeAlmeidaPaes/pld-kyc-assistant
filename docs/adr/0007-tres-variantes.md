# ADR 0007: Três variantes do RAG na v1, com e sem framework

- Status: Aceita
- Data: 2026-10-07
- Substitui em parte: ADR 0001 (a v1 deixa de ser só sem framework)

## Contexto
O autor quer aprender e comparar as duas formas de montar o RAG: escrevendo cada etapa e usando um framework. As duas rodam juntas, em endpoints diferentes, e passam pela mesma avaliação. O roadmap continua: v2 é o servidor MCP e v3 é o agente; as variantes são parte da v1.

## Decisão
Três variantes, cada uma com seu endpoint:

| Variante | Endpoint | O que é |
|---|---|---|
| `manual` | `POST /manual/perguntar` | Cada etapa escrita no projeto: cliente do Qdrant, `fetch` para o LLM, prompt e parsing à mão |
| `langchain` | `POST /langchain/perguntar` | LangChain.js com os nossos trechos por dispositivo |
| `langchain-padrao` | `POST /langchain-padrao/perguntar` | LangChain.js com o divisor de texto padrão dele (`RecursiveCharacterTextSplitter`, 1.000 caracteres, 200 de sobreposição) sobre o texto corrido da norma |

Cada variante também tem `POST /<variante>/buscar`, que devolve só os trechos recuperados, sem LLM: compara a busca sem gastar cota e funciona sem chave. Sem provedor configurado, `/perguntar` responde 503.

### O que é igual nas três
- Corpus normalizado e regra do índice (ADR 0005).
- Modelo de embeddings e5 local, com os prefixos `query: ` e `passage: `. No LangChain, entra como uma classe `Embeddings` própria, que usa o mesmo gerador da variante manual.
- Provedor e modelo de LLM (ADR 0002), texto das instruções e esquema da saída: `{ cobre, resposta, citacoes: [{ sigla, caminho }] }`.
- Regras de recusa e validação de citação: a resposta só sai se cada citação existir no corpus e o texto do dispositivo estiver nos trechos recuperados. A regra é uma função compartilhada; o framework não oferece isso, e qualquer aplicação real escreveria essa parte.
- Número de trechos recuperados e conjunto de avaliação.

### O que muda
- `manual` x `langchain`: só a orquestração (indexação, busca, montagem do prompt, chamada, saída estruturada, fallback). Com o mesmo modelo de embeddings, as duas devem recuperar os mesmos trechos; diferença aí é efeito do framework.
- `langchain` x `langchain-padrao`: só a divisão do texto. Mostra o que um divisor genérico faz com a citação de dispositivo.

## Por que LangChain.js
- Ativo e o mais usado; tem integração com Qdrant, chat compatível com OpenAI (Gemini e OpenRouter) e divisores de texto.
- Alternativas: LlamaIndex.TS sem atualização desde 31/12/2025; Mastra, mais voltado a agentes e com versão nova quase todo dia.

## Detalhes de implementação
- A integração de embeddings do LangChain (`@langchain/community`) exige o transformers.js v3; o projeto usa a v4. Duas versões do motor dariam vetores diferentes entre as variantes. Por isso a classe `Embeddings` própria, e `@langchain/community` não é instalado.
- Dependências do RAG em versão exata: mudam vetores e comportamento, e a avaliação precisa ser repetível.
- `.npmrc` com `onnxruntime-node-install=skip`: os embeddings rodam na CPU, e o `onnxruntime-node` tentaria baixar binários de CUDA na instalação.
- O cliente do Qdrant 1.19.0 fixa o `undici` em 7.29.0, com falhas corrigidas na 7.29.1; o `package.json` força a 7.30.0 por `overrides`.
- Cada variante tem a sua coleção no Qdrant, com o nome do modelo de embeddings (ADR 0003).

## Diferenças que a construção revelou (2026-10-08)
Testes com um servidor de LLM falso, que grava as requisições, mostraram onde o framework age por conta própria:

| Ponto | Manual | LangChain.js |
|---|---|---|
| Esquema da saída | JSON Schema como escrito | Com esquema zod, acrescenta `$schema` e põe `"title": "resposta"` em todos os campos. Por isso o LangChain recebe o mesmo JSON Schema da variante manual; o teste de paridade garante que o modelo recebe o mesmo pedido (fora `stream: false`). |
| 429 sem cabeçalho | Até 3 tentativas, com espera de 1 s e 2 s | Não repete: classifica como falta de capacidade e falha, para o fallback agir. Só repete se a resposta disser quanto esperar (`Retry-After` ou "retry in Ns"), e aí com a espera dele (1-2 s, 2-4 s). Mantido como está: é diferença de orquestração, que é o que se quer comparar. |
| Fallback | Laço sobre os provedores | `withFallbacks` |
| Tokens e modelo servido | Lidos do JSON da resposta | Lidos de `usage_metadata` e `response_metadata` da mensagem bruta (`includeRaw`) |

Com o Gemini real (`gemini-3.5-flash-lite`), a mesma pergunta nas três variantes deu a mesma resposta e a mesma citação. `manual` e `langchain` gastaram exatamente os mesmos tokens (1.015 de entrada, 106 de saída), o que confirma fora do teste que o pedido é idêntico; `langchain-padrao` gastou 1.357 de entrada. O Gemini aceita `response_format` com `json_schema` e `strict: true` pela API compatível com a da OpenAI.

Comparação da busca com 12 perguntas de diagnóstico (não é a avaliação):
- `manual` e `langchain` recuperaram os mesmos 5 trechos, com as mesmas pontuações, nas 12. Com os mesmos componentes, o framework não muda a busca.
- Dos 60 dispositivos que a `manual` recuperou, 43 (72%) aparecem inteiros em algum pedaço recuperado pela `langchain-padrao`. Nos outros, a citação não teria como ser conferida.
- A pergunta fora do corpus teve melhor trecho com 0,858; as do tema, de 0,873 a 0,903. Com o e5, as pontuações ficam numa faixa estreita, então o limiar sozinho não serve para recusar; a recusa depende do modelo e da validação de citação.

## Consequências
- Mais código e mais cota de LLM: a avaliação roda três vezes. A cota gratuita do Gemini limita quantas rodadas cabem por dia.
- A comparação mede também linhas de código, dependências e facilidade de inspecionar prompt e tokens, além de recuperação, acerto, citação, recusa, custo e latência.
- O servidor MCP da v2 vai expor a variante que a avaliação indicar, ou as três.
