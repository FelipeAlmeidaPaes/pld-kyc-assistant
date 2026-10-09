# O que aprendemos na v1

Este documento conta a história da v1 do assistente: o que tentamos, o que deu errado, como percebemos e por que escolhemos cada caminho. Foi escrito para quem não acompanhou o projeto e quer entender o porquê das decisões sem ler o código.

As decisões formais, com todos os detalhes, estão nas [ADRs](adr/README.md) (registros de decisão de arquitetura). Aqui fica a versão para ler de uma vez.

---

## Em uma página

**O projeto.** Um assistente que responde perguntas sobre normas brasileiras de prevenção à lavagem de dinheiro (PLD/FT) e antifraude. Ele tem três obrigações: **citar** o artigo de onde tirou cada resposta, **recusar** quando a base não cobre a pergunta e **custar zero** para rodar.

**Como funciona (RAG).** O assistente não responde "de cabeça". Ele primeiro **busca** os trechos das normas mais parecidos com a pergunta e só depois pede a um modelo de linguagem (LLM) que responda **usando apenas esses trechos**. Essa técnica se chama RAG (geração aumentada por recuperação).

**O resultado.** Na variante principal, o assistente passou de **11 para 20 a 21 respostas certas em 30 perguntas**, sem gastar nada, e recusou as 6 perguntas fora da base em todas as rodadas.

| Etapa | O que mudou | Trechos certos encontrados (recall@5) | Recusas indevidas | Respostas certas (de 30) |
|---|---|---|---|---|
| Ponto de partida | Embedding local (e5-small) | 42% | 12 | 11 |
| Busca nova | Embedding do Gemini | 80% | 6 | 17 |
| Resposta parcial | O modelo diz o que falta, em vez de recusar | 80% | 3 | 17 |
| Mais contexto | 8 trechos em vez de 5 | 80% (84% nos 8) | 1 | 21 |
| Conferência de valores | Prazos e valores conferidos no texto citado | 80% (84% nos 8) | 2 | 20 |

A diferença entre 21 e 20 na última linha não é piora: é ruído. A mesma configuração, rodada duas vezes, dá resultados diferentes (lição 10).

**As 11 lições, em uma frase cada:**

1. Pegar o texto oficial da norma é a parte mais traiçoeira, e um erro ali contamina tudo.
2. Cortar o texto onde a lei corta (por artigo, inciso, alínea) é o que torna a citação possível.
3. O framework (LangChain) não mudou o resultado; o que mudou foi a forma de dividir o texto.
4. Custo zero não é uma configuração, é um conjunto de travas.
5. Sem um conjunto de perguntas validado, toda melhoria é palpite. E o gabarito também erra.
6. O problema estava na busca, não no modelo.
7. Quem avalia o avaliador? O juiz automático também precisou ser corrigido.
8. Recusar toda resposta incompleta joga fora informação útil.
9. Citação válida não garante conteúdo verdadeiro.
10. O mesmo pedido gera respostas diferentes; é preciso medir o ruído.
11. A solução "de livro" (busca híbrida) perdeu no nosso caso.

---

## Antes das lições: como medimos

Quase todas as lições abaixo dependem de **medir**. Por isso, vale entender os números antes.

Montamos um **conjunto de avaliação** com 36 perguntas:
- **30 perguntas que a base cobre**, escritas pelo autor (especialista no tema), cada uma com um **gabarito**: a resposta certa e os artigos que precisam ser citados.
- **6 perguntas fora da base**, para testar se o assistente recusa. Algumas são armadilhas: o tema parece estar na base, mas não está.

Para cada rodada, medimos:

| Medida | O que responde | Exemplo |
|---|---|---|
| **recall@5** | Dos artigos que a resposta precisa, quantos a busca trouxe entre os 5 primeiros trechos? | 80% = a busca achou 4 de cada 5 artigos necessários |
| **Recusa indevida** | Quantas perguntas que a base cobre o assistente recusou? | Quanto menor, melhor |
| **Recusa correta** | Das 6 perguntas fora da base, quantas ele recusou? | 6/6 em todas as rodadas |
| **Citações pertinentes** | Dos artigos citados, quantos são de fato relevantes? | Mede se ele cita à toa |
| **Respostas certas** ("acerto fim a fim") | Quantas das 30 respostas estão certas, segundo um juiz (lição 7)? Em duas perguntas sem resposta clara na norma, recusar também conta como acerto (lição 5) | A medida principal |

