# Avaliação: cobertura-k8

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-09T12:18:00.929Z a 2026-10-09T12:26:55.650Z
- k = 8 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: gemini-3.5-flash-lite, sem fallback
- Prompt: versão 932e4dad
- Conteúdo das respostas julgado por openrouter/nvidia/nemotron-3-super-120b-a12b:free, versão ba1252a1 das instruções (`npm run julgar`), comparando com o gabarito

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@8 | acerto@8 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 84% | 93% | 0.71 |
| langchain | 30 | 84% | 93% | 0.71 |
| langchain-padrao | 30 | 91% | 93% | 0.69 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.767 / 0.806 / 0.872 | 0.665 / 0.691 / 0.696 |
| langchain | 0.767 / 0.806 / 0.872 | 0.665 / 0.691 / 0.696 |
| langchain-padrao | 0.748 / 0.802 / 0.840 | 0.649 / 0.669 / 0.692 |

## Resposta

| variante | falsa recusa | recusa correta (fora) | citações pertinentes | cobertura das citações | erros |
| --- | --- | --- | --- | --- | --- |
| manual | 1/30 (3%) | 6/6 (100%) | 69/76 (91%) | 73% | 0 |
| langchain | 1/30 (3%) | 6/6 (100%) | 73/85 (86%) | 77% | 0 |
| langchain-padrao | 6/30 (20%) | 6/6 (100%) | 53/66 (80%) | 73% | 0 |

| variante | tokens de entrada (média) | tokens de saída (média) | custo de tabela | geração p50 / p95 | total p50 / p95 |
| --- | --- | --- | --- | --- | --- |
| manual | 1469 | 287 | sem preço configurado | 1.1 s / 2.2 s | 1.1 s / 2.3 s |
| langchain | 1469 | 308 | sem preço configurado | 1.1 s / 2.2 s | 1.2 s / 2.3 s |
| langchain-padrao | 2222 | 301 | sem preço configurado | 1.1 s / 2.8 s | 1.1 s / 2.8 s |

Motivos de recusa (todas as perguntas):

| variante | citação não confere | modelo: não cobre |
| --- | --- | --- |
| manual | 0 | 7 |
| langchain | 0 | 7 |
| langchain-padrao | 5 | 7 |

## Conteúdo (juiz: nvidia/nemotron-3-super-120b-a12b:free)

Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.

Parcial declarada: o modelo disse que os trechos respondem só em parte. Parcial não declarada: o juiz deu parcial e o modelo disse total.

| variante | julgadas | corretas | parciais | incorretas | acerto fim a fim | afirmou o que não devia | parcial declarada | parcial não declarada |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| manual | 29 | 21 | 8 | 0 | 21/30 (70%) | 0 | 4 | 5 |
| langchain | 29 | 19 | 9 | 1 | 19/30 (63%) | 0 | 4 | 6 |
| langchain-padrao | 24 | 20 | 4 | 0 | 20/30 (67%) | 0 | 2 | 3 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/6, correta |
| q02 | coberta | 2 · respondeu 2/2, parcial | 2 · respondeu 2/2, parcial | 2 · respondeu 6/11, parcial |
| q03 | coberta | 3 · respondeu 1/1, correta | 3 · respondeu 2/2, correta | 3 · respondeu 1/1, correta |
| q04 | coberta | 3 · respondeu 5/5, parcial | 3 · respondeu 5/7, incorreta | 2 · recusou (citação não confere) |
| q05 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 2 · respondeu 4/4, correta |
| q06 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q07 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q08 | coberta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta |
| q09 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 11 · recusou (modelo: não cobre) |
| q10 | coberta | 1 · respondeu 1/2, correta | 1 · respondeu 1/2, correta | 7 · respondeu 1/1, correta |
| q11 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 2 · respondeu 1/1, correta |
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · respondeu 1/1, correta |
| q13 | coberta | 5 · respondeu 2/2, parcial | 5 · respondeu 1/1, parcial | 2 · respondeu 1/1, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q15 | coberta | 10 · respondeu 1/2, correta | 10 · respondeu 1/2, correta | 2 · respondeu 1/1, correta |
| q16 | coberta | 1 · respondeu 7/7, parcial | 1 · respondeu 7/7, parcial | 1 · respondeu 7/8, correta |
| q17 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 2/4, parcial | 1 · recusou (citação não confere) |
| q18 | coberta | 2 · respondeu 6/6, correta | 2 · respondeu 6/7, parcial | 3 · recusou (citação não confere) |
| q19 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 2/3, correta | 1 · respondeu 2/2, correta |
| q20 | coberta | 2 · respondeu 4/4, correta | 2 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q21 | coberta | 12 · respondeu 0/1, parcial | 12 · respondeu 0/1, parcial | 19 · respondeu 0/1, parcial |
| q22 | coberta | 1 · respondeu 2/2, parcial | 1 · respondeu 4/4, parcial | 1 · respondeu 3/3, parcial |
| q23 | coberta | 1 · respondeu 5/8, correta | 1 · respondeu 5/8, correta | 1 · recusou (citação não confere) |
| q24 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 0/1, correta |
| q25 | coberta | 2 · respondeu 3/4, parcial | 2 · respondeu 3/3, parcial | 6 · recusou (citação não confere) |
| q26 | coberta | 5 · respondeu 1/1, correta | 5 · respondeu 1/1, correta | 2 · respondeu 2/2, correta |
| q27 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta |
| q28 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q29 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, correta | 1 · respondeu 2/2, parcial |
| q30 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, parcial | 6 · respondeu 1/1, correta |
| f01 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f02 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f03 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f04 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f05 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f06 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |

## Respostas

### q01: Qual conduta configura o crime de lavagem de dinheiro e qual é a pena prevista?

**Gabarito:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. Pena: reclusão de 3 a 10 anos e multa.

**manual:** Configura o crime de lavagem de dinheiro ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal, conforme o gabarito, e indica a pena de reclusão de 3 a 10 anos e multa, também conforme o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

**langchain:** A conduta que configura o crime de lavagem de dinheiro é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, coincidindo integralmente com o gabarito. Não há omissão nem contradição.

**langchain-padrao:** Configura o crime de lavagem de dinheiro ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal, com pena de reclusão, de 3 (três) a 10 (dez) anos, e multa. Também incorre na mesma pena quem, para ocultar ou dissimular a utilização de bens, direitos ou valores provenientes de infração penal, os converte em ativos lícitos; os adquire, recebe, troca, negocia, dá ou recebe em garantia, guarda, tem em depósito, movimenta ou transfere; ou importa ou exporta bens com valores não correspondentes aos verdadeiros. Além disso, incorre na mesma pena quem utiliza, na atividade econômica ou financeira, bens, direitos ou valores provenientes de infração penal, bem como quem participa de grupo, associação ou escritório tendo conhecimento de que sua atividade principal ou secundária é dirigida à prática de crimes previstos na referida lei. — citações: Lei 9.613/1998, art. 1º, caput; Lei 9.613/1998, art. 1º, § 1º, I; Lei 9.613/1998, art. 1º, § 1º, II; Lei 9.613/1998, art. 1º, § 1º, III; Lei 9.613/1998, art. 1º, § 2º, I; Lei 9.613/1998, art. 1º, § 2º, II

