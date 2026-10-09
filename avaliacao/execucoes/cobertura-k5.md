# Avaliação: cobertura-k5

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-09T12:08:42.397Z a 2026-10-09T12:17:37.053Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: gemini-3.5-flash-lite, sem fallback
- Prompt: versão 932e4dad
- Conteúdo das respostas julgado por openrouter/nvidia/nemotron-3-super-120b-a12b:free, versão ba1252a1 das instruções (`npm run julgar`), comparando com o gabarito

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 80% | 93% | 0.71 |
| langchain | 30 | 80% | 93% | 0.71 |
| langchain-padrao | 30 | 76% | 83% | 0.69 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.767 / 0.806 / 0.872 | 0.665 / 0.691 / 0.696 |
| langchain | 0.767 / 0.806 / 0.872 | 0.665 / 0.691 / 0.696 |
| langchain-padrao | 0.748 / 0.802 / 0.840 | 0.649 / 0.669 / 0.692 |

## Resposta

| variante | falsa recusa | recusa correta (fora) | citações pertinentes | cobertura das citações | erros |
| --- | --- | --- | --- | --- | --- |
| manual | 3/30 (10%) | 6/6 (100%) | 57/61 (93%) | 76% | 0 |
| langchain | 3/30 (10%) | 6/6 (100%) | 54/57 (95%) | 75% | 0 |
| langchain-padrao | 10/30 (33%) | 6/6 (100%) | 35/41 (85%) | 57% | 0 |

| variante | tokens de entrada (média) | tokens de saída (média) | custo de tabela | geração p50 / p95 | total p50 / p95 |
| --- | --- | --- | --- | --- | --- |
| manual | 1042 | 235 | sem preço configurado | 1.0 s / 2.0 s | 1.0 s / 2.0 s |
| langchain | 1042 | 243 | sem preço configurado | 1.1 s / 1.9 s | 1.2 s / 2.0 s |
| langchain-padrao | 1533 | 283 | sem preço configurado | 1.0 s / 2.7 s | 1.0 s / 2.7 s |

Motivos de recusa (todas as perguntas):

| variante | citação não confere | modelo: não cobre |
| --- | --- | --- |
| manual | 0 | 9 |
| langchain | 1 | 8 |
| langchain-padrao | 8 | 9 |

## Conteúdo (juiz: nvidia/nemotron-3-super-120b-a12b:free)

Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.

Parcial declarada: o modelo disse que os trechos respondem só em parte. Parcial não declarada: o juiz deu parcial e o modelo disse total.

| variante | julgadas | corretas | parciais | incorretas | acerto fim a fim | afirmou o que não devia | parcial declarada | parcial não declarada |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| manual | 27 | 17 | 10 | 0 | 17/30 (57%) | 0 | 7 | 6 |
| langchain | 27 | 16 | 11 | 0 | 16/30 (53%) | 0 | 7 | 6 |
| langchain-padrao | 19 | 14 | 4 | 1 | 15/30 (50%) | 1 | 5 | 1 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q02 | coberta | 2 · respondeu 2/2, parcial | 2 · respondeu 2/2, parcial | 2 · respondeu 7/7, parcial |
| q03 | coberta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta |
| q04 | coberta | 3 · respondeu 3/3, parcial | 3 · respondeu 3/3, parcial | 2 · respondeu 3/3, parcial |
| q05 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 2 · recusou (citação não confere) |
| q06 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q07 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, parcial |
| q08 | coberta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta | 1 · recusou (citação não confere; aceita) |
| q09 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 11 · recusou (modelo: não cobre) |
| q10 | coberta | 1 · respondeu 1/1, parcial | 1 · respondeu 1/2, correta | 7 · respondeu 0/3, correta |
| q11 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 2 · respondeu 1/1, correta |
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · respondeu 1/1, parcial | 1 · recusou (citação não confere) |
| q13 | coberta | 5 · recusou (modelo: não cobre) | 5 · recusou (modelo: não cobre) | 2 · respondeu 1/1, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q15 | coberta | 10 · recusou (modelo: não cobre) | 10 · recusou (modelo: não cobre) | 2 · respondeu 1/1, correta |
| q16 | coberta | 1 · respondeu 5/5, parcial | 1 · respondeu 5/5, parcial | 1 · recusou (citação não confere) |
| q17 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, parcial | 1 · respondeu 0/1, parcial |
| q18 | coberta | 2 · respondeu 4/5, correta | 2 · respondeu 3/3, correta | 3 · recusou (citação não confere) |
| q19 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta |
| q20 | coberta | 2 · respondeu 3/3, parcial | 2 · respondeu 3/3, parcial | 1 · respondeu 3/3, correta |
| q21 | coberta | 12 · respondeu 0/1, parcial | 12 · respondeu 0/1, parcial | 19 · respondeu 0/1, incorreta, afirmou o que não devia |
| q22 | coberta | 1 · respondeu 5/5, parcial | 1 · respondeu 5/5, parcial | 1 · recusou (citação não confere) |
| q23 | coberta | 1 · respondeu 3/5, correta | 1 · respondeu 2/3, correta | 1 · recusou (citação não confere) |
| q24 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 0/1, correta |
| q25 | coberta | 2 · respondeu 3/3, parcial | 2 · recusou (citação não confere) | 6 · recusou (modelo: não cobre) |
| q26 | coberta | 5 · respondeu 1/1, correta | 5 · respondeu 1/1, correta | 2 · respondeu 2/2, correta |
| q27 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta |
| q28 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, parcial | 1 · respondeu 4/4, correta |
| q29 | coberta | 1 · respondeu 2/2, parcial | 1 · respondeu 2/2, parcial | 1 · recusou (citação não confere) |
| q30 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, parcial | 6 · recusou (modelo: não cobre) |
| f01 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f02 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f03 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f04 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f05 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f06 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |

## Respostas

### q01: Qual conduta configura o crime de lavagem de dinheiro e qual é a pena prevista?

**Gabarito:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. Pena: reclusão de 3 a 10 anos e multa.

