# Avaliação: base

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-08T12:55:03.508Z a 2026-10-08T13:11:13.259Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: gemini-3.5-flash-lite, sem fallback
- Conteúdo das respostas julgado por openrouter/nvidia/nemotron-3-super-120b-a12b:free (`npm run julgar`), comparando com o gabarito

## Busca (perguntas cobertas)

Na variante `langchain-padrao`, um pedaço contém vários dispositivos (mediana de 5), então a posição k compara contextos de tamanhos diferentes; ver tokens de entrada.

| variante | perguntas | recall@5 | acerto@5 | MRR@20 |
| --- | --- | --- | --- | --- |
| manual | 30 | 42% | 60% | 0.40 |
| langchain | 30 | 42% | 60% | 0.40 |
| langchain-padrao | 30 | 59% | 70% | 0.53 |

Pontuação do melhor trecho (mín. / mediana / máx.): se as faixas não se sobrepõem, um limiar separa o que o corpus cobre do que não cobre.

| variante | cobertas | fora do corpus |
| --- | --- | --- |
| manual | 0.872 / 0.889 / 0.913 | 0.838 / 0.848 / 0.864 |
| langchain | 0.872 / 0.889 / 0.913 | 0.838 / 0.848 / 0.864 |
| langchain-padrao | 0.860 / 0.887 / 0.913 | 0.844 / 0.858 / 0.868 |

## Resposta

| variante | falsa recusa | recusa correta (fora) | citações pertinentes | cobertura das citações | erros |
| --- | --- | --- | --- | --- | --- |
| manual | 12/30 (40%) | 6/6 (100%) | 29/31 (94%) | 57% | 0 |
| langchain | 11/30 (37%) | 6/6 (100%) | 31/33 (94%) | 62% | 0 |
| langchain-padrao | 13/30 (43%) | 6/6 (100%) | 21/24 (88%) | 53% | 0 |

| variante | tokens de entrada (média) | tokens de saída (média) | custo de tabela | geração p50 / p95 | total p50 / p95 |
| --- | --- | --- | --- | --- | --- |
| manual | 1008 | 101 | sem preço configurado | 1.7 s / 22.2 s | 1.7 s / 22.2 s |
| langchain | 1008 | 112 | sem preço configurado | 6.7 s / 15.9 s | 6.8 s / 15.9 s |
| langchain-padrao | 1394 | 121 | sem preço configurado | 5.9 s / 17.5 s | 5.9 s / 17.6 s |

Motivos de recusa (todas as perguntas):

| variante | citação não confere | modelo: não cobre |
| --- | --- | --- |
| manual | 0 | 19 |
| langchain | 0 | 18 |
| langchain-padrao | 8 | 13 |

## Conteúdo (juiz: nvidia/nemotron-3-super-120b-a12b:free)

Acerto fim a fim: nas perguntas cobertas, resposta julgada correta ou recusa onde recusar é aceito.

| variante | julgadas | corretas | parciais | incorretas | acerto fim a fim | afirmou o que não devia |
| --- | --- | --- | --- | --- | --- | --- |
| manual | 17 | 9 | 8 | 0 | 10/30 (33%) | 0 |
| langchain | 18 | 10 | 8 | 0 | 11/30 (37%) | 0 |
| langchain-padrao | 15 | 9 | 6 | 0 | 11/30 (37%) | 0 |

## Por pergunta

Posição do primeiro dispositivo exigido na busca (– se não veio), e o desfecho. Em "respondeu", citações pertinentes / feitas.