> juiz: **correta**. A resposta traz exatamente a conduta que configura o crime de lavagem de dinheiro (ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal) e a pena prevista (reclusão de 3 a 10 anos e multa), conforme o gabarito. As informações adicionais sobre outras condutas que também incorrem na mesma pena não contradizem o gabarito e não são exigidas pela pergunta, portanto não tornam a resposta parcial ou incorreta.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** As pessoas referidas no art. 9º devem identificar seus clientes e manter cadastro atualizado, nos termos de instruções emanadas das autoridades competentes (Lei 9.613/1998, art. 10, I). Além disso, devem manter registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas (Lei 9.613/1998, art. 10, II). [parcial; sem resposta nos trechos: Os deveres de comunicação.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. parcial

**langchain:** As pessoas referidas no art. 9º têm o dever de identificar seus clientes e manter cadastro atualizado, nos termos de instruções emanadas das autoridades competentes conforme Lei 9.613/1998, art. 10, I. Além disso, devem manter registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas segundo Lei 9.613/1998, art. 10, II. [parcial; sem resposta nos trechos: Os deveres de comunicação.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. A resposta menciona os deveres de identificação (art. 10, I) e de registro de transações acima do limite (art. 10, II), mas omite os deveres de comunicação ao Coaf (arts. 11, II e III) e outros deveres de comunicação previstos no gabarito. Como a pergunta pede especificamente os deveres de identificação, registro e comunicação, a falta de algo relacionado à comunicação caracteriza uma omissão, não uma contradição. Não há afirmação que contradiga o gabarito.

**langchain-padrao:** As pessoas referidas no art. 9º devem identificar seus clientes e manter cadastro atualizado, nos termos de instruções emanadas das autoridades competentes (Lei 9.613/1998 art. 10, I). Na hipótese de o cliente constituir-se em pessoa jurídica, a identificação deve abranger as pessoas físicas autorizadas a representá-la, bem como seus proprietários (Lei 9.613/1998 art. 10, § 1º). As instituições referidas no art. 1º devem adotar procedimentos de identificação que permitam verificar e validar a identidade do cliente (Circular BCB 3.978/2020 art. 16, caput). Esses procedimentos devem incluir a obtenção, a verificação e a validação da autenticidade de informações de identificação do cliente, inclusive, se necessário, mediante confrontação dessas informações com as disponíveis em bancos de dados de caráter público e privado (Circular BCB 3.978/2020 art. 16, § 1º). No processo de identificação do cliente devem ser coletados, no mínimo, o nome completo e o número de registro no Cadastro de Pessoas Físicas (CPF), no caso de pessoa natural, e a firma ou denominação social e o número de registro no Cadastro Nacional da Pessoa Jurídica (CNPJ), no caso de pessoa jurídica (Circular BCB 3.978/2020 art. 16, § 2º, I e II). As pessoas referidas no art. 9º devem manter registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas (Lei 9.613/1998 art. 10, II). O registro referido no inciso II do art. 10 deve ser efetuado também quando a pessoa física ou jurídica, seus entes ligados, houver realizado, em um mesmo mês-calendário, operações com uma mesma pessoa, conglomerado ou grupo que, em seu conjunto, ultrapassem o limite fixado pela autoridade competente (Lei 9.613/1998 art. 10, § 3º). Os cadastros e registros referidos nos incisos I e II do art. 10 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998 art. 10, § 2º). As pessoas referidas no art. 9º devem dispensar especial atenção às operações que, nos termos de instruções emanadas das autoridades competentes, possam constituir-se em sérios indícios dos crimes previstos na Lei 9.613/1998, ou com eles relacionar-se (Lei 9.613/1998 art. 11, I). As pessoas referidas no art. 9º devem comunicar ao Coaf, abstendo-se de dar ciência de tal ato a qualquer pessoa, inclusive àquela à qual se refira a informação, no prazo de 24 horas, a proposta ou realização (Lei 9.613/1998 art. 11, II). — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, § 1º; Circular BCB 3.978/2020, art. 16, caput; Circular BCB 3.978/2020, art. 16, § 1º; Circular BCB 3.978/2020, art. 16, § 2º, I; Circular BCB 3.978/2020, art. 16, § 2º, II; Lei 9.613/1998, art. 10, II; Lei 9.613/1998, art. 10, § 3º; Lei 9.613/1998, art. 10, § 2º; Lei 9.613/1998, art. 11, I; Lei 9.613/1998, art. 11, II

> juiz: **parcial**. A resposta aborda os deveres de identificação (art. 10, I e §1º), de registro (art. 10, II, §3º e §2º) e de comunicação (art. 11, I e II) previstos no gabarito, mas omite outros deveres de comunicação exigidos pela pergunta, como a comunicação da não ocorrência de operações comunicáveis (art. 11, III) e o atendimento às requisições do Coaf (art. 10, V). Não há afirmações que contrariem o gabarito.

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo devem ser comunicadas ao Coaf, conforme Circular BCB 3.978/2020, art. 48, caput. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de informação exigida pela pergunta.

**langchain:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf, conforme estabelecido para as instituições referidas no art. 1º (Circular BCB 3.978/2020, art. 48, caput) e para as pessoas referidas no art. 9º da Lei 9.613/1998 (Lei 9.613/1998, art. 11, II). — citações: Circular BCB 3.978/2020, art. 48, caput; Lei 9.613/1998, art. 11, II

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede (o destinatário da comunicação). Não há contradição com o gabarito e não omite nenhum elemento exigido pela pergunta.

**langchain-padrao:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 48). — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica que as instituições devem comunicar ao Coaf as operações suspeitas de lavagem de dinheiro (e também de financiamento do terrorismo), o que atende ao que a pergunta pede: a quem comunicar. Não há contradição com o gabarito, nem omissão de algo que a pergunta solicita.

### q04: Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**manual:** As pessoas referidas no art. 9º, bem como os administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11, podem sofrer, cumulativamente ou não, as seguintes sanções aplicadas pelas autoridades competentes: 1. Advertência (Lei 9.613/1998, art. 12, I); 2. Multa pecuniária variável (Lei 9.613/1998, art. 12, II), que não será superior ao dobro do valor da operação (Lei 9.613/1998, art. 12, II, a), ao dobro do lucro real obtido ou que seria obtido em tese com a operação ou ao valor de R$ 20.000.000,00 (vinte milhões de reais) (Lei 9.613/1998, art. 12, II, c); 3. Inabilitação temporária, pelo prazo de até dez anos, para o exercício do cargo de administrador das pessoas jurídicas referidas no art. 9º (Lei 9.613/1998, art. 12, III). — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a; Lei 9.613/1998, art. 12, II, c; Lei 9.613/1998, art. 12, III

> juiz: **parcial**. A resposta menciona advertência, multa pecuniária e inabilitação temporária, mas omite a sanção de cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento, que está prevista no gabarito. Não há afirmação que contradiga o gabarito, apenas falta um item solicitado pela pergunta, portanto a classificação é parcial. Não há itens de "Não deve afirmar" a serem listados.

**langchain:** As pessoas referidas no art. 9º, bem como os administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11, estão sujeitas às seguintes sanções, aplicadas cumulativamente ou não pelas autoridades competentes: 1. Advertência (Lei 9.613/1998, art. 12, I); 2. Multa pecuniária variável não superior ao dobro do valor da operação, ao 20% (vinte por cento) do valor corrigido da operação ou dos valores envolvidos, ou ao valor de R$ 20.000.000,00 (vinte milhões de reais), a qual será aplicada sempre que as pessoas referidas no art. 9º, por culpa ou dolo, não cumprirem o disposto nos incisos I a IV do art. 10 ou descumprirem a vedação ou deixarem de fazer a comunicação a que se refere o art. 11 (Lei 9.613/1998, art. 12, II, art. 12, II, a, art. 12, II, c, art. 12, § 2º, II e IV); 3. Inabilitação temporária, pelo prazo de até dez anos, para o exercício do cargo de administrador das pessoas jurídicas referidas no art. 9º (Lei 9.613/1998, art. 12, III). — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a; Lei 9.613/1998, art. 12, II, c; Lei 9.613/1998, art. 12, III; Lei 9.613/1998, art. 12, § 2º, II; Lei 9.613/1998, art. 12, § 2º, IV