**manual:** A conduta que configura o crime é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, coincidindo integralmente com o gabarito. Não há afirmações que contrariem o gabarito nem omissões de elementos exigidos pela pergunta.

**langchain:** Configura o crime de lavagem de dinheiro ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, conforme o gabarito. Não há contradição nem omissão.

**langchain-padrao:** Configura o crime de lavagem ou ocultação de bens, direitos e valores a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal, conforme o gabarito, e indica a pena de reclusão de 3 a 10 anos e multa, também conforme o gabarito. Não há contradição nem omissão de elementos exigidos pela pergunta.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** As pessoas referidas no art. 9º identificarão seus clientes e manterão cadastro atualizado, nos termos de instruções emanadas das autoridades competentes (Lei 9.613/1998, art. 10, I). As pessoas referidas no art. 9º manterão registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas (Lei 9.613/1998, art. 10, II). [parcial; sem resposta nos trechos: Os deveres de comunicação.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. A resposta menciona os deveres de identificação (art. 10, I) e de registro das transações acima do limite (art. 10, II), mas omite os deveres de comunicação ao Coaf (arts. 11, II e III) e outros deveres de registro/comunicação previstos no gabarito, que são solicitados pela pergunta. Não há afirmação que contradiga o gabarito.

**langchain:** As pessoas referidas no art. 9º identificarão seus clientes e manterão cadastro atualizado, nos termos de instruções emanadas das autoridades competentes, conforme a Lei 9.613/1998, art. 10, I. Além disso, manterão registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas, conforme a Lei 9.613/1998, art. 10, II. [parcial; sem resposta nos trechos: Os trechos fornecidos não contêm informações sobre os deveres de comunicação.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. A resposta menciona os deveres de identificação (art. 10, I) e de registro (art. 10, II), mas omite os deveres de comunicação previstos no art. 11 (comunicação de transações acima do limite, de operações suspeitas e de não ocorrência de operações comunicáveis). Como a pergunta pede especificamente os deveres de identificação, registro e comunicação, a falta dos deveres de comunicação torna a resposta parcial, sem contradizer o gabarito.

**langchain-padrao:** As pessoas sujeitas ao mecanismo de controle devem identificar seus clientes e manter cadastro atualizado, nos termos de instruções emanadas das autoridades competentes (Lei 9.613/1998, art. 10, I). No caso de o cliente ser pessoa jurídica, a identificação deve abranger as pessoas físicas autorizadas a representá-la, bem como seus proprietários (Lei 9.613/1998, art. 10, § 1º). Devem manter registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas (Lei 9.613/1998, art. 10, II). Os cadastros e registros devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). Devem adotar políticas, procedimentos e controles internos, compatíveis com seu porte e volume de operações, que lhes permitam atender ao disposto no art. 10 e no art. 11, na forma disciplinada pelos órgãos competentes (Lei 9.613/1998, art. 10, III). Devem cadastrar-se e manter seu cadastro atualizado no órgão regulador ou fiscalizador e, na falta deste, no Conselho de Controle de Atividades Financeiras (Coaf), na forma e condições por eles estabelecidas (Lei 9.613/1998, art. 10, IV). Devem atender às requisições formuladas pelo Coaf na periodicidade, forma e condições por ele estabelecidas, cabendo-lhe preservar, nos termos da lei, o sigilo das informações prestadas (Lei 9.613/1998, art. 10, V). [parcial; sem resposta nos trechos: Os deveres específicos de comunicação (exceto o atendimento a requisições do Coaf) não foram detalhados além da menção ao art. 11 nos controles internos.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, § 1º; Lei 9.613/1998, art. 10, II; Lei 9.613/1998, art. 10, § 2º; Lei 9.613/1998, art. 10, III; Lei 9.613/1998, art. 10, IV; Lei 9.613/1998, art. 10, V

> juiz: **parcial**. parcial

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As instituições devem comunicar as operações ou situações suspeitas de lavagem de dinheiro ao Coaf, conforme Circular BCB 3.978/2020, art. 48, caput. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as instituições devem comunicar as operações suspeitas ao Coaf, atendendo ao que a pergunta pede (o destinatário da comunicação). Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

**langchain:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 48, caput. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica que as instituições referidas no art. 1º devem comunicar ao Coaf as operações suspeitas de lavagem de dinheiro (e também de financiamento do terrorismo), o que atende à pergunta sobre a quem devem ser comunicadas as operações com indícios de lavagem de dinheiro. Não há contradição com o gabarito, que também aponta o Coaf como destinatário. A resposta não omite nada que a pergunta exija e não afirma nada que contradiga o gabarito.

**langchain-padrao:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 48. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica que as instituições devem comunicar ao Coaf as operações suspeitas de lavagem de dinheiro, o que corresponde exatamente ao que a pergunta pede (o destinatário da comunicação). Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

### q04: Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**manual:** As pessoas referidas no art. 9º, bem como os administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11, estarão sujeitas às seguintes sanções, aplicadas cumulativamente ou não pelas autoridades competentes: 1. Advertência (Lei 9.613/1998, art. 12, I); 2. Multa pecuniária variável (Lei 9.613/1998, art. 12, II), que não será superior ao dobro do valor da operação (Lei 9.613/1998, art. 12, II, a). — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a

> juiz: **parcial**. A resposta menciona apenas advertência e multa pecuniária limitada ao dobro do valor da operação, omitindo as demais sanções previstas no gabarito: multa também pode ser até o dobro do lucro real obtido ou presumido ou até R$ 20 milhões, inabilitação temporária por até dez anos e cassação ou suspensão da autorização. Não há contradição com o gabarito, apenas falta de informações solicitadas pela pergunta.

**langchain:** As pessoas referidas no art. 9º, bem como os administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11, estarão sujeitas às seguintes sanções, aplicadas cumulativamente ou não pelas autoridades competentes: advertência (Lei 9.613/1998, art. 12, I) e multa pecuniária variável não superior ao dobro do valor da operação (Lei 9.613/1998, art. 12, II e art. 12, II, a). — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a

> juiz: **parcial**. A resposta menciona apenas advertência e multa pecuniária (até o dobro do valor da operação), omitindo as sanções de inabilitação temporária, cassação ou suspensão da autorização e as variantes da multa (até o dobro do lucro ou até R$ 20 milhões). Não há afirmação que contradiga o gabarito, apenas falta de informações solicitadas pela pergunta.

**langchain-padrao:** Às pessoas referidas no art. 9º, bem como aos administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11 serão aplicadas, cumulativamente ou não, pelas autoridades competentes, as seguintes sanções: advertência (Lei 9.613/1998, art. 12, caput e I) e multa pecuniária variável não superior ao dobro do valor da operação (Lei 9.613/1998, art. 12, caput e II, a). [parcial; sem resposta nos trechos: Os trechos fornecidos não detalham todas as demais alíneas e incisos das sanções aplicáveis previstas na Lei 9.613/1998 para além da advertência e da primeira alínea da multa pecuniária do art. 12.] — citações: Lei 9.613/1998, art. 12, caput; Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II, a

> juiz: **parcial**. A resposta menciona apenas advertência e multa limitada ao dobro do valor da operação, omitindo as demais sanções previstas no gabarito (multa até o dobro do lucro ou até R$ 20 milhões, inabilitação temporária e cassação/suspensão da autorização). Não há afirmação que contradiga o gabarito, apenas omissão de itens que a pergunta pede, portanto a classificação é parcial. Não há itens de "Não deve afirmar" a serem listados.

### q05: Por quanto tempo a instituição deve conservar os cadastros de clientes e os registros das operações?

**Gabarito:** A lei fixa o mínimo de cinco anos, contados do encerramento da conta ou da conclusão da transação, prazo que a autoridade competente pode ampliar (Lei 9.613, art. 10, § 2º). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 fixa dez anos: para as informações dos procedimentos de conhecer o cliente, contados do primeiro dia do ano seguinte ao término do relacionamento (art. 67, I), e para os registros de operações dos arts. 28 a 37, contados do primeiro dia do ano seguinte ao da operação (art. 67, III).

**manual:** Sobre os cadastros e registros, os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). Adicionalmente, as informações coletadas nos procedimentos destinados a conhecer os clientes de que tratam os arts. 13, 16 e 18 devem ser conservadas pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, I). Sobre os registros das operações, as informações e registros de que tratam os arts. 28 a 37 devem ser conservados pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente o que o gabarito estabelece: prazo mínimo de cinco anos para cadastros e registros, com possibilidade de ampliação pela autoridade competente, e, para as instituições autorizadas pelo Banco Central, prazo de dez anos para as informações de conhecer o cliente e para os registros de operações, contados a partir do primeiro dia do ano seguinte ao término do relacionamento ou da operação. Não há contradição nem omissão de algo que a pergunta pede.