| id | tipo | manual | langchain | langchain-padrao |
| --- | --- | --- | --- | --- |
| q01 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q02 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 13 · recusou (modelo: não cobre) |
| q03 | coberta | – · respondeu 1/1, correta | – · respondeu 1/1, correta | – · respondeu 1/1, correta |
| q04 | coberta | 13 · recusou (modelo: não cobre) | 13 · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) |
| q05 | coberta | 10 · recusou (modelo: não cobre) | 10 · recusou (modelo: não cobre) | 1 · recusou (citação não confere) |
| q06 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 1 · recusou (citação não confere) |
| q07 | coberta | 3 · respondeu 1/1, correta | 3 · respondeu 1/1, correta | 5 · recusou (modelo: não cobre; aceita) |
| q08 | coberta | 1 · recusou (modelo: não cobre; aceita) | 1 · recusou (modelo: não cobre; aceita) | 10 · recusou (modelo: não cobre; aceita) |
| q09 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 4 · respondeu 1/1, correta |
| q10 | coberta | 5 · recusou (modelo: não cobre) | 5 · respondeu 1/1, correta | – · respondeu 0/2, correta |
| q11 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · respondeu 1/1, parcial |
| q13 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 5 · respondeu 1/2, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 3 · respondeu 1/1, correta |
| q15 | coberta | 6 · recusou (modelo: não cobre) | 6 · recusou (modelo: não cobre) | 11 · recusou (modelo: não cobre) |
| q16 | coberta | 1 · respondeu 6/6, parcial | 1 · respondeu 6/6, parcial | 1 · respondeu 3/3, parcial |
| q17 | coberta | 3 · respondeu 1/1, parcial | 3 · respondeu 1/1, parcial | 1 · respondeu 1/1, parcial |
| q18 | coberta | 12 · respondeu 2/4, parcial | 12 · respondeu 3/5, parcial | 3 · recusou (citação não confere) |
| q19 | coberta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta | 1 · respondeu 1/1, correta |
| q20 | coberta | 4 · respondeu 3/3, parcial | 4 · respondeu 3/3, parcial | 1 · recusou (citação não confere) |
| q21 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 18 · recusou (modelo: não cobre) |
| q22 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 6 · respondeu 3/3, parcial |
| q23 | coberta | – · respondeu 1/1, correta | – · respondeu 1/1, correta | 2 · recusou (citação não confere) |
| q24 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 1 · recusou (citação não confere) |
| q25 | coberta | – · recusou (modelo: não cobre) | – · recusou (modelo: não cobre) | 3 · recusou (citação não confere) |
| q26 | coberta | 4 · respondeu 2/2, correta | 4 · respondeu 2/2, correta | – · recusou (modelo: não cobre) |
| q27 | coberta | 1 · respondeu 2/2, parcial | 1 · respondeu 2/2, parcial | 1 · recusou (citação não confere) |
| q28 | coberta | 1 · respondeu 3/3, parcial | 1 · respondeu 3/3, parcial | 1 · respondeu 4/4, correta |
| q29 | coberta | 4 · respondeu 1/1, parcial | 4 · respondeu 1/1, parcial | 1 · respondeu 1/1, parcial |
| q30 | coberta | 2 · respondeu 1/1, parcial | 2 · respondeu 1/1, parcial | 5 · respondeu 1/1, parcial |
| f01 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f02 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f03 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f04 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f05 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |
| f06 | fora | recusou (modelo: não cobre) | recusou (modelo: não cobre) | recusou (modelo: não cobre) |

## Respostas

### q01: Qual conduta configura o crime de lavagem de dinheiro e qual é a pena prevista?

**Gabarito:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. Pena: reclusão de 3 a 10 anos e multa.

**manual:** Configura o crime de lavagem de dinheiro ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta que configura o crime de lavagem de dinheiro e a pena prevista, conforme o gabarito, sem acrescentar informações contraditórias ou omitir partes solicitadas.

**langchain:** O crime de lavagem de dinheiro consiste em ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de lavagem de dinheiro conforme o gabarito e indica a pena de reclusão de 3 a 10 anos e multa, sem acrescentar informações contraditórias ou omitir partes solicitadas.

**langchain-padrao:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente a conduta descrita no gabarito e a pena prevista, sem acrescentar informações que contrariem o gabarito. A citação da Lei 9.613/1998, art. 1º, caput é um detalhe adicional que não contradiz o gabarito. Não há itens em "Não deve afirmar" para serem violados.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede (a quem). Não há contradição com o gabarito; a omissão do prazo de 24 horas e da obrigação de sigilo não é exigida pela pergunta, portanto a resposta está correta.

**langchain:** As operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta afirma que as operações suspeitas devem ser comunicadas ao Coaf, o que está de acordo com o gabarito. Não há contradição com o gabarito; a inclusão de financiamento do terrorismo é detalhe adicional que não contradiz, e a omissão do prazo de 24 horas e do sigilo não afeta a resposta à pergunta 'a quem'. Portanto, a resposta está correta.