Com 30 perguntas, **cada pergunta vale 3,3 pontos percentuais**. Uma diferença de 1 ou 2 perguntas pode ser sorte (lição 10).

---

## 1. O texto da norma é mais difícil de pegar do que parece

**O problema.** Para citar um artigo, primeiro é preciso ter o texto exato e atual de cada norma. Parece simples (baixar a página do governo), mas cada fonte tinha uma armadilha:

- **O site do Planalto bloqueia robôs sem avisar.** Com um download comum, a resposta vinha vazia, o que parecia problema de rede. Na verdade, o firewall do site só responde quando a requisição se identifica como navegador.
- **O mesmo site muda a página a cada download.** Ele injeta um código com um número aleatório. Como guardamos uma "impressão digital" (hash) de cada documento para saber se a norma mudou, o hash mudava sempre. Solução: remover esse código antes de calcular o hash.
- **Acentos e travessões sumiam.** As páginas usam uma codificação antiga (windows-1252) e não a declaram. O Node.js decodificava alguns caracteres errado, e um travessão perdido fez um inciso da Lei 9.613 ficar colado no parágrafo anterior. Solução: decodificar essa faixa de caracteres à mão.
- **No Banco Central, o texto "oficial" do sistema é o original, não o atual.** A API devolve a redação de quando a norma foi publicada, sem as alterações posteriores. Na Circular 3.978, isso significava ter um artigo revogado e não ter um artigo novo. O texto atualizado (compilado) só existe em PDF.
- **O PDF não sabe o que é um parágrafo.** Ele só guarda pedaços de texto com posição na página. Tivemos que remontar cada artigo pela geometria: distância entre linhas, recuo, tamanho da fonte.

**Como descobrimos.** Conferindo o resultado contra a fonte, não confiando no download. Por exemplo, cada artigo extraído do PDF foi procurado, literalmente, no texto de outro extrator: 379 de 379 bateram na Circular 3.978, e 187 de 189 na Carta Circular 4.001 (as duas diferenças eram um espaço antes de ponto e vírgula).

**Por que isso importa.** Se o texto da base estiver errado ou desatualizado, o assistente vai citar com confiança um artigo que não existe mais. Em compliance, isso é pior do que não responder.

**O que ficou como regra.**
- Sempre o texto **compilado** (com as alterações). Texto riscado (revogado) é descartado.
- Artigos revogados ou vetados ficam guardados, para a numeração ficar completa, mas **não entram na busca**.
- Cada documento baixado tem o endereço de origem e o hash registrados, para auditar a versão.
- **Nenhum texto de norma é escrito de memória**, nem em teste. Testes usam uma norma fictícia.

> Detalhes: [ADR 0005](adr/0005-corpus-v1.md) (corpus) e [ADR 0006](adr/0006-extracao-pdf.md) (PDF).

---

## 2. Cortar o texto onde a lei corta

**O problema.** O RAG não manda a norma inteira ao modelo; manda pedaços ("trechos"). A forma mais comum de cortar é por tamanho: blocos de 1.000 caracteres. Só que uma lei tem estrutura própria (artigo, parágrafo, inciso, alínea, item), e a citação depende dela.

**O que fizemos.** Cada trecho é **um dispositivo** (um inciso, uma alínea), acompanhado do que o abre. Por exemplo, o trecho da alínea "a" leva junto o caput do artigo e o inciso a que ela pertence, porque "a) ao dobro do valor da operação" sozinho não diz nada. Isso deu 939 trechos para as seis normas.

**Por que.** Com o trecho por dispositivo, o assistente sabe exatamente de onde veio cada frase e consegue citar "Lei 9.613/1998, art. 12, II, a". E o sistema consegue **conferir** a citação: o artigo citado existe? O texto dele veio na busca? Se não, a resposta é recusada.

**Como comparamos.** Montamos uma variante com o divisor de texto padrão do LangChain (blocos de 1.000 caracteres) para ver a diferença na prática:
- Num teste com 12 perguntas, só 72% dos dispositivos que a nossa busca achava apareciam inteiros nos blocos que o divisor padrão trazia. Nos outros, a citação não tinha como ser conferida.
- O modelo precisava **deduzir** o número do artigo lendo o texto, e errava: escrevia "alínea d" sem o artigo, ou "art. 2º, II" sem o parágrafo. Na rodada com a busca nova, 10 das 15 recusas dessa variante foram por citação que não conferia.
- Cada bloco tem, em média, cinco dispositivos, então cada pergunta gasta de 40% a 55% mais tokens.

