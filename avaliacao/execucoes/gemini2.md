# Avaliação: gemini2

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-09T07:24:19.144Z a 2026-10-09T07:33:15.539Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: gemini-embedding-2; LLM: gemini-3.5-flash-lite, sem fallback
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
| manual | 6/30 (20%) | 6/6 (100%) | 45/46 (98%) | 77% | 0 |
| langchain | 6/30 (20%) | 6/6 (100%) | 46/47 (98%) | 79% | 0 |
| langchain-padrao | 15/30 (50%) | 6/6 (100%) | 23/26 (88%) | 62% | 0 |

| variante | tokens de entrada (média) | tokens de saída (média) | custo de tabela | geração p50 / p95 | total p50 / p95 |
| --- | --- | --- | --- | --- | --- |
| manual | 890 | 140 | sem preço configurado | 0.8 s / 1.5 s | 0.8 s / 1.5 s |
| langchain | 890 | 135 | sem preço configurado | 0.9 s / 1.3 s | 0.9 s / 1.4 s |
| langchain-padrao | 1381 | 163 | sem preço configurado | 0.9 s / 2.0 s | 0.9 s / 2.0 s |

Motivos de recusa (todas as perguntas):

| variante | citação não confere | modelo: não cobre |
| --- | --- | --- |
| manual | 0 | 14 |
| langchain | 0 | 13 |
| langchain-padrao | 10 | 13 |

## Conteúdo (juiz: nvidia/nemotron-3-super-120b-a12b:free)

Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.

| variante | julgadas | corretas | parciais | incorretas | acerto fim a fim | afirmou o que não devia |
| --- | --- | --- | --- | --- | --- | --- |
| manual | 22 | 15 | 7 | 0 | 17/30 (57%) | 0 |
| langchain | 23 | 15 | 8 | 0 | 16/30 (53%) | 0 |
| langchain-padrao | 13 | 11 | 1 | 1 | 13/30 (43%) | 0 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q02 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 2 · recusou (citação não confere) |
| q03 | coberta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta |
| q04 | coberta | 3 · respondeu 3/3, parcial | 3 · respondeu 3/3, parcial | 2 · recusou (citação não confere) |
| q05 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 2 · recusou (modelo: não cobre) |
| q06 | coberta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta | 1 · respondeu 4/4, correta |
| q07 | coberta | 1 · recusou (modelo: não cobre; aceita) | 1 · respondeu 1/1, correta | 1 · recusou (modelo: não cobre; aceita) |
| q08 | coberta | 1 · recusou (modelo: não cobre; aceita) | 1 · recusou (modelo: não cobre; aceita) | 1 · recusou (modelo: não cobre; aceita) |
| q09 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 11 · recusou (modelo: não cobre) |
| q10 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 7 · respondeu 0/2, incorreta |
| q11 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 2 · respondeu 1/1, correta |
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · respondeu 1/1, correta |
| q13 | coberta | 5 · recusou (modelo: não cobre) | 5 · recusou (modelo: não cobre) | 2 · respondeu 1/1, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q15 | coberta | 10 · recusou (modelo: não cobre) | 10 · recusou (modelo: não cobre) | 2 · respondeu 1/1, correta |
| q16 | coberta | 1 · respondeu 5/5, parcial | 1 · respondeu 5/5, parcial | 1 · respondeu 7/8, correta |
| q17 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, parcial | 1 · respondeu 1/1, parcial |
| q18 | coberta | 2 · respondeu 2/2, correta | 2 · respondeu 3/3, parcial | 3 · recusou (citação não confere) |
| q19 | coberta | 1 · respondeu 2/2, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q20 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · recusou (citação não confere) |
| q21 | coberta | 12 · recusou (modelo: não cobre) | 12 · recusou (modelo: não cobre) | 19 · recusou (modelo: não cobre) |
| q22 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, parcial | 1 · recusou (citação não confere) |
| q23 | coberta | 1 · respondeu 2/3, correta | 1 · respondeu 2/3, correta | 1 · recusou (citação não confere) |
| q24 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · recusou (citação não confere) |
| q25 | coberta | 2 · respondeu 3/3, parcial | 2 · respondeu 3/3, parcial | 6 · recusou (modelo: não cobre) |
| q26 | coberta | 5 · respondeu 1/1, correta | 5 · respondeu 1/1, correta | 2 · respondeu 3/3, correta |
| q27 | coberta | 1 · respondeu 3/3, correta | 1 · respondeu 3/3, correta | 1 · recusou (citação não confere) |
| q28 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, parcial | 1 · recusou (citação não confere) |
| q29 | coberta | 1 · respondeu 2/2, parcial | 1 · respondeu 2/2, parcial | 1 · recusou (citação não confere) |
| q30 | coberta | 2 · respondeu 1/1, parcial | 2 · respondeu 1/1, correta | 6 · recusou (modelo: não cobre) |
| f01 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f02 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f03 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f04 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f05 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f06 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |

