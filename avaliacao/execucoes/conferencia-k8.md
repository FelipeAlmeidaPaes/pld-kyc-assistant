# Avaliação: conferencia-k8

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-09T12:56:54.316Z a 2026-10-09T13:05:54.630Z
- k = 8 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: gemini-3.5-flash-lite, sem fallback
- Prompt: versão 932e4dad
- Conferência de valores: ligada (prazos, percentuais, valores e datas contra o texto citado)
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
| manual | 2/30 (7%) | 6/6 (100%) | 66/74 (89%) | 73% | 0 |
| langchain | 2/30 (7%) | 6/6 (100%) | 63/69 (91%) | 72% | 0 |
| langchain-padrao | 7/30 (23%) | 6/6 (100%) | 50/65 (77%) | 73% | 0 |

| variante | tokens de entrada (média) | tokens de saída (média) | custo de tabela | geração p50 / p95 | total p50 / p95 |
| --- | --- | --- | --- | --- | --- |
| manual | 1469 | 292 | sem preço configurado | 1.4 s / 6.3 s | 1.4 s / 6.3 s |
| langchain | 1469 | 284 | sem preço configurado | 1.3 s / 2.5 s | 1.3 s / 2.5 s |
| langchain-padrao | 2222 | 329 | sem preço configurado | 1.3 s / 3.8 s | 1.3 s / 3.8 s |

Motivos de recusa (todas as perguntas):

| variante | citação não confere | modelo: não cobre |
| --- | --- | --- |
| manual | 1 | 7 |
| langchain | 1 | 7 |
| langchain-padrao | 6 | 7 |

## Conteúdo (juiz: nvidia/nemotron-3-super-120b-a12b:free)

Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.

Parcial declarada: o modelo disse que os trechos respondem só em parte. Parcial não declarada: o juiz deu parcial e o modelo disse total.

| variante | julgadas | corretas | parciais | incorretas | acerto fim a fim | afirmou o que não devia | parcial declarada | parcial não declarada |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| manual | 28 | 20 | 7 | 1 | 20/30 (67%) | 0 | 5 | 5 |
| langchain | 28 | 18 | 10 | 0 | 18/30 (60%) | 0 | 4 | 7 |
| langchain-padrao | 23 | 18 | 5 | 0 | 18/30 (60%) | 0 | 3 | 4 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q02 | coberta | 2 · respondeu 2/2, parcial | 2 · respondeu 2/2, parcial | 2 · recusou (citação não confere) |
| q03 | coberta | 3 · respondeu 1/2, correta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta |
| q04 | coberta | 3 · recusou (citação não confere) | 3 · recusou (citação não confere) | 2 · recusou (citação não confere) |
| q05 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 3/3, correta | 2 · respondeu 3/3, correta |
| q06 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q07 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q08 | coberta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta |
| q09 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 11 · recusou (modelo: não cobre) |
| q10 | coberta | 1 · respondeu 1/2, correta | 1 · respondeu 1/2, correta | 7 · respondeu 1/3, correta |
| q11 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 2 · respondeu 1/1, correta |
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · respondeu 1/1, correta |
| q13 | coberta | 5 · respondeu 2/2, parcial | 5 · respondeu 1/1, parcial | 2 · respondeu 1/1, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q15 | coberta | 10 · respondeu 1/2, correta | 10 · respondeu 1/2, correta | 2 · respondeu 1/1, correta |
| q16 | coberta | 1 · respondeu 7/7, parcial | 1 · respondeu 7/7, parcial | 1 · recusou (citação não confere) |
| q17 | coberta | 2 · respondeu 1/1, parcial | 2 · respondeu 1/1, parcial | 1 · respondeu 1/4, parcial |
| q18 | coberta | 2 · respondeu 6/6, correta | 2 · respondeu 6/6, parcial | 3 · respondeu 10/19, correta |
| q19 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 2/2, correta | 1 · respondeu 2/2, correta |
| q20 | coberta | 2 · respondeu 4/4, correta | 2 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q21 | coberta | 12 · respondeu 0/1, incorreta | 12 · respondeu 0/1, parcial | 19 · respondeu 0/1, parcial |
| q22 | coberta | 1 · respondeu 4/4, parcial | 1 · respondeu 2/2, parcial | 1 · respondeu 2/2, parcial |
| q23 | coberta | 1 · respondeu 5/8, correta | 1 · respondeu 5/8, correta | 1 · recusou (citação não confere) |
| q24 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · recusou (citação não confere) |
| q25 | coberta | 2 · respondeu 3/4, parcial | 2 · respondeu 3/3, parcial | 6 · recusou (citação não confere) |
| q26 | coberta | 5 · respondeu 1/1, correta | 5 · respondeu 1/1, correta | 2 · respondeu 3/3, correta |
| q27 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta |
| q28 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q29 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, parcial | 1 · respondeu 2/2, parcial |
| q30 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, parcial | 6 · respondeu 1/1, parcial |
| f01 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f02 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f03 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f04 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f05 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f06 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |

## Respostas

### q01: Qual conduta configura o crime de lavagem de dinheiro e qual é a pena prevista?

**Gabarito:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. Pena: reclusão de 3 a 10 anos e multa.

**manual:** A conduta que configura o crime de lavagem de dinheiro é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, conforme o gabarito. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain:** A conduta que configura o crime de lavagem de dinheiro é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal (Lei 9.613/1998, art. 1º, caput). A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa (Lei 9.613/1998, art. 1º, caput). — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, conforme o gabarito. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** Configura o crime de lavagem de dinheiro ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal, com pena de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta e a pena previstas no gabarito, sem acrescentar informações contraditórias ou omitir o que foi perguntado.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** As pessoas referidas no art. 9º devem: 1. identificar seus clientes e manter cadastro atualizado, nos termos de instruções emanadas das autoridades competentes, conforme a Lei 9.613/1998, art. 10, I; 2. manter registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas, conforme a Lei 9.613/1998, art. 10, II. [parcial; sem resposta nos trechos: Os deveres de comunicação não foram respondidos pelos trechos fornecidos.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. A resposta menciona os deveres de identificação (art. 10, I) e de registro das transações acima do limite (art. 10, II), mas omite os deveres de comunicação ao Coaf (arts. 11, II e III) e outros deveres de comunicação previstos no gabarito, que são solicitados pela pergunta. Não há afirmação que contradiga o gabarito.

**langchain:** As pessoas referidas no art. 9º têm os seguintes deveres: 1. identificarão seus clientes e manterão cadastro atualizado, nos termos de instruções emanadas das autoridades competentes, conforme Lei 9.613/1998, art. 10, I; 2. manterão registro de toda transação em moeda nacional ou estrangeira, títulos e valores mobiliários, títulos de crédito, metais, ativos virtuais, ou qualquer ativo passível de ser convertido em dinheiro, que ultrapassar limite fixado pela autoridade competente e nos termos de instruções por esta expedidas, conforme Lei 9.613/1998, art. 10, II. [parcial; sem resposta nos trechos: Os deveres de comunicação não foram respondidos pelos trechos fornecidos.] — citações: Lei 9.613/1998, art. 10, I; Lei 9.613/1998, art. 10, II

> juiz: **parcial**. A resposta menciona apenas os deveres de identificação (art. 10, I) e de registro de transações acima do limite (art. 10, II), mas omite os deveres de comunicação ao Coaf (arts. 11, II e III) e outros deveres de registro/comunicação que a pergunta pede. Não há afirmação que contradiga o gabarito, apenas falta de conteúdo solicitado.

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 9º, IV (dispositivo não existe no corpus); Lei 9.613/1998, art. 9º, V (dispositivo não existe no corpus))

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 48, caput). As pessoas referidas no art. 9º deverão comunicar ao Coaf, abstendo-se de dar ciência de tal ato a qualquer pessoa, inclusive àquela à qual se refira a informação, no prazo de 24 (vinte e quatro) horas, a proposta ou realização de todas as transações referidas no inciso II do art. 10, acompanhadas da identificação de que trata o inciso I do mencionado artigo (Lei 9.613/1998, art. 11, II, a). — citações: Circular BCB 3.978/2020, art. 48, caput; Lei 9.613/1998, art. 11, II, a