**langchain-padrao:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede (a quem). Não traz informações que contrariem o gabarito e omite detalhes (prazo, sigilo) que não são exigidos pela pergunta.

### q04: Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q05: Por quanto tempo a instituição deve conservar os cadastros de clientes e os registros das operações?

**Gabarito:** A lei fixa o mínimo de cinco anos, contados do encerramento da conta ou da conclusão da transação, prazo que a autoridade competente pode ampliar (Lei 9.613, art. 10, § 2º). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 fixa dez anos: para as informações dos procedimentos de conhecer o cliente, contados do primeiro dia do ano seguinte ao término do relacionamento (art. 67, I), e para os registros de operações dos arts. 28 a 37, contados do primeiro dia do ano seguinte ao da operação (art. 67, III).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Lei 9.613/1998, art. 1º, § 2º (texto do dispositivo não está nos trechos recuperados))

### q06: Para efeito dos crimes contra o sistema financeiro, o que se considera instituição financeira e quem é equiparado a ela?

**Gabarito:** Instituição financeira é a pessoa jurídica de direito público ou privado que tenha como atividade principal ou acessória, cumulativamente ou não, a captação, intermediação ou aplicação de recursos financeiros de terceiros, em moeda nacional ou estrangeira, ou a custódia, emissão, distribuição, negociação, intermediação ou administração de valores mobiliários. Equiparam-se: a pessoa jurídica que capte ou administre seguros, câmbio, consórcio, capitalização ou qualquer tipo de poupança, ou recursos de terceiros (I); a pessoa jurídica que ofereça serviços de operações com ativos virtuais, inclusive intermediação, negociação ou custódia (I-A); e a pessoa natural que exerça qualquer dessas atividades, ainda que de forma eventual (II).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Lei 7.492/1986, art. 1º, parágrafo único, I, I-A e II (dispositivo não existe no corpus))

### q07: O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** O crime consiste em gerir fraudulentamente instituição financeira, tendo como pena reclusão de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma apenas que o crime consiste em gerir fraudulentamente instituição financeira e indica a pena de reclusão de 3 a 12 anos e multa, o que está totalmente conforme o gabarito. Não apresenta nenhuma definição de gestão fraudulenta, portanto não viola o item 1 de 'Não deve afirmar'.

**langchain:** O crime consiste em gerir fraudulentamente instituição financeira, tendo como pena reclusão de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma corretamente que o crime consiste em gerir fraudulentamente instituição financeira e indica a pena de reclusão de 3 a 12 anos e multa, conforme o gabarito. Não apresenta definição de gestão fraudulenta, portanto não viola o item 1 de 'Não deve afirmar'. A citação adicional não contradiz o gabarito.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime operar instituição financeira sem autorização ou com autorização falsa e indicando a pena de reclusão de 1 a 4 anos e multa. A inclusão da citaçăo Lei 7.492/1986, art. 16, caput é detalhe adicional que não contradiz o gabarito. Não há nenhum item em 'Não deve afirmar' para ser violado.

**langchain:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime operar instituição financeira sem autorização ou com autorização falsa e indicando a pena de reclusão de 1 a 4 anos e multa. A inclusão da citaçăo Lei 7.492/1986, art. 16, caput é detalhe adicional que não contradiz o gabarito. Não há nenhum item na lista 'Não deve afirmar' para ser violado.

**langchain-padrao:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, descreve a pena de reclusão de 1 a 4 anos e multa, exatamente como o gabarito. Não acrescenta informações que contrariem o gabarito e não há itens em 'Não deve afirmar'.

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente em relação a operação ou situação financeira, mediante a sonegação de informação ou a prestação falsa. — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **correta**. A resposta confirma que é crime induzir ou manter em erro sócio, investidor ou repartição pública competente mediante sonegação ou prestação falsa de informação, o que está totalmente de acordo com o gabarito. Não acrescenta informações contrárias e não omite nenhum elemento exigido pela pergunta (que apenas questiona se há crime). Não há itens na lista de 'Não deve afirmar' que sejam afirmados.