> Detalhes: [ADR 0007](adr/0007-tres-variantes.md).

---

## 3. Framework ou à mão? O que muda é a divisão do texto

**A pergunta.** Vale a pena usar um framework de RAG como o LangChain, ou escrever cada etapa? O autor queria aprender as duas formas.

**O que fizemos.** Construímos três versões do mesmo assistente, lado a lado, com a mesma avaliação:

| Variante | Como é feita |
|---|---|
| `manual` | Cada etapa escrita no projeto, sem framework |
| `langchain` | LangChain.js, com os nossos trechos por dispositivo |
| `langchain-padrao` | LangChain.js com o divisor de texto padrão dele |

**O que descobrimos.**
- `manual` e `langchain` mandaram **exatamente o mesmo pedido** ao modelo (mesmo número de tokens, até o último) e recuperaram os mesmos trechos. Com os mesmos componentes, o framework não muda o resultado.
- A diferença entre elas fica nas respostas, e é do tamanho do ruído do modelo (lição 10).
- O framework age por conta própria em detalhes que importam. Por exemplo, ele altera o formato de saída pedido ao modelo, e trata o erro de limite de requisições de outro jeito. Só vimos isso com um servidor falso que gravava cada requisição.
- **A conferência da citação não existe no framework.** Escrevemos uma vez e usamos nas três variantes. Qualquer aplicação real teria de escrever.

**Por que importa.** Para o portfólio, a lição é que o framework acelera a montagem, mas não substitui as decisões de domínio. O que fez diferença foi como dividir o texto (lição 2), não a ferramenta.

---

## 4. Custo zero não é configuração, é trava

**A exigência.** Nenhum pagamento além do que é gratuito.

**O que aprendemos.** Escolher um modelo gratuito não basta. Cada provedor tem um jeito de cobrar sem você perceber:

- **Google (Gemini).** O nível gratuito só é gratuito se o projeto **não tiver faturamento** configurado. Sem faturamento, passado o limite, a API devolve um erro (429) e nada é cobrado. Com faturamento, tudo é cobrado e não há teto. Isso não se controla pelo código: conferimos no painel do Google.
- **OpenRouter (reserva).** A conta tinha crédito comprado, e qualquer modelo pago o consumiria. Colocamos **duas travas independentes**: a configuração recusa qualquer modelo que não termine em `:free`, e a chave tem limite de gasto de US$ 0.
- **Apelidos de modelo** como `-latest` são recusados: podem passar a apontar para outro modelo, de outro preço, sem aviso.
- **A cota de embeddings acaba rápido.** O Gemini dá 1.000 textos por dia, e cada item de um lote conta. Indexar a base gasta quase a cota inteira. Gastamos a cota de um dia inteiro só em experimentos. Solução: guardar em disco cada vetor já calculado, pela impressão digital do texto. Repetir uma avaliação ou reindexar passou a custar zero.
- **A mensagem de erro mente.** O erro de cota dizia para esperar até a meia-noite em UTC. A cota, na verdade, renova à meia-noite do horário do Pacífico.

**Resultado.** Cinco rodadas completas de avaliação (108 chamadas ao modelo cada), mais os julgamentos e os experimentos, com custo de **US$ 0**.

> Detalhes: [ADR 0002](adr/0002-provedor-llm.md).

---

## 5. Medir antes de mexer (e o gabarito também erra)

**Por que um conjunto de avaliação.** Sem ele, cada mudança vira opinião: "parece que melhorou". Com ele, cada mudança tem um número antes e depois.

**Como montamos.**
- As 30 perguntas do autor foram reescritas **sem o nome da norma e sem o número do artigo**, como um usuário de verdade perguntaria. O original ficou guardado.
- Cada pergunta indica os artigos **exigidos** (que a resposta precisa trazer), os **aceitos** (relevantes, citar não é erro) e o que a resposta **não pode afirmar**.
- O gabarito foi rascunhado pelo assistente de IA usado no desenvolvimento e **validado pelo autor**. Gabarito gerado por IA sem revisão humana não vale.