> juiz: **correta**. A resposta indica que as operações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf, o que corresponde ao que a pergunta pede. Não há contradição com o gabarito; apenas acrescenta informações adicionais (prazo, sigilo, inclusão de financiamento do terrorismo, etc.), o que não a torna parcial nem incorreta.

**langchain:** As instituições devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 48, caput. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as instituições devem comunicar ao Coaf as operações suspeitas de lavagem de dinheiro, atendendo ao que a pergunta pede. A menção adicional ao financiamento do terrorismo não contradiz o gabarito e apenas acrescenta informação extra, não tornando a resposta parcial nem incorreta.

**langchain-padrao:** As instituições referidas no art. 1º devem comunicar ao Coaf as operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 48). — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica que as instituições referidas no art. 1º devem comunicar ao Coaf as operações suspeitas de lavagem de dinheiro (e também de financiamento do terrorismo). Isso responde diretamente à pergunta 'A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?', identificando o destinatário correto (Coaf). Não há contradição com o gabarito, que também aponta o Coaf como destinatário. A resposta não omite nenhum elemento exigido pela pergunta (não pede prazos ou sigilo), portanto está correta.

### q04: Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**manual:** recusou (citação não confere: Lei 9.613/1998, art. 12, II, b (texto do dispositivo não está nos trechos recuperados))

**langchain:** recusou (citação não confere: Lei 9.613/1998, art. 12, II, b (texto do dispositivo não está nos trechos recuperados); Lei 9.613/1998, art. 12, IV (texto do dispositivo não está nos trechos recuperados))

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 9º, II, a (dispositivo não existe no corpus); Lei 9.613/1998, art. 9º, II, b (dispositivo não existe no corpus); Lei 9.613/1998, art. 9º, II, c (dispositivo não existe no corpus))

### q05: Por quanto tempo a instituição deve conservar os cadastros de clientes e os registros das operações?

**Gabarito:** A lei fixa o mínimo de cinco anos, contados do encerramento da conta ou da conclusão da transação, prazo que a autoridade competente pode ampliar (Lei 9.613, art. 10, § 2º). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 fixa dez anos: para as informações dos procedimentos de conhecer o cliente, contados do primeiro dia do ano seguinte ao término do relacionamento (art. 67, I), e para os registros de operações dos arts. 28 a 37, contados do primeiro dia do ano seguinte ao da operação (art. 67, III).

**manual:** 1. Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). 2. As informações coletadas nos procedimentos destinados a conhecer os clientes de que tratam os arts. 13, 16 e 18 devem ser mantidas à disposição do Banco Central do Brasil e conservadas pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, caput e I). 3. As informações e registros de que tratam os arts. 28 a 37 devem ser mantidos à disposição do Banco Central do Brasil e conservados pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, caput e III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, caput; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente o que a pergunta pede: o prazo mínimo de cinco anos para cadastros e registros, com possibilidade de ampliação pela autoridade competente, e os prazos de dez anos para as informações de conhecer o cliente e para os registros de operações, conforme o gabarito. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas.

**langchain:** Os cadastros e registros devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). As informações coletadas nos procedimentos destinados a conhecer os clientes devem ser conservadas pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, I). Os registros de todas as operações realizadas, produtos e serviços contratados, inclusive saques, depósitos, aportes, pagamentos, recebimentos, transferências de recursos e operações no mercado de câmbio, devem ser conservados pelo período mínimo de dez anos, contado a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta fornece os prazos de conservação solicitados: o mínimo de cinco anos (passível de ampliação) para cadastros e registros em geral, e o período de dez anos para informações de conhecer o cliente e para registros de operações, conforme o gabarito. Não há contradição nem omissão do que a pergunta pede.

**langchain-padrao:** Os cadastros e registros referidos nos incisos I e II do artigo 10 da Lei nº 9.613/1998 deverão ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação, prazo este que poderá ser ampliado pela autoridade competente (Lei 9.613/1998, art. 10, § 2º). Adicionalmente, as instituições devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações coletadas nos procedimentos destinados a conhecer os clientes de que tratam os arts. 13, 16 e 18, contado o prazo a partir do primeiro dia do ano seguinte ao término do relacionamento com o cliente (Circular BCB 3.978/2020, art. 67, I), bem como as informações e registros de que tratam os arts. 28 a 37, contado o prazo a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta fornece o prazo mínimo de cinco anos para cadastros e registros, conforme a Lei 9.613/1998, art. 10, § 2º, e acrescenta o prazo de dez anos para instituições autorizadas pelo Banco Central, conforme a Circular 3.978/2020, arts. 67, I e III, com a contagem a partir do primeiro dia do ano seguinte ao término do relacionamento ou da operação. Isso está em total acordo com o gabarito, não há contradição nem omissão do que a pergunta pede.

### q06: Para efeito dos crimes contra o sistema financeiro, o que se considera instituição financeira e quem é equiparado a ela?

**Gabarito:** Instituição financeira é a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (I); a pessoa jurídica que ofereça serviços de operações com ativos virtuais, inclusive intermediação, negociação ou custódia (I-A); e a pessoa natural que exerça qualquer dessas atividades, ainda que de forma eventual (II).

**manual:** Considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: 1. a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); 2. a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); 3. a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes e sem contradizer nenhum ponto.

**langchain:** Considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º, caput). Equipara-se à instituição financeira: 1. a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); 2. a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); 3. a pessoa natural que exerça quaisquer das atividades referidas no artigo 1º, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os três casos de equiparação presentes no gabarito, sem acrescentar ou omitir informações que contradigam o conteúdo exigido pela pergunta.

**langchain-padrao:** Para efeito da lei, considera-se instituição financeira a pessoa jurídica de direito público ou privado, que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários (Lei 7.492/1986, art. 1º). Equiparam-se à instituição financeira: I - a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (Lei 7.492/1986, art. 1º, parágrafo único, I); I-A - a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia (Lei 7.492/1986, art. 1º, parágrafo único, I-A); II - a pessoa natural que exerça quaisquer das atividades referidas neste artigo, ainda que de forma eventual (Lei 7.492/1986, art. 1º, parágrafo único, II). — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar informações contraditórias ou omitir algo que a pergunta pede.