**langchain:** Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). As instituições devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações coletadas nos procedimentos destinados a conhecer os clientes, contado o prazo a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, I). As instituições também devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações e registros de operações, contado o prazo a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente os prazos de conservação indicados no gabarito: mínimo de cinco anos, com possibilidade de ampliação pela autoridade competente, e dez anos para as informações de conhecer o cliente e para os registros de operações, com os mesmos pontos de início. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta pede.

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 1º, § 2º (texto do dispositivo não está nos trechos recuperados))

### q06: Para efeito dos crimes contra o sistema financeiro, o que se considera instituição financeira e quem é equiparado a ela?

**Gabarito:** Instituição financeira é a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (I); a pessoa jurídica que ofereça serviços de operações com ativos virtuais, inclusive intermediação, negociação ou custódia (I-A); e a pessoa natural que exerça qualquer dessas atividades, ainda que de forma eventual (II).

**manual:** Considera-se instituição financeira, para efeito da lei, a pessoa jurídica de direito público ou privado, que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: 1. a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); 2. a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); 3. a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os três casos de equiparação presentes no gabarito, sem acrescentar ou omitir informações relevantes e sem contradizer nenhum ponto.

**langchain:** Para efeito da lei dos crimes contra o sistema financeiro, considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); e a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem falta de conteúdo exigido.

**langchain-padrao:** Considera-se instituição financeira, para efeito da lei, a pessoa jurídica de direito público ou privado, que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º). Equipara-se à instituição financeira: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); e a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, definindo instituição financeira e listando os equiparados (pessoas jurídicas que captam ou administram seguros, câmbio, consórcio, capitalização, poupança ou recursos de terceiros; pessoas jurídicas que oferecem serviços de operações com ativos virtuais; e pessoa natural que exerça essas atividades, ainda que eventual). Não há contradição nem omissão de algo que a pergunta pede.

### q07: O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** O crime consiste em gerir fraudulentamente instituição financeira, tendo como pena reclusão de 3 (três) a 12 (doze) anos, e multa, conforme Lei 7.492/1986, art. 4º, caput. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime consiste em gerir fraudulentamente instituição financeira e indica a pena de reclusão de 3 a 12 anos e multa, conforme a Lei 7.492/1986, art. 4º, caput. Isso corresponde exatamente ao que o gabarito indica como caracterização do crime e pena, sem acrescentar definições proibidas ou informações contraditórias. Não há afirmação que viole os itens de 'Não deve afirmar'.

**langchain:** O crime é caracterizado por gerir fraudulentamente instituição financeira, cuja pena é de reclusão, de 3 (três) a 12 (doze) anos, e multa, conforme o Lei 7.492/1986, art. 4º, caput. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime consiste em 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, exatamente como o gabarito indica. Não apresenta qualquer definição de gestão fraudulenta, portanto não viola o item 1 de 'Não deve afirmar'. Assim, a resposta está correta.