> juiz: **incorreta**. A resposta menciona multa com base em 20% do valor corrigido da operação, o que contradiz o gabarito que permite multa de até o dobro do lucro real obtido ou presumido. Além disso, omite a sanção de cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento. Portanto, há contradição e omissão de conteúdo exigido pela pergunta.

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 2º, II, b (dispositivo não existe no corpus); Lei 9.613/1998, art. 2º, II, c (dispositivo não existe no corpus))

### q05: Por quanto tempo a instituição deve conservar os cadastros de clientes e os registros das operações?

**Gabarito:** A lei fixa o mínimo de cinco anos, contados do encerramento da conta ou da conclusão da transação, prazo que a autoridade competente pode ampliar (Lei 9.613, art. 10, § 2º). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 fixa dez anos: para as informações dos procedimentos de conhecer o cliente, contados do primeiro dia do ano seguinte ao término do relacionamento (art. 67, I), e para os registros de operações dos arts. 28 a 37, contados do primeiro dia do ano seguinte ao da operação (art. 67, III).

**manual:** 1. Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). 2. As informações coletadas nos procedimentos destinados a conhecer os clientes de que tratam os arts. 13, 16 e 18 devem ser mantidas à disposição do Banco Central do Brasil e conservadas pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, caput e I). 3. As informações e registros de que tratam os arts. 28 a 37 devem ser mantidos à disposição do Banco Central do Brasil e conservados pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, caput e III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, caput; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente o que a pergunta pede: o prazo mínimo de cinco anos (passível de ampliação) para cadastros e registros conforme a Lei 9.613/1998, art. 10, § 2º, e, para as instituições autorizadas pelo Banco Central, o prazo de dez anos para as informações de conhecer o cliente (arts. 13, 16 e 18) e para os registros de operações dos arts. 28 a 37, contados a partir do primeiro dia do ano seguinte ao término do relacionamento ou da operação, conforme a Circular BCB 3.978/2020, arts. 67, I e III. Não há afirmação que contradiga o gabarito nem omissão de algo que a pergunta pediu.

**langchain:** 1. Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). 2. As informações coletadas nos procedimentos destinados a conhecer os clientes de que tratam os arts. 13, 16 e 18 devem ser conservadas pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, caput e I). 3. As informações e registros de que tratam os arts. 28 a 37 devem ser conservados pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, caput e III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, caput; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz o prazo mínimo de cinco anos para cadastros e registros, conforme a Lei 9.613/1998, art. 10, § 2º, e também informa o prazo de dez anos para as informações de conhecer o cliente e para os registros das operações dos arts. 28 a 37, conforme a Circular BCB 3.978/2020, arts. 67, I e III, o que está em total acordo com o gabarito. Não há afirmação que contradiga o gabarito nem omissão de algo que a pergunta pede.

**langchain-padrao:** Os cadastros e registros referidos nos incisos I e II do artigo 10 da Lei nº 9.613/1998 deverão ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). Adicionalmente, as instituições devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações coletadas nos procedimentos destinados a conhecer os clientes, contado o prazo a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, caput, I). Da mesma forma, as instituições devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações e registros de operações, contado o prazo a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, caput, e art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, caput; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente os prazos solicitados: mínimo de cinco anos, passível de ampliação, e dez anos para instituições autorizadas pelo Banco Central, tanto para informações de conhecer o cliente quanto para registros de operações, conforme o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

### q06: Para efeito dos crimes contra o sistema financeiro, o que se considera instituição financeira e quem é equiparado a ela?

**Gabarito:** Instituição financeira é a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (I); a pessoa jurídica que ofereça serviços de operações com ativos virtuais, inclusive intermediação, negociação ou custódia (I-A); e a pessoa natural que exerça qualquer dessas atividades, ainda que de forma eventual (II).

**manual:** Considera-se instituição financeira, para efeito da lei, a pessoa jurídica de direito público ou privado, que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: 1. a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); 2. a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); 3. a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes e sem contradizer nenhum ponto.

**langchain:** Para efeito da lei, considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: 1. A pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); 2. A pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); 3. A pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os três casos de equiparação presentes no gabarito, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem falta de conteúdo exigido.

**langchain-padrao:** Considera-se instituição financeira a pessoa jurídica de direito público ou privado, que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se à instituição financeira: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros; a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia; e a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual. — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem falta de conteúdo exigido.

### q07: O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** O crime de gestão fraudulenta de instituição financeira consiste em gerir fraudulentamente instituição financeira, com pena de reclusão, de 3 (três) a 12 (doze) anos, e multa, conforme o art. 4º, caput, da Lei 7.492/1986. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime consiste em 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, exatamente como o gabarito indica. Não apresenta uma definição de gestão fraudulenta além da própria expressão, portanto não contradiz o gabarito nem viola o item de 'Não deve afirmar'.

**langchain:** O crime de gestão fraudulenta de instituição financeira consiste em gerir fraudulentamente instituição financeira, tendo como pena reclusão de 3 (três) a 12 (doze) anos, e multa, conforme Lei 7.492/1986, art. 4º, caput. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime consiste em 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, o que corresponde exatamente ao que o gabarito indica como caracterização e pena. Não acrescenta nenhuma definição de gestão fraudulenta além da frase tipificada, portanto não viola o item 1 de 'Não deve afirmar'. Como responde plenamente ao que a pergunta pede (caracterização e pena), está correta.

**langchain-padrao:** Caracteriza-se como gestão fraudulenta de instituição financeira, cuja pena é de reclusão, de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma apenas que o crime consiste em 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, sem apresentar qualquer definição de gestão fraudulenta. Isso está em conformidade com o gabarito, que afirma que a lei apenas tipifica a conduta e não define o que é gestão fraudulenta, e não contém nenhum dos itens proibidos de 'Não deve afirmar'. Portanto, a resposta está correta.

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** A gestão temerária tem a pena de reclusão de 2 (dois) a 8 (oito) anos, e multa (Lei 7.492/1986, art. 4º, parágrafo único). A gestão fraudulenta de instituição financeira tem a pena de reclusão, de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º, caput). [parcial; sem resposta nos trechos: Os conceitos ou diferenciações técnicas entre gestão temerária e gestão fraudulenta, além das penas cominadas a cada uma.] — citações: Lei 7.492/1986, art. 4º, parágrafo único; Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta indica corretamente que a diferença entre gestão temerária e gestão fraudulenta está apenas nas penas previstas (reclusão de 2 a 8 anos e multa para temerária; de 3 a 12 anos e multa para fraudulenta), conforme o gabarito, que afirma que a lei não define as condutas e diferencia apenas pela pena. Não há afirmação que contrarie o gabarito e não há violação do item 1 de 'Não deve afirmar'.

**langchain:** A gestão fraudulenta de instituição financeira tem pena de reclusão de 3 (três) a 12 (doze) anos, e multa, conforme a Lei 7.492/1986, art. 4º, caput. Se a gestão é temerária, a pena é de reclusão de 2 (dois) a 8 (oito) anos, e multa, conforme a Lei 7.492/1986, art. 4º, parágrafo único. [parcial; sem resposta nos trechos: Os trechos fornecidos não trazem a conceituação ou a distinção conceitual entre os termos gestão temerária e gestão fraudulenta, limitando-se a apresentar as respectivas penas.] — citações: Lei 7.492/1986, art. 4º, caput; Lei 7.492/1986, art. 4º, parágrafo único