### q07: O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** O crime é caracterizado por gerir fraudulentamente instituição financeira, com pena de reclusão, de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime é caracterizado por gerir fraudulentamente instituição financeira e indica a pena de reclusão de 3 a 12 anos e multa, o que está em conformidade com o gabarito. Não apresenta uma definição de gestão fraudulenta além da própria expressão, portanto não viola o item 1 de 'Não deve afirmar'.

**langchain:** A conduta caracterizadora é gerir fraudulentamente instituição financeira (Lei 7.492/1986, art. 4º, caput), cuja pena é reclusão de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º, caput). — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta indica corretamente que a conduta caracterizadora é 'gerir fraudulentamente instituição financeira' e apresenta a pena de reclusão de 3 a 12 anos e multa, sem acrescentar qualquer definição de gestão fraudulenta que esteja proibida. Assim, atende integralmente ao que a pergunta pede e não contradiz o gabarito.

**langchain-padrao:** Os trechos não descrevem o que caracteriza o crime de gestão fraudulenta, mencionando apenas a respectiva pena de reclusão, de 3 (três) a 12 (doze) anos, e multa. [parcial; sem resposta nos trechos: O que caracteriza o crime de gestão fraudulenta de instituição financeira.] — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que a lei não descreve o que caracteriza o crime, apenas prevê a pena, o que está de acordo com o gabarito que diz que a lei só tipifica a conduta e não define gestão fraudulenta. Não há afirmação que contradiga o gabarito e não há violação do item 1 de 'Não deve afirmar'.

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** Os trechos informam as penas para cada uma das condutas, estabelecendo que gerir fraudulentamente instituição financeira tem pena de reclusão, de 3 (três) a 12 (doze) anos, e multa (Lei 7.492/1986, art. 4º, caput), enquanto a gestão temerária tem pena de reclusão, de 2 (dois) a 8 (oito) anos, e multa (Lei 7.492/1986, art. 4º, parágrafo único). [parcial; sem resposta nos trechos: Os trechos não definem conceitualmente o que caracteriza a diferença entre a gestão temerária e a gestão fraudulenta, limitando-se a apresentar as penas aplicáveis a cada uma delas.] — citações: Lei 7.492/1986, art. 4º, caput; Lei 7.492/1986, art. 4º, parágrafo único

> juiz: **correta**. A pergunta pede a diferença entre gestão temerária e gestão fraudulenta. A resposta informa as penas distintas para cada conduta, que é exatamente a diferença prevista no gabarito. Não acrescenta afirmações contrárias ao gabarito, não viola nenhum item de "Não deve afirmar" e não omite nada que a pergunta explicitamente solicite.

**langchain:** A gestão fraudulenta de instituição financeira tem pena de reclusão de 3 (três) a 12 (doze) anos, e multa, conforme a Lei 7.492/1986, art. 4º, caput. Se a gestão é temerária, a pena é de reclusão de 2 (dois) a 8 (oito) anos, e multa, conforme a Lei 7.492/1986, art. 4º, parágrafo único. [parcial; sem resposta nos trechos: Os trechos não trazem os conceitos ou definições de gestão fraudulenta e gestão temerária, informando apenas as respectivas penas.] — citações: Lei 7.492/1986, art. 4º, caput; Lei 7.492/1986, art. 4º, parágrafo único

> juiz: **correta**. A resposta indica corretamente que a lei não define as condutas e diferencia apenas pelas penas: gestão fraudulenta (3 a 12 anos) e gestão temerária (2 a 8 anos), conforme o art. 4º da Lei 7.492/1986. Não há afirmação que contradiga o gabarito, nem viola o item 1 de 'Não deve afirmar'.

**langchain-padrao:** Os trechos preveem as penas para a gestão fraudulenta de instituição financeira, que é de reclusão de 3 (três) a 12 (doze) anos, e multa, e para a gestão temerária, que possui pena de reclusão de 2 (dois) a 8 (oito) anos, e multa. [parcial; sem resposta nos trechos: Os trechos não detalham os conceitos ou a diferença prática entre gestão temerária e gestão fraudulenta, limitando-se a estipular as penas aplicáveis a cada uma delas.] — citações: Lei 7.492/1986, art. 4º, caput; Lei 7.492/1986, art. 4º, parágrafo único

> juiz: **correta**. A resposta indica que a diferença entre gestão temerária e gestão fraudulenta está apenas nas penas previstas (reclusão de 2 a 8 anos e multa para temerária; reclusão de 3 a 12 anos e multa para fraudulenta), o que está de acordo com o gabarito, que afirma que a lei não define as condutas e diferencia apenas pela pena. Não há afirmação que contradiga o gabarito nem violação dos itens de "Não deve afirmar". Portanto, a resposta está correta.

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio, cuja pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa conforme Lei 7.492/1986, art. 16, caput. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, descreve a mesma pena de reclusão de 1 a 4 anos e multa, e não omite nem contradiz nenhum elemento exigido pela pergunta. A inclusão da citaçăo legal não afeta a correção.

**langchain:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio (Lei 7.492/1986, art. 16, caput). A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa (Lei 7.492/1986, art. 16, caput). — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito: confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, inclui a abrangência de distribuição de valores mobiliários ou de câmbio e indica a pena de reclusão de 1 a 4 anos e multa. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente (Lei 7.492/1986, art. 6º, caput). Também constitui crime fraudar a fiscalização ou o investidor inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º, caput). — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira, citando o art. 6º da Lei 7.492/1986, o que diretamente responde à pergunta. Acrescenta informações adicionais sobre o art. 9º, que não contradiz o gabarito e não é solicitado pela pergunta, portanto não a torna parcial. Não há afirmações que contrariem o gabarito.

**langchain:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente, com pena de reclusão de 2 (dois) a 6 (seis) anos, e multa, conforme o art. 6º, caput, da Lei 7.492/1986. Além disso, constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar, com pena de reclusão de 1 (um) a 5 (cinco) anos, e multa, segundo o art. 9º, caput, da Lei 7.492/1986. — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira, apresentando a pena prevista no art. 6º da Lei 7.492/1986, conforme o gabarito. Embora acrescente informações sobre outro crime (art. 9º), isso não contradiz o gabarito e a resposta ainda atende ao que a pergunta pede.

**langchain-padrao:** Sim, constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Além disso, é crime fazer inserir elemento falso ou omitir elemento exigido pela legislação em demonstrativos contábeis de instituição financeira, seguradora ou instituição integrante do sistema de distribuição de títulos de valores mobiliários, bem como fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar. — citações: Lei 7.492/1986, art. 6º, caput; Lei 7.492/1986, art. 9º, caput; Lei 7.492/1986, art. 10, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira, conforme o gabarito, e acrescenta apenas informações adicionais que não contradizem o gabarito nem omitem o que a pergunta pede.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A Lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. Não há omissão nem contradição em relação ao que a pergunta pede.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º, caput). — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, acrescentando apenas a referência normativa, o que não constitui contradição nem omissão.

**langchain-padrao:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Significa imediatamente ou dentro de algumas horas. — citações: Lei 13.810/2019, art. 2º, V