**langchain-padrao:** Constitui crime fraudar a fiscalização ou o investidor inserindo ou fazendo inserir em documento comprobatório de investimento em títulos ou valores mobiliários declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º), bem como fazer inserir elemento falso ou omitir elemento exigido pela legislação em demonstrativos contábeis de instituição financeira, seguradora ou instituição integrante do sistema de distribuição de títulos de valores mobiliários (Lei 7.492/1986, art. 10). — citações: Lei 7.492/1986, art. 9º, caput; Lei 7.492/1986, art. 10, caput

> juiz: **correta**. A resposta confirma que omitir ou prestar informação falsa a investidores ou à fiscalização constitui crime, o que está de acordo com o gabarito. Não há contradição nem omissão de informações essenciais à pergunta feita.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, sem acrescentar ou omitir informações relevantes, e não contém nenhuma afirmação que contradiga o gabarito.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, o que inclui a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, bem como a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, sem acrescentar ou omitir informações relevantes, e não há itens em 'Não deve afirmar' para serem violados.

**langchain-padrao:** A Lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, afirmando que a lei trata do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há contradição com o gabarito nem acréscimo de informações que o contrariem. Portanto, a resposta está correta.

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Significa realizar a ação imediatamente ou dentro de algumas horas. — citações: Lei 13.810/2019, art. 2º, V

> juiz: **parcial**. A resposta está correta ao afirmar que 'sem demora' significa imediatamente ou dentro de algumas horas, conforme o art. 2º, V do gabarito. Porém, omite a parte que diz que o cumprimento deve ser feito sem prévio aviso aos sancionados (art. 9º), deixando de fora parte do que a pergunta pede. Não há afirmações que contrariem o gabarito.

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Para fins da lei, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não, que podem ser alcançados pela indisponibilidade decorrente de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas ou designações de seus comitês de sanções. — citações: Lei 13.810/2019, art. 2º, I; Lei 13.810/2019, art. 3º, I

