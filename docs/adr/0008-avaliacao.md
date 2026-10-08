# ADR 0008: Como a avaliação mede as variantes

- Status: Aceita
- Data: 2026-10-08

## Contexto
A v1 entrega RAG com citação e recusa, e a ADR 0007 pede que as três variantes passem pela mesma avaliação. O gabarito precisa ser validado pelo autor, dispositivo por dispositivo, e as chamadas ao LLM precisam caber no nível gratuito do Gemini (ADR 0002), que limita requisições por minuto e por dia.

## Decisão

### Conjunto
- `avaliacao/perguntas.json` é a fonte da verdade. Cada pergunta tem o gabarito, os dispositivos **exigidos** (base do recall e do MRR), os **aceitos** (relevantes, citar não é erro) e o que a resposta **não deve** afirmar.
- As perguntas vão ao RAG sem o nome da norma e sem o número do artigo, como um usuário perguntaria. O texto original do autor fica guardado, para medir depois se nomear a norma ajuda.
- 30 perguntas cobertas pelo corpus (do autor, com gabarito conferido no texto) e 6 fora do corpus, para medir a recusa. Algumas são armadilhas de propósito: o corpus tem trechos parecidos.
- Todo dispositivo citado no conjunto tem de estar no índice, na grafia exata do corpus; um teste confere. `avaliacao/revisao.md` mostra o texto de cada um, para a validação.
- Só entram na execução as perguntas com `validado: true`. A primeira validação foi em bloco ("Tudo ok", 2026-10-08), não item por item.

### Execução (`npm run avaliar -- <rótulo>`)
- Só o provedor principal, sem fallback (ADR 0002, regra 2). O modelo pedido fica gravado em cada registro.
- Intervalo mínimo entre chamadas ao LLM (padrão 5 s). Falha é repetida duas vezes, com 15 s e 60 s de espera, além das tentativas do próprio cliente. Erro que persiste vira registro com erro, refeito na próxima retomada; 429 que persiste interrompe a execução, porque seguir só acumularia falhas.
- Um arquivo JSONL por rótulo, em `avaliacao/execucoes/`, que só recebe linhas novas. Rodar de novo com o mesmo rótulo retoma o que falta; vale o registro mais recente de cada par pergunta e variante. Rótulo com configuração diferente (k, profundidade, limiar, embeddings, modelo) é recusado.
- `--sem-llm` registra só a busca: não gasta cota, e serve para comparar mudanças na busca.

### Métricas
- **Busca**, nas perguntas cobertas, com a busca registrada até a posição 20:
  - recall@k: média da fração dos dispositivos exigidos que vieram até a posição k (k = trechos que vão ao modelo);
  - acerto@k: fração das perguntas com ao menos um exigido até k;
  - MRR@20: média de 1/posição do primeiro exigido.
- Na variante `langchain-padrao`, o pedaço não tem caminho. Ele é localizado no texto corrido da norma e contém os dispositivos de todas as linhas que toca, mesmo em parte.
- Pontuação do melhor trecho, separada entre cobertas e fora do corpus, para calibrar o limiar de recusa sem chamar o LLM.
- **Resposta:** falsa recusa (coberta recusada), recusa correta (fora do corpus recusada), motivo de cada recusa, citações pertinentes (feitas que estão entre exigidos e aceitos), cobertura das citações (exigidos citados), tokens, custo a preço de tabela e latência (p50 e p95).

### Não medido ainda
- Se o conteúdo da resposta está certo e se ela afirma algo de `naoDeve`. Isso pede um juiz. Pela ADR 0002 (regra 3), um LLM avaliador seria fixo e apareceria no relatório. Fica para decisão própria, com o resultado desta avaliação em mãos.

## Alternativas consideradas
- **Medir pelo servidor HTTP:** acrescenta rede e serialização sem medir nada a mais. O executor chama as mesmas variantes montadas pelo servidor.
- **Recall só nos k trechos da resposta:** não diz quão longe ficou o dispositivo que faltou. Registrar até 20 custa só busca local.
- **Reindexar o divisor padrão com os caminhos no metadado:** daria o mesmo mapeamento, mas mexeria no índice que se quer comparar. Localizar o pedaço no texto corrido não muda nada no RAG.

## Consequências
- Na variante padrão, cada pedaço contém em média cinco dispositivos: o recall@5 dela compara contextos maiores. Os tokens de entrada mostram a diferença.
- Com 30 perguntas cobertas, uma pergunta vale 3,3 p.p. O ganho mínimo de 5 p.p. em recall@5 da ADR 0003 equivale a duas perguntas; diferença menor é ruído.
- Com 6 perguntas fora do corpus, um limiar tirado da pontuação do melhor trecho tende a ficar ajustado a estas 6. Calibrar exige mais perguntas fora do corpus.
- A mesma execução pode variar entre rodadas mesmo com `temperature` 0. Antes de comparar variantes pela resposta, convém medir essa variação repetindo uma execução.