> juiz: **correta**. A resposta indica corretamente a diferença de penas entre gestão fraudulenta (3 a 12 anos) e gestão temerária (2 a 8 anos), conforme o gabarito. Não afirma nada que contradiga o gabarito e não omite nada que a pergunta exija (a pergunta pede a diferença, que é atendida pela indicação das penas). Também não viola o item de "Não deve afirmar". Portanto, a resposta está correta.

**langchain-padrao:** Os trechos trazem as penas para cada uma das condutas, estabelecendo que gerir fraudulentamente instituição financeira tem pena de reclusão de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º), enquanto a gestão temerária tem pena de reclusão de 2 (dois) a 8 (oito) anos, e multa (Lei 7.492/1986, art. 4º, parágrafo único). Os trechos não explicam em que consiste a diferença conceitual ou prática entre os dois tipos de gestão. [parcial; sem resposta nos trechos: A diferença conceitual ou prática entre gestão temerária e gestão fraudulenta, além das penas.] — citações: Lei 7.492/1986, art. 4º, caput; Lei 7.492/1986, art. 4º, parágrafo único

> juiz: **correta**. A resposta afirma que a lei não define gestão temerária nem gestão fraudulenta, diferenciando apenas pelas penas (reclusão de 3 a 12 anos e multa para a fraudulenta; 2 a 8 anos e multa para a temerária), o que está de acordo com o gabarito. Não há afirmação que contradiga o gabarito, nem viola o item 1 de "Não deve afirmar". Portanto, a resposta está correta.

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio (Lei 7.492/1986, art. 16, caput). A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa (Lei 7.492/1986, art. 16, caput). — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, abrangendo também distribuição de valores mobiliários ou câmbio, e indica a pena de reclusão de 1 a 4 anos e multa, exatamente como o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

**langchain:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio (Lei 7.492/1986, art. 16, caput). A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa (Lei 7.492/1986, art. 16, caput). — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito: confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, inclusive para distribuição de valores mobiliários ou de câmbio, e indica a pena de reclusão de 1 a 4 anos e multa. Não há contradição nem omissão relativa ao que a pergunta pede.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente (Lei 7.492/1986, art. 6º, caput). Também constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º, caput). — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira, conforme o gabarito, e não acrescenta nada que contradiga o gabarito. A menção adicional ao art. 9º trata de outro crime, mas não contraria o conteúdo exigido pela pergunta.

**langchain:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente (Lei 7.492/1986, art. 6º, caput). Também constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º, caput). — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização, conforme o gabarito, e acrescenta apenas informação adicional (crime de fraude via documento falso) que não contradiz o gabarito. Não omite nada que a pergunta pede e não afirma nada que esteja na lista de 'Não deve afirmar' (que está vazia).

**langchain-padrao:** Sim, constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa, exatamente como o gabarito afirma, sem contradizer nada. Não omite nada que a pergunta pede (a pergunta não pede a pena). Portanto está correta.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º, caput). — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta contém exatamente o mesmo conteúdo do gabarito, sem omissões nem contradições. A inclusão da referência legal (Lei 13.810/2019, art. 1º, caput) não afeta o julgamento, pois as citações são ignoradas.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz integralmente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz integralmente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Significa imediatamente ou dentro de algumas horas. — citações: Lei 13.810/2019, art. 2º, V

> juiz: **correta**. A resposta afirma que cumprir 'sem demora' significa imediatamente ou dentro de algumas horas, o que está de acordo com o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** A indisponibilidade de ativos abrange a proibição de transferir, converter, trasladar, disponibilizar ativos, ou deles dispor, direta ou indiretamente (Lei 13.810/2019, art. 2º, II), e incide sobre ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de resoluções do Conselho de Segurança das Nações Unidas ou de designações de seus comitês de sanções (Lei 13.810/2019, art. 9º, caput). [parcial; sem resposta nos trechos: Os trechos não especificam detalhadamente os tipos específicos de bens e recursos materiais alcançados (como contas bancárias, imóveis, veículos, etc.), mencionando apenas de forma genérica o termo ativos e a proibição de transferir, converter, trasladar, disponibilizar ou deles dispor.] — citações: Lei 13.810/2019, art. 2º, II; Lei 13.810/2019, art. 9º, caput

> juiz: **parcial**. A resposta descreve a abrangência da indisponibilidade de ativos (proibições de transferência, conversão etc.) e a titularidade dos ativos, mas não menciona quais tipos de bens e recursos podem ser alcançados (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), que é o que a pergunta pede. Não há contradição com o gabarito, apenas omissão.

**langchain:** A indisponibilidade de ativos alcança os ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções (Lei 13.810/2019, art. 9º, caput). [parcial; sem resposta nos trechos: A pergunta também pede quais tipos específicos de bens e recursos podem ser alcançados, o que não foi detalhado nos trechos fornecidos além do termo genérico ativos.] — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **parcial**. A resposta menciona apenas que a indisponibilidade atinge os ativos de titularidade direta ou indireta de pessoas físicas, jurídicas ou entidades sancionadas, mas não especifica os tipos de bens e recursos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não) que a pergunta pede. Não há contradição com o gabarito, apenas omissão de detalhes solicitados.

**langchain-padrao:** Para fins da indisponibilidade de ativos decorrente de sanções do Conselho de Segurança das Nações Unidas, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não, conforme o art. 2º, inciso I, da Lei 13.810/2019. — citações: Lei 13.810/2019, art. 2º, I

> juiz: **correta**. A resposta lista os tipos de bens e recursos que podem ser alcançados pela indisponibilidade de ativos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), o que corresponde exatamente ao que a pergunta pede. Não há contradição com o gabarito e não falta nenhum elemento solicitado pela pergunta.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica que as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998 devem cumprir, sem demora e sem prévio aviso, as determinações de indisponibilidade de ativos provenientes de sanções do Conselho de Segurança da ONU, na forma definida por seu órgão regulador. Isso corresponde exatamente ao que a pergunta pergunta (quem deve cumprir) e não contradiz o gabarito. Não há afirmação que vá contra o gabarito, nem omissão de algo que a pergunta exija.

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso, conforme definido por seu órgão regulador. Não há contradição com o gabarito e não há omissão de algo que a pergunta peça.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A pergunta pede apenas quem deve cumprir as determinações de indisponibilidade de ativos. A resposta indica corretamente que são as pessoas naturais e jurídicas do art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Não há omissão de algo que a pergunta pede e não há contradição com o gabarito.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** Não, pois a indisponibilidade de ativos e as tentativas de sua transferência relacionadas a pessoas naturais, pessoas jurídicas ou entidades sancionadas por resolução do Conselho de Segurança das Nações Unidas ou por designações de seus comitês de sanções são de cumprimento imediato e devem ser comunicadas ao Ministério da Justiça e Segurança Pública, aos órgãos reguladores ou fiscalizadores das pessoas naturais ou das pessoas jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, e ao Conselho de Controle de Atividades Financeiras, conforme Lei 13.810/2019, art. 11, caput. Caso não ocorra o cumprimento imediato e haja informações sobre a existência de ativos sujeitos à indisponibilidade ou de pessoas e bens sujeitos a outra espécie de sanção determinada em resoluções do Conselho de Segurança das Nações Unidas ou em designações de seus comitês de sanções, a União ingressará, sem demora, com auxílio direto judicial para obtê-la, conforme Lei 13.810/2019, art. 12, caput. — citações: Lei 13.810/2019, art. 11, caput; Lei 13.810/2019, art. 12, caput