## Respostas

### q01: Qual conduta configura o crime de lavagem de dinheiro e qual é a pena prevista?

**Gabarito:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. Pena: reclusão de 3 a 10 anos e multa.

**manual:** A conduta que configura o crime de lavagem de dinheiro é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta e a pena prevista no gabarito, sem omissões ou contradições.

**langchain:** A conduta que configura o crime de lavagem de dinheiro é ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal, conforme o gabarito, e indica a pena de reclusão de 3 a 10 anos e multa, também conforme o gabarito. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular bens provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, coincidindo integralmente com o gabarito. Não há omissão nem contradição.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 9º, IV (dispositivo não existe no corpus); Lei 9.613/1998, art. 9º, V (dispositivo não existe no corpus))

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf conforme previsto na Circular BCB 3.978/2020, art. 48, caput. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede (a quem). Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

**langchain:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf (Circular BCB 3.978/2020, art. 48, caput). — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede. Não há contradição com o gabarito e não omite nenhum elemento exigido pela pergunta.

**langchain-padrao:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo exatamente ao que a pergunta pede (o destinatário da comunicação). Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

### q04: Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**manual:** As sanções aplicáveis são advertência e multa pecuniária variável não superior ao dobro do valor da operação, ao dobro do lucro real obtido ou que seria obtido em razão da operação, ou ao valor de R$ 20.000.000,00. — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a

> juiz: **parcial**. A resposta menciona advertência e multa pecuniária, que estão corretas conforme o gabarito, mas omite as sanções de inabilitação temporária e cassação ou suspensão da autorização, que também são previstas. Como a pergunta pede quais sanções administrativas pode sofrer quem descumpre os deveres, a falta desses itens torna a resposta parcial, pois não contradiz o gabarito, apenas deixa de trazer parte do que foi solicitado.

**langchain:** As sanções administrativas aplicáveis são a advertência e a multa pecuniária variável não superior ao dobro do valor da operação. — citações: Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II; Lei 9.613/1998, art. 12, II, a

> juiz: **parcial**. A resposta menciona apenas advertência e multa pecuniária (até o dobro do valor da operação), omitindo outras sanções previstas no gabarito, como inabilitação temporária, cassação ou suspensão da autorização e a possibilidade de multa baseada no lucro ou em R$ 20 milhões. Não há contradição com o gabarito, apenas omissão.

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 2º, II, b, do Anexo [2] / Lei 9.613/1998 art. 12, II, b (dispositivo não existe no corpus); Lei 9.613/1998, art. 2º, II, c, do Anexo [2] / Lei 9.613/1998 art. 12, II, c (dispositivo não existe no corpus))

### q05: Por quanto tempo a instituição deve conservar os cadastros de clientes e os registros das operações?

**Gabarito:** A lei fixa o mínimo de cinco anos, contados do encerramento da conta ou da conclusão da transação, prazo que a autoridade competente pode ampliar (Lei 9.613, art. 10, § 2º). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 fixa dez anos: para as informações dos procedimentos de conhecer o cliente, contados do primeiro dia do ano seguinte ao término do relacionamento (art. 67, I), e para os registros de operações dos arts. 28 a 37, contados do primeiro dia do ano seguinte ao da operação (art. 67, III).

