# Avaliação: base

Gerado por `npm run avaliar`. Não editar à mão.

- Registros: 108, de 2026-10-08T12:55:03.508Z a 2026-10-08T13:11:13.259Z
- k = 5 trechos ao modelo; busca registrada até a posição 20; limiar: desligado
- Embeddings: Xenova/multilingual-e5-small; LLM: gemini-3.5-flash-lite, sem fallback
- Conteúdo das respostas julgado por openrouter/nvidia/nemotron-3-super-120b-a12b:free, versão ba1252a1 das instruções (`npm run julgar`), comparando com o gabarito

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
| manual | 17 | 10 | 7 | 0 | 11/30 (37%) | 0 |
| langchain | 18 | 12 | 6 | 0 | 13/30 (43%) | 0 |
| langchain-padrao | 15 | 10 | 5 | 0 | 12/30 (40%) | 0 |

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
| q12 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 1 · respondeu 1/1, correta |
| q13 | coberta | 2 · recusou (modelo: não cobre) | 2 · recusou (modelo: não cobre) | 5 · respondeu 1/2, correta |
| q14 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 3 · respondeu 1/1, correta |
| q15 | coberta | 6 · recusou (modelo: não cobre) | 6 · recusou (modelo: não cobre) | 11 · recusou (modelo: não cobre) |
| q16 | coberta | 1 · respondeu 6/6, parcial | 1 · respondeu 6/6, parcial | 1 · respondeu 3/3, parcial |
| q17 | coberta | 3 · respondeu 1/1, parcial | 3 · respondeu 1/1, parcial | 1 · respondeu 1/1, parcial |
| q18 | coberta | 12 · respondeu 2/4, parcial | 12 · respondeu 3/5, correta | 3 · recusou (citação não confere) |
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
| q30 | coberta | 2 · respondeu 1/1, correta | 2 · respondeu 1/1, correta | 5 · respondeu 1/1, parcial |
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

> juiz: **correta**. A resposta descreve exatamente a conduta de ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes de infração penal e indica a pena de reclusão de 3 a 10 anos e multa, coincidindo integralmente com o gabarito. Não há omissão nem contradição.

**langchain:** O crime de lavagem de dinheiro consiste em ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta descreve exatamente a conduta de lavagem de dinheiro e a pena prevista, conforme o gabarito, sem omissões ou contradições.

**langchain-padrao:** Ocultar ou dissimular a natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos ou valores provenientes, direta ou indiretamente, de infração penal. A pena prevista é de reclusão, de 3 (três) a 10 (dez) anos, e multa. — citações: Lei 9.613/1998, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente a conduta e a pena prevista no gabarito, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem falta.

### q02: Quais deveres de identificação de clientes, registro e comunicação têm as pessoas sujeitas ao mecanismo de controle da lavagem de dinheiro?

**Gabarito:** Identificar os clientes e manter cadastro atualizado (art. 10, I); manter registro das transações que ultrapassarem o limite fixado pela autoridade competente (art. 10, II); adotar políticas, procedimentos e controles internos compatíveis com o porte e o volume de operações (art. 10, III); cadastrar-se no órgão regulador ou fiscalizador ou, na falta dele, no Coaf (art. 10, IV); atender às requisições do Coaf (art. 10, V); dispensar especial atenção às operações que possam constituir sérios indícios de lavagem (art. 11, I); comunicar ao Coaf, em 24 horas e sem dar ciência a ninguém, as transações acima do limite e as operações suspeitas (art. 11, II); e comunicar a não ocorrência de operações comunicáveis (art. 11, III).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q03: A quem devem ser comunicadas as operações que apresentem indícios de lavagem de dinheiro?

**Gabarito:** Ao Conselho de Controle de Atividades Financeiras (Coaf), no prazo de 24 horas, sem dar ciência do ato a qualquer pessoa, inclusive àquela a quem a informação se refere (Lei 9.613, art. 11, II). Para as instituições autorizadas pelo Banco Central, a Circular 3.978 repete o dever de comunicar ao Coaf (art. 48).