> juiz: **correta**. A resposta afirma que a indisponibilidade de ativos determinada pelo CSNU tem cumprimento imediato no Brasil e só requer auxílio judicial caso não haja cumprimento voluntário, o que está em total acordo com o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

**langchain:** Não, pois a indisponibilidade de ativos e as tentativas de sua transferência relacionadas a pessoas naturais, jurídicas ou entidades sancionadas por resolução do Conselho de Segurança das Nações Unidas ou por designações de seus comitês de sanções são de cumprimento imediato, sendo comunicadas ao Ministério da Justiça e Segurança Pública, aos órgãos reguladores ou fiscalizadores das pessoas naturais ou das pessoas jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, e ao Conselho de Controle de Atividades Financeiras, conforme o art. 11 da Lei 13.810/2019. O auxílio direto judicial é previsto apenas na hipótese de haver informações sobre ativos ou pessoas e bens sem que tenha ocorrido o seu cumprimento imediato, nos termos do art. 12 da referida lei. — citações: Lei 13.810/2019, art. 11, caput; Lei 13.810/2019, art. 12, caput

> juiz: **correta**. A resposta afirma que a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU não precisa de decisão judicial para ser cumprida, pois tem executoriedade imediata, e que o auxílio direto judicial só ocorre quando não há cumprimento imediato. Isso está totalmente de acordo com o gabarito, que também afirma que a medida tem executoriedade imediata e que o auxílio judicial é previsto apenas em caso de não cumprimento. A resposta acrescenta detalhes sobre a comunicação a órgãos específicos, mas isso não contradiz o gabarito e não é exigido pela pergunta. Não há nenhum item de 'Não deve afirmar' violado.

**langchain-padrao:** As resoluções sancionatórias do Conselho de Segurança das Nações Unidas e as designações de seus comitês de sanções são dotadas de executoriedade imediata na República Federativa do Brasil, sem que seja exigida uma decisão judicial prévia para o seu cumprimento. — citações: Lei 13.810/2019, art. 6º, caput

> juiz: **correta**. A resposta afirma que as resoluções do CSNU têm executoriedade imediata no Brasil sem necessidade de decisão judicial prévia, o que está de acordo com o gabarito que diz que não é necessária decisão judicial para o cumprimento. Não há contradição nem omissão de algo que a pergunta pede.

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** A avaliação interna é realizada pelas instituições com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, caput). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco: dos clientes (Circular BCB 3.978/2020, art. 10, § 1º, I); da instituição, incluindo o modelo de negócio e a área geográfica de atuação (Circular BCB 3.978/2020, art. 10, § 1º, II); e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Além disso, devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta descreve corretamente o objetivo da avaliação interna e alguns de seus requisitos (perfis de risco, probabilidade e magnitude dos impactos, categorias de risco). Porém, omite elementos que a pergunta pede como parte de 'como deve ser feita': a necessidade de considerar também as operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias (§ 1º), bem como as exigências de documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e auditoria e ao conselho/diretoria, e revisão bienal ou diante de alteração significativa (art. 12). Não há afirmações que contradigam o gabarito, apenas faltas de informações solicitadas. Portanto, a classificação é parcial. Não há itens em 'Não deve afirmar' para listar.

**langchain:** A avaliação interna tem o objetivo de identificar e mensurar o risco de utilização de produtos e serviços das instituições na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os seguintes perfis de risco: dos clientes (Circular BCB 3.978/2020, art. 10, § 1º, I); da instituição, incluindo o modelo de negócio e a área geográfica de atuação (Circular BCB 3.978/2020, art. 10, § 1º, II); e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. parcial

**langchain-padrao:** A avaliação interna de risco tem o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, deve considerar, no mínimo, os perfis de risco: dos clientes; da instituição, incluindo o modelo de negócio e a área geográfica de atuação; das operações, transações, produtos e serviços, abrangendo todos os canais de distribuição e a utilização de novas tecnologias; e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados. O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição. Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco. Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo. A avaliação interna de risco pode ser realizada de forma centralizada em instituição do conglomerado prudencial e do sistema cooperativo de crédito. As instituições que optarem por realizar a avaliação interna de risco de forma centralizada devem formalizar essa opção em reunião do conselho de administração ou, se inexistente, da diretoria da instituição. Além disso, a avaliação interna de risco deve ser documentada e aprovada pelo diretor responsável; encaminhada para ciência ao comitê de risco (quando houver), ao comitê de auditoria (quando houver) e ao conselho de administração ou, se inexistente, à diretoria da instituição; e revisada a cada dois anos, bem como quando ocorrerem alterações significativas nos perfis de risco. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º; Circular BCB 3.978/2020, art. 11, caput; Circular BCB 3.978/2020, art. 11, parágrafo único; Circular BCB 3.978/2020, art. 12, caput

> juiz: **correta**. A resposta descreve corretamente o que é a avaliação interna de risco e como deve ser feita, abrangendo todos os pontos exigidos pelo gabarito (objetivo, fatores a considerar, método de avaliação, categorias de risco, documentação, aprovação, encaminhamento e periodicidade de revisão). As informações adicionais (uso de avaliações de entidades públicas, possibilidade de centralização) não contradizem o gabarito e, portanto, não tornam a resposta parcial ou incorreta.

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **correta**. correta

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput). Adicionalmente, tais procedimentos devem ser formalizados em manual específico (Circular BCB 3.978/2020, art. 13, § 2º) e devem ser compatíveis com o perfil de risco do cliente, contemplando medidas reforçadas para clientes classificados em categorias de maior risco, de acordo com a avaliação interna de risco referida no art. 10 (Circular BCB 3.978/2020, art. 13, § 1º, I), bem como com a política de prevenção à lavagem de dinheiro e ao financiamento do terrorismo de que trata o art. 2º (Circular BCB 3.978/2020, art. 13, § 1º, II). — citações: Circular BCB 3.978/2020, art. 13, caput; Circular BCB 3.978/2020, art. 13, § 2º; Circular BCB 3.978/2020, art. 13, § 1º, I; Circular BCB 3.978/2020, art. 13, § 1º, II

> juiz: **parcial**. A resposta menciona a devida diligência na identificação, qualificação e classificação, a formalização em manual, a compatibilidade com o perfil de risco e com a política de PLD/FT, mas omite detalhes exigidos pelo gabarito: os requisitos mínimos de identificação (nome completo e CPF ou firma e CNPJ), os elementos de qualificação (local de residência/sede e capacidade financeira), a classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, a análise da cadeia de participação societária até o beneficiário final. Como não há contradição com o gabarito, apenas falta de informações que a pergunta pede, a resposta é parcial.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 13, § 1º, I, II e III (dispositivo não existe no corpus))

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições referidas no art. 1º devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 38, caput. Para os fins da norma, operações e situações suspeitas referem-se a qualquer operação ou situação que apresente indícios de utilização da instituição para a prática dos crimes de lavagem de dinheiro e de financiamento do terrorismo, segundo Circular BCB 3.978/2020, art. 38, § 1º. Os procedimentos de monitoramento, seleção e análise devem ser aplicados, inclusive, às propostas de operações, de acordo com Circular BCB 3.978/2020, art. 38, § 2º. As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, especialmente as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar a existência de indícios de lavagem de dinheiro ou de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 39, caput e inciso I. O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação, nos termos da Circular BCB 3.978/2020, art. 39, parágrafo único. — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 38, § 1º; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, I; Circular BCB 3.978/2020, art. 39, parágrafo único