**langchain-padrao:** Os trechos estabelecem que gerir fraudulentamente instituição financeira tem a pena de reclusão, de 3 (três) a 12 (doze) anos, e multa. [parcial; sem resposta nos trechos: O que caracteriza o crime de gestão fraudulenta de instituição financeira.] — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **parcial**. A resposta apenas menciona a pena (reclusão de 3 a 12 anos e multa) e omite a caracterização do crime, que segundo o gabarito consiste apenas na tipificação da conduta 'gerir fraudulentamente instituição financeira', sem definição de gestão fraudulenta. Não há contradição com o gabarito, apenas falta de informação solicitada.

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** Se a gestão é temerária, a pena é de reclusão, de 2 (dois) a 8 (oito) anos, e multa (Lei 7.492/1986, art. 4º, parágrafo único). Gerir fraudulentamente instituição financeira tem pena de reclusão, de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º, caput). [parcial; sem resposta nos trechos: Os trechos não trazem os conceitos ou definições do que caracteriza cada uma das duas gestões, apenas informam as penas correspondentes.] — citações: Lei 7.492/1986, art. 4º, parágrafo único; Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta indica apenas as penas previstas para cada conduta, sem apresentar definições ou características que não estejam no gabarito, e não contém nenhum dos itens proibidos de 'Não deve afirmar'. Portanto, está correta.

**langchain:** A gestão temerária tem a pena de reclusão, de 2 (dois) a 8 (oito) anos, e multa (Lei 7.492/1986, art. 4º, parágrafo único). A gestão fraudulenta tem a pena de reclusão, de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º, caput). [parcial; sem resposta nos trechos: Os trechos fornecidos não definem o conceito ou a diferença conceitual entre gestão temerária e gestão fraudulenta, informando apenas as penas de cada uma.] — citações: Lei 7.492/1986, art. 4º, parágrafo único; Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A pergunta pede a diferença entre gestão temerária e gestão fraudulenta. A resposta indica as penas distintas para cada uma (2 a 8 anos para temerária, 3 a 12 anos para fraudulenta), o que constitui a diferença prevista na lei. O gabarito acrescenta apenas que a lei não define as condutas, informação que não é exigida pela pergunta; portanto, a ausência desse detalhe não torna a resposta parcial. Além disso, a resposta não afirma o conteúdo proibido no item 1 de "Não deve afirmar". Assim, a resposta está correta.

**langchain-padrao:** recusou (citação não confere: Lei 7.492/1986, Parágrafo único (dispositivo não existe no corpus))

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, constitui crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, incluindo instituições de distribuição de valores mobiliários ou de câmbio, e indica a pena de reclusão de 1 a 4 anos e multa, exatamente como o gabarito. Não há contradição nem omissão.

**langchain:** Sim, constitui crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio (Lei 7.492/1986, art. 16, caput). A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa (Lei 7.492/1986, art. 16, caput). — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, incluindo instituições de distribuição de valores mobiliários ou de câmbio, e indica a pena de reclusão de 1 a 4 anos e multa, exatamente como o gabarito. Não há contradição nem omissão relevante.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** Induzir ou manter em erro investidor relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente é crime (Lei 7.492/1986, art. 6º, caput). [parcial; sem resposta nos trechos: O trecho correspondente a omitir informação ou prestar informação falsa especificamente à fiscalização sobre a situação financeira da instituição não foi respondido.] — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **parcial**. A resposta confirma que é crime induzir ou manter em erro investidor ao omitir ou falsificar informação, o que está de acordo com o gabarito. Porém, a pergunta também abrange a fiscalização, e a resposta não menciona esse destinatário, omitindo algo que a pergunta pede. Não há afirmações que contrariem o gabarito.

**langchain:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente (Lei 7.492/1986, art. 6º, caput). Também constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º, caput). — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput

> juiz: **correta**. A resposta afirma que é crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente, o que corresponde exatamente ao que o gabarito afirma como crime. Não há contradição com o gabarito; a menção adicional ao art. 9º da Lei 7.492/1986 não contradiz o gabarito, apenas acrescenta informação extra. Não há itens em "Não deve afirmar" para listar.

**langchain-padrao:** Constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar, com pena de reclusão de 1 (um) a 5 (cinco) anos, e multa, conforme o art. 9º da Lei 7.492/1986. Também constitui crime fazer inserir elemento falso ou omitir elemento exigido pela legislação em demonstrativos contábeis de instituição financeira, seguradora ou instituição integrante do sistema de distribuição de títulos de valores mobiliários, com pena de reclusão de 1 (um) a 5 (cinco) anos, e multa, nos termos do art. 10 da Lei 7.492/1986. Além disso, é crime divulgar informação falsa ou prejudicialmente incompleta sobre instituição financeira, com pena de reclusão de 2 (dois) a 6 (seis) anos, e multa, conforme o art. 3º da Lei 7.492/1986. [parcial; sem resposta nos trechos: A resposta não aborda o crime específico de omitir informação ou prestar informação falsa diretamente a investidores de forma genérica fora dos documentos comprobatórios de investimento, nem toda e qualquer omissão de informação à fiscalização além dos demonstrativos contábeis e do art. 9º.] — citações: Lei 7.492/1986, art. 9º, caput; Lei 7.492/1986, art. 10, caput; Lei 7.492/1986, art. 3º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição, citando o art. 3º da Lei 7.492/1986, que prevê pena de reclusão de 2 a 6 anos e multa, exatamente como o gabarito. Embora também mencione outros crimes (arts. 9º e 10º) com penas diferentes, esses tratam de fatos distintos e não contradizem o conteúdo do gabarito relativo ao crime em questão. Não há itens em "Não deve afirmar" a serem violados. Portanto, a resposta está correta.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º). — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, acrescentando apenas a referência legal, o que não constitui contradição nem omissão. Portanto, está correta.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º, caput). — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, afirmando que a lei trata do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º). — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, sem acrescentar nem omitir informações relevantes, e não contém afirmações que o contrariem.

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** Os trechos não trazem o significado da expressão "sem demora", mas indicam que as pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput). [parcial; sem resposta nos trechos: O significado da expressão "sem demora".] — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **parcial**. A resposta não fornece o significado da expressão "sem demora", que é o que a pergunta pede. Ela apenas afirma que os trechos não trazem esse significado e fala sobre quem deve cumprir a indisponibilidade, omitindo o conteúdo exigido (imediatamente ou dentro de algumas horas). Não há contradição com o gabarito, apenas falta de informação solicitada.