> juiz: **correta**. A resposta afirma que 'cumprir sem demora' significa imediatamente ou dentro de algumas horas, o que está de acordo com o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** A indisponibilidade de ativos abrange a proibição de transferir, converter, trasladar, disponibilizar ativos, ou deles dispor, direta ou indiretamente (Lei 13.810/2019, art. 2º, II), e atinge ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções (Lei 13.810/2019, art. 9º, caput). [parcial; sem resposta nos trechos: Os trechos não especificam detalhadamente os tipos específicos de bens e recursos que podem ser alcançados, além de mencionar genericamente os "ativos".] — citações: Lei 13.810/2019, art. 2º, II; Lei 13.810/2019, art. 9º, caput

> juiz: **parcial**. A resposta descreve a abrangência da indisponibilidade de ativos (proibições de transferência, conversão etc.) e a titularidade dos ativos, mas não enumera os tipos de bens e recursos que podem ser alcançados (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), o que a pergunta pede. Não há contradição com o gabarito, apenas omissão.

**langchain:** A indisponibilidade de ativos abrange a proibição de transferir, converter, trasladar, disponibilizar ativos, ou deles dispor, direta ou indiretamente (Lei 13.810/2019, art. 2º, II). [parcial; sem resposta nos trechos: Os trechos fornecidos não especificam quais tipos detalhados de bens e recursos (como contas bancárias, imóveis, veículos, etc.) podem ser alcançados, apenas definindo o conceito de indisponibilidade de ativos como a proibição de transferir, converter, trasladar, disponibilizar ou dispor de ativos.] — citações: Lei 13.810/2019, art. 2º, II

> juiz: **parcial**. A pergunta pede quais tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU. O gabarito indica que os ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não, de titularidade direta ou indireta das pessoas sancionadas. A resposta do assistente descreve apenas o que a indisponibilidade proíbe (transferir, converter, trasladar, disponibilizar ou dispor de ativos) e não menciona os tipos de bens e recursos que podem ser atingidos. Assim, a resposta omite o conteúdo solicitado pela pergunta, mas não contradiz o gabarito.

**langchain-padrao:** Para fins da indisponibilidade de ativos decorrente de sanções, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não. — citações: Lei 13.810/2019, art. 2º, I

> juiz: **correta**. A resposta lista os tipos de bens e recursos que podem ser alcançados pela indisponibilidade de ativos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), o que corresponde exatamente ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de algo que a pergunta requisite.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente que as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998 devem cumprir, sem demora e sem prévio aviso, as determinações de indisponibilidade de ativos provenientes de sanções do Conselho de Segurança da ONU, conforme definido por seu órgão regulador ou fiscalizador. Isso corresponde exatamente ao que a pergunta pergunta (quem deve cumprir). Não há afirmações que contrariem o gabarito, e não há itens na lista 'Não deve afirmar' para serem marcados.

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso, na forma definida por seu órgão regulador ou fiscalizador. Não há contradição com o gabarito e a resposta atende ao que a pergunta pede.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998. Isso atende ao que a pergunta pede (quem deve cumprir). Não há contradição com o gabarito e não há itens de 'Não deve afirmar' para listar.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** A indisponibilidade de ativos e as tentativas de sua transferência relacionadas às pessoas naturais, às pessoas jurídicas ou às entidades sancionadas por resolução do Conselho de Segurança das Nações Unidas ou por designações de seus comitês de sanções são cumpridas imediatamente (Lei 13.810/2019, art. 11, caput). A União ingressará com auxílio direto judicial para obter a indisponibilidade apenas na hipótese de haver informações sobre a existência de ativos sujeitos à indisponibilidade ou de pessoas e bens sujeitos a outra espécie de sanção determinada em resoluções do Conselho de Segurança das Nações Unidas ou em designações de seus comitês de sanções, sem que tenha ocorrido seu cumprimento de forma imediata (Lei 13.810/2019, art. 12, caput). — citações: Lei 13.810/2019, art. 11, caput; Lei 13.810/2019, art. 12, caput

> juiz: **correta**. A resposta afirma que a indisponibilidade de ativos é cumprida imediatamente e que a União só recorre ao auxílio direto judicial quando não houver cumprimento imediato, o que está de acordo com o gabarito que diz que as resoluções têm executoriedade imediata e só há ingresso judicial quando não houver cumprimento por essa via. Não há contradição nem omissão do que a pergunta pede.

**langchain:** A indisponibilidade de ativos e as tentativas de sua transferência relacionadas às pessoas naturais, às pessoas jurídicas ou às entidades sancionadas por resolução do Conselho de Segurança das Nações Unidas ou por designações de seus comitês de sanções são comunicadas ao Ministério da Justiça e Segurança Pública, aos órgãos reguladores ou fiscalizadores e ao Conselho de Controle de Atividades Financeiras, sem exigência de prévia decisão judicial para o seu cumprimento imediato (Lei 13.810/2019, art. 11, caput). Caso não ocorra o cumprimento imediato e haja informações sobre ativos sujeitos à indisponibilidade, a União ingressará com auxílio direto judicial para obtê-la (Lei 13.810/2019, art. 12, caput). — citações: Lei 13.810/2019, art. 11, caput; Lei 13.810/2019, art. 12, caput

> juiz: **correta**. A resposta afirma que a indisponibilidade de ativos determinada pelo CSNU tem executoriedade imediata no Brasil, sem necessidade de prévia decisão judicial, e que somente em caso de não cumprimento a União buscará auxílio judicial. Isso está totalmente de acordo com o gabarito, que também afirma que as resoluções têm executoriedade imediata e devem ser cumpridas sem demora, recorrendo ao auxílio judicial apenas quando houver falta de cumprimento. Não há contradição nem omissão de algo que a pergunta pede.

**langchain-padrao:** As resoluções sancionatórias do Conselho de Segurança das Nações Unidas e as designações de seus comitês de sanções são dotadas de executoriedade imediata na República Federativa do Brasil, não havendo exigência de decisão judicial prévia para o cumprimento da indisponibilidade. — citações: Lei 13.810/2019, art. 6º, caput

> juiz: **correta**. A resposta afirma que as resoluções do CSNU têm executoriedade imediata no Brasil e que não há exigência de decisão judicial prévia para o cumprimento da indisponibilidade, o que está de acordo com o gabarito, que também afirma que as resoluções têm executoriedade imediata e devem ser cumpridas sem demora, sem necessidade de decisão judicial. Não há contradição nem omissão de algo que a pergunta pede.

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** A avaliação interna deve ser realizada pelas instituições com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, caput). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os seguintes perfis de risco: dos clientes (Circular BCB 3.978/2020, art. 10, § 1º, I); da instituição, incluindo o modelo de negócio e a área geográfica de atuação (Circular BCB 3.978/2020, art. 10, § 1º, II); e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta descreve corretamente o objetivo da avaliação interna e alguns de seus requisitos mínimos (perfis de risco dos clientes, da instituição e das atividades de funcionários, parceiros e terceirizados, bem como a avaliação por probabilidade e magnitude dos impactos e a definição de categorias de risco). Porém, omite elementos que o gabarito indica como parte obrigatória de 'como deve ser feita': a consideração das operações, transações, produtos e serviços com todos os canais de distribuição e novas tecnologias (§ 1º), bem as exigências de documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e auditoria e ao conselho/diretoria, e a revisão a cada dois anos ou diante de alteração significativa nos perfis de risco (art. 12). Como nada do afirmado contradiz o gabarito, mas faltam itens que a pergunta pede, a resposta é parcial.