**manual:** Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação (Lei 9.613/1998, art. 10, § 2º). Além disso, as instituições devem manter à disposição do Banco Central do Brasil e conservar pelo período mínimo de dez anos as informações coletadas nos procedimentos para conhecer os clientes, contado a partir do primeiro dia do ano seguinte ao término do relacionamento (Circular BCB 3.978/2020, art. 67, I), bem como as informações e registros de operações tratados nos arts. 28 a 37, contado o prazo a partir do primeiro dia do ano seguinte ao da realização da operação (Circular BCB 3.978/2020, art. 67, III). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente os prazos solicitados: cinco anos mínimo para cadastros e registros (Lei 9.613/1998, art. 10, § 2º) e dez anos para as informações de KYC e registros de operações (Circular BCB 3.978/2020, arts. 67, I e III), com a correta contagem a partir do primeiro dia do ano seguinte ao término do relacionamento ou da operação. Não há afirmação que contradiga o gabarito, nem omissão de algo que a pergunta pede.

**langchain:** Os cadastros e registros referidos nos incisos I e II do art. 10 da Lei 9.613/1998 devem ser conservados durante o período mínimo de cinco anos a partir do encerramento da conta ou da conclusão da transação. Adicionalmente, nos termos da Circular BCB 3.978/2020, as instituições devem conservar pelo período mínimo de dez anos as informações coletadas nos procedimentos destinados a conhecer os clientes (contado a partir do primeiro dia do ano seguinte ao término do relacionamento) e as informações e registros de operações tratados nos arts. 28 a 37 (contado a partir do primeiro dia do ano seguinte ao da realização da operação). — citações: Lei 9.613/1998, art. 10, § 2º; Circular BCB 3.978/2020, art. 67, I; Circular BCB 3.978/2020, art. 67, III

> juiz: **correta**. A resposta traz exatamente os prazos exigidos pela pergunta: cinco anos a partir do encerramento da conta ou conclusão da transação (Lei 9.613/1998, art. 10, § 2º) e dez anos, conforme a Circular BCB 3.978/2020, para as informações de conhecer o cliente (art. 67, I) e para os registros de operações dos arts. 28 a 37 (art. 67, III), contados do primeiro dia do ano seguinte ao término do relacionamento ou da operação, respectivamente. Não há contradição com o gabarito e não omite nenhum elemento que a pergunta pede.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q06: Para efeito dos crimes contra o sistema financeiro, o que se considera instituição financeira e quem é equiparado a ela?

**Gabarito:** Instituição financeira é a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (I); a pessoa jurídica que ofereça serviços de operações com ativos virtuais, inclusive intermediação, negociação ou custódia (I-A); e a pessoa natural que exerça qualquer dessas atividades, ainda que de forma eventual (II).

**manual:** Considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se à instituição financeira: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros; a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia; e a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual. — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem falta de conteúdo exigido.

**langchain:** Considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se à instituição financeira a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros; a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia; e a pessoa natural que exerça quaisquer das atividades referidas no artigo, ainda que de forma eventual. — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, sem acrescentar ou omitir informações que contradigam o que foi solicitado. Não há nenhum item na lista 'Não deve afirmar' que seja afirmado.

**langchain-padrao:** Para efeito da lei, considera-se instituição financeira a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se à instituição financeira: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros; a pessoa jurídica que ofereça serviços referentes a operações com ativos virtuais, inclusive intermediação, negociação ou custódia; e a pessoa natural que exerça quaisquer das atividades referidas, ainda que de forma eventual. — citações: Lei 7.492/1986, art. 1º, caput; Lei 7.492/1986, art. 1º, parágrafo único, I; Lei 7.492/1986, art. 1º, parágrafo único, I-A; Lei 7.492/1986, art. 1º, parágrafo único, II

> juiz: **correta**. A resposta reproduz exatamente a definição de instituição financeira e os equiparados previstos no gabarito, sem acrescentar ou omitir informações relevantes e sem contradizer nenhum ponto.

### q07: O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** O crime de gestão fraudulenta de instituição financeira consiste em gerir fraudulentamente instituição financeira, sendo a pena de reclusão, de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta caracteriza o crime como 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, exatamente como o gabarito afirma. Não acrescenta definição proibida (engano, artifício, ardil, fraude contra sócios, investidores ou fiscalização) e não omite nada que a pergunta pede.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime e indicando a pena de reclusão de 1 a 4 anos e multa, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem omissão.

**langchain:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime e indicando a pena de reclusão de 1 a 4 anos e multa, sem acrescentar ou omitir informações relevantes à pergunta.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** Sim, constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa, conforme o gabarito, sem acrescentar informações contraditórias. Não omite nada que a pergunta pede (a pergunta apenas pede se é crime). Portanto está correta.

