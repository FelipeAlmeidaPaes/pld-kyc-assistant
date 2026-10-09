# Auditoria do juiz: cobertura-k5

Gerado por `npm run julgar`. Para cada item, diga no chat se concorda com o veredito (ex.: "A3 discordo, é parcial").
Amostra de 20 dos 73 julgamentos: metade não "correta", metade "correta", sorteio fixo.

## A1 · q07 · langchain-padrao · juiz: parcial

**Pergunta:** O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**Não deve afirmar:**
1. apresentar como texto da norma uma definição de gestão fraudulenta (engano, artifício, ardil, fraude contra sócios, investidores ou fiscalização)

**Resposta do assistente:** Os trechos estabelecem que gerir fraudulentamente instituição financeira tem a pena de reclusão, de 3 (três) a 12 (doze) anos, e multa.

**Citações da resposta:** Lei 7.492/1986, art. 4º, caput

**Justificativa do juiz:** A resposta apenas menciona a pena (reclusão de 3 a 12 anos e multa) e omite a caracterização do crime, que segundo o gabarito consiste apenas na tipificação da conduta 'gerir fraudulentamente instituição financeira', sem definição de gestão fraudulenta. Não há contradição com o gabarito, apenas falta de informação solicitada.

## A2 · q22 · langchain · juiz: parcial

**Pergunta:** Quando o fracionamento de depósitos ou saques em espécie é indício de suspeita de lavagem de dinheiro?

**Gabarito:** A fragmentação de depósitos ou de outro instrumento de transferência de recursos em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (art. 1º, I, d); a fragmentação de saques em espécie a fim de burlar limites regulatórios de reportes (I, e); saques em cinco dias úteis em valores inferiores aos limites, de forma a dissimular o valor total e evitar comunicações de operações em espécie (I, k); e dois ou mais saques em espécie no caixa no mesmo dia, ou dois ou mais depósitos em espécie em terminais de autoatendimento em cinco dias úteis, com indícios de burla para evitar a identificação (I, l e I, m).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O fracionamento de depósitos ou saques em espécie é considerado indício de suspeita nas seguintes situações: 1. fragmentação de depósitos ou outro instrumento de transferência de recurso em espécie, inclusive boleto de pagamento, de forma a dissimular o valor total da movimentação (Carta Circular BCB 4.001/2020, art. 1º, I, d); 2. fragmentação de saques em espécie, a fim de burlar limites regulatórios de reportes (Carta Circular BCB 4.001/2020, art. 1º, I, e); 3. depósitos ou aportes de grandes valores em espécie, de forma parcelada, principalmente nos mesmos caixas ou terminais de autoatendimento próximos, destinados a uma única conta ou a várias contas em municípios ou agências distintas (Carta Circular BCB 4.001/2020, art. 1º, I, f); 4. saques no período de cinco dias úteis em valores inferiores aos limites estabelecidos, de forma a dissimular o valor total da operação e evitar comunicações de operações em espécie (Carta Circular BCB 4.001/2020, art. 1º, I, k); 5. dois ou mais depósitos em terminais de autoatendimento em espécie, no período de cinco dias úteis, com indícios de tentativa de burla para evitar a identificação do depositante (Carta Circular BCB 4.001/2020, art. 1º, I, m).

**Citações da resposta:** Carta Circular BCB 4.001/2020, art. 1º, I, d; Carta Circular BCB 4.001/2020, art. 1º, I, e; Carta Circular BCB 4.001/2020, art. 1º, I, f; Carta Circular BCB 4.001/2020, art. 1º, I, k; Carta Circular BCB 4.001/2020, art. 1º, I, m

**Justificativa do juiz:** parcial

## A3 · q04 · langchain-padrao · juiz: parcial

**Pergunta:** Quais sanções administrativas pode sofrer quem descumpre os deveres de identificação de clientes, registro e comunicação de operações?