**langchain:** A avaliação interna é realizada com o objetivo de identificar e mensurar o risco de utilização de produtos e serviços das instituições na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os seguintes perfis de risco: dos clientes (Circular BCB 3.978/2020, art. 10, § 1º, I); da instituição, incluindo o modelo de negócio e a área geográfica de atuação (Circular BCB 3.978/2020, art. 10, § 1º, II); das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco (Circular BCB 3.978/2020, art. 10, § 3º). Devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta aborda corretamente o objetivo da avaliação interna e menciona a maioria dos elementos exigidos (perfis de risco dos clientes, da instituição e das atividades de funcionários, parceiros e terceirizados, bem como a avaliação por probabilidade e magnitude dos impactos, definição de categorias de risco). Porém, omite explicitamente a consideração das "operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias", que o gabarito lista como parte mínima do que deve ser considerado na avaliação. Essa omissão caracteriza uma resposta parcial, pois nada do afirmado contradiz o gabarito, mas falta um item que a pergunta pede. Não há afirmações que contrariem o gabarito, portanto a lista de itens que não devem ser afirmados está vazia.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 10, § 1º, I a IV (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 12, I a III (dispositivo não existe no corpus))

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação, omitindo requisitos como compatibilidade com perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação (nome completo e CPF ou firma e CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco e, para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final. Não há contradição com o gabarito, apenas falta de conteúdo exigido pela pergunta.

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação, omite outros requisitos que a pergunta pede (compatibilidade com perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação, qualificação e classificação). Não há contradição com o gabarito, portanto a resposta está parcial.

**langchain-padrao:** Os procedimentos destinados a conhecer os clientes devem contemplar medidas que assegurem a devida diligência na sua identificação, qualificação e classificação, sendo compatíveis com o perfil de risco do cliente (incluindo medidas reforçadas para clientes classificados em categorias de maior risco, conforme a avaliação interna de risco), com a política de prevenção à lavagem de dinheiro e ao financiamento do terrorismo e com a própria avaliação interna de risco. — citações: Circular BCB 3.978/2020, art. 13, caput; Circular BCB 3.978/2020, art. 13, § 1º, I; Circular BCB 3.978/2020, art. 13, § 1º, II; Circular BCB 3.978/2020, art. 13, § 1º, III

> juiz: **parcial**. A resposta menciona a devida diligência na identificação, qualificação e classificação e a compatibilidade com o perfil de risco, a política de PLD/FT e a avaliação interna de risco, mas omite requisitos específicos que o gabarito indica como necessários: formalização em manual aprovado pela diretoria, detalhes da identificação (nome completo e CPF ou firma e CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final. Não há afirmações que contradigam o gabarito, apenas faltas de conteúdo exigido pela pergunta.

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições referidas no art. 1º devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 38, caput). Os procedimentos de monitoramento, seleção e análise de operações e situações suspeitas referem-se a qualquer operação ou situação que apresente indícios de utilização da instituição para a prática dos crimes de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 38, § 1º). Os procedimentos devem ser aplicados, inclusive, às propostas de operações (Circular BCB 3.978/2020, art. 38, § 2º). As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, especialmente as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar a existência de indícios de lavagem de dinheiro ou de financiamento do terrorismo, inclusive (Circular BCB 3.978/2020, art. 39, caput, e art. 39, I). O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação (Circular BCB 3.978/2020, art. 39, parágrafo único). [parcial; sem resposta nos trechos: Os detalhes específicos dos incisos e alíneas que seguem o art. 39, I, bem como as demais regras operacionais de monitoramento e análise além do prazo e da abrangência geral informada.] — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 38, § 1º; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, I; Circular BCB 3.978/2020, art. 39, parágrafo único

> juiz: **correta**. A resposta descreve os procedimentos de monitoramento, seleção e análise de operações, incluindo a aplicação às propostas de operações, a identificação de situações suspeitas e o limite de 45 dias, atendendo ao que a pergunta pede. Não há afirmações que contrariem o gabarito, apenas omite alguns detalhes adicionais presentes nele, mas a pergunta não exige explicitamente aqueles itens. Portanto, a resposta é correta.

**langchain:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 38, caput. Para os fins dessa norma, as operações e situações suspeitas referem-se a qualquer operação ou situação que apresente indícios de utilização da instituição para a prática dos crimes de lavagem de dinheiro e de financiamento do terrorismo, de acordo com a Circular BCB 3.978/2020, art. 38, § 1º. Os procedimentos devem ser aplicados, inclusive, às propostas de operações, segundo a Circular BCB 3.978/2020, art. 38, § 2º. A instituição deve implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 39, caput. O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação, nos termos da Circular BCB 3.978/2020, art. 39, parágrafo único. Além disso, o monitoramento deve abranger as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar a existência de indícios de lavagem de dinheiro ou de financiamento do terrorismo, conforme Circular BCB 3.978/2020, art. 39, I. — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 38, § 1º; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, parágrafo único; Circular BCB 3.978/2020, art. 39, I

> juiz: **parcial**. A resposta está em conformidade com o gabarito quanto aos pontos de implementar procedimentos de monitoramento, seleção e análise, aplicar também às propostas de operações e respeitar o prazo de 45 dias. Porém, omite requisitos que o gabarito exige para a condução do monitoramento: que os procedimentos sejam compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, que considerem a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e que estejam descritos em manual aprovado pela diretoria (art. 38, §3º). Como não há contradição, apenas falta de informações solicitadas pela pergunta, o veredito é parcial.

**langchain-padrao:** As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo, especialmente: as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar a existência de indícios de lavagem de dinheiro ou de financiamento do terrorismo, inclusive: as operações com pessoas expostas politicamente de nacionalidade brasileira e com representantes, familiares ou estreitos colaboradores de pessoas expostas politicamente; as operações com pessoas expostas politicamente estrangeiras; os clientes e as operações em relação aos quais não seja possível identificar o beneficiário final; as operações oriundas ou destinadas a países ou territórios com deficiências estratégicas na implementação das recomendações do Grupo de Ação Financeira (Gafi); e as situações em que não seja possível manter atualizadas as informações cadastrais de seus clientes; bem como as operações e situações que possam indicar suspeitas de financiamento do terrorismo. O período para a execução dos procedimentos de monitoramento e de seleção das operações e situações suspeitas não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação. Além disso, os procedimentos devem ser aplicados, inclusive, às propostas de operações, e devem: ser compatíveis com a política de prevenção à lavagem de dinheiro e ao financiamento do terrorismo; ser definidos com base na avaliação interna de risco; considerar a condição de pessoa exposta politicamente, bem como a condição de representante, familiar ou estreito colaborador da pessoa exposta politicamente; e estar descritos em manual específico, aprovado pela diretoria da instituição. As instituições devem assegurar que os sistemas utilizados no monitoramento e na seleção de operações e situações suspeitas contenham informações detalhadas das operações realizadas e das situações ocorridas, inclusive informações sobre a identificação e a qualificação dos envolvidos, devendo manter documentação detalhada dos parâmetros, variáveis, regras e cenários utilizados. Os sistemas e os procedimentos utilizados devem ser passíveis de verificação quanto à sua adequação e efetividade. Devem ser incluídos no manual referido os critérios de definição da periodicidade de execução dos procedimentos de monitoramento e seleção para os diferentes tipos de operações e situações monitoradas. As instituições também devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo. — citações: Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, I; Circular BCB 3.978/2020, art. 39, I, d; Circular BCB 3.978/2020, art. 39, I, e; Circular BCB 3.978/2020, art. 39, I, f; Circular BCB 3.978/2020, art. 39, I, g; Circular BCB 3.978/2020, art. 39, I, h; Circular BCB 3.978/2020, art. 39, II; Circular BCB 3.978/2020, art. 39, parágrafo único; Circular BCB 3.978/2020, art. 40, caput; Circular BCB 3.978/2020, art. 40, § 1º; Circular BCB 3.978/2020, art. 40, § 2º; Circular BCB 3.978/2020, art. 41, I; Circular BCB 3.978/2020, art. 38, § 3º; Circular BCB 3.978/2020, art. 38, § 3º, I; Circular BCB 3.978/2020, art. 38, § 3º, II; Circular BCB 3.978/2020, art. 38, § 3º, III; Circular BCB 3.978/2020, art. 38, § 3º, IV; Circular BCB 3.978/2020, art. 38, caput