**manual:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica que as operações suspeitas devem ser comunicadas ao Coaf, o que atende exatamente ao que a pergunta pergunta (a quem devem ser comunicadas). Não há contradição com o gabarito, nem omissão de algo que a pergunta pede.

**langchain:** As operações ou situações suspeitas de lavagem de dinheiro e de financiamento do terrorismo devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf, atendendo ao que a pergunta pede. Não há contradição com o gabarito; a inclusão de financiamento do terrorismo é informação adicional que não contradiz. Não há itens de 'Não deve afirmar' a listar.

**langchain-padrao:** As operações ou situações suspeitas de lavagem de dinheiro devem ser comunicadas ao Coaf. — citações: Circular BCB 3.978/2020, art. 48, caput

> juiz: **correta**. A resposta indica corretamente que as operações suspeitas devem ser comunicadas ao Coaf, atendendo exatamente ao que a pergunta pede. Não há contradição com o gabarito e não há itens de 'Não deve afirmar' a serem listados.

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

> juiz: **correta**. correta

**langchain:** O crime consiste em gerir fraudulentamente instituição financeira, tendo como pena reclusão de 3 (três) a 12 (doze) anos, e multa. — citações: Lei 7.492/1986, art. 4º, caput

> juiz: **correta**. A resposta afirma que o crime consiste em gerir fraudulentamente instituição financeira e indica a pena de reclusão de 3 a 12 anos e multa, o que está em conformidade com o gabarito, que afirma que a lei apenas tipifica essa conduta e estabelece essa pena, sem definir gestão fraudulenta. Não há afirmação que contradiga o gabarito nem apresentação de uma definição proibida (item 1 de 'Não deve afirmar'). Portanto, a resposta está correta.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q08: Qual é a diferença entre gestão temerária e gestão fraudulenta de instituição financeira?

**Gabarito:** A lei não define nenhuma das duas. Diferencia apenas a pena: gestão fraudulenta, reclusão de 3 a 12 anos e multa; gestão temerária, reclusão de 2 a 8 anos e multa. Recusar também é aceito: a lei não define nenhuma das duas, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q09: É crime fazer operar uma instituição financeira sem autorização? Qual é a pena?

**Gabarito:** Sim. É crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. Pena: reclusão de 1 a 4 anos e multa.

**manual:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente confirma que é crime operar instituição financeira sem autorização ou com autorização falsa, incluindo instituições de distribuição de valores mobiliários ou de câmbio, e indica a pena de reclusão de 1 a 4 anos e multa, exatamente como o gabarito. Não há contradição nem omissão do que a pergunta pede.

**langchain:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime e indicando a pena de reclusão de 1 a 4 anos e multa, sem acrescentar ou omitir informações relevantes à pergunta.

**langchain-padrao:** Sim, é crime fazer operar, sem a devida autorização, ou com autorização obtida mediante declaração falsa, instituição financeira, inclusive de distribuição de valores mobiliários ou de câmbio. A pena é de reclusão, de 1 (um) a 4 (quatro) anos, e multa. — citações: Lei 7.492/1986, art. 16, caput

> juiz: **correta**. A resposta do assistente reproduz exatamente o conteúdo do gabarito, confirmando que é crime e indicando a pena de reclusão de 1 a 4 anos e multa, sem acrescentar ou omitir informações relevantes à pergunta. Não há contradição nem omissão do que a pergunta pede.

### q10: É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** Constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente em relação a operação ou situação financeira, mediante a sonegação de informação ou a prestação falsa. — citações: Lei 7.492/1986, art. 6º, caput

> juiz: **correta**. A resposta afirma que constitui crime induzir ou manter em erro sócio, investidor ou repartição pública competente em relação a operação ou situação financeira, mediante sonegação ou prestação falsa de informação, o que está de acordo com o gabarito. A pergunta apenas questiona se é crime, não exigindo a menção da pena; portanto, a ausência da pena não torna a resposta parcial. Não há contradição com o gabarito.

