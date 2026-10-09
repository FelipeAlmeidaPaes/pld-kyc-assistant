# ADR 0011: Cobertura declarada no lugar da recusa de resposta parcial

- Status: Aceita
- Data: 2026-10-09
- Altera: ADR 0007 (esquema da saída e regra de recusa, iguais nas três variantes)

## Contexto
Na avaliação `gemini2` (ADR 0009), depois da troca do embedding, a busca deixou de ser o único gargalo. Na variante `manual`, das 13 respostas que não acertaram, a maior parte tinha o conteúdo nos trechos e mesmo assim saiu errada de dois jeitos:
- **Recusa de resposta parcial:** a regra 3 do prompt mandava recusar quando os trechos respondiam "só em parte" (q02, q12, q13, q20). Quem pergunta perdia a parte que a base cobre.
- **Omissão:** o modelo respondia com parte do que estava nos trechos, sem dizer que faltava algo (q16, q29, q30). O juiz deu "parcial".

O autor pediu que a resposta trouxesse o mais completo possível, só do que foi perguntado.

## Decisão
- **Esquema da saída:** `{ cobertura, resposta, naoCoberto, citacoes }`, no lugar de `{ cobre, resposta, citacoes }`. `cobertura` é `total`, `parcial` ou `nenhuma`; `naoCoberto` diz o que a pergunta pede e os trechos não respondem.
- **Recusa:** só com `cobertura: nenhuma` (ou citação que não confere, como antes). Com `parcial`, a resposta sai, com o que ficou sem resposta.
- **Instruções:** identificar cada coisa que a pergunta pede; para cada uma, trazer tudo o que os trechos dizem, enumerando os itens de uma lista um a um, cada um com a citação; não trazer o que a pergunta não pede.
- **Versão do prompt** (`VERSAO_DO_PROMPT`, hash das instruções, do modelo da mensagem e do esquema) gravada na configuração de cada execução da avaliação, como a do juiz (ADR 0010).
- **Métricas novas:** respostas declaradas parciais, e "parcial não declarada" (o juiz deu parcial e o modelo disse total), que mede a incompletude escondida de quem lê.
- Vale para as três variantes; o teste de paridade continua garantindo o mesmo pedido em `manual` e `langchain`.

## Alternativas consideradas
- **Manter a recusa de resposta parcial:** a mais conservadora, mas joga fora a parte coberta, e não resolve a omissão (o modelo que omite diz que cobre tudo).
- **Só trocar o texto da regra 3:** sem o campo, a avaliação não separaria a parcial honesta da escondida.
- **Mais trechos (k maior) sem mudar o prompt:** ataca só a falta de trechos, não a omissão nem a recusa. Medido junto, abaixo.

## Resultado (2026-10-09)
Duas execuções, para separar os efeitos: `cobertura-k5` (prompt e esquema novos, 5 trechos) e `cobertura-k8` (o mesmo, com 8 trechos), contra a `gemini2` (prompt antigo, 5 trechos). Mesmo LLM, embedding, conjunto e juiz (versão `ba1252a1`); uma execução de cada. Recall@5 e acerto@5 iguais nas três (80% e 93% em `manual` e `langchain`; 76% e 83% no padrão), porque a busca é a mesma.

| variante | execução | falsa recusa | corretas / parciais / incorretas | acerto fim a fim | parcial declarada / não declarada | citações pertinentes | tokens de entrada |
|---|---|---|---|---|---|---|---|
| manual | gemini2 | 6/30 | 15/7/0 | 17/30 | – | 45/46 (98%) | 890 |
| manual | cobertura-k5 | 3/30 | 17/10/0 | 17/30 | 7/6 | 56/61 (92%) | 1.042 |
| manual | cobertura-k8 | 1/30 | 21/8/0 | **21/30** | 4/5 | 69/76 (91%) | 1.469 |
| langchain | gemini2 | 6/30 | 15/8/0 | 16/30 | – | 46/47 (98%) | 890 |
| langchain | cobertura-k5 | 3/30 | 16/11/0 | 16/30 | 7/6 | 53/57 (93%) | 1.042 |
| langchain | cobertura-k8 | 1/30 | 19/9/1 | **19/30** | 4/6 | 72/85 (85%) | 1.469 |
| langchain-padrao | gemini2 | 15/30 | 11/1/1 | 13/30 | – | 23/26 (88%) | 1.381 |
| langchain-padrao | cobertura-k5 | 10/30 | 14/4/1 | 15/30 | 5/1 | 35/41 (85%) | 1.533 |
| langchain-padrao | cobertura-k8 | 6/30 | 20/4/0 | **20/30** | 2/3 | 52/66 (79%) | 2.222 |