**langchain:** Sim, constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **correta**. A resposta confirma que é crime omitir ou prestar informação falsa, descrevendo exatamente o tipo de crime previsto no gabarito. Não há contradição e não omite nada que a pergunta exija (a pergunta apenas pede se é crime). Portanto, está correta.

**langchain-padrao:** Constitui crime fraudar a fiscalização ou o investidor, inserindo ou fazendo inserir, em documento comprobatório de investimento em títulos ou valores mobiliários, declaração falsa ou diversa da que dele deveria constar, com pena de reclusão de 1 a 5 anos e multa. Também é crime fazer inserir elemento falso ou omitir elemento exigido pela legislação em demonstrativos contábeis de instituição financeira, seguradora ou instituição integrante do sistema de distribuição de títulos de valores mobiliários, com a mesma pena. — citações: Lei 7.492/1986, art. 9º, caput; Lei 7.492/1986, art. 10, caput

> juiz: **incorreta**. A resposta afirma que o crime de omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição tem pena de reclusão de 1 a 5 anos, enquanto o gabarito estabelece pena de reclusão de 2 a 6 anos. Essa divergência de pena para o mesmo fato constitui contradição, tornando a resposta incorreta.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, abordando o cumprimento das sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há omissão nem contradição.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz integralmente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz integralmente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Cumprir "sem demora" significa agir imediatamente ou dentro de algumas horas. — citações: Lei 13.810/2019, art. 2º, V

> juiz: **correta**. A resposta define corretamente o significado de 'cumprir sem demora' como agir imediatamente ou dentro de algumas horas, o que está de acordo com o gabarito. Não há contradição nem omissão de algo que a pergunta pede.

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Para fins da indisponibilidade de ativos, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não. — citações: Lei 13.810/2019, art. 2º, I

> juiz: **correta**. A resposta lista exatamente os tipos de bens e recursos que podem ser alcançados pela indisponibilidade de ativos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), o que corresponde ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de algo que a pergunta solicita.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998. Isso atende exatamente ao que a pergunta pergunta ('Quem deve cumprir...'). O gabarito acrescenta detalhes sobre como devem cumprir (sem demora, sem prévio aviso, conforme órgão regulador), mas esses não são exigidos pela pergunta. Assim, a resposta não omite nada que a pergunta pede e não contradiz o gabarito.

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta identifica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998. A pergunta não pede detalhes sobre prazos, forma ou comunicação, portanto a ausência dessas informações não caracteriza parcialidade. Não há afirmações que contradigam o gabarito.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Isso corresponde exatamente ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de algo que a pergunta requisite.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Não, as resoluções sancionatórias do Conselho de Segurança das Nações Unidas e as designações de seus comitês de sanções são dotadas de executoriedade imediata na República Federativa do Brasil, conforme o art. 6º da Lei 13.810/2019. — citações: Lei 13.810/2019, art. 6º, caput

> juiz: **correta**. correta

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** As instituições devem realizar avaliação interna com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco. O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição. Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco. Além disso, devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta define corretamente a avaliação interna de risco, mas omite elementos essenciais sobre como ela deve ser feita: não menciona a necessidade de considerar os perfis de risco dos clientes, da instituição (modelo de negócio e área geográfica), das operações, transações, produtos e serviços (incluindo canais de distribuição e novas tecnologias), nem das atividades de funcionários, parceiros e terceirizados; também deixa de exigir que a avaliação seja documentada, aprovada pelo diretor responsável, encaminhada aos comitês de risco e auditoria e ao conselho ou diretoria, e revisada a cada dois anos ou diante de alteração significativa nos perfis de risco. Não há afirmações que contradigam o gabarito, apenas faltas de informações que a pergunta pede.