> juiz: **correta**. A resposta aborda o que a pergunta pede: descreve como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro, incluindo a implementação de procedimentos de monitoramento, seleção e análise, o prazo de 45 dias, a aplicação às propostas de operações, a compatibilidade com a política de PLD/FT, a base na avaliação interna de risco, a consideração de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e a descrição em manual aprovado pela diretoria. Nenhum desses pontos contradiz o gabarito; ao contrário, eles estão em conformidade. A resposta acrescenta detalhes adicionais (listas específicas de operações/situações, requisitos de sistemas, documentação, periodicidade) que não entram em conflito com o gabarito e, portanto, não a tornam parcial ou incorreta.

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, conforme Circular BCB 3.978/2020, art. 48, § 2º. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação ao Coaf deve ser feita até o dia útil seguinte à decisão de comunicação, o que está de acordo com o trecho do gabarito que estabelece exatamente esse prazo (Circular 3.978, art. 48, § 2º). Não há contradição com o gabarito, nem afirmação de nenhum dos itens proibidos (não diz que o prazo é 45 dias nem menciona o art. 49, § 1º). Assim, a resposta está correta.

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, conforme Circular BCB 3.978/2020, art. 48, § 2º. Além disso, as pessoas referidas no art. 9º da Lei 9.613/1998 devem comunicar ao Coaf no prazo de 24 (vinte e quatro) horas a proposta ou realização da operação, abstendo-se de dar ciência de tal ato a qualquer pessoa, inclusive àquela à qual se refira a informação, de acordo com a Lei 9.613/1998, art. 11, II. — citações: Circular BCB 3.978/2020, art. 48, § 2º; Lei 9.613/1998, art. 11, II

> juiz: **correta**. A resposta traz o prazo de comunicação ao Coaf até o dia útil seguinte à decisão (Circular 3.978, art. 48, § 2º) e também menciona o prazo de 24 horas previsto na Lei 9.613/1998, art. 11, II, que está conforme o gabarito. Não afirma nenhum dos itens proibidos (não diz que o prazo é 45 dias nem que o prazo de operação suspeita é o do art. 49, § 1º). Portanto, está correta.

**langchain-padrao:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, devendo esta ocorrência ocorrer até o final do prazo de análise referido no art. 43, § 1º. — citações: Circular BCB 3.978/2020, art. 48, § 1º, III; Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta indica que a comunicação deve ser feita até o dia útil seguinte à decisão de comunicação, o que está de acordo com o gabarito. Não afirma que o prazo seja de 45 dias nem que o prazo de operação suspeita seja o do art. 49, § 1º, portanto não contradiz o gabarito e responde à pergunta.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** A avaliação da efetividade da política, dos procedimentos e dos controles internos deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º, e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base: ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, a e b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta traz a periodicidade (anual, data-base 31/12) e os destinatários do relatório (comitê de auditoria, quando houver, e conselho de administração ou diretoria), além do prazo de envio (até 31/03 do ano seguinte), exatamente como consta no gabarito. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas.

**langchain:** A avaliação da efetividade da política, dos procedimentos e dos controles internos deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º, e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, a, e art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta traz a periodicidade anual com data-base de 31 de dezembro, o prazo de envio até 31 de março do ano seguinte e os destinatários (comitê de auditoria, quando houver, e conselho de administração ou diretoria), exatamente como o gabarito exige. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta pede.

**langchain-padrao:** A avaliação da efetividade da política, dos procedimentos e dos controles internos deve ser elaborada anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º e § 2º, I). O relatório específico dessa avaliação deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base: ao comitê de auditoria, quando houver (Circular BCB 3.978/2020, art. 62, § 2º, II, a); e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **correta**. A resposta menciona a periodicidade anual com data-base de 31 de dezembro e o envio do relatório até 31 de março do ano seguinte ao comitê de auditoria (se houver) e ao conselho de administração ou diretoria, exatamente como o gabarito estabelece. Não há contradições nem omissões relevantes.

### q21: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro? Toda operação da relação deve ser comunicada ao Coaf?

**Gabarito:** As operações e situações relacionadas exemplificam indícios de suspeita para fins dos procedimentos de monitoramento e seleção da Circular 3.978 (art. 1º, caput). Não são comunicadas automaticamente: só quando os indícios forem confirmados ao término da análise (§ 1º), que deve considerar todas as informações disponíveis, inclusive as dos procedimentos de conhecer clientes, funcionários, parceiros e terceirizados (§ 2º).

