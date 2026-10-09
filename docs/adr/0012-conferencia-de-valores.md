# ADR 0012: Conferência de valores contra o texto citado

- Status: Aceita
- Data: 2026-10-09
- Complementa: ADR 0007 (regras de recusa e citação, iguais nas três variantes)

## Contexto
A validação de citação (ADR 0007) confere que o dispositivo citado existe no corpus e que o texto dele veio nos trechos recuperados. Não confere que o conteúdo da resposta saiu dele. Na avaliação `cobertura-k8` (ADR 0011), a q04 pergunta as sanções da Lei 9.613, art. 12. A alínea II, b, não veio na busca, e a variante `langchain` completou a lista com uma multa de "20% (vinte por cento) do valor corrigido da operação". Esse texto não existe em nenhuma norma do corpus, e as citações eram de dispositivos vizinhos, todas válidas. A `manual` fez o mesmo na `gemini2`: escreveu "R$ 20.000.000,00", que está na alínea c, sem que a alínea c tivesse vindo na busca. O juiz pegou a primeira; o usuário não pegaria nenhuma das duas.

Prazo, percentual e valor são o que mais pesa numa resposta sobre norma de PLD/FT, e o que menos se pode inventar.

## Decisão
- Toda **quantidade** da resposta tem de estar no texto do que foi citado: prazo (minutos, horas, dias, semanas, meses, anos), percentual, valor em dinheiro e data de calendário sem ano ("até 31 de março do ano seguinte").
- **Texto do que foi citado:** o dispositivo citado, os que o abrem (caput, parágrafo, inciso) e os que vêm abaixo dele; o caput abre os incisos do artigo, não os parágrafos. Só conta o texto que veio nos trechos recuperados: o que o modelo não viu não sustenta a resposta, mesmo que esteja certo.
- **Comparação pelo valor**, não pela grafia: "24 (vinte e quatro) horas" e "vinte e quatro horas" são 24 horas; "R$ 20.000.000,00" e "20 milhões de reais", o mesmo valor. Numa faixa ("de 2 (dois) a 6 (seis) anos"), os dois números são anos.
- **Fica de fora** número sem unidade (artigo, inciso, número e ano de lei, "dois ou mais saques") e data com ano ("de 3 de março de 1998"), que identifica norma, não é prazo.
- **Quantidade sem respaldo recusa a resposta inteira**, como a citação que não confere: `valor sem respaldo nos dispositivos citados: 20%`. A avaliação conta essa recusa numa categoria própria.
- Sem LLM: regra determinística em `src/rag/conferencia.ts`, aplicada em `concluirResposta`, igual nas três variantes. A configuração de cada execução da avaliação registra `conferenciaDeValores`.

## Alternativas consideradas
- **Marcar a resposta em vez de recusar:** quem lê veria o aviso, mas a resposta com o valor inventado sairia. A v1 recusa quando não consegue sustentar o que diz; a mesma regra vale aqui.
- **Conferir contra todos os trechos recuperados, não só os citados:** pegaria o valor inventado, mas não o valor de um dispositivo atribuído a outro. Na simulação, as duas regras deram o mesmo resultado; a dos citados é a que a regra de citação (toda afirmação com a sua fonte) pede.
- **Juiz LLM em tempo de resposta:** pegaria também o conteúdo sem número ("dobro do lucro real" atribuído à alínea errada), mas dobra a chamada ao LLM, a latência e o consumo da cota gratuita, e não é determinístico.
- **Conferir também o texto sem número** (frases inteiras): exigiria comparar paráfrases, que é o problema que a regra evita.

## Resultado
**Simulação nas 263 respostas gravadas** (`base`, `gemini2`, `cobertura-k5`, `cobertura-k8`), sem chamar o LLM: 82 trazem algum valor; a conferência recusaria exatamente 2, as duas da q04 descritas acima, e nenhuma outra. Nenhum falso positivo nesse conjunto.

**Execução `conferencia-k8`** (a mesma configuração da `cobertura-k8`, com a conferência ligada; 108 chamadas, nenhum erro): a conferência não recusou nenhuma resposta. Na q04, desta vez, `manual` e `langchain` citaram a própria alínea II, b, que não veio na busca, e a validação de citação recusou antes. Total: 342 respostas conferidas, 2 recusas, nenhuma falsa.

Como a conferência não agiu, a diferença entre `cobertura-k8` e `conferencia-k8` mede o ruído do modelo e do juiz:

| variante | acerto fim a fim, cobertura-k8 | acerto fim a fim, conferencia-k8 | falsa recusa |
|---|---|---|---|
| manual | 21/30 | 20/30 | 1 → 2 |
| langchain | 19/30 | 18/30 | 1 → 2 |
| langchain-padrao | 20/30 | 18/30 | 6 → 7 |

11 pares pergunta-variante mudaram de desfecho entre as duas, sem mudança no código que os afetasse. Diferença de até 2 perguntas entre execuções é ruído.

## Consequências
- Pega o valor de memória, não o conteúdo de memória sem número: a `manual` da q04 também escreveu "dobro do lucro real" (alínea b, que não veio na busca) atribuído à alínea c, e isso continua passando.
- O modelo que converte unidade ("24 horas" por "1 dia") ou arredonda é recusado. Não apareceu nas 263 respostas; se aparecer, é falsa recusa, e o relatório mostra o motivo.
- "Dias úteis" e "dias" contam como a mesma unidade: "10 dias" na resposta passa contra "dez dias úteis" na norma. Afrouxa a regra para não recusar a simplificação; a precisão do "úteis" fica com o juiz.
- Só português e as unidades da lista. Valor em outra unidade (salário mínimo, UFIR) não é conferido; não há nenhum no corpus da v1.