**langchain:** As instituições devem realizar avaliação interna com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco. O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição. Devem ser definidas categorias de risco que possibilitem a adoção de controles de gerenciamento e de mitigação reforçados para as situações de maior risco e a adoção de controles simplificados nas situações de menor risco. Além disso, devem ser utilizadas como subsídio à avaliação interna de risco, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta define corretamente o que é a avaliação interna de risco e menciona alguns passos de como deve ser feita (considerar perfis de risco, avaliar probabilidade e magnitude dos impactos, definir categorias de risco). Porém, omite elementos exigidos pelo gabarito para descrever como a avaliação deve ser realizada, tais como a necessidade de considerar, no mínimo, os perfis de risco dos clientes, da instituição (modelo de negócio e área geográfica), das operações, transações, produtos e serviços (incluindo canais de distribuição e novas tecnologias) e das atividades de funcionários, parceiros e terceirizados; a forma de documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e de auditoria e ao conselho ou diretoria; e a periodicidade de revisão a cada dois anos ou diante de alteração significativa nos perfis de risco. Como não há afirmações que contradigam o gabarito, apenas faltam informações que a pergunta pede, a resposta é parcial.

**langchain-padrao:** A avaliação interna tem o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, deve considerar no mínimo os perfis de risco dos clientes; da instituição (incluindo modelo de negócio e área geográfica); das operações, transações, produtos, serviços, canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e prestadores terceirizados. O risco identificado deve ser avaliado quanto à probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental. Devem ser definidas categorias de risco para adoção de controles reforçados (maior risco) ou simplificados (menor risco), utilizando-se como subsídio avaliações de entidades públicas brasileiras, quando disponíveis. A avaliação pode ser centralizada em instituição do conglomerado prudencial ou do sistema cooperativo de crédito (com opção formalizada em reunião do conselho de administração ou diretoria), e deve ser documentada, aprovada pelo diretor responsável, encaminhada para ciência a comitês (risco e auditoria, quando houver) e ao conselho de administração ou diretoria, além de ser revisada a cada dois anos ou quando houver alterações significativas nos perfis de risco. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 3º; Circular BCB 3.978/2020, art. 10, § 4º; Circular BCB 3.978/2020, art. 11, caput; Circular BCB 3.978/2020, art. 11, parágrafo único; Circular BCB 3.978/2020, art. 12, caput

> juiz: **correta**. A resposta cobre todos os pontos exigidos pelo gabarito: objetivo de identificar e mensurar o risco, os fatores mínimos a considerar (perfis de clientes, instituição, operações, transações, produtos, serviços, canais, novas tecnologias, atividades de funcionários, parceiros e terceirizados), avaliação por probabilidade e magnitude dos impactos, definição de categorias de risco para controles reforçados ou simplificados, documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e auditoria (quando houver) e ao conselho ou diretoria, e revisão a cada dois anos ou diante de alterações significativas nos perfis de risco. Não há afirmações que contrariem o gabarito; os acréscimos (uso de avaliações de entidades públicas brasileiras e possibilidade de centralização) são informações adicionais que não contradizem o conteúdo exigido. Portanto, a resposta está correta.

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **correta**. A resposta afirma que os procedimentos devem incluir devida diligência na identificação, qualificação e classificação dos clientes, o que está de acordo com o gabarito. Não há contradição nem omissão de algo que a pergunta explicitamente pede; portanto, a resposta está correta.

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput). — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação, omitindo outros requisitos que a pergunta implica, como compatibilidade com o perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria e os detalhes específicos de identificação, qualificação e classificação. Não há contradição com o gabarito, apenas falta de informações solicitadas.

**langchain-padrao:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação, omitindo requisitos como compatibilidade com o perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria e os detalhes específicos de cada etapa (nome/CPF, residência/sede, capacidade financeira, categorias de risco e análise da cadeia societária). Não há contradição com o gabarito, portanto o veredito é parcial.

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo, cujos procedimentos de monitoramento e seleção devem permitir identificar operações e situações que possam indicar tais suspeitas. — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 39, caput

> juiz: **correta**. A resposta descreve que a instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dar especial atenção às suspeitas de lavagem de dinheiro e financiamento do terrorismo, o que atende ao que a pergunta pede (como conduzir o monitoramento). Não há contradição com o gabarito, e a ausência de detalhes como compatibilidade com política de PLD/FT, avaliação de risco, PEPs, manual aprovado pela diretoria ou o limite de 45 dias não torna a resposta parcial, pois a pergunta não exige esses pontos.