**manual:** A relação de operações, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, serve para configurar a hipótese prevista no inciso I do art. 11 da Lei 9.613/1998, conforme a Lei 9.613/1998, art. 11, § 1º. [parcial; sem resposta nos trechos: Os trechos não respondem se toda operação da relação deve ser comunicada ao Coaf.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **incorreta**. incorreta

**langchain:** As autoridades competentes elaborarão relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese prevista no inciso I do art. 11 da Lei 9.613/1998 (Lei 9.613/1998, art. 11, § 1º). [parcial; sem resposta nos trechos: A informação sobre se toda operação da relação deve ser comunicada ao Coaf não é respondida pelos trechos fornecidos.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta descreve o que é a relação de operações (operações que podem configurar a hipótese do art. 11, inciso I da Lei 9.613/1998), mas não explica o propósito da relação (exemplificar indícios de suspeita para fins de monitoramento e seleção) nem responde à segunda pergunta, indicando que nem toda operação da relação deve ser comunicada ao Coaf. Não há contradição com o gabarito, apenas omissão de conteúdo exigido pela pergunta.

**langchain-padrao:** As autoridades competentes elaborarão relação de operações que, por suas características, no que se refere às partes envolvidas, valores, forma de realização, instrumentos utilizados, ou pela falta de fundamento econômico ou legal, possam configurar a hipótese de configurar indícios de lavagem de dinheiro ou de financiamento do terrorismo. [parcial; sem resposta nos trechos: A pergunta também pede se toda operação da relação deve ser comunicada ao Coaf, o que não foi respondido nos trechos fornecidos.] — citações: Lei 9.613/1998, art. 11, § 1º

> juiz: **parcial**. A resposta explica o propósito da relação de operações (elaborar uma lista que possa indicar indícios de lavagem de dinheiro ou financiamento do terrorismo), mas não aborda a segunda parte da pergunta, que questiona se toda operação da relação deve ser comunicada ao CoAF. Como não há contradição com o gabarito e falta apenas um elemento solicitado pela pergunta, a resposta é parcial. Além disso, a resposta não afirma o item proibido de dizer que toda operação deve ser comunicada ao CoAF.

### q22: Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**manual:** O fracionamento é considerado indício de suspeita nas seguintes situações: 1. Fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d). 2. Fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e). 3. Depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f). 4. Saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie (Carta Circular BCB 4.001/2020, art. 1º, I, k). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f; Carta Circular BCB 4.001/2020, art. 1º, I, k

> juiz: **parcial**. parcial

**langchain:** O fracionamento de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, é considerado indício de suspeita quando feito de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d). O fracionamento de saques em espécie é indício de suspeita quando realizado a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e

> juiz: **parcial**. A resposta menciona apenas as situações d) e e) do gabarito, omitindo as situações k), l) e m), que também são indícios de suspeita de lavagem de dinheiro relacionados ao fracionamento de depósitos ou saques em espécie. Não há afirmação que contradiga o gabarito, portanto a resposta está parcial.

**langchain-padrao:** O fracionamento de depósitos ou saques em espécie configura indício de suspeita nas seguintes situações: 1. fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d). 2. fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e

> juiz: **parcial**. A resposta menciona apenas duas das situações indicadas no gabarito (fragmentação de depósitos para dissimular o valor total e fragmentação de saques para burlar limites de reporte), omitindo as demais (saques em cinco dias úteis abaixo dos limites, dois ou mais saques/depósitos em espécie em determinados períodos com indícios de burla). Como a pergunta pede quando o fracionamento configura indício de suspeita, a ausência dessas outras situações torna a resposta parcial, sem contradizer o gabarito.

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** Os sinais de alerta que envolvem a movimentação financeira ou operações do cliente em relação à sua capacidade econômica ou financeira são: 1. movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente, em contas de depósito e de contas de pagamento em moeda nacional (Carta Circular BCB 4.001/2020, art. 1º, IV, a); 2. solicitação de concessão de crédito no País incompatível com a atividade econômica ou com a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, VI, b); 3. investimentos significativos não proporcionais à capacidade financeira do cliente, ou cuja origem não seja claramente conhecida (Carta Circular BCB 4.001/2020, art. 1º, V, d); 4. operações realizadas e produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio (Circular BCB 3.978/2020, art. 39, I, c); 5. movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente, em contas correntes em moeda estrangeira (Carta Circular BCB 4.001/2020, art. 1º, XVI, a); 6. transferências internacionais, inclusive a título de disponibilidade no exterior, nas quais não se justifique a origem dos fundos envolvidos ou que se mostrem incompatíveis com a capacidade financeira ou com o perfil do cliente (Carta Circular BCB 4.001/2020, art. 1º, X, f); 7. incompatibilidade da atividade econômica ou faturamento informados com o padrão apresentado por clientes com o mesmo perfil (Carta Circular BCB 4.001/2020, art. 1º, III, j); e 8. movimentações de moeda estrangeira em espécie ou de cheques de viagem denominados em moeda estrangeira, que apresentem atipicidade em relação à atividade econômica do cliente ou incompatibilidade com a sua capacidade financeira (Carta Circular BCB 4.001/2020, art. 1º, II, a). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, VI, b; Carta Circular BCB 4.001/2020, art. 1º, V, d; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a; Carta Circular BCB 4.001/2020, art. 1º, X, f; Carta Circular BCB 4.001/2020, art. 1º, III, j; Carta Circular BCB 4.001/2020, art. 1º, II, a

> juiz: **correta**. A resposta inclui o sinal de alerta correto (movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente) e não afirma nada que contradiga o gabarito. Embora apresente outros sinais de alerta não mencionados no gabarito, isso não constitui contradição, pois trata de outros deveres/fatos diferentes. Como a pergunta pede o sinal de alerta envolvendo movimentação financeira em relação à capacidade econômica e a resposta o fornece, ela está correta.

**langchain:** Os sinais de alerta que envolvem a movimentação financeira do cliente em relação à sua capacidade são: 1. Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, IV, a). 2. Solicitação de concessão de crédito no País incompatível com a atividade econômica ou com a capacidade financeira do cliente (Carta Circular BCB 4.001/2020, art. 1º, VI, b). 3. Investimentos significativos não proporcionais à capacidade financeira do cliente, ou cuja origem não seja claramente conhecida (Carta Circular BCB 4.001/2020, art. 1º, V, d). 4. Operações realizadas e produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio (Circular BCB 3.978/2020, art. 39, I, c). 5. Movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente em contas correntes em moeda estrangeira (CCME) (Carta Circular BCB 4.001/2020, art. 1º, XVI, a). 6. Transferências internacionais, inclusive a título de disponibilidade no exterior, nas quais não se justifique a origem dos fundos envolvidos ou que se mostrem incompatíveis com a capacidade financeira ou com o perfil do cliente (Carta Circular BCB 4.001/2020, art. 1º, X, f). 7. Incompatibilidade da atividade econômica ou faturamento informados com o padrão apresentado por clientes com o mesmo perfil (Carta Circular BCB 4.001/2020, art. 1º, III, j). 8. Movimentações de moeda estrangeira em espécie ou de cheques de viagem denominados em moeda estrangeira, que apresentem atipicidade em relação à atividade econômica do cliente ou incompatibilidade com a sua capacidade financeira (Carta Circular BCB 4.001/2020, art. 1º, II, a). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, VI, b; Carta Circular BCB 4.001/2020, art. 1º, V, d; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a; Carta Circular BCB 4.001/2020, art. 1º, X, f; Carta Circular BCB 4.001/2020, art. 1º, III, j; Carta Circular BCB 4.001/2020, art. 1º, II, a