**O que descobrimos ao conferir o gabarito no texto da lei.**

| Situação das 30 respostas originais do autor | Quantas |
|---|---|
| Conferem com o texto da norma | 12 |
| Precisaram de ajuste | 11 |
| Sem base no texto (eram doutrina ou interpretação, não estão na norma) | 6 |
| Erradas | 1 |

Exemplo do erro: uma resposta dizia que o prazo de comunicação era de 45 dias. Os 45 dias são, na verdade, o prazo de monitoramento e de análise; a comunicação é até o dia útil seguinte.

E o erro não foi só do lado humano. Na primeira conferência, o assistente de IA disse que uma norma não falava em burlar a identificação do cliente. Estava errado, e quem mostrou foi a própria avaliação: as respostas citavam justamente as alíneas que tratam disso.

**Por que isso importa.** Um assistente preso ao texto da norma não consegue responder doutrina. Das 6 perguntas "sem base no texto", 4 foram reescritas para ter resposta na norma, e 2 viraram testes de alucinação: a resposta certa é dizer o que a lei diz, sem inventar a definição, e recusar também conta como acerto.

**Outras escolhas da avaliação, e por quê.**
- **Sem modelo reserva durante a avaliação.** Se o modelo principal falhar, a rodada falha. Misturar modelos numa rodada invalidaria a comparação.
- **Retomada.** O nível gratuito pode interromper uma rodada longa; ela continua de onde parou, sem refazer o que já foi feito.
- **Busca registrada até a 20ª posição**, não só até a 5ª. Assim sabemos quão longe ficou o artigo que faltou, e conseguimos simular mudanças sem gastar chamadas.

> Detalhes: [ADR 0008](adr/0008-avaliacao.md).

---

## 6. O problema estava na busca, não no modelo

**O sintoma.** Na primeira rodada, o assistente recusou 13 das 30 perguntas que a base cobre (uma delas passou depois a contar como recusa aceitável, por isso a tabela do início mostra 12). A tentação era culpar o modelo ou o prompt.

**Como descobrimos a causa.** Olhando, para cada recusa, se os artigos certos tinham chegado ao modelo. Em 9 das 13, **nenhum** artigo necessário estava entre os 5 trechos enviados. O modelo recusou corretamente: ele não tinha a informação.

**O que testamos.** Como a busca roda localmente, testamos 20 configurações sem gastar chamadas ao LLM:

| Busca | Trechos certos encontrados (recall@5) |
|---|---|
| e5-small (o modelo local, ponto de partida) | 42% |
| Melhor configuração local (e5 maior, busca por palavras, combinações) | 53% |
| Embedding do Gemini, versão 1 | 69% |
| **Embedding do Gemini, versão 2** | **80%** |

Um **embedding** transforma texto em números, de modo que textos com sentido parecido ficam próximos. A busca compara os números da pergunta com os de cada trecho. Um embedding melhor entende melhor o português jurídico.

**Por que confiamos nessa troca.** O critério foi definido **antes** de medir: só trocar se o ganho fosse de pelo menos 5 pontos percentuais. O ganho foi de 38. E, como testamos 20 configurações nas mesmas 30 perguntas, só uma diferença grande como essa está acima do risco de termos "decorado" o conjunto.

**Também testamos, e descartamos:** limitar quantos trechos de um mesmo artigo entram na resposta (a busca trazia cinco incisos do mesmo artigo). Parecia lógico, mas piorou: de 42% para 32%. Várias perguntas precisam justamente de vários incisos do mesmo artigo.

**Resultado com o modelo de linguagem.** Respostas certas de 11 para 17 em 30; recusas indevidas de 12 para 6.

> Detalhes: [ADR 0009](adr/0009-embeddings-gemini.md).

---

## 7. Quem avalia o avaliador?

**O problema.** Contar recusas e citações é fácil. Saber se o **conteúdo** da resposta está certo exige ler cada uma. São cerca de 80 respostas por rodada; ler tudo a cada mudança é inviável.

**O que fizemos.** Um **juiz automático**: outro modelo de linguagem compara cada resposta com o gabarito e diz se ela está correta, parcial ou incorreta.
- O juiz é de **outra família** de modelos (não o Gemini, que gera as respostas), porque um modelo tende a favorecer as próprias respostas.
- Também é gratuito.
- Uma amostra de 20 julgamentos vai para o autor auditar.