**langchain:** As instituições devem implementar procedimentos de monitoramento, seleção e análise de operações e situações com o objetivo de identificar e dispensar especial atenção às suspeitas de lavagem de dinheiro e de financiamento do terrorismo. Esses procedimentos devem permitir identificar operações e situações que possam indicar suspeitas, sendo que o período para a execução dos procedimentos de monitoramento e de seleção não pode exceder o prazo de quarenta e cinco dias, contados a partir da data de ocorrência da operação ou da situação. — citações: Circular BCB 3.978/2020, art. 38, caput; Circular BCB 3.978/2020, art. 39, caput; Circular BCB 3.978/2020, art. 39, parágrafo único

> juiz: **parcial**. A resposta menciona a implementação de procedimentos de monitoramento, seleção e análise, o objetivo de identificar suspeitas de lavagem de dinheiro e financiamento do terrorismo e o limite de 45 dias para execução desses procedimentos. Porém, omite requisitos que o gabarito considera parte de como conduzir o monitoramento: a compatibilidade com a política de PLD/FT, a base na avaliação interna de risco, a consideração de pessoa exposta politicamente e a descrição em manual aprovado pela diretoria, bem como a aplicação às propostas de operações. Como a pergunta pede 'como a instituição deve conduzir o monitoramento', esses elementos são parte do que se espera na resposta; portanto a resposta está incompleta, mas não contradiz o gabarito.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 40, § 1º e § 2º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 38, § 2º e § 3º (dispositivo não existe no corpus))

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação, conforme o art. 48, § 2º, da Circular BCB 3.978/2020. Por sua vez, a Lei nº 9.613/1998 estabelece no art. 11, II, que a comunicação ao Coaf de propostas ou realizações de transações deve ocorrer no prazo de 24 (vinte e quatro) horas, abstendo-se de dar ciência de tal ato a qualquer pessoa. — citações: Circular BCB 3.978/2020, art. 48, § 2º; Lei 9.613/1998, art. 11, II

> juiz: **correta**. A resposta indica o prazo correto para a comunicação ao Coaf: até o dia útil seguinte à decisão de comunicação (art. 48, § 2º da Circular 3.978) e também menciona o prazo de 24 horas previsto na Lei 9.613/1998 (art. 11, II), sem afirmar nada que contradiga o gabarito ou que viole os itens de 'Não deve afirmar'. Assim, responde adequadamente à pergunta.

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma exatamente o prazo indicado no gabarito: 'até o dia útil seguinte ao da decisão de comunicação', citando a Circular 3.978, art. 48, § 2º. Não acrescenta informações que contrariem o gabarito nem omite algo que a pergunta pede, pois a pergunta apenas solicita o prazo para comunicar ao Coaf uma operação suspeita. Portanto, a resposta está correta.

**langchain-padrao:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma exatamente o prazo indicado no gabarito: 'até o dia útil seguinte ao da decisão de comunicação', citando a Circular 3.978, art. 48, § 2º. Não acrescenta informações que contrariem o gabarito nem omite algo que a pergunta pede, pois a pergunta apenas solicita o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro. Portanto, a resposta está correta.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 62, § 2º, I e II (dispositivo não existe no corpus))

### q21: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro? Toda operação da relação deve ser comunicada ao Coaf?