> juiz: **correta**. A resposta lista exatamente os tipos de bens e recursos que podem ser alcançados pela indisponibilidade de ativos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não), conforme o gabarito. Não há contradição nem omissão de informações essenciais para a pergunta.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos (pessoas naturais e jurídicas do art. 9º da Lei 9.613/1998), menciona que o cumprimento deve ser sem demora e sem prévio aviso aos sancionados e cita a base legal (Lei 13.810/2019, art. 9º, caput). Não há afirmações que contrariem o gabarito; apenas omite detalhes sobre a comunicação das sanções pelos órgãos reguladores, o que não é exigido pela pergunta. Portanto, a resposta está correta.

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos (pessoas naturais e jurídicas do art. 9º da Lei 9.613/1998), sem demora e sem prévio aviso, e menciona que o cumprimento refere‑se às resoluções do Conselho de Segurança da ONU ou às designações de seus comitês de sanções que determinem o bloqueio de ativos. Isso está em conformidade com o gabarito, que também afirma que tais pessoas devem cumprir as determinações sem demora e sem aviso prévio. A resposta omite alguns detalhes adicionais presentes no gabarito (como a forma definida pelo órgão regulador, a comunicação do Ministério da Justiça e a lista de outros órgãos), mas, conforme as regras, omissões não tornam a resposta incorreta desde que não haja contradição. Não há afirmações que contrariem o gabarito.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta afirma que as pessoas naturais e jurídicas do art. 9º da Lei 9.613/1998 devem cumprir, sem demora e sem prévio aviso, as determinações de indisponibilidade de ativos provenientes de resoluções do Conselho de Segurança da ONU ou de seus comitês de sanções. Isso está totalmente de acordo com o gabarito, que estabelece exatamente quem são os obrigados (as mesmas pessoas) e que o cumprimento deve ser imediato e sem aviso prévio. A resposta omite detalhes sobre a forma de comunicação (por meio do Ministério da Justiça e dos órgãos reguladores) e sobre a definição do procedimento pelos órgãos reguladores, mas essas omissões não contradiem o gabarito e não são exigidas pela pergunta, que apenas pergunta quem deve cumprir. Não há afirmação que contradiga o gabarito, portanto a resposta é correta.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** As instituições devem realizar avaliação interna com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação desse risco, a avaliação interna deve considerar, no mínimo, os perfis de risco dos clientes, da instituição (incluindo o modelo de negócio e a área geográfica de atuação), e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, I, II e IV). Além disso, o risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º), e devem ser utilizadas como subsídio, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao tema (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta aborda o objetivo da avaliação interna e alguns de seus requisitos (perfis de risco dos clientes, da instituição e das atividades de funcionários, parceiros e terceirizados, bem como a avaliação por probabilidade e magnitude dos impactos). Porém, omite elementos essenciais do 'como deve ser feita' previstos no gabarito, tais como a consideração de operações, transações, produtos e serviços com todos os canais de distribuição e novas tecnologias; a definição de categorias de risco para controles reforçados ou simplificados; a necessidade de documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e auditoria e ao conselho ou diretoria; e a periodicidade de revisão a cada dois anos ou diante de alterações significativas. Não há afirmações que contrariem o gabarito, apenas informações adicionais (uso de avaliações de entidades públicas) que não o contradizem. Portanto, a resposta está parcialmente correta.

**langchain:** A avaliação interna de risco é realizada com o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco dos clientes, da instituição (incluindo o modelo de negócio e a área geográfica de atuação), dos produtos e serviços, e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, I, II e IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Além disso, devem ser utilizadas como subsídio à avaliação interna, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta está em conformidade com o gabarito quanto ao que afirma, mas omite elementos exigidos pela pergunta, como as categorias de risco (§3º), a documentação e aprovação pelo diretor responsável, o encaminhamento aos comitês de risco e auditoria ou ao conselho/diretoria, e a periodicidade de revisão (a cada dois anos ou diante de alteração significativa nos perfis de risco) previstos no art. 12. Não há afirmações que contrariem o gabarito.

**langchain-padrao:** A avaliação interna tem o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, deve ser considerado, no mínimo, o perfil de risco dos clientes; da instituição (incluindo modelo de negócio e área geográfica de atuação); das operações, transações, produtos e serviços (abrangendo canais de distribuição e novas tecnologias); e das atividades exercidas por funcionários, parceiros e prestadores de serviços terceirizados. Além disso, o risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º

> juiz: **parcial**. A resposta aborda corretamente o objetivo da avaliação interna e os fatores a serem considerados (perfil de clientes, instituição, operações, atividades de funcionários/parceiros/terceirizados) bem como a avaliação de probabilidade e magnitude dos impactos. Porém, omite elementos exigidos pelo gabarito: a necessidade de categorias de risco que permitam controles reforçados ou simplificados (§3º), a documentação e aprovação pelo diretor responsável, o encaminhamento aos comitês de risco e auditoria e ao conselho/diretoria, e a revisão bienal ou diante de alteração significativa nos perfis de risco. Como não há afirmações que contrariem o gabarito, a resposta está parcialmente correta.

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas identificação, qualificação e classificação, omitindo requisitos de compatibilidade com perfil de risco, política PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação (nome completo e CPF/CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco e análise da cadeia societária para pessoa jurídica. Tudo o que afirma está conforme o gabarito, mas deixa de fora parte do que a pergunta pede.

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação, omitindo requisitos como compatibilidade com perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação, qualificação e classificação específicos, e análise da cadeia societária para pessoa jurídica. Não há afirmações contrárias ao gabarito.

**langchain-padrao:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta afirma apenas que os procedimentos devem incluir devida diligência na identificação, qualificação e classificação, o que está conforme o gabarito, mas omite outros elementos exigidos, como compatibilidade com perfil de risco, política de PLD/FT, avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação, qualificação e classificação, e análise da cadeia societária para pessoa jurídica. Portanto, está parcialmente correta.

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo. Esses procedimentos devem ser aplicados inclusive às propostas de operações, devem estar descritos em manual específico aprovado pela diretoria da instituição, e devem contemplar especialmente as operações e os produtos e serviços contratados que apresentem falta de fundamento econômico ou legal, incompatibilidade com a capacidade financeira do cliente (incluindo renda ou faturamento e patrimônio), bem como operações de depósito ou aporte em espécie, saque em espécie ou pedido de provisionamento para saque que apresentem indícios de ocultação ou dissimulação da natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos e valores. — citações: Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 38, § 3º, IV; Circular BCB 3.978/2020, art. 39, I, b; Circular BCB 3.978/2020, art. 39, I, c

> juiz: **parcial**. A resposta menciona a implementação de procedimentos de monitoramento e seleção aplicáveis às propostas de operações e a necessidade de estar descrito em manual aprovado pela diretoria, o que está de acordo com o gabarito. Porém, omite requisitos essenciais como a compatibilidade com a política de PLD/FT, a base na avaliação interna de risco, a consideração de pessoa exposta politicamente e seus relacionados, e o limite de 45 dias para o monitoramento e seleção. Não afirma nada que contradiga o gabarito.

**langchain:** As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo. Devem ser incluídas, especialmente, as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar indícios, tais como operações de depósito ou aporte em espécie, saque em espécie ou pedido de provisionamento para saque que apresentem indícios de ocultação ou dissimulação, bem como operações e produtos e serviços que apresentem incompatibilidade com a capacidade financeira do cliente (incluindo renda ou faturamento e patrimônio). Além disso, esses procedimentos devem ser aplicados inclusive às propostas de operações e devem estar descritos em manual específico aprovado pela diretoria da instituição. — citações: Circular BCB 3.978/2020, art. 39, I, c; Circular BCB 3.978/2020, art. 39, I, b; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 38, § 3º, IV; Circular BCB 3.978/2020, art. 38, caput

> juiz: **parcial**. A resposta menciona a implementação de procedimentos de monitoramento e seleção, a aplicação às propostas de operações e a descrição em manual aprovado pela diretoria, o que está de acordo com o gabarito. Porém, omite requisitos essenciais do gabarito: que os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e que o monitoramento e a seleção não podem ultrapassar 45 dias da data da operação ou situação. Como não há afirmações que contrariem o gabarito, a resposta está parcialmente correta.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 40, § 1º e § 2º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 39, § 1º, § 2º e § 3º (dispositivo não existe no corpus))

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação (Circular BCB 3.978/2020, art. 48, § 2º). — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação deve ser feita até o dia útil seguinte à decisão de comunicação, conforme o art. 48, § 2º da Circular BCB 3.978/2020, o que está exatamente de acordo com o trecho do gabarito que trata desse prazo. Não há afirmação de que o prazo seja de 45 dias ou de que se baseie no art. 49, § 1º, portanto não há contradição com o gabarito nem violação dos itens de 'Não deve afirmar'.

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma exatamente o prazo indicado no gabarito: 'até o dia útil seguinte ao da decisão de comunicação', citando o art. 48, § 2º da Circular 3.978. Não menciona os prazos de 45 dias nem o art. 49, § 1º, portanto não incorre em nenhum dos itens de 'Não deve afirmar'. Tudo o que afirma está compatível com o gabarito e responde diretamente à pergunta.

**langchain-padrao:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação deve ser feita até o dia útil seguinte à decisão de comunicação, o que está exatamente conforme o trecho do gabarito: 'Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º)'. Não menciona prazos de 45 dias nem o art. 49, § 1º, portanto não viola nenhum dos itens de 'Não deve afirmar'. Tudo o que afirma é compatível com o gabarito e responde à pergunta.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** A avaliação da efetividade deve ser documentada em relatório elaborado anualmente, com data-base de 31 de dezembro, o qual deve ser encaminhado para ciência até 31 de março do ano seguinte ao da data-base ao conselho de administração ou, se inexistente, à diretoria da instituição. — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **parcial**. A resposta está correta quanto à periodicidade (anual) e ao prazo (até 31 de março do ano seguinte), mas omite a menção ao comitê de auditoria, que deve receber o relatório quando existir, conforme o gabarito. Assim, a resposta deixa de fora parte do que a pergunta pede, sendo parcial.

**langchain:** A avaliação da efetividade deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **parcial**. A resposta está correta quanto à periodicidade (anual, data-base 31/12) e ao prazo de envio (até 31/03 do ano seguinte). Porém, omite a menção ao comitê de auditoria, que segundo o gabarito também deve receber o relatório quando existir. Como não há afirmação contraditória, apenas falta de parte da informação exigida, o veredito é parcial. Não há itens em "Não deve afirmar" a serem listados.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 62, § 2º, I e II (dispositivo não existe no corpus))