> juiz: **correta**. correta

**langchain:** As instituições devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 38, caput). Para os fins da norma, operações e situações suspeitas referem-se a qualquer operação ou situação que apresente indícios de utilização da instituição para a prática dos crimes de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 38, § 1º). Os procedimentos de monitoramento, seleção e análise devem ser aplicados, inclusive, às propostas de operações (Circular BCB 3.978/2020, art. 38, § 2º). Além disso, as instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, especialmente as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar a existência de indícios de lavagem de dinheiro ou de financiamento do terrorismo (Circular BCB 3.978/2020, art. 39, caput e I). O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação (Circular BCB 3.978/2020, art. 39, parágrafo único). Ademais, a política da instituição deve contemplar, no mínimo, as diretrizes para implementação de procedimentos de monitoramento, seleção e análise de operações e situações suspeitas (Circular BCB 3.978/2020, art. 3º, II, c). — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 38, § 1º; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, I; Circular BCB 3.978/2020, art. 39, parágrafo único; Circular BCB 3.978/2020, art. 3º, II, c

> juiz: **parcial**. A resposta inclui a maior parte do conteúdo do gabarito (procedimentos de monitoramento, seleção e análise, aplicação às propostas de operações, prazo de 45 dias) e não afirma nada que contradiga o gabarito. Porém, omite requisitos que o gabarito exige: que os procedimentos sejam compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, que considerem a condição de pessoa exposta politicamente e que estejam descritos em manual aprovado pela diretoria (art. 38, §3º). Como a pergunta pede como a instituição deve conduzir o monitoramento, esses elementos são parte do que se espera na resposta. Sua ausência torna a resposta parcial, não incorreta.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 3º, § 2º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 3º, § 3º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 4º, parágrafo único (texto do dispositivo não está nos trechos recuperados))

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação (Circular BCB 3.978/2020, art. 48, § 2º). — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação deve ser feita até o dia útil seguinte à decisão de comunicação, conforme o art. 48, § 2º da Circular BCB 3.978/2020, o que está de acordo com o gabarito. Não há contradição nem omissão do que a pergunta pede, e nenhum dos itens da lista 'Não deve afirmar' é mencionado.

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, conforme Circular BCB 3.978/2020, art. 48, § 2º. Além disso, as pessoas referidas no art. 9º da Lei 9.613/1998 devem comunicar ao Coaf no prazo de 24 (vinte e quatro) horas a proposta ou realização de todas as transações referidas no inciso II do art. 10, acompanhadas da identificação de que trata o inciso I do mencionado artigo, abstendo-se de dar ciência de tal ato a qualquer pessoa, inclusive àquela à qual se refira a informação, conforme Lei 9.613/1998, art. 11, II e II, a. — citações: Circular BCB 3.978/2020, art. 48, § 2º; Lei 9.613/1998, art. 11, II; Lei 9.613/1998, art. 11, II, a

> juiz: **correta**. A resposta indica corretamente que a comunicação ao Coaf deve ser feita até o dia útil seguinte à decisão de comunicação, conforme a Circular BCB 3.978/2020, art. 48, § 2º, que é o prazo solicitado na pergunta. Ela também acrescenta informações adicionais (prazo de 24 horas para determinadas pessoas) que não contradizem o gabarito. Nenhum dos itens proibidos (prazo de 45 dias ou prazo do art. 49, § 1º) foi afirmado.

**langchain-padrao:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, sendo que a referida decisão deve ocorrer até o final do prazo de análise referido no art. 43, § 1º. — citações: Circular BCB 3.978/2020, art. 48, § 1º, III; Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação deve ser feita até o dia útil seguinte à decisão e que a decisão deve ocorrer até o final do prazo de análise (art. 43, §1º), o que está de acordo com o gabarito. Não afirma que o prazo seja de 45 dias nem menciona o art. 49, §1º, portanto não viola os itens de 'Não deve afirmar'.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** A avaliação da efetividade da política, dos procedimentos e dos controles internos deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º, e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, a e b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta menciona a periodicidade anual com data-base de 31 de dezembro e o envio até 31 de março do ano seguinte ao comitê de auditoria, conselho de administração ou diretoria, exatamente como o gabarito estabelece. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas pela pergunta.

**langchain:** A avaliação deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º, e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, a, e art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta indica que a avaliação deve ser feita anualmente, com data-base de 31 de dezembro, e que o relatório deve ser enviado até 31 de março do ano seguinte ao comitê de auditoria, conselho de administração ou diretoria, o que está totalmente de acordo com o gabarito. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas pela pergunta.

**langchain-padrao:** A avaliação da efetividade deve ser elaborada anualmente, com data-base de 31 de dezembro, e o relatório específico deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria da instituição. — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta indica que a avaliação deve ser feita anualmente, com data-base de 31 de dezembro, e que o relatório deve ser enviado até 31 de março do ano seguinte ao da data-base ao comitê de auditoria (se houver) e ao conselho de administração ou diretoria. Isso corresponde exatamente ao que o gabarito estabelece quanto à periodicidade e aos destinatários do relatório, sem acrescentar informações que o contrariem. Não há nenhum item em "Não deve afirmar" que seja violado.

### q21: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro? Toda operação da relação deve ser comunicada ao Coaf?

**Gabarito:** As operações e situações relacionadas exemplificam indícios de suspeita para fins dos procedimentos de monitoramento e seleção da Circular 3.978 (art. 1º, caput). Não são comunicadas automaticamente: só quando os indícios forem confirmados ao término da análise (§ 1º), que deve considerar todas as informações disponíveis, inclusive as dos procedimentos de conhecer clientes, funcionários, parceiros e terceirizados (§ 2º).

**manual:** A relação de operações serve para indicar aquelas que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese prevista no inciso I do art. 11 da Lei 9.613/1998 (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: Os trechos não respondem se toda operação da relação deve ser comunicada ao Coaf.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta explica o propósito da relação de operações (indicar aquelas que podem configurar a hipótese do art. 11, inciso I da Lei 9.613/1998), mas não aborda a segunda parte da pergunta, que trata de saber se toda operação da relação deve ser comunicada ao Coaf. Não há contradição com o gabarito, apenas omissão.

**langchain:** As autoridades competentes, nas instruções referidas no inciso I do art. 11 da Lei 9.613/1998, elaborarão relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese nele prevista (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: A resposta não aborda se toda operação da relação deve ser comunicada ao Coaf.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. parcial

**langchain-padrao:** A relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, serve para configurar a hipótese prevista no inciso I do artigo correspondente (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: Se toda operação da relação deve ser comunicada ao Coaf.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta menciona um propósito da relação (configurar hipótese prevista na Lei 9.613/1998, art. 11, §1º) mas não aborda o segundo ponto da pergunta, que questiona se toda operação da relação deve ser comunicada ao Coaf. Como não afirma que toda operação deve ser comunicada, não há contradição com o gabarito nem com o item 'Não deve afirmar'. Porém, ao omitir a resposta sobre a comunicação, deixa de atender ao que a pergunta pede, tornando a resposta parcial.

### q22: Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**manual:** O fracionamento de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, é indício de suspeita quando feito de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d). O fracionamento de saques em espécie é indício de suspeita quando realizado a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e

> juiz: **parcial**. A resposta menciona apenas duas das situações indicadas no gabarito (itens d e e), omitindo os casos descritos nos itens k, l e m. Não há contradição com o gabarito, apenas falta de informações que a pergunta pede.

**langchain:** O fracionamento é considerado um indício de suspeita nas seguintes situações: 1. Fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d). 2. Fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e). 3. Depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f). 4. Saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie (Carta Circular BCB 4.001/2020, art. 1º, I, k). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f; Carta Circular BCB 4.001/2020, art. 1º, I, k