**Gabarito:** As operações e situações relacionadas exemplificam indícios de suspeita para fins dos procedimentos de monitoramento e seleção da Circular 3.978 (art. 1º, caput). Não são comunicadas automaticamente: só quando os indícios forem confirmados ao término da análise (§ 1º), que deve considerar todas as informações disponíveis, inclusive as dos procedimentos de conhecer clientes, funcionários, parceiros e terceirizados (§ 2º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q22: Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**manual:** O fracionamento de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, constitui indício de suspeita quando é feito de forma a dissimular o valor total da movimentação. A fragmentação de saques em espécie é considerada indício de suspeita a fim de burlar limites regulatórios de reportes. Além disso, os saques realizados no período de cinco dias úteis em valores inferiores aos limites estabelecidos também são indícios quando ocorrem de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie. — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, k

> juiz: **parcial**. A resposta aborda os itens (d), (e) e (k) do gabarito, mas omite os itens (l) e (m), que também são situações de fracionamento de depósitos ou saques em espécie consideradas indícios de suspeita. Como a pergunta pede quando o fracionamento de depósitos ou saques em espécie é indício, faltar esses itens caracteriza resposta parcial. Não há afirmações que contrariem o gabarito.

**langchain:** Constituem indícios de suspeita a fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação; a fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes; e a realização de saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie. — citações: Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, k

> juiz: **parcial**. A resposta inclui os itens d, e e k do gabarito, mas omite os itens l e m (dois ou mais saques em espécie no caixa no mesmo dia ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação). Como a pergunta pede todas as situações em que o fracionamento de depósitos ou saques em espécie é indício de suspeita, a omissão desses itens torna a resposta parcial. Não há afirmações que contradigam o gabarito.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, alínea d (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, alínea e (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, alínea f (dispositivo não existe no corpus))

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** Constituem indícios de suspeita a movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente em contas de depósito e de contas de pagamento em moeda nacional (Carta Circular BCB 4.001/2020, art. 1º, IV, a), a movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente em contas correntes em moeda estrangeira (Carta Circular BCB 4.001/2020, art. 1º, XVI, a), bem como operações realizadas e produtos e serviços contratados que apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda para pessoa natural ou o faturamento para pessoa jurídica, e o patrimônio (Circular BCB 3.978/2020, art. 39, I, c). — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Carta Circular BCB 4.001/2020, art. 1º, XVI, a; Circular BCB 3.978/2020, art. 39, I, c

> juiz: **correta**. A resposta contém exatamente o sinal de alerta solicitado: movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente. As informações adicionais não contradizem o gabarito e não são exigidas pela pergunta, portanto a resposta está completa e correta.

**langchain:** Constituem indícios de suspeita a movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente em contas de depósito e de contas de pagamento em moeda nacional, a movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente em contas correntes em moeda estrangeira (CCME), e as operações realizadas e os produtos e serviços contratados que apresentem incompatibilidade com a capacidade financeira do cliente, incluindo renda ou faturamento e patrimônio. — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, a; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a

> juiz: **correta**. A resposta traz o sinal de alerta solicitado (movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente) e acrescenta apenas detalhes adicionais que não contradizem o gabarito. Não há omissão de algo que a pergunta pede nem afirmação contrária.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, art. 1º, I, a (texto do dispositivo não está nos trechos recuperados))

### q24: Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**manual:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção. — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta confirma que a movimentação de quantia significativa em conta até então pouco movimentada ou com depósito inusitado caracteriza indício de suspeita, exatamente como o gabarito afirma. Não acrescenta nem omite informações relevantes à pergunta e não viola nenhum dos itens de 'Não deve afirmar'.

**langchain:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção. — citações: Carta Circular BCB 4.001/2020, art. 1º, IV, e

> juiz: **correta**. A resposta confirma que a movimentação significativa em conta pouco movimentada é indício de suspeita, conforme o gabarito, sem acrescentar afirmações contraditórias ou itens proibidos.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, e (dispositivo não existe no corpus))

### q25: Que situações envolvendo procuradores, representantes ou o beneficiário final são indícios de suspeita de lavagem de dinheiro?

**Gabarito:** Abertura, movimentação de contas ou realização de operações por detentor de procuração ou de outro tipo de mandato (art. 1º, III, d); operações em que não seja possível identificar o beneficiário final (III, g); representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável (III, h); e contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t).

**manual:** Constituem indícios de suspeita a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável; a abertura, movimentação de contas ou realização de operações por detentor de procuração ou de qualquer outro tipo de mandato; e as operações em que não seja possível identificar o beneficiário final, observados os procedimentos da regulamentação vigente. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, h; Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g

> juiz: **parcial**. A resposta menciona três das quatro situações listadas no gabarito como indícios de suspeita: representação de diferentes pessoas jurídicas pelos mesmos procuradores sem justificativa, abertura/movimentação de contas por detentor de procuração ou outro mandato, e operações onde não é possível identificar o beneficiário final. Não há afirmações que contrariem o gabarito nem uso dos termos proibidos. Porém, omite a situação de contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes, que também envolve representantes e portanto é algo que a pergunta pede. Como falta algo que a pergunta requer, a resposta é parcial.

**langchain:** Constituem indícios de suspeita a abertura, a movimentação de contas ou a realização de operações por detentor de procuração ou de qualquer outro tipo de mandato; operações em que não seja possível identificar o beneficiário final, observados os procedimentos da regulamentação vigente; e a representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável. — citações: Carta Circular BCB 4.001/2020, art. 1º, III, d; Carta Circular BCB 4.001/2020, art. 1º, III, g; Carta Circular BCB 4.001/2020, art. 1º, III, h