**langchain-padrao:** Constitui crime fraudar a fiscalização ou o investidor inserindo ou fazendo inserir em documento comprobatório de investimento em títulos ou valores mobiliários declaração falsa ou diversa da que dele deveria constar (Lei 7.492/1986, art. 9º), bem como fazer inserir elemento falso ou omitir elemento exigido pela legislação em demonstrativos contábeis de instituição financeira, seguradora ou instituição integrante do sistema de distribuição de títulos de valores mobiliários (Lei 7.492/1986, art. 10). — citações: Lei 7.492/1986, art. 9º, caput; Lei 7.492/1986, art. 10, caput

> juiz: **correta**. A resposta afirma que é crime omitir ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição, o que corresponde exatamente ao que a pergunta pergunta. Não há contradição com o gabarito e não há omissão de algo que a pergunta pede.

### q11: Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**manual:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, abordando o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, o que inclui a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, bem como a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. A resposta reproduz exatamente o conteúdo do gabarito, abordando o cumprimento das sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluindo a indisponibilidade de ativos e a designação nacional de pessoas investigadas ou acusadas de terrorismo, seu financiamento ou atos correlacionados. Não há contradição nem omissão de elementos exigidos pela pergunta.

**langchain-padrao:** A Lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados. — citações: Lei 13.810/2019, art. 1º, caput

> juiz: **correta**. correta

### q12: O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Significa realizar a ação imediatamente ou dentro de algumas horas. — citações: Lei 13.810/2019, art. 2º, V

> juiz: **correta**. A resposta afirma que cumprir 'sem demora' significa realizar a ação imediatamente ou dentro de algumas horas, o que corresponde exatamente à definição fornecida no gabarito ('Sem demora' é imediatamente ou dentro de algumas horas). Não há contradição com o gabarito, e a resposta não omite nenhum elemento que a pergunta exija, pois a pergunta apenas pede o significado de 'sem demora' no contexto da indisponibilidade de ativos. Portanto, a resposta está correta.

### q13: Que tipos de bens e recursos podem ser alcançados pela indisponibilidade de ativos decorrente de sanção do Conselho de Segurança da ONU?

**Gabarito:** Ativos são bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não (art. 2º, I), de titularidade direta ou indireta das pessoas físicas, jurídicas ou entidades sancionadas (art. 9º).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** Para fins da lei, consideram-se ativos os bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não, que podem ser alcançados pela indisponibilidade decorrente de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas ou designações de seus comitês de sanções. — citações: Lei 13.810/2019, art. 2º, I; Lei 13.810/2019, art. 3º, I

> juiz: **correta**. A resposta lista os tipos de bens e recursos (bens, direitos, valores, fundos, recursos ou serviços, de qualquer natureza, financeiros ou não) que podem ser alcançados pela indisponibilidade de ativos decorrente de sanções do Conselho de Segurança da ONU, o que corresponde exatamente ao que a pergunta pede. Não há contradição com o gabarito e não há omissão de algo que a pergunta solicite.

### q14: Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**manual:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Isso atende exatamente ao que a pergunta pede, sem acrescentar informações que contradigam o gabarito. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta exija.

**langchain:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta indica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas referidas no art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Isso corresponde exatamente ao que o gabarito afirma como sujeito obrigado. Não há afirmações que contrariem o gabarito, nem omissão de algo que a pergunta peça (a pergunta apenas pergunta quem deve cumprir). Não há itens em 'Não deve afirmar' para listar.

**langchain-padrao:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos. — citações: Lei 13.810/2019, art. 9º, caput

> juiz: **correta**. A resposta identifica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados. Não há contradição com o gabarito e não há omissão de algo que a pergunta pede.

### q15: A indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU precisa de decisão judicial no Brasil para ser cumprida?

**Gabarito:** Não. As resoluções sancionatórias do CSNU e as designações de seus comitês têm executoriedade imediata no Brasil (art. 6º) e devem ser cumpridas sem demora pelas pessoas obrigadas (art. 9º). Só quando não houver cumprimento por essa via a União ingressa, sem demora, com auxílio direto judicial (arts. 12 e 13).

**manual:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q16: O que é e como deve ser feita a avaliação interna de risco de lavagem de dinheiro e financiamento do terrorismo?