### q21: Para que serve a relação de operações e situações que exemplificam indícios de suspeita de lavagem de dinheiro? Toda operação da relação deve ser comunicada ao Coaf?

**Gabarito:** As operações e situações relacionadas exemplificam indícios de suspeita para fins dos procedimentos de monitoramento e seleção da Circular 3.978 (art. 1º, caput). Não são comunicadas automaticamente: só quando os indícios forem confirmados ao término da análise (§ 1º), que deve considerar todas as informações disponíveis, inclusive as dos procedimentos de conhecer clientes, funcionários, parceiros e terceirizados (§ 2º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q22: Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** O fracionamento de saques ou depósitos em espécie constitui indício de suspeita quando envolve saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie; dois ou mais saques em espécie no caixa no mesmo dia, com indícios de tentativa de burla para evitar a identificação do sacador; ou dois ou mais depósitos em terminais de autoatendimento em espécie, no período de cinco dias úteis, com indícios de tentativa de burla para evitar a identificação do depositante. — citações: Carta Circular BCB 4.001/2020, art. 1º, I, k; Carta Circular BCB 4.001/2020, art. 1º, I, l; Carta Circular BCB 4.001/2020, art. 1º, I, m

> juiz: **parcial**. A resposta menciona apenas os incisos I, k, l e m do art. 1º da Circular BCB 4.001/2020, omitindo os incisos I, d e I, que também tratam de fragmentação de depósitos ou saques em espécie como indício de suspeita. Não há afirmações que contrariem o gabarito, portanto a resposta está parcialmente correta.

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** As operações realizadas e os produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda (no caso de pessoa natural) ou o faturamento (no caso de pessoa jurídica), e o patrimônio. — citações: Circular BCB 3.978/2020, art. 39, I, c

> juiz: **correta**. A resposta descreve o sinal de alerta de movimentação financeira incompatível com a capacidade econômica do cliente, abrangendo renda, faturamento e patrimônio, o que está totalmente compatível com o gabarito. Não há afirmações que contrariem o gabarito e não há itens em "Não deve afirmar" para listar.

**langchain:** As operações realizadas e os produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda (no caso de pessoa natural) ou o faturamento (no caso de pessoa jurídica) e o patrimônio. — citações: Circular BCB 3.978/2020, art. 39, I, c

> juiz: **correta**. A resposta descreve o sinal de alerta de movimentação financeira incompatível com a capacidade econômica do cliente, incluindo renda, faturamento e patrimônio, o que está totalmente compatível com o gabarito. Não há afirmações que contrariem o gabarito nem omissões relevantes para a pergunta.

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, a (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, IV, a (dispositivo não existe no corpus))

### q24: Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, e (dispositivo não existe no corpus))

### q25: Que situações envolvendo procuradores, representantes ou o beneficiário final são indícios de suspeita de lavagem de dinheiro?

**Gabarito:** Abertura, movimentação de contas ou realização de operações por detentor de procuração ou de outro tipo de mandato (art. 1º, III, d); operações em que não seja possível identificar o beneficiário final (III, g); representação de diferentes pessoas jurídicas ou organizações pelos mesmos procuradores ou representantes legais, sem justificativa razoável (III, h); e contas em nome de menores ou incapazes cujos representantes realizem grande número de operações ou operações de valores relevantes (IV, t).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (citação não confere: Carta Circular BCB 4.001/2020, h (dispositivo não existe no corpus); Carta Circular BCB 4.001/2020, g (dispositivo não existe no corpus))

### q26: Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**manual:** Estão obrigadas a compartilhar dados e informações sobre indícios de fraudes as instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil, ficando excluídas dessa obrigação as administradoras de consórcio. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e a excluída (administradoras de consórcio), conforme o gabarito. Não há afirmações que contrariem o gabarito nem omissões relevantes.

**langchain:** Estão obrigadas a compartilhar dados e informações sobre indícios de fraudes as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o art. 1º, caput. As administradoras de consórcio estão excluídas dessa obrigação, de acordo com o art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito: menciona as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e a exclusão das administradoras de consórcio, citando os mesmos artigos. Não há afirmações que contrariem o gabarito nem omissões relevantes.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades, bem como a consulta dos dados e das informações registrados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **parcial**. A resposta menciona o registro (I) e a consulta (III) dos dados, mas omite a alteração e exclusão (II), que faz parte do gabarito. Não há afirmações que contrariem o gabarito.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I) e a consulta dos dados e das informações registrados de que trata o referido registro (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **parcial**. A resposta menciona apenas o registro (I) e a consulta (III) dos dados, omitindo a alteração e exclusão (II) exigida pelo gabarito. Não há afirmações que contrariem o gabarito.

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I, II e III (dispositivo não existe no corpus))

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **parcial**. A resposta menciona os itens I, II e IV do gabarito, mas omite o item III (identificação da instituição responsável pelo registro). Não há afirmações que contrariem o gabarito.