**O juiz errou, e foi o autor quem percebeu.** A primeira versão era rigorosa demais:
- Tratava como contradição citar um artigo que o gabarito não citava, ou repetir uma remissão que estava no próprio texto da lei.
- Cobrava tudo o que estava no gabarito, e não só o que a **pergunta** pedia. Nas palavras do autor: o juiz cobrava "apenas o que estava no gabarito e não o que a pergunta pedia".

**A correção.** Duas regras novas: (1) quem define o que a resposta precisa trazer é a pergunta; (2) o juiz compara só conteúdo (prazos, valores, penas, órgãos), não números de artigo. E cada julgamento passou a guardar a **versão** das instruções do juiz: julgamento de versão antiga não vale e é refeito.

**Resultado.** Julgando de novo, nenhum veredito piorou. Das 4 respostas que a primeira versão chamou de incorretas, só uma continuou incorreta, e é um caso de fronteira. O ganho real da busca nova era maior do que parecia: 6 perguntas a mais, não 1 a 3.

**Por que isso importa.** Um avaliador automático é um modelo como qualquer outro: precisa de gabarito, de auditoria e de versão. Se o juiz estiver errado, todas as conclusões em cima dele estão erradas.

> Detalhes: [ADR 0010](adr/0010-juiz.md).

---

## 8. Recusar toda resposta incompleta joga fora informação útil

**O problema.** A regra original do prompt dizia: se os trechos respondem só em parte, **recuse**. Parecia prudente. Mas o autor notou: se a pergunta tem duas partes e a base responde uma, o usuário perde a parte que a base cobre.

**A pergunta do autor.** "Como podemos dizer para a LLM trazer a resposta mais completa possível APENAS para o que foi perguntado?"

**O que fizemos.** Três mudanças, medidas separadamente:
1. O modelo passou a **declarar a cobertura** (total, parcial ou nenhuma) e a dizer **o que ficou sem resposta**. Só "nenhuma" vira recusa.
2. Novas instruções: identificar cada coisa que a pergunta pede, trazer **tudo** o que os trechos dizem sobre ela, enumerando cada item de uma lista, e **nada além** do que foi perguntado.
3. Enviar **8 trechos** ao modelo, em vez de 5.

**O que a medição mostrou (e não era o que esperávamos).**
- As mudanças 1 e 2, sozinhas, **não aumentaram as respostas certas** (17 continuou 17). As recusas indevidas caíram pela metade (6 para 3), mas viraram respostas parciais. Ficou melhor para o usuário, que recebe a parte coberta e o aviso do que falta, mas o número de acertos não mudou.
- A instrução de enumerar **não resolveu as omissões**. Em várias respostas incompletas, o item que faltava nem tinha chegado ao modelo. Ele não tem como saber que existe.
- **O ganho veio dos 8 trechos:** de 17 para 21. Em 3 dos 4 casos, o artigo que faltava estava exatamente nas posições 6 a 8 da busca.
- O custo: 41% mais tokens por pergunta (ainda gratuito) e um pouco menos de precisão nas citações.

**A lição.** Medir cada mudança separadamente evitou atribuir o ganho à coisa errada. Se tivéssemos feito as três juntas, a conclusão seria "o prompt novo funcionou".

> Detalhes: [ADR 0011](adr/0011-cobertura-declarada.md).

---

## 9. Citação válida não garante conteúdo verdadeiro

**O que aconteceu.** A pergunta era sobre as sanções da Lei 9.613. A lei lista três limites para a multa (alíneas a, b e c), e a busca nunca trazia a alínea "b". Diante da lista incompleta, o modelo a completou de memória, de três jeitos, em rodadas diferentes:
- **inventou** uma multa de "20% do valor corrigido da operação". Esse texto não existe em nenhuma norma da base;
- numa rodada em que nem a "b" nem a "c" vieram na busca, escreveu o conteúdo das duas de memória (inclusive o valor de R$ 20 milhões) e citou o inciso que as abre;
- trouxe o conteúdo certo da "b", também de memória, e o atribuiu à "c".

Em todos os casos, **as citações eram válidas**: os artigos citados existiam e tinham vindo na busca. A nossa validação de citação aprovou as respostas. Quem pegou o primeiro erro foi o juiz, na avaliação. Um usuário não pegaria.