**Gabarito:** Cumulativamente ou não: advertência; multa pecuniária de até o dobro do valor da operação, até o dobro do lucro real obtido ou que presumivelmente seria obtido, ou até R$ 20 milhões; inabilitação temporária, por até dez anos, para o cargo de administrador; e cassação ou suspensão da autorização para o exercício de atividade, operação ou funcionamento.

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** Às pessoas referidas no art. 9º, bem como aos administradores das pessoas jurídicas, que deixem de cumprir as obrigações previstas nos arts. 10 e 11 serão aplicadas, cumulativamente ou não, pelas autoridades competentes, as seguintes sanções: advertência (Lei 9.613/1998, art. 12, caput e I) e multa pecuniária variável não superior ao dobro do valor da operação (Lei 9.613/1998, art. 12, caput e II, a).

**Citações da resposta:** Lei 9.613/1998, art. 12, caput; Lei 9.613/1998, art. 12, I; Lei 9.613/1998, art. 12, II, a

**Justificativa do juiz:** A resposta menciona apenas advertência e multa limitada ao dobro do valor da operação, omitindo as demais sanções previstas no gabarito (multa até o dobro do lucro ou até R$ 20 milhões, inabilitação temporária e cassação/suspensão da autorização). Não há afirmação que contradiga o gabarito, apenas omissão de itens que a pergunta pede, portanto a classificação é parcial. Não há itens de "Não deve afirmar" a serem listados.

## A4 · q20 · manual · juiz: parcial

**Pergunta:** Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** As instituições devem avaliar anualmente a efetividade da política, dos procedimentos e dos controles internos, conforme Circular BCB 3.978/2020, art. 62, caput e § 1º, e art. 62, § 2º, I.

**Citações da resposta:** Circular BCB 3.978/2020, art. 62, caput; Circular BCB 3.978/2020, art. 62, § 1º; Circular BCB 3.978/2020, art. 62, § 2º, I

**Justificativa do juiz:** A resposta menciona a periodicidade anual da avaliação, mas não informa a quem o relatório deve ser enviado, que é parte do que a pergunta pede. Não há contradição com o gabarito.

## A5 · q29 · langchain · juiz: parcial

**Pergunta:** Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I). Além disso, deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II).

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

**Justificativa do juiz:** parcial

## A6 · q12 · langchain · juiz: parcial

**Pergunta:** O que significa cumprir "sem demora" a indisponibilidade de ativos determinada pelo Conselho de Segurança da ONU?

**Gabarito:** "Sem demora" é imediatamente ou dentro de algumas horas (art. 2º, V). As pessoas obrigadas devem cumprir as resoluções e designações que determinem a indisponibilidade sem demora e sem prévio aviso aos sancionados (art. 9º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** Os trechos não trazem o significado da expressão "sem demora", mas indicam que as pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput).

**Citações da resposta:** Lei 13.810/2019, art. 9º, caput

**Justificativa do juiz:** A resposta não fornece o significado da expressão "sem demora", que é o que a pergunta pede. Ela apenas afirma que os trechos não trazem esse significado e fala sobre quem deve cumprir a indisponibilidade, omitindo o conteúdo exigido (imediatamente ou dentro de algumas horas). Não há contradição com o gabarito, apenas falta de informação solicitada.

## A7 · q28 · langchain · juiz: parcial

**Pergunta:** Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O registro dos dados e das informações sobre indícios de ocorrências ou de tentativas de fraudes deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); e a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III).

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III

**Justificativa do juiz:** A resposta inclui os itens I, II e III, mas omite o item IV (identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento), que é exigido pela pergunta como parte mínima do registro. Não há afirmações que contrariem o gabarito.

## A8 · q17 · langchain · juiz: parcial

**Pergunta:** O que devem contemplar os procedimentos destinados a conhecer o cliente?

**Gabarito:** Procedimentos que assegurem a devida diligência na identificação, qualificação e classificação dos clientes, compatíveis com o perfil de risco, com a política de PLD/FT e com a avaliação interna de risco, formalizados em manual aprovado pela diretoria (art. 13). Identificação: verificar e validar a identidade, coletando no mínimo nome completo e CPF, ou firma e CNPJ (art. 16). Qualificação: local de residência ou sede e capacidade financeira, incluindo renda ou faturamento (art. 18, § 1º). Classificação nas categorias de risco da avaliação interna (art. 20). Para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final (art. 24).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** Os procedimentos destinados a conhecer os clientes devem incluir procedimentos que assegurem a devida diligência na sua identificação, qualificação e classificação (Circular BCB 3.978/2020, art. 13, caput).