**langchain:** O registro dos dados e das informações sobre indícios de ocorrência ou de tentativa de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **parcial**. parcial

**langchain-padrao:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; a identificação da instituição responsável pelo registro dos dados e das informações; e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito (I, II, III, IV), sem acrescentar informações que o contradigam ou omitir algum deles. As citações são apenas referências e não alteram o conteúdo.

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** As instituições devem obter do cliente com quem possuam relacionamento o consentimento prévio e geral, possibilitando o registro dos dados e das informações que digam respeito ao referido cliente. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º

> juiz: **parcial**. A resposta menciona apenas o consentimento prévio e geral do cliente com quem a instituição tem relacionamento, omitindo os demais requisitos: a finalidade de tratamento e compartilhamento de dados sobre indícios de fraude, a necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido, e a disponibilização da documentação ao Banco Central. Tudo o que afirma está de acordo com o gabarito, mas não abrange todo o que a pergunta pede.

**langchain:** As instituições devem obter do cliente com quem possuam relacionamento o consentimento prévio e geral, possibilitando o registro dos dados e das informações que digam respeito ao referido cliente. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º

> juiz: **parcial**. A resposta menciona apenas o consentimento prévio e geral do cliente com quem a instituição tenha relacionamento, que está de acordo com o § 3º do gabarito. Porém, omite os demais requisitos exigidos: a finalidade de tratamento e compartilhamento de dados sobre indícios de fraude (§ 4º, I), a necessidade de constar em contrato, mediante cláusula em destaque ou outro instrumento jurídico válido (§ 4º, II) e a disponibilização dessa documentação ao Banco Central (§ 5º). Como não há afirmações que contrariem o gabarito, a resposta está parcialmente correta.