> juiz: **parcial**. A resposta inclui os itens d, e e k do gabarito, mas omite os itens l e m, que também são indicadores de suspeita conforme o gabarito. Não há afirmações que contradigam o gabarito; apenas falta informação solicitada pela pergunta. Portanto, a resposta é parcial.

**langchain-padrao:** O fracionamento de depósitos ou saques em espécie é considerado um indício de suspeita nas seguintes situações: 1. fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d); 2. fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e); 3. depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f

> juiz: **parcial**. parcial

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** Os sinais de alerta que envolvem a movimentação financeira ou operações do cliente em relação à capacidade econômica ou financeira são: 1. movimentação de recursos em contas de depósito e de contas de pagamento em moeda nacional incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, IV, a); 2. solicitação de concessão de crédito no País incompatível com a atividade econômica ou com a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, VI, b); 3. investimentos significativos não proporcionais à capacidade financeira do cliente, ou cuja origem não seja claramente conhecida (Carta Circular BCB 4.001/2020, art. 1º, V, d); 4. operações realizadas, produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio (Circular BCB 3.978/2020, art. 39, I, c); 5. movimentação de recursos em contas correntes em moeda estrangeira (CCME) incompatível com a atividade econômica e a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, XVI, a); 6. transferências internacionais, inclusive a título de disponibilidade no exterior, nas quais não se justifique a origem dos fundos envolvidos ou que se mostrem incompatíveis com a capacidade financeira ou com o perfil do cliente (Carta Circular BCB 4.001/2020, art. 1º, X, f); 7. incompatibilidade da atividade econômica ou faturamento informados com o padrão apresentado por clientes com o mesmo perfil (Carta Circular BCB 4.001/2020, art. 1º, III, j); e 8. movimentações de moeda estrangeira em espécie ou de cheques de viagem denominados em moeda estrangeira, que apresentem atipicidade em relação à atividade econômica do cliente ou incompatibilidade com a sua capacidade financeira (Carta Circular BCB 4.001/2020, art. 1º, II, a). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, VI, b; Carta Circular BCB 4.001/2020, art. 1º, V, d; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a; Carta Circular BCB 4.001/2020, art. 1º, X, f; Carta Circular BCB 4.001/2020, art. 1º, III, j; Carta Circular BCB 4.001/2020, art. 1º, II, a

> juiz: **correta**. A resposta inclui o sinal de alerta solicitado (movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente) e acrescenta outros sinais que não contradizem o gabarito. Não há omissão do que a pergunta pede nem afirmação contrária ao gabarito, portanto a resposta está correta.

**langchain:** Os sinais de alerta que envolvem a movimentação financeira do cliente em relação à sua capacidade financeira ou econômica incluem: 1. Movimentação de recursos em contas de depósito e de contas de pagamento em moeda nacional incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, IV, a. 2. Solicitação de concessão de crédito no País incompatível com a atividade econômica ou com a capacidade financeira do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, VI, b. 3. Investimentos significativos não proporcionais à capacidade financeira do cliente, ou cuja origem não seja claramente conhecida, conforme Carta Circular BCB 4.001/2020, art. 1º, V, d. 4. Operações realizadas e produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio, conforme Circular BCB 3.978/2020, art. 39, I, c. 5. Movimentação de recursos em contas correntes em moeda estrangeira (CCME) incompatível com a atividade econômica e a capacidade financeira do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, XVI, a. 6. Transferências internacionais, inclusive a título de disponibilidade no exterior, nas quais não se justifique a origem dos fundos envolvidos ou que se mostrem incompatíveis com a capacidade financeira ou com o perfil do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, X, f. 7. Incompatibilidade da atividade econômica ou faturamento informados com o padrão apresentado por clientes com o mesmo perfil, conforme Carta Circular BCB 4.001/2020, art. 1º, III, j. 8. Movimentações de moeda estrangeira em espécie ou de cheques de viagem denominados em moeda estrangeira, que apresentem atipicidade em relação à atividade econômica do cliente ou incompatibilidade com a sua capacidade financeira, conforme Carta Circular BCB 4.001/2020, art. 1º, II, a. — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, VI, b; Carta Circular BCB 4.001/2020, art. 1º, V, d; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a; Carta Circular BCB 4.001/2020, art. 1º, X, f; Carta Circular BCB 4.001/2020, art. 1º, III, j; Carta Circular BCB 4.001/2020, art. 1º, II, a

> juiz: **correta**. A resposta inclui o sinal de alerta correto (movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente) e acrescenta outros sinais que não contradizem o gabarito. Não há omissão do que a pergunta pede e não há afirmação que contradiga o gabarito.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, I, a (texto do dispositivo não está nos trechos recuperados); Carta Circular BCB 4.001/2020, art. 1º, II, j (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, II, n (dispositivo não existe no corpus))

### q24: Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**manual:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta confirma que a movimentação de quantia significativa por conta até então pouco movimentada ou com depósito inusitado é indício de suspeita, exatamente como o gabarito afirma, sem acrescentar informações contraditórias ou omitir o que a pergunta pede. Não há afirmação proibida.

**langchain:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta confirma que a movimentação de quantia significativa por conta até então pouco movimentada ou com depósito inusitado é indício de suspeita, exatamente como o gabarito afirma, sem acrescentar informações contraditórias ou violar os itens de 'Não deve afirmar'.

**langchain-padrao:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção. — citações: Carta Circular BCB 4.001/2020, art. 1º, I, e

> juiz: **correta**. A resposta confirma que a movimentação de quantia significativa em conta pouco movimentada ou com depósito inusitado configura indício de suspeita, o que está em total acordo com o gabarito. Não há afirmações contraditórias nem omissões de elementos exigidos pela pergunta. Além disso, a resposta não menciona nenhum dos itens proibidos (contas recém-abertas ou contas de passagem).

### q25: Que situações envolvendo procuradores, representantes ou o beneficiário final são indícios de suspeita de lavagem de dinheiro?

**Gabarito:** Abertura, movimentação de contas ou realização de operações por detentor de procuração ou de outro tipo de mandato (art. 1º, III, d); operações em que não seja possível identificar o beneficiário final (III, g); representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável (III, h); e contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t).

**manual:** As seguintes situações envolvendo procuradores, representantes ou o beneficiário final exemplificam indícios de suspeita para fins de monitoramento e seleção: a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato, conforme Carta Circular BCB 4.001/2020, art. 1º, III, d; operações em que não seja possível identificar o beneficiário final, observados os procedimentos definidos na regulamentação vigente, conforme Carta Circular BCB 4.001/2020, art. 1º, III, g; e a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável para tal ocorrência, conforme Carta Circular BCB 4.001/2020, art. 1º, III, h. Além disso, as instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, especialmente os clientes e as operações em relação aos quais não seja possível identificar o beneficiário final, conforme Circular BCB 3.978/2020, art. 39, I, f. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h; Circular BCB 3.978/2020, art. 39, I, f

> juiz: **parcial**. A resposta traz três das quatro situações listadas no gabarito (d, g, h) e omite a situação das contas em nome de menores ou incapazes com representantes que realizem muitas ou relevantes operações (IV, t). Não há contradição com o gabarito e não há uso dos termos proibidos. Portanto, a resposta está parcial.