**Citações da resposta:** Circular BCB 3.978/2020, art. 13, caput

**Justificativa do juiz:** A resposta menciona apenas que os procedimentos devem assegurar devida diligência na identificação, qualificação e classificação dos clientes, omite outros requisitos exigidos pelo gabarito, como compatibilidade com perfil de risco, política de PLD/FT e avaliação interna de risco, formalização em manual aprovado pela diretoria, detalhes de identificação (nome completo e CPF ou firma e CNPJ), qualificação (local de residência/sede e capacidade financeira), classificação nas categorias de risco da avaliação interna e, para pessoa jurídica, análise da cadeia de participação societária até o beneficiário final. Não há contradição com o gabarito, apenas omissão de elementos que a pergunta pede, portanto a resposta é parcial.

## A9 · q29 · manual · juiz: parcial

**Pergunta:** Que requisitos deve ter o consentimento do cliente para o registro dos seus dados no compartilhamento de indícios de fraude?

**Gabarito:** Consentimento prévio e geral do cliente com quem a instituição tenha relacionamento (§ 3º), com a finalidade de tratamento e compartilhamento de dados e informações sobre indícios de fraude no âmbito da Resolução (§ 4º, I), constante de contrato, mediante cláusula em destaque no corpo do instrumento, ou de outro instrumento jurídico válido (§ 4º, II). Essa documentação fica à disposição do Banco Central (§ 5º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O consentimento deve ter como finalidade o tratamento e o compartilhamento de dados e informações sobre indícios de fraudes no âmbito da Resolução Conjunta (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I). Além disso, deve constar de contrato firmado entre o cliente e a instituição, mediante cláusula em destaque no corpo do instrumento contratual ou por outro instrumento jurídico válido (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II).

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 4º, II

**Justificativa do juiz:** A resposta menciona a finalidade de tratamento e compartilhamento (art. 2º, §4º, I) e a necessidade de constar em contrato com cláusula em destaque ou outro instrumento jurídico válido (art. 2º, §4º, II). Porém omite o requisito de que o consentimento deve ser prévio e geral do cliente com quem a instituição tenha relacionamento (§3º) e a obrigação de manter a documentação à disposição do Banco Central (§5º). Como não há contradição com o gabarito, apenas falta de informações solicitadas, a classificação é parcial.

## A10 · q10 · manual · juiz: parcial

**Pergunta:** É crime omitir informação ou prestar informação falsa a investidores ou à fiscalização sobre a situação financeira de uma instituição?

**Gabarito:** Sim. É crime induzir ou manter em erro sócio, investidor ou repartição pública competente, relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente. Pena: reclusão de 2 a 6 anos e multa.

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** Induzir ou manter em erro investidor relativamente a operação ou situação financeira, sonegando-lhe informação ou prestando-a falsamente é crime (Lei 7.492/1986, art. 6º, caput).

**Citações da resposta:** Lei 7.492/1986, art. 6º, caput

**Justificativa do juiz:** A resposta confirma que é crime induzir ou manter em erro investidor ao omitir ou falsificar informação, o que está de acordo com o gabarito. Porém, a pergunta também abrange a fiscalização, e a resposta não menciona esse destinatário, omitindo algo que a pergunta pede. Não há afirmações que contrariem o gabarito.

## A11 · q28 · langchain-padrao · juiz: correta

**Pergunta:** Que informações o registro de um indício de fraude deve conter, no mínimo?

**Gabarito:** A identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (I); a descrição dos indícios da ocorrência ou da tentativa de fraude (II); a identificação da instituição responsável pelo registro (III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento (IV).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O registro dos dados e das informações sobre indícios de ocorrência ou de tentativa de fraude deve contemplar, no mínimo: a identificação de quem, segundo os indícios disponíveis, teria executado ou tentado executar a fraude, quando aplicável (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I); a descrição dos indícios da ocorrência ou da tentativa de fraude (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II); a identificação da instituição responsável pelo registro dos dados e das informações (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III); e a identificação dos dados da conta destinatária e de seu titular, em caso de transferência ou pagamento de recursos (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV).

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, III; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 2º, IV

**Justificativa do juiz:** A resposta contém exatamente os quatro itens exigidos pelo gabarito: (I) identificação do suposto autor da fraude, (II) descrição dos indícios, (III) identificação da instituição responsável pelo registro e (IV) identificação dos dados da conta destinatária e de seu titular em caso de transferência ou pagamento. Não há afirmações que contrariem o gabarito nem omissões de itens exigidos pela pergunta.

## A12 · q23 · langchain · juiz: correta

**Pergunta:** Qual sinal de alerta envolve a movimentação financeira do cliente em relação à sua capacidade econômica?

**Gabarito:** Movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente (art. 1º, IV, a). A norma traz variações em outros contextos, como operações em espécie incompatíveis com a capacidade financeira (I, a) e movimentação incompatível com o faturamento mensal de pessoa jurídica (IV, ac). A Circular 3.978 traz o mesmo sinal para o monitoramento: operações incompatíveis com a capacidade financeira do cliente, incluindo renda, faturamento e patrimônio (art. 39, I, c).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** Os sinais de alerta que envolvem a movimentação financeira ou de recursos do cliente em relação à sua capacidade financeira são: 1. movimentação de recursos incompatível com o patrimônio, a atividade econômica ou a ocupação profissional e a capacidade financeira do cliente, conforme Carta Circular BCB 4.001/2020, art. 1º, IV, a; 2. operações realizadas e produtos e serviços contratados que, considerando as partes e os valores envolvidos, apresentem incompatibilidade com a capacidade financeira do cliente, incluindo a renda, no caso de pessoa natural, ou o faturamento, no caso de pessoa jurídica, e o patrimônio, conforme Circular BCB 3.978/2020, art. 39, I, c; e 3. movimentação de recursos incompatível com a atividade econômica e a capacidade financeira do cliente em contas correntes em moeda estrangeira (CCME), conforme Carta Circular BCB 4.001/2020, art. 1º, XVI, a.

**Citações da resposta:** Carta Circular BCB 4.001/2020, art. 1º, IV, a; Circular BCB 3.978/2020, art. 39, I, c; Carta Circular BCB 4.001/2020, art. 1º, XVI, a

**Justificativa do juiz:** A resposta apresenta três sinais de alerta que tratam de movimentação financeira incompatível com a capacidade econômica/financeira do cliente. Todos estão em conformidade com o gabarito, que descreve o sinal básico e menciona variações em outros contextos. Nenhum dos afirmativos contradiz o gabarito, e a resposta não omite nada que a pergunta peça. Portanto, está correta.

## A13 · q20 · langchain-padrao · juiz: correta

**Pergunta:** Com que periodicidade a instituição deve avaliar a efetividade da sua política e dos seus controles de PLD/FT, e a quem o relatório deve ser enviado?

**Gabarito:** A instituição deve avaliar a efetividade da política, dos procedimentos e dos controles internos (art. 62), em relatório específico (§ 1º) elaborado anualmente, com data-base de 31 de dezembro, e encaminhado, para ciência, até 31 de março do ano seguinte ao comitê de auditoria, quando houver, e ao conselho de administração ou, se inexistente, à diretoria (§ 2º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** A avaliação de efetividade deve ser elaborada anualmente, com data-base de 31 de dezembro (Circular BCB 3.978/2020, art. 62, § 2º, I). O relatório deve ser encaminhado para ciência, até 31 de março do ano seguinte ao da data-base: ao comitê de auditoria, quando houver (Circular BCB 3.978/2020, art. 62, § 2º, II, a); e ao conselho de administração ou, se inexistente, à diretoria da instituição (Circular BCB 3.978/2020, art. 62, § 2º, II, b).

**Citações da resposta:** Circular BCB 3.978/2020, art. 62, § 2º, I; Circular BCB 3.978/2020, art. 62, § 2º, II, a; Circular BCB 3.978/2020, art. 62, § 2º, II, b

**Justificativa do juiz:** A resposta menciona a periodicidade anual, a data-base de 31 de dezembro, o prazo de envio até 31 de março do ano seguinte e os destinatários (comitê de auditoria, quando houver, e conselho de administração ou diretoria), exatamente como o gabarito estabelece. Não há afirmações que contrariem o gabarito nem omissões de elementos exigidos pela pergunta.

## A14 · q14 · manual · juiz: correta

**Pergunta:** Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão, sem demora e sem prévio aviso aos sancionados, as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput).

**Citações da resposta:** Lei 13.810/2019, art. 9º, caput

**Justificativa do juiz:** correta

## A15 · q11 · manual · juiz: correta

**Pergunta:** Do que trata a lei sobre o cumprimento das sanções do Conselho de Segurança das Nações Unidas?

**Gabarito:** Do cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e da designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados.

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** A lei dispõe sobre o cumprimento de sanções impostas por resoluções do Conselho de Segurança das Nações Unidas, incluída a indisponibilidade de ativos de pessoas naturais e jurídicas e de entidades, e a designação nacional de pessoas investigadas ou acusadas de terrorismo, de seu financiamento ou de atos a ele correlacionados (Lei 13.810/2019, art. 1º).

**Citações da resposta:** Lei 13.810/2019, art. 1º, caput

**Justificativa do juiz:** A resposta reproduz exatamente o conteúdo do gabarito, acrescentando apenas a referência legal, o que não constitui contradição nem omissão. Portanto, está correta.

## A16 · q07 · langchain · juiz: correta

**Pergunta:** O que caracteriza o crime de gestão fraudulenta de instituição financeira e qual é a pena?

**Gabarito:** A lei só tipifica a conduta, "gerir fraudulentamente instituição financeira", e fixa a pena de reclusão de 3 a 12 anos e multa. Não define o que é gestão fraudulenta. Recusar também é aceito: a lei não define gestão fraudulenta, e a regra do prompt manda recusar quando os trechos respondem só em parte.

**Não deve afirmar:**
1. apresentar como texto da norma uma definição de gestão fraudulenta (engano, artifício, ardil, fraude contra sócios, investidores ou fiscalização)

**Resposta do assistente:** O crime é caracterizado por gerir fraudulentamente instituição financeira, cuja pena é de reclusão, de 3 (três) a 12 (doze) anos, e multa, conforme o Lei 7.492/1986, art. 4º, caput.

**Citações da resposta:** Lei 7.492/1986, art. 4º, caput

**Justificativa do juiz:** A resposta afirma que o crime consiste em 'gerir fraudulentamente instituição financeira' e indica a pena de reclusão de 3 a 12 anos e multa, exatamente como o gabarito indica. Não apresenta qualquer definição de gestão fraudulenta, portanto não viola o item 1 de 'Não deve afirmar'. Assim, a resposta está correta.

## A17 · q14 · langchain · juiz: correta

**Pergunta:** Quem deve cumprir as determinações de indisponibilidade de ativos de pessoas sancionadas pelo Conselho de Segurança da ONU?

**Gabarito:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, sem demora e sem prévio aviso aos sancionados, na forma definida por seu órgão regulador ou fiscalizador (Lei 13.810, art. 9º). O Ministério da Justiça e Segurança Pública comunica as sanções aos órgãos reguladores, que as repassam a essas pessoas (art. 10, I), e também às corregedorias de justiça, à Anac, ao Departamento Nacional de Trânsito, às Capitanias dos Portos, à Anatel e a outros órgãos de registro público, para cumprimento sem demora (art. 10, § 1º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** As pessoas naturais e jurídicas de que trata o art. 9º da Lei nº 9.613, de 3 de março de 1998, cumprirão as resoluções do Conselho de Segurança das Nações Unidas ou as designações de seus comitês de sanções que determinem a indisponibilidade de ativos de titularidade, direta ou indireta, de pessoas físicas, de pessoas jurídicas ou de entidades submetidas a sanções decorrentes de tais resoluções, na forma e nas condições definidas por seu órgão regulador ou fiscalizador (Lei 13.810/2019, art. 9º, caput).

**Citações da resposta:** Lei 13.810/2019, art. 9º, caput

**Justificativa do juiz:** A resposta identifica corretamente quem deve cumprir as determinações de indisponibilidade de ativos: as pessoas naturais e jurídicas de que trata o art. 9º da Lei 9.613/1998, conforme o gabarito. Não há contradição com o gabarito e não omite nada que a pergunta pede.

## A18 · q27 · langchain · juiz: correta

**Pergunta:** Quais funcionalidades mínimas deve ter o sistema eletrônico de compartilhamento de indícios de fraude?

**Gabarito:** O registro de dados e informações sobre indícios de ocorrências ou de tentativas de fraude identificadas pelas instituições (I); a alteração e a exclusão desses registros (II); e a consulta aos dados registrados (III).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** O sistema eletrônico deve contemplar, no mínimo, as seguintes funcionalidades: o registro de dados e de informações sobre indícios de ocorrências ou de tentativas de fraudes identificadas pelas instituições em suas atividades (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I); a alteração e a exclusão dos dados e das informações registrados, conforme o caso (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II); e a consulta dos dados e das informações registrados (Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III).

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, I; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, II; Resolução Conjunta CMN/BCB 6/2023, art. 2º, § 1º, III

**Justificativa do juiz:** A resposta traz exatamente as três funcionalidades mínimas listadas no gabarito: registro, alteração/exclusão e consulta. Não há afirmações que contrariem o gabarito nem omissões de algo que a pergunta pede.

## A19 · q26 · manual · juiz: correta

**Pergunta:** Quais instituições estão obrigadas a compartilhar dados sobre indícios de fraude, e qual está excluída dessa obrigação?

**Gabarito:** As instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil (art. 1º). A norma não se aplica às administradoras de consórcio (art. 1º, § 1º).

**Não deve afirmar:**
(nenhum item)

**Resposta do assistente:** As instituições obrigadas a observar os requisitos para compartilhamento de dados e informações sobre indícios de fraudes são as instituições financeiras, as instituições de pagamento e as demais instituições autorizadas a funcionar pelo Banco Central do Brasil, conforme o Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º. A instituição excluída dessa obrigação (o disposto na Resolução Conjunta não se aplica a ela) é a administradora de consórcio, nos termos do Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º.

**Citações da resposta:** Resolução Conjunta CMN/BCB 6/2023, art. 1º, § 1º

**Justificativa do juiz:** A resposta menciona corretamente as instituições obrigadas (financeiras, de pagamento e demais autorizadas pelo BCB) e a excluída (administradora de consórcio), sem contradizer o gabarito. Não há omissão de conteúdo exigido pela pergunta.

## A20 · q24 · manual · juiz: correta

**Pergunta:** Uma conta até então pouco movimentada que passa a movimentar quantia significativa é indício de suspeita de lavagem de dinheiro?

**Gabarito:** Sim. A movimentação de quantia significativa por meio de conta até então pouco movimentada, ou de conta que acolha depósito inusitado, é exemplo de indício de suspeita (art. 1º, IV, e). Relacionado: aumento substancial de depósitos em espécie sem causa aparente, transferidos em curto período a destino não relacionado com o cliente (I, c).

**Não deve afirmar:**
1. dizer que a norma trata de contas recém-abertas ou de "contas de passagem"

**Resposta do assistente:** Sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica a ocorrência de indícios de suspeita para fins dos procedimentos de monitoramento e seleção previstos na Circular nº 3.978, de 23 de janeiro de 2020 (Carta Circular BCB 4.001/2020, art. 1º, IV, e).

**Citações da resposta:** Carta Circular BCB 4.001/2020, art. 1º, IV, e

**Justificativa do juiz:** A resposta afirma que sim, a movimentação de quantia significativa por meio de conta até então pouco movimentada ou de conta que acolha depósito inusitado exemplifica indício de suspeita, o que está de acordo com o gabarito. Não há contradição com o gabarito e não há afirmação dos itens proibidos (não menciona contas recém-abertas ou de passagem).