**langchain-padrao:** O consentimento do cliente deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta e deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º

> juiz: **parcial**. A resposta menciona a finalidade, a constância em contrato com cláusula em destaque ou outro instrumento jurídico válido, o que está de acordo com o gabarito. Porém, omite requisitos como o consentimento ser prévio e geral, ser com quem a instituição tenha relacionamento e a disponibilização da documentação ao Banco Central. Não há afirmações que contrariem o gabarito.

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados e a documentação com os critérios e procedimentos relacionados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados e informações compartilhados e a documentação com critérios e procedimentos (art. 8º, II), omitindo os prazos de cinco anos para os dados relacionados aos mecanismos de acompanhamento e controle (art. 8º, III) e a documentação sobre o sistema eletrônico sem prazo fixado (art. 8º, I). Tudo o que afirma está de acordo com o gabarito, mas não abrange toda a pergunta.

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados e a documentação com os critérios e procedimentos relacionados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta afirma corretamente que os dados e informações compartilhados e a documentação com critérios e procedimentos devem ficar à disposição por dez anos, conforme o art. 8º, II do gabarito. Porém, omite o prazo de cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e controle (art. 8º, III) e a documentação sobre o sistema eletrônico sem prazo fixado (art. 8º, I). Como não há afirmações que contrariem o gabarito, a resposta está parcialmente correta.

**langchain-padrao:** As instituições devem manter à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, bem como a documentação com os critérios e procedimentos referidos na norma. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta afirma corretamente que os dados e informações compartilhados, bem como a documentação com os critérios e procedimentos, devem ser mantidos por dez anos, conforme o art. 8º, II do gabarito. Porém, omite a menção ao prazo de cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle (art. 8º, III) e à documentação sobre o sistema eletrônico, que fica à disposição sem prazo fixado (art. 8º, I). Como não há afirmações que contrariem o gabarito, a resposta está parcialmente correta.

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