**Por que acontece.** O modelo foi instruído a usar só os trechos. Mas, diante de uma lista com um buraco, ele completa com o que "sabe", e cita o vizinho.

**O que fizemos.** Uma **conferência de valores**, sem IA: todo prazo, percentual, valor em dinheiro e data da resposta tem de aparecer no texto do artigo citado (ou no que o abre, ou nos que vêm abaixo dele), e esse texto tem de ter vindo na busca. "24 horas" e "vinte e quatro horas" contam como o mesmo valor. Se algum valor não tiver respaldo, a resposta inteira é recusada.

**Como validamos.** Antes de ligar, aplicamos a regra às 263 respostas já gravadas. Ela recusaria **exatamente as duas** respostas com valor de memória (os 20% inventados e os R$ 20 milhões que não vieram na busca), e **nenhuma outra**. Depois, numa rodada nova com 79 respostas, nenhuma recusa indevida.

**O limite, dito com clareza.** A conferência pega **números** sem respaldo, não **frases**. O terceiro caso ("dobro do lucro real" atribuído à alínea errada) não tem número e continua passando. E o problema de fundo, a alínea "b" não chegar ao modelo, é de busca, e continua aberto.

> Detalhes: [ADR 0012](adr/0012-conferencia-de-valores.md).

---

## 10. O mesmo pedido gera respostas diferentes

**O que observamos.** As variantes `manual` e `langchain` mandam exatamente o mesmo pedido ao modelo. Mesmo assim, numa pergunta, uma recusou e a outra respondeu. E isso com a "temperatura" (o grau de aleatoriedade) no mínimo.

**Como medimos.** Rodamos a mesma configuração duas vezes. Nada mudou no código que afetasse as respostas, e mesmo assim:

| Variante | 1ª rodada | 2ª rodada |
|---|---|---|
| manual | 21 | 20 |
| langchain | 19 | 18 |
| langchain-padrao | 20 | 18 |

**11 pares de pergunta e variante mudaram de resultado** entre as duas rodadas. Parte vem do modelo que responde, parte do juiz, que também não é determinístico.

**A regra que ficou.** Diferença de até 2 perguntas entre rodadas é ruído. Só uma melhoria acima disso, e com uma explicação mecânica (por exemplo, "o artigo que faltava estava na posição 7"), conta como melhoria. Por isso a passagem de 5 para 8 trechos foi aceita (ganho de 3 a 5 perguntas, com causa identificada), e a mudança de prompt, sozinha, não foi tratada como ganho de acerto.

---

## 11. A solução "de livro" perdeu no nosso caso

**A expectativa.** A busca híbrida (juntar a busca por sentido com a busca por palavras-chave) é a recomendação padrão para RAG, especialmente com siglas e termos técnicos. O banco vetorial foi escolhido, em parte, por oferecê-la pronta.

**O que medimos.** Com o embedding novo, a híbrida **perdeu em todas as configurações**:

| Busca | Trechos certos nos 5 primeiros | Nos 8 primeiros |
|---|---|---|
| **Só por sentido (a atual)** | **80%** | **84%** |
| Melhor híbrida | 63% | 80% |

**Por que perdeu.** Com o embedding local, a busca por palavras empatava com a busca por sentido, e juntar as duas podia somar. Com o embedding do Gemini, a busca por sentido ficou muito melhor, e a fusão passou a trazer para cima trechos que só repetiam palavras da pergunta. A híbrida também quebraria o limiar de recusa: as notas das perguntas da base e das de fora ficariam misturadas.

**Também testamos, e descartamos:** trazer junto os "irmãos" de cada item encontrado (os outros incisos da mesma lista). Melhora pouco (84% para 86%) e chega a mandar 87 trechos a mais numa pergunta.

**A lição.** Recomendação genérica é ponto de partida, não decisão. A decisão sai da medição, no seu corpus.

> Detalhes: [ADR 0009](adr/0009-embeddings-gemini.md), seção "Busca híbrida com o Gemini".

---

## O que ainda não resolvemos

Ser honesto sobre os limites faz parte do resultado.