**langchain-padrao:** recusou (citação não confere: Lei 13.810/2019, art. 1º, V (dispositivo não existe no corpus))

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Para fins da indisponibilidade de ativos, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não, conforme o art. 2º, I, da Lei 13.810/2019. — citações: Lei 13.810/2019, art. 2º, I

> juiz: **correta**. A resposta lista os tipos de bens e recursos que podem ser atingidos pela indisponibilidade de ativos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), o que corresponde exatamente ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput). — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. correta

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput). — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta identifica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, conforme o gabarito. Não há contradição com o gabarito e não omite nada que a pergunta pede.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Isso está em total acordo com o gabarito, que também aponta esses sujeitos como responsáveis. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta exija (a pergunta apenas pede quem deve cumprir). Portanto, a resposta está correta.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** As resoluções sancionatórias do Conselho de Segurança das Nações Unidas e as designações de seus comitês de sanções são dotadas de executoriedade imediata na República Federativa do Brasil, conforme o art. 6º da Lei 13.810/2019 [2]. — citações: Lei 13.810/2019, art. 6º, caput

> juiz: **correta**. A resposta afirma que as resoluções sancionatórias do CSNU têm executoriedade imediata no Brasil, o que indica que não é necessária decisão judicial para o cumprimento da indisponibilidade de ativos. Isso está de acordo com o gabarito, que também afirma que as resoluções têm executoriedade imediata e devem ser cumpridas sem demora, sem necessidade de decisão judicial. A resposta não contradiz o gabarito e responde adequadamente à pergunta.

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** A avaliação interna é um procedimento que as instituições devem realizar com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco (Circular BCB 3.978/2020, art. 10, § 1º). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta define corretamente a avaliação interna de risco e menciona que deve considerar, no mínimo, os perfis de risco, mas não especifica quais perfis (clientes, instituição, operações, transações, produtos, serviços, canais de distribuição, novas tecnologias e atividades de funcionários, parceiros e terceirizados), conforme exigido pelo gabarito para descrever como a avaliação deve ser feita. Essa omissão caracteriza uma resposta parcial. Não há afirmações que contradigam o gabarito, e não há itens em 'Não deve afirmar' para listar.

**langchain:** A avaliação interna é realizada pelas instituições com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco (Circular BCB 3.978/2020, art. 10, § 1º). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta descreve corretamente o objetivo e alguns requisitos da avaliação interna de risco, mas omite a especificação dos perfis de risco que devem ser considerados (clientes, instituição – modelo de negócio e área geográfica – operações, transações, produtos e serviços com todos os canais de distribuição e novas tecnologias, e atividades de funcionários, parceiros e terceirizados), conforme exigido pelo gabarito. Não há afirmações que contradigam o gabarito, apenas falta de detalhes.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 10, § 1º, I a IV (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 12, I a III (dispositivo não existe no corpus))

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput). [parcial; sem resposta nos trechos: Quais são os demais elementos ou detalhamentos que esses procedimentos devem contemplar, além da identificação, qualificação e classificação.] — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **correta**. A resposta menciona que os procedimentos devem incluir a devida diligência na identificação, qualificação e classificação dos clientes, o que está de acordo com o trecho do gabarito que trata desses elementos. Não há contradição com o gabarito, e a pergunta não exige especificamente os detalhes adicionais (compatibilidade com perfil de risco, política PLD/FT, formalização em manual, etc.) que o gabarito também traz. Portanto, a resposta está correta.

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas que os procedimentos devem assegurar devida diligência na identificação, qualificação e classificação dos clientes, omite outros requisitos exigidos pelo gabarito, como compatibilidade com perfil de risco, política de PLD/FT e avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação (nome completo e CPF ou firma e CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final. Não há contradição com o gabarito, apenas omissão de elementos que a pergunta pede, portanto a resposta é parcial.

**langchain-padrao:** Os procedimentos destinados a conhecer os clientes devem contemplar medidas reforçadas para clientes classificados em categorias de maior risco, de acordo com a avaliação interna de risco referida no art. 10 (Circular BCB 3.978/2020, art. 13, § 1º, I). — citações: Circular BCB 3.978/2020, art. 13, § 1º, I

> juiz: **parcial**. A resposta menciona apenas medidas reforçadas para clientes de maior risco, o que está em conformidade com o gabarito, mas omite outros elementos essenciais que os procedimentos devem contemplar, como identificação, qualificação e classificação dos clientes, conforme exigido pela pergunta. Não há contradição com o gabarito, apenas falta de conteúdo solicitado.

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições referidas no art. 1º devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 38, caput. Para os fins desta Circular, as operações e situações suspeitas referem-se a qualquer operação ou situação que apresente indícios de utilização da instituição para a prática dos crimes de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 38, § 1º. As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 39, caput. Além disso, a política da instituição deve contemplar diretrizes para a implementação de procedimentos de monitoramento, seleção e análise de operações e situações suspeitas, conforme Circular BCB 3.978/2020, art. 3º, II, c. O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação, conforme Circular BCB 3.978/2020, art. 39, parágrafo único. — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 38, § 1º; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 3º, II, c; Circular BCB 3.978/2020, art. 39, parágrafo único

> juiz: **correta**. A resposta aborda o que a pergunta pede: descreve que a instituição deve implementar procedimentos de monitoramento, seleção e análise de operações para identificar e dar especial atenção às suspeitas de lavagem de dinheiro e financiamento do terrorismo, menciona que a política deve contemplar diretrizes para esses procedimentos e estabelece o limite de 45 dias para o monitoramento. Não há afirmações que contradigam o gabarito. Embora o gabarito inclua detalhes adicionais (avaliação interna de risco, condição de PEP, manual aprovado pela diretoria e aplicação às propostas de operações), a pergunta não exige explicitamente esses itens; portanto, a ausência deles não torna a resposta parcial nem incorreta.

**langchain:** As instituições devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 38, caput. As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 39, caput. O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação, conforme Circular BCB 3.978/2020, art. 39, parágrafo único. [parcial; sem resposta nos trechos: Quais são as situações específicas (especialmente) que o monitoramento deve permitir identificar, conforme o caput do art. 39.] — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, parágrafo único

> juiz: **correta**. A resposta aborda os pontos essenciais solicitados pela pergunta: implementar procedimentos de monitoramento, seleção e análise de operações, dar atenção especial às suspeitas de lavagem de dinheiro e financiamento do terrorismo, e respeitar o prazo máximo de 45 dias. Não há contradição com o gabarito, e os detalhes omitidos (compatibilidade com a política de PLD/FT, avaliação de risco interno, condição de PEP, manual aprovado pela diretoria e aplicação às propostas de operações) não são exigidos explicitamente pela pergunta, portanto sua ausência não torna a resposta parcial. Não há itens de "Não deve afirmar" presentes na resposta.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 39, caput, I, d, e, f, g, h, II (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 39, § 2º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 39, § 3º, I, II, III, IV (dispositivo não existe no corpus))

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação conforme Circular BCB 3.978/2020, art. 48, § 2º. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta indica que a comunicação ao Coaf deve ser feita até o dia útil seguinte à decisão de comunicação, conforme o art. 48, § 2º da Circular BCB 3.978/2020, o que exatamente corresponde ao prazo solicitado na pergunta. Não há afirmação de que o prazo seja de 45 dias nem referência ao art. 49, § 1º, portanto não há itens violados da lista 'Não deve afirmar'.

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação conforme Circular BCB 3.978/2020, art. 48, § 2º. Adicionalmente, as pessoas referidas no art. 9º da Lei 9.613/1998 devem comunicar ao Coaf no prazo de 24 (vinte e quatro) horas, conforme o art. 11, II, da mesma lei. — citações: Circular BCB 3.978/2020, art. 48, § 2º; Lei 9.613/1998, art. 11, II

> juiz: **correta**. A resposta traz o prazo correto de comunicação ao Coaf: até o dia útil seguinte à decisão de comunicação (Circular 3.978/2020, art. 48, § 2º) e também menciona o prazo de 24 horas previsto na Lei 9.613/1998, art. 11, II, que está presente no gabarito. Não afirma nada que contradiga o gabarito, nem viola os itens de 'Não deve afirmar'.

**langchain-padrao:** A decisão de comunicação da operação ou situação ao Coaf deve ocorrer até o final do prazo de análise referido no art. 43, § 1º (Circular BCB 3.978/2020, art. 48, § 1º, III). Além disso, a comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação (Circular BCB 3.978/2020, art. 48, § 2º). — citações: Circular BCB 3.978/2020, art. 48, § 1º, III; Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta indica corretamente que a comunicação ao Coaf deve ser feita até o dia útil seguinte à decisão de comunicação e que a decisão deve ocorrer até o fim do prazo de análise, conforme o gabarito. Não afirma que o prazo seja de 45 dias nem menciona o art. 49, § 1º, portanto não viola os itens de 'Não deve afirmar'.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** As instituições devem avaliar anualmente a efetividade da política, dos procedimentos e dos controles internos, conforme Circular BCB 3.978/2020, art. 62, caput e § 1º, e art. 62, § 2º, I. [parcial; sem resposta nos trechos: A quem o relatório deve ser enviado.] — citações: Circular BCB 3.978/2020, art. 62, caput; Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I

> juiz: **parcial**. A resposta menciona a periodicidade anual da avaliação, mas não informa a quem o relatório deve ser enviado, que é parte do que a pergunta pede. Não há contradição com o gabarito.

**langchain:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (Circular BCB 3.978/2020, art. 62, caput), sendo a avaliação documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º e § 2º, I). [parcial; sem resposta nos trechos: A indicação de a quem o relatório deve ser enviado.] — citações: Circular BCB 3.978/2020, art. 62, caput; Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I