**langchain:** As seguintes situações envolvendo procuradores, representantes ou o beneficiário final exemplificam indícios de suspeita para fins de monitoramento e seleção: a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato, conforme Carta Circular BCB 4.001/2020, art. 1º, III, d; operações em que não seja possível identificar o beneficiário final, observados os procedimentos definidos na regulamentação vigente, conforme Carta Circular BCB 4.001/2020, art. 1º, III, g; e a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável para tal ocorrência, conforme Carta Circular BCB 4.001/2020, art. 1º, III, h. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h

> juiz: **parcial**. A resposta omite a situação de contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t), que também é um indício envolvendo representantes.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, II, g (texto do dispositivo não está nos trechos recuperados); Carta Circular BCB 4.001/2020, art. 1º, II, h (texto do dispositivo não está nos trechos recuperados))

### q26: Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**manual:** Estão obrigadas a compartilhar dados e informações as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. A instituição excluída dessa obrigação é a administradora de consórcio, conforme Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona corretamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradora de consórcio), conforme o gabarito. As citações de artigos são ignoradas para fins de comparação de conteúdo.

**langchain:** As instituições obrigadas a compartilhar dados e informações sobre indícios de fraudes são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). A instituição excluída dessa obrigação é a administradora de consórcio (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta lista corretamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradora de consórcio), conforme o gabarito. As citações incorretas de artigos são ignoradas conforme as regras.

**langchain-padrao:** As instituições obrigadas a compartilhar dados são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o art. 1º, caput. A instituição excluída dessa obrigação é a administradora de consórcio, conforme o art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradora de consórcio), conforme o gabarito. Não há contradição nem omissão.

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I); 2. a alteração e a exclusão dos dados e das informações registrados nos termos do § 1º, inciso I, deste artigo, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II); 3. a consulta dos dados e das informações registrados de que trata o § 1º, inciso I, deste artigo (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada relevante à pergunta. Não há contradição com o gabarito e não há itens de 'Não deve afirmar' a serem listados.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. O registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I); 2. A alteração e a exclusão dos dados e das informações registrados nos termos do § 1º, inciso I, deste artigo, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II); 3. A consulta dos dados e das informações registrados de que trata o § 1º, inciso I, deste artigo (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

**langchain-padrao:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades; 2. a alteração e a exclusão dos dados e das informações registrados, conforme o caso; e 3. a consulta dos dados e das informações registrados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito: (I) identificação do suposto autor da fraude, (II) descrição dos indícios, (III) identificação da instituição responsável pelo registro e (IV) identificação dos dados da conta destinatária e de seu titular em caso de transferência ou pagamento. Não há afirmações que contrariem o gabarito nem omissões de itens solicitados.

**langchain:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente as quatro informações mínimas listadas no gabarito: (I) identificação do suposto autor da fraude, (II) descrição dos indícios, (III) identificação da instituição responsável pelo registro e (IV) identificação dos dados da conta destinatária e de seu titular em caso de transferência ou pagamento. Não há afirmações que contrariem o gabarito nem omissões de itens exigidos pela pergunta.

**langchain-padrao:** O registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes deve conter, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. correta

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** O consentimento do cliente deve ser prévio e geral, possibilitando o registro dos dados e das informações que digam respeito ao referido cliente, conforme estabelece a Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º. Além disso, o consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da resolução, conforme a Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I, e deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido, nos termos da Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona que o consentimento deve ser prévio e geral, ter a finalidade de tratamento e compartilhamento de dados sobre indícios de fraude e constar de contrato com cláusula em destaque ou outro instrumento jurídico válido. Porém, omite dois requisitos exigidos pelo gabarito: (i) que o consentimento seja do cliente com quem a instituição tenha relacionamento e (ii) que a documentação fique à disposição do Banco Central. Não há afirmações que contrariem o gabarito, apenas faltas de informações que a pergunta pede. Portanto, a resposta está parcial.

**langchain:** O consentimento prévio e geral obtido do cliente com quem a instituição possui relacionamento deve: 1. Ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta CMN/BCB 6/2023 (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º e § 4º, I); 2. Constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **correta**. A resposta menciona todos os requisitos exigidos para o consentimento do cliente: ser prévio e geral, ter a finalidade de tratamento e compartilhamento de dados sobre indícios de fraude e constar de contrato com cláusula em destaque ou outro instrumento jurídico válido. Não há afirmações que contrariem o gabarito, nem omissão de algo que a pergunta peça.

**langchain-padrao:** O consentimento do cliente deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta CMN/BCB 6/2023, conforme o art. 2º, § 4º, I, da Resolução Conjunta CMN/BCB 6/2023. Além disso, o consentimento deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido, nos termos do art. 2º, § 4º, II, da Resolução Conjunta CMN/BCB 6/2023. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona a finalidade de tratamento e compartilhamento (§4º, I) e a forma de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido (§4º, II), mas omite o requisito de que o consentimento deve ser prévio e geral do cliente com quem a instituição tenha relacionamento (§3º) e que a documentação deve ficar à disposição do Banco Central (§5º). Como faltam elementos que a pergunta pede, a resposta é parcial.

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. A resposta indica que os dados e informações compartilhados, bem como a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º, devem ficar à disposição do Banco Central por dez anos, o que está conforme o gabarito para esses itens. Não há contradição com o gabarito; a menção a artigos diferentes é ignorada conforme as regras. Não há itens de 'Não deve afirmar' a listar.

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados e informações compartilhados e a documentação com critérios e procedimentos (art. 8º, II), omitindo o prazo de cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle (art. 8º, III) e a documentação sobre o sistema eletrônico sem prazo fixado (art. 8º, I). Como a pergunta pede o prazo para os dados sobre indícios de fraude compartilhados e a documentação relacionada, a resposta deixa de fora informações que a pergunta exige, tornando-a parcial.

**langchain-padrao:** As instituições devem manter à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados e a documentação com os critérios e procedimentos referentes ao registro. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. A pergunta pede o prazo de retenção dos dados sobre indícios de fraude compartilhados e da documentação relacionada. O gabarito indica que tais dados e documentação devem ser mantidos por dez anos (art. 8º, II). A resposta do assistente afirma exatamente que os dados e informações compartilhados e a documentação com os critérios e procedimentos devem ficar à disposição por dez anos, o que atende integralmente ao que foi perguntado. Não há contradição com o gabarito e não falta nenhum elemento exigido pela pergunta.

### f01: Qual é a pena para quem pratica atos de terrorismo?

**Gabarito:** Recusa. A tipificação e a pena do terrorismo estão na Lei 13.260/2016, que não está no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### f02: Qual é a pena do crime de estelionato?

**Gabarito:** Recusa. O estelionato está no Código Penal, que não está no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### f03: Qual é a alíquota do IOF nas operações de câmbio?

**Gabarito:** Recusa. Tributação não está no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### f04: Quais são as bases legais que autorizam o tratamento de dados pessoais?

**Gabarito:** Recusa. As bases legais estão na LGPD (Lei 13.709/2018), que não está no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### f05: Em quanto tempo o banco deve devolver o dinheiro de uma vítima de golpe pelo Pix?

**Gabarito:** Recusa. As regras do Pix e do mecanismo de devolução não estão no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### f06: Qual é o capital mínimo exigido para constituir uma instituição de pagamento?

**Gabarito:** Recusa. Requisitos de constituição e capital não estão no corpus.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)