**Gabarito:** Avaliação para identificar e mensurar o risco de utilização dos produtos e serviços da instituição na lavagem de dinheiro e no financiamento do terrorismo (art. 10). Deve considerar, no mínimo, os perfis de risco dos clientes; da instituição (modelo de negócio e área geográfica); das operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias; e das atividades de funcionários, parceiros e terceirizados (§ 1º). O risco é avaliado pela probabilidade de ocorrência e pela magnitude dos impactos financeiro, jurídico, reputacional e socioambiental (§ 2º), com categorias de risco que permitam controles reforçados nas situações de maior risco e simplificados nas de menor (§ 3º). Deve ser documentada e aprovada pelo diretor responsável, encaminhada, para ciência, aos comitês de risco e de auditoria, quando houver, e ao conselho de administração ou à diretoria, e revisada a cada dois anos ou quando houver alteração significativa nos perfis de risco (art. 12).

**manual:** As instituições devem realizar avaliação interna com o objetivo de identificar e mensurar o risco de utilização de seus produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação desse risco, a avaliação interna deve considerar, no mínimo, os perfis de risco dos clientes, da instituição (incluindo o modelo de negócio e a área geográfica de atuação), e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, I, II e IV). Além disso, o risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º), e devem ser utilizadas como subsídio, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao tema (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta aborda o objetivo da avaliação interna e menciona alguns dos fatores a serem considerados (perfis de risco dos clientes, da instituição e das atividades de funcionários, parceiros e terceirizados), mas omite a exigência de considerar também as operações, transações, produtos e serviços, com todos os canais de distribuição e novas tecnologias, que está prevista no gabarito como item mínimo obrigatório. Essa omissão caracteriza uma resposta parcial, pois não contradiz o gabarito, mas deixa de atender ao que a pergunta pede. Não há afirmações que contrariem o gabarito, e não há itens na lista 'Não deve afirmar' para serem listados.

**langchain:** A avaliação interna de risco é realizada com o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo (Circular BCB 3.978/2020, art. 10). Para a identificação do risco, a avaliação interna deve considerar, no mínimo, os perfis de risco dos clientes, da instituição (incluindo o modelo de negócio e a área geográfica de atuação), dos produtos e serviços, e das atividades exercidas pelos funcionários, parceiros e prestadores de serviços terceirizados (Circular BCB 3.978/2020, art. 10, § 1º, I, II e IV). O risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição (Circular BCB 3.978/2020, art. 10, § 2º). Além disso, devem ser utilizadas como subsídio à avaliação interna, quando disponíveis, avaliações realizadas por entidades públicas do País relativas ao risco de lavagem de dinheiro e de financiamento do terrorismo (Circular BCB 3.978/2020, art. 10, § 4º). — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º, I; Circular BCB 3.978/2020, art. 10, § 1º, II; Circular BCB 3.978/2020, art. 10, § 1º, IV; Circular BCB 3.978/2020, art. 10, § 2º; Circular BCB 3.978/2020, art. 10, § 4º

> juiz: **parcial**. A resposta descreve corretamente o objetivo da avaliação interna de risco e menciona alguns dos elementos que devem ser considerados (perfis de risco dos clientes, da instituição, dos produtos e serviços e das atividades de funcionários, parceiros e terceirizados) bem como a avaliação por probabilidade e magnitude dos impactos. Porém, omite requisitos que o gabarito estabelece como parte de 'como deve ser feita': a inclusão de operações, transações, canais de distribuição e novas tecnologias; a definição de categorias de risco para controles reforçados ou simplificados; a necessidade de documentação, aprovação pelo diretor responsável, encaminhamento aos comitês de risco e auditoria e ao conselho ou diretoria; e a periodicidade de revisão a cada dois anos ou diante de alteração significativa nos perfis de risco. Como não há afirmações que contrariem o gabarito, apenas faltam informações que a pergunta pede, a resposta é parcial.

**langchain-padrao:** A avaliação interna tem o objetivo de identificar e mensurar o risco de utilização de produtos e serviços na prática da lavagem de dinheiro e do financiamento do terrorismo. Para a identificação do risco, deve ser considerado, no mínimo, o perfil de risco dos clientes; da instituição (incluindo modelo de negócio e área geográfica de atuação); das operações, transações, produtos e serviços (abrangendo canais de distribuição e novas tecnologias); e das atividades exercidas por funcionários, parceiros e prestadores de serviços terceirizados. Além disso, o risco identificado deve ser avaliado quanto à sua probabilidade de ocorrência e à magnitude dos impactos financeiro, jurídico, reputacional e socioambiental para a instituição. — citações: Circular BCB 3.978/2020, art. 10, caput; Circular BCB 3.978/2020, art. 10, § 1º; Circular BCB 3.978/2020, art. 10, § 2º

> juiz: **parcial**. parcial

### q17: O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**manual:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação dos clientes, omitindo outros requisitos exigidos pelo gabarito, como compatibilidade com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes da identificação (nome completo e CPF ou firma e CNPJ), da qualificação (local de residência/sede e capacidade financeira), da classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, a análise da cadeia de participação societária até o beneficiário final. Não há contradição com o gabarito, apenas falta de informações que a pergunta pede.

**langchain:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação dos clientes, omitindo outros requisitos exigidos pelo gabarito, como compatibilidade com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes da identificação (nome completo e CPF ou firma e CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final. Não há contradição com o gabarito, portanto a resposta está parcial.

**langchain-padrao:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação. — citações: Circular BCB 3.978/2020, art. 13, caput

> juiz: **parcial**. A resposta menciona apenas a devida diligência na identificação, qualificação e classificação dos clientes, omitindo outros requisitos exigidos pelo gabarito, como compatibilidade com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalização em manual aprovado pela diretoria, bem como os detalhes específicos de identificação, qualificação e classificação (nome completo e CPF ou firma e CNPJ; local de residência ou sede e capacidade financeira; classificação nas categorias de risco; análise da cadeia de participação societária até o beneficiário final para pessoa jurídica). Não há contradição com o gabarito, apenas falta de informações que a pergunta pede contemplar.

### q18: Como a instituição deve conduzir o monitoramento de operações para detectar suspeitas de lavagem de dinheiro?

**Gabarito:** A instituição deve implementar procedimentos de monitoramento, seleção e análise de operações e situações para identificar e dispensar especial atenção às suspeitas de lavagem e de financiamento do terrorismo (art. 38), aplicados inclusive às propostas de operações (§ 2º). Os procedimentos devem ser compatíveis com a política de PLD/FT, definidos com base na avaliação interna de risco, considerar a condição de pessoa exposta politicamente e de seu representante, familiar ou estreito colaborador, e estar descritos em manual aprovado pela diretoria (§ 3º). O monitoramento e a seleção não podem passar de 45 dias da data da operação ou situação (art. 39, parágrafo único).

**manual:** As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo. Esses procedimentos devem ser aplicados inclusive às propostas de operações, devem estar descritos em manual específico aprovado pela diretoria da instituição, e devem contemplar especialmente as operações e os produtos e serviços contratados que apresentem falta de fundamento econômico ou legal, incompatibilidade com a capacidade financeira do cliente (incluindo renda ou faturamento e patrimônio), bem como operações de depósito ou aporte em espécie, saque em espécie ou pedido de provisionamento para saque que apresentem indícios de ocultação ou dissimulação da natureza, origem, localização, disposição, movimentação ou propriedade de bens, direitos e valores. — citações: Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 38, § 3º, IV; Circular BCB 3.978/2020, art. 39, I, b; Circular BCB 3.978/2020, art. 39, I, c

> juiz: **parcial**. A resposta menciona a implementação de procedimentos de monitoramento e seleção aplicáveis às propostas de operações e a descrição em manual aprovado pela diretoria, mas omite requisitos essenciais do gabarito: compatibilidade com a política de PLD/FT, base na avaliação interna de risco, consideração de pessoa exposta politicamente e seus relacionados, e o limite de 45 dias para o monitoramento e seleção. Não há contradição com o gabarito, apenas faltas de informações que a pergunta pede, portanto a classificação é parcial.

**langchain:** As instituições devem implementar procedimentos de monitoramento e seleção que permitam identificar operações e situações que possam indicar suspeitas de lavagem de dinheiro e de financiamento do terrorismo. Devem ser incluídas, especialmente, as operações realizadas e os produtos e serviços contratados que, considerando as partes envolvidas, os valores, as formas de realização, os instrumentos utilizados ou a falta de fundamento econômico ou legal, possam configurar indícios, tais como operações de depósito ou aporte em espécie, saque em espécie ou pedido de provisionamento para saque que apresentem indícios de ocultação ou dissimulação, bem como operações e produtos e serviços que apresentem incompatibilidade com a capacidade financeira do cliente (incluindo renda ou faturamento e patrimônio). Além disso, esses procedimentos devem ser aplicados inclusive às propostas de operações e devem estar descritos em manual específico aprovado pela diretoria da instituição. — citações: Circular BCB 3.978/2020, art. 39, I, c; Circular BCB 3.978/2020, art. 39, I, b; Circular BCB 3.978/2020, art. 38, § 2º; Circular BCB 3.978/2020, art. 38, § 3º, IV; Circular BCB 3.978/2020, art. 38, caput

> juiz: **correta**. A resposta descreve como a instituição deve implementar procedimentos de monitoramento e seleção para identificar suspeitas de lavagem de dinheiro e financiamento do terrorismo, incluindo a aplicação às propostas de operações e a descrição em manual aprovado pela diretoria, o que está de acordo com o gabarito. Não há afirmações que contrariem o gabarito, e os elementos ausentes (avaliação interna de risco, condição de PEP, limite de 45 dias) não são exigidos pela pergunta, portanto a resposta está correta.

**langchain-padrao:** recusou (citação não confere: Circular BCB 3.978/2020, art. 40, § 1º e § 2º (dispositivo não existe no corpus); Circular BCB 3.978/2020, art. 39, § 1º, § 2º e § 3º (dispositivo não existe no corpus))

### q19: Qual é o prazo para comunicar ao Coaf uma operação suspeita de lavagem de dinheiro?

**Gabarito:** Até o dia útil seguinte ao da decisão de comunicação (Circular 3.978, art. 48, § 2º). A decisão deve ocorrer até o fim do prazo de análise (art. 48, § 1º, III), que é de até 45 dias contados da seleção da operação (art. 43, § 1º); a seleção, por sua vez, deve ocorrer em até 45 dias da operação (art. 39, parágrafo único). A Lei 9.613 fala em comunicar no prazo de 24 horas (art. 11, II).

**manual:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação (Circular BCB 3.978/2020, art. 48, § 2º). — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta traz exatamente o prazo indicado no gabarito: comunicação até o dia útil seguinte à decisão de comunicação, conforme a Circular BCB 3.978/2020, art. 48, § 2º. Não afirma nenhum dos itens proibidos (não menciona prazo de 45 dias nem o art. 49, § 1º).

**langchain:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta afirma que a comunicação deve ser feita até o dia útil seguinte à decisão de comunicação, o que está de acordo com o gabarito. Não há contradição nem omissão do que a pergunta pede, e não afirma nenhum dos itens proibidos.

**langchain-padrao:** A comunicação da operação ou situação suspeita ao Coaf deve ser realizada até o dia útil seguinte ao da decisão de comunicação. — citações: Circular BCB 3.978/2020, art. 48, § 2º

> juiz: **correta**. A resposta indica que a comunicação ao Coaf deve ser feita até o dia útil seguinte à decisão de comunicação, o que está exatamente conforme o gabarito. Não há contradição nem omissão do que a pergunta pede, e não afirma nenhum dos itens proibidos.

### q20: Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**manual:** A avaliação da efetividade deve ser documentada em relatório elaborado anualmente, com data-base de 31 de dezembro, o qual deve ser encaminhado para ciência até 31 de março do ano seguinte ao da data-base ao conselho de administração ou, se inexistente, à diretoria da instituição. — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **parcial**. A resposta está correta quanto à periodicidade (anual, data-base 31/12, envio até 31/03 do ano seguinte) e quanto ao envio ao conselho de administração ou diretoria, mas omite o envio ao comitê de auditoria, quando houver, que também é exigido pelo gabarito. Como a pergunta pede a quem o relatório deve ser enviado, a omissão de um dos destinatários caracteriza resposta parcial. Não há afirmações que contradigam o gabarito.

**langchain:** A avaliação da efetividade deve ser documentada em relatório específico elaborado anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 1º e art. 62, § 2º, I). O relatório deve ser encaminhado, para ciência, até 31 de março do ano seguinte ao da data-base ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, b). — citações: Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, b