> juiz: **parcial**. A resposta inclui as situações previstas nos incisos d, g e h do art. 1º da Circular BCB 4.001/2020, mas omite a situação descrita no inciso t (contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes), que também envolve representantes e portanto é requerida pela pergunta. Não há afirmações que contrariem o gabarito e não há uso dos termos proibidos.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q26: Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**manual:** As instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil estão obrigadas ao compartilhamento, enquanto as administradoras de consórcio estão excluídas dessa obrigação. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BC) e a excluída (administradoras de consórcio), sem contradizer o gabarito.

**langchain:** As instituições obrigadas a compartilhar dados são as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil, estando excluídas dessa obrigação as administradoras de consórcio. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e a excluída (administradoras de consórcio), sem contradizer o gabarito.

**langchain-padrao:** As instituições obrigadas a compartilhar dados são as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil. Estão excluídas dessa obrigação as administradoras de consórcio. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º; Resolução Conjunta CMN/BCB 6/2023, art. 2º, caput

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradoras de consórcio), conforme o gabarito, sem acrescentar ou omitir informações relevantes.

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades; a alteração e a exclusão dos dados e das informações registrados, conforme o caso; e a consulta dos dados e das informações registrados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta menciona exatamente as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar ou omitir nada que contradiga o gabarito.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades; a alteração e a exclusão dos dados e das informações registrados, conforme o caso; e a consulta dos dados e das informações registrados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **correta**. A resposta menciona as três funcionalidades mínimas exigidas: registro, alteração/exclusão e consulta, sem acrescentar nada que contradiga o gabarito nem omitir nenhum item requerido.

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I, II e III (dispositivo não existe no corpus))

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações sobre indícios de ocorrência ou tentativa de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; e a identificação da instituição responsável pelo registro dos dados e das informações. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III

> juiz: **parcial**. A resposta inclui os itens I, II e III do gabarito, mas omite o item IV (identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento). Não há afirmações que contrariem o gabarito.

**langchain:** O registro dos dados e informações sobre indícios ou tentativas de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; e a identificação da instituição responsável pelo registro dos dados e das informações. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III

> juiz: **parcial**. A resposta inclui os itens I, II e III do gabarito, mas omite o item IV (identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento). Não há afirmações que contradigam o gabarito.

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 2º, II (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 2º, III (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 2º, IV (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 2º, I (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 2º, II (dispositivo não existe no corpus); Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 2º, III (dispositivo não existe no corpus))

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** O consentimento do cliente deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes, além de constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona a finalidade de tratamento e compartilhamento e a forma de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido, mas omite os requisitos de que o consentimento deve ser prévio e geral, que deve ser do cliente com quem a instituição tenha relacionamento e que a documentação deve ficar à disposição do Banco Central. Não há afirmações que contradigam o gabarito.

**langchain:** O consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes, além de constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

> juiz: **parcial**. A resposta menciona a finalidade de tratamento e compartilhamento e a necessidade de constar de contrato com cláusula em destaque ou outro instrumento jurídico válido, mas omite os requisitos de que o consentimento deve ser prévio e geral e que deve ser do cliente com quem a instituição tenha relacionamento. Como faltam elementos que a pergunta pede, a resposta é parcial.

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 4º, I e II (dispositivo não existe no corpus))

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados e informações compartilhados e a documentação com critérios e procedimentos, omitindo o prazo de cinco anos para os dados relativos aos mecanismos de acompanhamento e controle e a documentação sobre o sistema eletrônico sem prazo fixado. Como a pergunta pede o prazo para os dados sobre indícios de fraude compartilhados e a documentação relacionada, a omissão desses itens torna a resposta parcial, sem contradizer o gabarito.

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil por dez anos os dados e as informações compartilhados, nos termos do art. 2º, § 6º, inciso II, e a documentação com os critérios e procedimentos a que se refere o art. 2º, § 8º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. A resposta indica que os dados e informações compartilhados, bem como a documentação com os critérios e procedimentos de identificação, devem ficar à disposição do Banco Central por dez anos, o que está conforme o item II do gabarito. Não há afirmação que contradiga o gabarito nem omissão de algo que a pergunta especificamente pede.

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