> juiz: **parcial**. A resposta menciona a periodicidade anual com data-base de 31 de dezembro, mas omite a informação de a quem o relatório deve ser enviado (comitê de auditoria, conselho de administração ou diretoria). Como não há contradição com o gabarito, apenas falta de informação solicitada, a classificação é parcial.

**langchain-padrao:** A avaliação de efetividade deve ser elaborada anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 2º, I). O relatório deve ser encaminhado para ciência, até 31 de março do ano seguinte ao da data-base: ao comitê de auditoria, quando houver (Circular BCB 3.978/2020, art. 62, § 2º, II, a); e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta menciona a periodicidade anual, a data-base de 31 de dezembro, o prazo de envio até 31 de março do ano seguinte e os destinatários (comitê de auditoria, quando houver, e conselho de administração ou diretoria), exatamente como o gabarito estabelece. Não há afirmações que contrariem o gabarito nem omissões de elementos exigidos pela pergunta.

### q21: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro? Toda operação da relação deve ser comunicada ao Coaf?

**Gabarito:** As operações e situações relacionadas exemplificam indícios de suspeita para fins dos procedimentos de monitoramento e seleção da Circular 3.978 (art. 1º, caput). Não são comunicadas automaticamente: só quando os indícios forem confirmados ao término da análise (§ 1º), que deve considerar todas as informações disponíveis, inclusive as dos procedimentos de conhecer clientes, funcionários, parceiros e terceirizados (§ 2º).