> juiz: **parcial**. A resposta menciona a periodicidade anual e a data-base de 31 de dezembro, corretos. Quanto ao destinatário, menciona apenas o conselho de administração ou diretoria, omitindo o comitê de auditoria quando existente, o que a pergunta pede. Não há afirmações que contradigam o gabarito, apenas omissão.

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

> juiz: **parcial**. parcial

### q23: Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**manual:** As operações realizadas e os produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda (no caso de pessoa natural) ou o faturamento (no caso de pessoa jurídica), e o patrimônio. — citações: Circular BCB 3.978/2020, art. 39, I, c

> juiz: **correta**. A resposta descreve o sinal de alerta de movimentação financeira incompatível com a capacidade econômica do cliente, abrangendo renda, faturamento e patrimônio, conforme indicado no gabarito. Não há contradição nem omissão de algo que a pergunta peça.

**langchain:** As operações realizadas e os produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda (no caso de pessoa natural) ou o faturamento (no caso de pessoa jurídica) e o patrimônio. — citações: Circular BCB 3.978/2020, art. 39, I, c

> juiz: **correta**. A resposta descreve o sinal de alerta de movimentação financeira incompatível com a capacidade econômica do cliente, abrangendo renda, faturamento e patrimônio, o que está em conformidade com o gabarito. Não há contradições nem omissões relevantes.

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