> juiz: **correta**. A pergunta pede o sinal de alerta que envolve a movimentação financeira do cliente em relação à sua capacidade econômica. O gabarito indica que esse sinal é a 'Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente' (art. 1º, IV, a). A resposta do assistente traz exatamente esse sinal como primeiro item, além de outros sinais de alerta que não contradizem o gabarito. Como a resposta contém o que a pergunta pede e não acrescenta afirmações contrárias ao gabarito, ela está correta.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, caput, I, a (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, IV, a (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, j (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, n (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, d (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, VI, a (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, VI, b (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 39, caput, I, c (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, XV, a (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, art. 1º, caput, XVI, a (dispositivo não existe no corpus))

### q24: Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**manual:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta confirma que a movimentação significativa em conta pouco movimentada é indício de suspeita, conforme o gabarito, sem acrescentar afirmações contraditórias ou violar os itens de 'Não deve afirmar'.

**langchain:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção (Carta Circular BCB 4.001/2020, art. 1º, IV, e). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. correta

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, e (dispositivo não existe no corpus))

### q25: Que situações envolvendo procuradores, representantes ou o beneficiário final são indícios de suspeita de lavagem de dinheiro?

**Gabarito:** Abertura, movimentação de contas ou realização de operações por detentor de procuração ou de outro tipo de mandato (art. 1º, III, d); operações em que não seja possível identificar o beneficiário final (III, g); representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável (III, h); e contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t).

**manual:** As seguintes situações envolvendo procuradores, representantes ou o beneficiário final exemplificam indícios de suspeita para fins de monitoramento e seleção: a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato (Carta Circular BCB 4.001/2020, art. 1º, III, d); as operações em que não seja possível identificar o beneficiário final, observados os procedimentos definidos na regulamentação vigente (Carta Circular BCB 4.001/2020, art. 1º, III, g); a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável para tal ocorrência (Carta Circular BCB 4.001/2020, art. 1º, III, h); e os clientes e as operações em relação aos quais não seja possível identificar o beneficiário final (Circular BCB 3.978/2020, art. 39, I, f). — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h; Circular BCB 3.978/2020, art. 39, I, f

> juiz: **parcial**. A resposta inclui três das quatro situações listadas no gabarito (itens d, g e h) e omite a quarta situação (contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes). Não há afirmação que contradiga o gabarito nem uso dos termos proibidos "laranja" ou "interposta pessoa". Portanto, a resposta está parcial.

**langchain:** As situações que exemplificam a ocorrência de indícios de suspeita para fins de monitoramento e seleção são as seguintes: a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato; as operações em que não seja possível identificar o beneficiário final, observados os procedimentos definidos na regulamentação vigente; e a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável para tal ocorrência. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h

> juiz: **parcial**. A resposta menciona três das quatro situações listadas no gabarito (procuração/mandato, beneficiário final não identificável e representação de diferentes pessoas pelos mesmos procuradores sem justificativa). Omitiu a situação envolvendo contas em nome de menores ou incapazes cujos representantes realizem muitas ou relevantes operações, que também se enquadra no âmbito de 'procuradores, representantes ou beneficiário final' perguntado. Como faltou algo que a pergunta pede, a resposta é parcial. Não há afirmação dos termos proibidos 'laranja' ou 'interposta pessoa'.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, item XIII, g (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, item XIII, h (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, item XIII, f (dispositivo não existe no corpus))

### q26: Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**manual:** As instituições obrigadas a observar os requisitos para compartilhamento de dados e informações sobre indícios de fraudes são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). A instituição excluída dessa obrigação são as administradoras de consórcio (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. correta

**langchain:** As instituições obrigadas a compartilhar dados e informações são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). A instituição excluída dessa obrigação são as administradoras de consórcio (Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradoras de consórcio), conforme o gabarito. As citações incorretas de artigos são ignoradas conforme as regras.

**langchain-padrao:** As instituições obrigadas a compartilhar dados e informações com as demais instituições são as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o art. 1º, caput e o art. 2º, caput. A instituição excluída dessa obrigação é a administradora de consórcio, conforme o art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, caput

> juiz: **correta**. A resposta lista corretamente as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e a instituição excluída (administradora de consórcio), conforme o gabarito. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas pela pergunta.

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I); 2. a alteração e a exclusão dos dados e das informações registrados nos termos do § 1º, inciso I, deste artigo, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II); 3. a consulta dos dados e das informações registrados de que trata o § 1º, inciso I, deste artigo (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada relevante à pergunta.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. O registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I). 2. A alteração e a exclusão dos dados e das informações registrados nos termos do § 1º, inciso I, deste artigo, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II). 3. A consulta dos dados e das informações registrados de que trata o § 1º, inciso I, deste artigo (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

**langchain-padrao:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: 1. O registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (art. 2º, § 1º, I). 2. A alteração e a exclusão dos dados e das informações registrados, conforme o caso (art. 2º, § 1º, II). 3. A consulta dos dados e das informações registrados (art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta lista exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente as quatro informações mínimas exigidas pelo gabarito: identificação do suposto autor, descrição dos indícios, identificação da instituição responsável e, quando aplicável, dados da conta destinatária e seu titular. Não há omissão nem afirmação que contradiga o gabarito.

**langchain:** O registro dos dados e das informações deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito: identificação do suposto autor, descrição dos indícios, identificação da instituição responsável e identificação dos dados da conta destinatária e de seu titular em caso de transferência ou pagamento. Não há afirmações que contrariem o gabarito nem omissões de itens solicitados.

**langchain-padrao:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo:
1. A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I);
2. A descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II);
3. A identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III);
4. A identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito: identificação do suposto autor, descrição dos indícios, identificação da instituição responsável e, quando aplicável, dados da conta destinatária e seu titular. Não há omissão nem afirmação que contradiga o gabarito.

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** O consentimento deve ser prévio e geral, possibilitando o registro dos dados e das informações do cliente (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º). Além disso, o consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I) e deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. parcial

**langchain:** O consentimento deve ser prévio e geral, possibilitando o registro dos dados e das informações do cliente (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º). Além disso, o consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I) e deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta inclui os requisitos de consentimento prévio e geral, finalidade de tratamento e compartilhamento, e constar de contrato com cláusula em destaque ou outro instrumento jurídico válido. Porém, omite dois requisitos mencionados no gabarito: (i) que o consentimento seja do cliente com quem a instituição tenha relacionamento, e (ii) que a documentação do consentimento fique à disposição do Banco Central. Não há afirmações que contradigam o gabarito, portanto a resposta está parcial.

**langchain-padrao:** O consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude deve ter as seguintes características e requisitos: ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta CMN/BCB nº 6, de 2023, conforme o art. 2º, § 4º, I; e constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido, conforme o art. 2º, § 4º, II. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona a finalidade de tratamento e compartilhamento e a necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido, mas omite o requisito de que o consentimento deve ser prévio e geral do cliente com quem a instituição tenha relacionamento (§3º) e a exigência de que a documentação fique à disposição do Banco Central (§5º). Como não há afirmações que contradigam o gabarito, apenas faltam elementos que a pergunta pede, a resposta é parcial.

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. correta

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º (Resolução Conjunta CMN/BCB 6/2023, art. 8º, II). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados compartilhados e a documentação de critérios e procedimentos (art. 8º, II), mas omite o prazo de cinco anos para os dados relativos à aplicação dos mecanismos de acompanhamento e controle (art. 8º, III) e o fato de que a documentação sobre o sistema eletrônico fica à disposição sem prazo fixado (art. 8º, I). Como a pergunta pede o tempo de retenção dos dados sobre indícios de fraude compartilhados e da documentação relacionada, faltam informações que a pergunta exige, tornando a resposta parcial. Não há afirmações que contrariem o gabarito.

**langchain-padrao:** As instituições devem manter à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados compartilhados e a documentação de critérios e procedimentos (art. 8º, II), omitindo o prazo de cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e controle (art. 8º, III) e a ausência de prazo fixo para a documentação do sistema eletrônico (art. 8º, I). Não há contradição com o gabarito, apenas falta de informações que a pergunta pede.

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