**manual:** As autoridades competentes elaborarão relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese prevista no inciso I do art. 11 da Lei 9.613/1998 (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: Os trechos fornecidos não respondem se toda operação da relação deve ser comunicada ao Coaf.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta não afirma que toda operação da relação deve ser comunicada ao Coaf, portanto não contradiz o gabarito. Porém, ela omite informações que a pergunta pede: o propósito da relação (exemplificar indícios para os procedimentos de monitoramento e seleção da Circular 3.978) e o fato de que as operações não são comunicadas automaticamente, sendo necessária a confirmação dos indícios após análise. Como nada do que afirma contradiz o gabarito, mas falta algo que a pergunta pede, a resposta é parcial.

**langchain:** As autoridades competentes, nas instruções referidas no inciso I do art. 11 da Lei 9.613/1998, elaborarão relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese nele prevista (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: A resposta para saber se toda operação da relação deve ser comunicada ao Coaf não é abordada nos trechos fornecidos.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta não menciona o propósito da relação (exemplificar indícios para monitoramento e seleção) nem esclarece que as operações não são comunicadas automaticamente, apenas após confirmação. Não há contradição com o gabarito, apenas omissão.

**langchain-padrao:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 48. [parcial; sem resposta nos trechos: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro.] — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **incorreta**. A resposta afirma que as instituições devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e financiamento do terrorismo, o que equivale a dizer que toda operação da relação deve ser comunicada, contrariando o gabarito que esclarece que a comunicação ocorre somente após confirmação dos indícios. Além disso, não aborda o propósito da relação (exemplificar indícios para monitoramento e seleção). Portanto, a resposta está incorreta e viola o item 1 de "Não deve afirmar". Afirmou o que não devia: dizer que toda operação da relação deve ser comunicada ao Coaf.

### q22: Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**manual:** O fracionamento de depósitos ou saques em espécie é considerado indício de suspeita nas seguintes situações: 1. fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d); 2. fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e); 3. depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f); 4. saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie (Carta Circular BCB 4.001/2020, art. 1º, I, k); 5. dois ou mais depósitos em terminais de autoatendimento em espécie, no período de cinco dias úteis, com indícios de tentativa de burla para evitar a identificação do depositante (Carta Circular BCB 4.001/2020, art. 1º, I, m). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f; Carta Circular BCB 4.001/2020, art. 1º, I, k; Carta Circular BCB 4.001/2020, art. 1º, I, m

> juiz: **parcial**. A resposta inclui a maioria das situações indicadas no gabarito (d, e, k, m) mas omite a situação 'l' (dois ou mais saques em espécie no caixa no mesmo dia) e acrescenta a situação 'f', que não está no gabarito. Como a pergunta pede as condições em que o fracionamento de depósitos ou saques em espécie é indício de suspeita, a falta de 'l' caracteriza omissão de algo que a pergunta pede, tornando a resposta parcial. Não há contradição com o gabarito.

**langchain:** O fracionamento de depósitos ou saques em espécie é considerado indício de suspeita nas seguintes situações: 1. fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d); 2. fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e); 3. depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f); 4. saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie (Carta Circular BCB 4.001/2020, art. 1º, I, k); 5. dois ou mais depósitos em terminais de autoatendimento em espécie, no período de cinco dias úteis, com indícios de tentativa de burla para evitar a identificação do depositante (Carta Circular BCB 4.001/2020, art. 1º, I, m). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f; Carta Circular BCB 4.001/2020, art. 1º, I, k; Carta Circular BCB 4.001/2020, art. 1º, I, m

> juiz: **parcial**. parcial

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, caput, d (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, e (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, f (dispositivo não existe no corpus))

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** Os sinais de alerta que envolvem a movimentação financeira do cliente em relação à capacidade econômica são: 1. movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, IV, a); 2. solicitação de concessão de crédito no País incompatível com a atividade econômica ou com a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, VI, b); 3. investimentos significativos não proporcionais à capacidade financeira do cliente, ou cuja origem não seja claramente conhecida (Carta Circular BCB 4.001/2020, art. 1º, V, d); 4. as operações realizadas e os produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio (Circular BCB 3.978/2020, art. 39, I, c); e 5. movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, XVI, a). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, VI, b; Carta Circular BCB 4.001/2020, art. 1º, V, d; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a

> juiz: **correta**. A resposta inclui os sinais de alerta que envolvem a movimentação financeira do cliente em relação à capacidade econômica (itens 1, 4 e 5), que estão de acordo com o gabarito. Os demais itens acrescentados não contradizem o gabarito, pois tratam de outros fatos não mencionados nele. Não há omissão de algo que a pergunta pede, portanto a resposta está correta.

**langchain:** Os sinais de alerta que envolvem a movimentação financeira ou de recursos do cliente em relação à sua capacidade financeira são: 1. movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, IV, a; 2. operações realizadas e produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio, conforme Circular BCB 3.978/2020, art. 39, I, c; e 3. movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente em contas correntes em moeda estrangeira (CCME), conforme Carta Circular BCB 4.001/2020, art. 1º, XVI, a. — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a

> juiz: **correta**. A resposta apresenta três sinais de alerta que tratam de movimentação financeira incompatível com a capacidade econômica/financeira do cliente. Todos estão em conformidade com o gabarito, que descreve o sinal básico e menciona variações em outros contextos. Nenhum dos afirmativos contradiz o gabarito, e a resposta não omite nada que a pergunta peça. Portanto, está correta.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, I, a (texto do dispositivo não está nos trechos recuperados); Carta Circular BCB 4.001/2020, art. 1º, II, j (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, II, n (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, III, d (texto do dispositivo não está nos trechos recuperados))

### q24: Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**manual:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta afirma que sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica indício de suspeita, o que está de acordo com o gabarito. Não há contradição com o gabarito e não há afirmação dos itens proibidos (não menciona contas recém-abertas ou de passagem).

**langchain:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. correta

**langchain-padrao:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado é considerada um indício de situação que pode configurar ou indicar suspeita de lavagem de dinheiro. — citações: Carta Circular BCB 4.001/2020, art. 1º, I, e

> juiz: **correta**. A resposta confirma que a movimentação significativa em conta anteriormente pouco movimentada ou com depósito inusitado é indício de suspeita de lavagem de dinheiro, o que está em total acordo com o gabarito. Não acrescenta informações contraditórias e não menciona o que está proibido (contas recém-abertas ou de passagem). Portanto, está correta.

### q25: Que situações envolvendo procuradores, representantes ou o beneficiário final são indícios de suspeita de lavagem de dinheiro?

**Gabarito:** Abertura, movimentação de contas ou realização de operações por detentor de procuração ou de outro tipo de mandato (art. 1º, III, d); operações em que não seja possível identificar o beneficiário final (III, g); representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável (III, h); e contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t).