> juiz: **correta**. A resposta menciona exatamente as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e a excluída (administradoras de consórcio), conforme o gabarito, sem acrescentar ou omitir informações relevantes à pergunta.

**langchain:** Estão obrigadas a compartilhar dados e informações sobre indícios de fraudes as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o art. 1º, caput. As administradoras de consórcio estão excluídas dessa obrigação, de acordo com o art. 1º, § 1º. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 1º, caput; Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

> juiz: **correta**. A resposta lista exatamente as instituições obrigadas (instituições financeiras, instituições de pagamento e demais instituições autorizadas a funcionar pelo Banco Central do Brasil) e indica a excluída (administradoras de consórcio), conforme o gabarito. Não há contradição nem omissão.

**langchain-padrao:** recusou (o modelo indicou que os trechos recuperados não cobrem a pergunta)

### q27: Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**manual:** O sistema eletrônico deve contemplar, no mínimo, o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades, bem como a consulta dos dados e das informações registrados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **parcial**. A resposta menciona o registro (I) e a consulta (III) dos dados, mas omite a alteração e exclusão (II), que também é requerida como funcionalidade mínima. Não há afirmação que contradiga o gabarito, portanto o veredito é parcial. Como não há itens na lista 'Não deve afirmar', nada é listado.

**langchain:** O sistema eletrônico deve contemplar, no mínimo, o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I) e a consulta dos dados e das informações registrados de que trata o referido registro (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

> juiz: **parcial**. parcial

**langchain-padrao:** recusou (citação não confere: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I, II e III (dispositivo não existe no corpus))

### q28: Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**manual:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **parcial**. A resposta inclui os itens I, II e IV do gabarito, mas omite o item III (identificação da instituição responsável pelo registro). Não há afirmações que contrariem o gabarito, portanto a resposta está parcial.

**langchain:** O registro dos dados e das informações sobre indícios de ocorrência ou de tentativa de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV). — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **parcial**. A resposta inclui os itens I, II e IV do gabarito, mas omite o item III (identificação da instituição responsável pelo registro), que é solicitado pela pergunta. Não há afirmações que contradigam o gabarito.