- **O conjunto é pequeno.** São 30 perguntas cobertas e 6 fora da base. Cada pergunta vale 3,3 pontos percentuais, e testamos muitas configurações nas mesmas perguntas: há risco de termos ajustado o sistema a elas. Um conjunto maior e separado para teste final seria o próximo passo de rigor.
- **A busca ainda deixa artigos de fora.** Com 8 trechos, 84% dos artigos necessários chegam ao modelo. O caso da alínea "b" das sanções não se resolve pela ordem da busca: o texto dela não tem nenhuma palavra da pergunta.
- **Omissões.** Em algumas respostas, o artigo estava nos trechos e o modelo omitiu assim mesmo, dizendo que a resposta estava completa.
- **Frases de memória** com citação válida ainda passam (só números são conferidos).
- **O juiz não foi auditado item por item.** O autor concordou, em geral, que a primeira versão era rigorosa demais, mas a concordância formal (quantos dos 20 julgamentos ele confirma) ainda não foi medida.
- **Recusa sem chamar o modelo** (por uma nota mínima de semelhança) parece possível: as perguntas da base têm nota a partir de 0,767, e as de fora, até 0,696. Mas com só 6 perguntas fora da base, esse limiar ficaria ajustado a elas.
- **O divisor padrão** continua errando o caminho da citação; é limite da forma de dividir, não do modelo.

---

## Princípios que ficam para a v2

1. **Medir antes de mudar, e mudar uma coisa por vez.** Foi o que mostrou que o ganho veio dos 8 trechos, e não do prompt.
2. **Separar ruído de melhoria.** Rodar duas vezes a mesma configuração custa pouco e evita comemorar sorte.
3. **Procurar a causa onde ela está.** As recusas pareciam culpa do modelo; eram da busca.
4. **Avaliador também é sistema.** Precisa de gabarito validado, versão e auditoria.
5. **Validar o que dá para validar sem IA.** A citação e os valores são conferidos por regra, não por confiança no modelo.
6. **Custo zero se garante com travas, não com boas intenções.**
7. **O especialista humano continua no centro.** Foi o autor quem percebeu o juiz rigoroso demais e a recusa que jogava informação fora, e quem validou cada item do gabarito.

---

## Glossário

| Termo | O que significa aqui |
|---|---|
| **RAG** | Geração aumentada por recuperação: buscar trechos relevantes e pedir ao modelo que responda só com eles |
| **LLM** | Modelo de linguagem, como o Gemini, que escreve a resposta |
| **Corpus / base** | As seis normas que o assistente conhece |
| **Dispositivo** | Cada parte numerada de uma norma: artigo, parágrafo (§), inciso (I, II), alínea (a, b), item (1, 2) |
| **Trecho** | O pedaço de texto que a busca devolve. Aqui, um dispositivo com o contexto que o abre |
| **Texto compilado** | A norma com todas as alterações já incorporadas |
| **Embedding** | A representação de um texto em números, que permite comparar sentidos |
| **Busca densa** | Busca pela semelhança de sentido, usando embeddings |
| **BM25 / busca lexical** | Busca por palavras em comum, como um buscador clássico |
| **Busca híbrida** | Junta a busca densa e a lexical numa só lista |
| **k** | Quantos trechos vão ao modelo em cada pergunta (hoje, 8) |
| **recall@k** | Dos dispositivos que a resposta precisa, a fração que chegou entre os k primeiros trechos |
| **Gabarito** | A resposta certa de cada pergunta do conjunto, validada pelo autor |
| **Recusa indevida** | O assistente recusou uma pergunta que a base cobre |
| **Juiz** | Um segundo modelo, de outra família, que compara cada resposta com o gabarito |
| **Acerto fim a fim** | Resposta julgada correta, ou recusa onde recusar era aceitável, sobre as 30 perguntas cobertas |
| **Nível gratuito / cota** | O uso sem custo que o provedor permite por minuto e por dia |
| **Ruído** | A variação entre rodadas iguais, porque o modelo não responde sempre igual |

---

## Onde ver os detalhes

| Tema | Onde |
|---|---|
| Todas as decisões | [docs/adr](adr/README.md) |
| Conjunto de avaliação | [avaliacao/perguntas.json](../avaliacao/perguntas.json) e [avaliacao/revisao.md](../avaliacao/revisao.md) |
| Relatório de cada rodada | [avaliacao/execucoes](../avaliacao/execucoes/) (`base`, `gemini2`, `cobertura-k5`, `cobertura-k8`, `conferencia-k8`) |
| Experimentos de busca | [avaliacao/experimentos](../avaliacao/experimentos/) |