**manual:** As situações que exemplificam a ocorrência de indícios de suspeita são: a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato; as operações em que não seja possível identificar o beneficiário final, observados os procedimentos definidos na regulamentação vigente; e a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável para tal ocorrência. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h

> juiz: **parcial**. A resposta lista três das quatro situações indicadas no gabarito (d, g, h) e omite a situação descrita no item (t) – contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes. Não há afirmação que contradiga o gabarito, portanto o veredito é parcial. Não há atribuição dos termos proibidos "laranja" ou "interposta pessoa", então naoDeveAfirmados está vazio.

**langchain:** recusou (citação não confere: Circular BCB 4.001/2020, art. 1º, III, d (dispositivo não existe no corpus); Circular BCB 4.001/2020, art. 1º, III, g (dispositivo não existe no corpus); Circular BCB 4.001/2020, art. 1º, III, h (dispositivo não existe no corpus))

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q26: Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**manual:** As instituições obrigadas a observar os requisitos para compartilhamento de dados e informações sobre indícios de fraudes são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. A instituição excluída dessa obrigação (o disposto na Resolução Conjunta não se aplica a ela) é a administradora de consórcio, nos termos do Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona corretamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradora de consórcio), sem contradizer o gabarito. Não há omissão de conteúdo exigido pela pergunta.

**langchain:** As instituições obrigadas a compartilhar dados e informações sobre indícios de fraudes são as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. A instituição excluída dessa obrigação é a administradora de consórcio, de acordo com a Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta lista corretamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo Banco Central) e a excluída (administradora de consórcio), conforme o gabarito. Embora cite incorretamente o parágrafo, isso é ignorado conforme as regras.

**langchain-padrao:** As instituições obrigadas a compartilhar dados e informações sobre indícios de fraudes são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o art. 1º, caput, da Resolução Conjunta CMN/BCB 6/2023. A instituição expressamente excluída dessa obrigação é a administradora de consórcio, de acordo com o art. 1º, § 1º, da Resolução Conjunta CMN/BCB 6/2023. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (instituições financeiras, de pagamento e demais autorizadas pelo BC) e a excluída (administradora de consórcio), conforme o gabarito, sem acrescentar informações contraditórias ou omitir o que a pergunta pede.

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades, conforme Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; a alteração e a exclusão dos dados e das informações registrados, conforme o caso, conforme Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; e a consulta dos dados e das informações registrados, conforme Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta menciona exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta dos dados sobre indícios de fraude, sem acrescentar nada que contradiga o gabarito e sem omitir nenhum item solicitado.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I); a alteração e a exclusão dos dados e das informações registrados, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II); e a consulta dos dados e das informações registrados (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta traz exatamente as três funcionalidades mínimas listadas no gabarito: registro, alteração/exclusão e consulta. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta pede.

**langchain-padrao:** O sistema eletrônico de compartilhamento deve contemplar, no mínimo, as seguintes funcionalidades: 1. O registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I). 2. A alteração e a exclusão dos dados e das informações registrados nos termos do § 1º, inciso I, do art. 2º, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II). 3. A consulta dos dados e das informações registrados de que trata o § 1º, inciso I, do art. 2º (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); e a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III

> juiz: **parcial**. A resposta inclui os itens I, II e III do gabarito, mas omite o item IV (identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento), que também é exigido como informação mínima. Não há afirmações que contradigam o gabarito.

**langchain:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); e a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III

> juiz: **parcial**. A resposta inclui os itens I, II e III, mas omite o item IV (identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento), que é exigido pela pergunta como parte mínima do registro. Não há afirmações que contrariem o gabarito.

**langchain-padrao:** O registro dos dados e das informações sobre indícios de ocorrência ou de tentativa de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito: (I) identificação do suposto autor da fraude, (II) descrição dos indícios, (III) identificação da instituição responsável pelo registro e (IV) identificação dos dados da conta destinatária e de seu titular em caso de transferência ou pagamento. Não há afirmações que contrariem o gabarito nem omissões de itens exigidos pela pergunta.

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** O consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I). Além disso, deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona a finalidade de tratamento e compartilhamento (art. 2º, §4º, I) e a necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido (art. 2º, §4º, II). Porém omite o requisito de que o consentimento deve ser prévio e geral do cliente com quem a instituição tenha relacionamento (§3º) e a obrigação de manter a documentação à disposição do Banco Central (§5º). Como não há contradição com o gabarito, apenas falta de informações solicitadas, a classificação é parcial.

**langchain:** O consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I). Além disso, deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. parcial

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 4º, I (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 4º, II (dispositivo não existe no corpus))

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). [parcial; sem resposta nos trechos: O prazo específico para manter à disposição do Banco Central os dados sobre indícios de fraudes identificadas referidos no art. 2º, § 1º, inciso I.] — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. A resposta indica que os dados e informações compartilhados, bem como a documentação com os critérios e procedimentos de identificação, devem ficar à disposição do Banco Central por dez anos, o que corresponde exatamente ao prazo estabelecido no gabarito para esse tipo de dado e documentação (art. 8º, II). Não há menção a prazos diferentes ou a informações que contrariem o gabarito, e a resposta aborda integralmente o que a pergunta pede (tempo de retenção dos dados sobre indícios de fraude compartilhados e da documentação relacionada).

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). [parcial; sem resposta nos trechos: O trecho não informa o prazo específico para manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada, além do que já foi mencionado para os dados e informações compartilhados nos termos do art. 2º, § 6º, inciso II, e a documentação de critérios e procedimentos do art. 2º, § 8º.] — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados e informações compartilhados e a documentação com critérios e procedimentos (art. 8º, II), omitindo o prazo de cinco anos para os dados relativos aos mecanismos de acompanhamento e controle (art. 8º, III) e a documentação sobre o sistema eletrônico sem prazo fixado (art. 8º, I). Como a pergunta pede o prazo para manter à disposição os dados sobre indícios de fraude compartilhados e a documentação relacionada, a resposta deixa de fora informações que a pergunta exige, tornando-a parcial, sem contradizer o gabarito.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

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