**langchain-padrao:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável; a descrição dos indícios da ocorrência ou da tentativa de fraude; a identificação da instituição responsável pelo registro dos dados e das informações; e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

> juiz: **correta**. A resposta contém exatamente os quatro itens exigidos pelo gabarito: identificação do suposto autor, descrição dos indícios, identificação da instituição responsável e, quando aplicável, dados da conta destinatária e seu titular. Não há afirmações que contrariem o gabarito nem omissões de informações solicitadas.

### q29: Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**manual:** As instituições devem obter do cliente com quem possuam relacionamento o consentimento prévio e geral, possibilitando o registro dos dados e das informações que digam respeito ao referido cliente. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º

> juiz: **parcial**. A resposta menciona apenas que o consentimento deve ser prévio e geral, omitindo outros requisitos exigidos pelo gabarito: a finalidade de tratamento e compartilhamento de dados sobre indícios de fraude, a necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido, e a disponibilização dessa documentação ao Banco Central. Como faltam requisitos que a pergunta pede, a resposta é parcial. Não há afirmações que contrariem o gabarito.

**langchain:** As instituições devem obter do cliente com quem possuam relacionamento o consentimento prévio e geral, possibilitando o registro dos dados e das informações que digam respeito ao referido cliente. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 3º

> juiz: **parcial**. A resposta menciona apenas que o consentimento deve ser prévio e geral e do cliente com quem a instituição possui relacionamento. Não traz os demais requisitos exigidos pelo gabarito: finalidade de tratamento e compartilhamento de dados sobre indícios de fraude, necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido, e a disposição da documentação ao Banco Central. Como não há contradição ao gabarito, mas faltam elementos que a pergunta pede, a resposta é parcial. Não há itens na lista 'Não deve afirmar' para serem listados.