**Prompt e esquema, sozinhos (k = 5), não subiram o acerto fim a fim** em `manual` e `langchain`. As recusas indevidas caíram à metade (6 para 3), mas viraram respostas parciais: q02, q20 e q21 passaram de recusa a "parcial" declarada. As corretas subiram de 15 para 17, e isso só compensou q07 e q08, que antes contavam como recusa aceita e agora respondem (certo). Para quem usa, é melhor: recebe a parte coberta e o aviso do que falta, no lugar de uma recusa.

**A instrução de enumerar não resolveu a omissão.** Na `manual` com k = 5, das 10 parciais, 6 foram declaradas "total". Em 4 delas (q04, q22, q25, q28) o que faltava não estava nos 5 trechos, e o modelo não tem como saber que existe. Em 2 (q16, q29), estava nos trechos e o modelo omitiu assim mesmo.

**k = 8 trouxe o ganho**: +4 em `manual`, +3 em `langchain`, +5 no padrão. Em `manual`, 3 dos 4 ganhos têm causa mecânica, um dispositivo que estava nas posições 6 a 8: q20 (as alíneas do art. 62, § 2º, II, da Circular 3.978, que dizem a quem enviar o relatório), q28 (o inciso IV) e q15 (Lei 13.810, art. 12, aceito no gabarito, na posição 7). O quarto (q10) é variação do modelo ou do juiz. A falsa recusa caiu para 1 de 30 (q12). No padrão, cada pedaço tem vários dispositivos, e 8 deles levam o recall@8 a 91%.

**Custo do k = 8:** 41% mais tokens de entrada (1.042 para 1.469; 2.222 no padrão), ainda dentro do nível gratuito, e menos precisão nas citações (de 92–93% para 85–91%; 79% no padrão). Parte das "não pertinentes" é o gabarito incompleto, não erro (ver pendências: q22, alínea f).

**Conteúdo que não está nos trechos (achado):** na q04 da `langchain` com k = 8, a resposta diz que a multa pode ir a "20% (vinte por cento) do valor corrigido da operação". Esse texto não existe em nenhuma das seis normas do corpus; a alínea que falta (Lei 9.613, art. 12, II, b) não veio na busca, e o modelo preencheu a lista de memória, com citações válidas de dispositivos vizinhos. A `manual` fez o mesmo na `gemini2` e na `cobertura-k8`, com o conteúdo certo da alínea b atribuído à alínea c. A validação de citação confere que o dispositivo existe e veio na busca; não confere que o conteúdo saiu dele. O juiz pegou a "incorreta"; o usuário não pegaria.

**Decisão sobre k:** passa a 8 (`RAG_K`, padrão da configuração).

## Consequências
- Uma resposta parcial mostra ao usuário o que a base não cobre, em vez de uma recusa. Num assistente de normas, isso é o que um analista faria; o risco é o modelo declarar "parcial" quando a base cobre tudo (a recusa honesta vira resposta incompleta), o que a métrica de parcial e o juiz medem.
- Execuções anteriores (`base`, `gemini2`) não têm `cobertura` nem `versaoDoPrompt`; o relatório mostra "–" nelas.
- A declaração de cobertura só pega o que o modelo vê: item de uma lista que não veio na busca não aparece em `naoCoberto`. A parcial não declarada continua em 5 ou 6 por variante.
- A regra 1 do prompt (só os trechos) não basta quando uma lista tem um buraco: o modelo completa de memória. Candidato a correção, a medir: conferir, sem LLM, que todo número, prazo, percentual e valor da resposta aparece no texto dos dispositivos citados, e recusar ou marcar a resposta que falhar.
- Uma execução de cada configuração. O ruído do modelo e do juiz é de uma pergunta ou duas (ADR 0007, 0010): o ganho do k = 8 (+3 a +5) está acima disso, e tem causa mecânica; o efeito do prompt sozinho (0 em `manual` e `langchain`) não se distingue do ruído.