**langchain-padrao:** O consentimento do cliente deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta e deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º

> juiz: **parcial**. A resposta menciona a finalidade, a forma de constar em contrato com cláusula em destaque ou outro instrumento, mas omite os requisitos de que o consentimento deve ser prévio e geral, que deve ser dado pelo cliente com quem a instituição tenha relacionamento e que a documentação deve ficar à disposição do Banco Central. Como não há afirmações que contradigam o gabarito, apenas faltam elementos que a pergunta pede, a resposta é parcial.

### q30: Por quanto tempo as instituições devem manter à disposição do Banco Central os dados sobre indícios de fraude compartilhados e a documentação relacionada?

**Gabarito:** Dez anos para os dados e informações compartilhados e para a documentação com os critérios e procedimentos de identificação do art. 2º, § 8º (art. 8º, II); cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle do art. 7º, contados de cada aplicação (art. 8º, III). A documentação sobre o sistema eletrônico também fica à disposição, sem prazo fixado (art. 8º, I).

**manual:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados e a documentação com os critérios e procedimentos relacionados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. A resposta indica que os dados e informações compartilhados, bem como a documentação com os critérios e procedimentos relacionados, devem ficar à disposição do Banco Central por dez anos, o que está de acordo com o item II do art. 8º da Resolução Conjunta CMN/BCB 6/2023 mencionado no gabarito. Não há contradição com o gabarito e a resposta abrange exatamente o que a pergunta pede.

**langchain:** As instituições devem deixar à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados e a documentação com os critérios e procedimentos relacionados. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **correta**. correta

**langchain-padrao:** As instituições devem manter à disposição do Banco Central do Brasil, por dez anos, os dados e as informações compartilhados, bem como a documentação com os critérios e procedimentos referidos na norma. — citações: Resolução Conjunta CMN/BCB 6/2023, art. 8º, II

> juiz: **parcial**. A resposta menciona apenas o prazo de dez anos para os dados e informações compartilhados e a documentação com os critérios e procedimentos (art. 8º, II), omitindo o prazo de cinco anos para os dados, registros e informações relativos à aplicação dos mecanismos de acompanhamento e de controle (art. 8º, III). Como a pergunta pede o prazo para os dados sobre indícios de fraude compartilhados e a documentação relacionada, faltando um dos prazos exigidos, a resposta é parcial. Não há afirmações que contrariem o gabarito.

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
