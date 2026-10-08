# ADR 0002: Gemini como LLM principal, OpenRouter como fallback

- Status: Aceita
- Data: 2026-10-07

## Contexto
O custo precisa ficar perto de zero durante o curso. O Gemini tem nível gratuito com limite de requisições. O OpenRouter cobra por uso e dá acesso a vários modelos pela mesma API. Assinaturas de chat (Claude Pro, Copilot) não incluem acesso de API para aplicações.

## Decisão
- Provedor principal: Gemini, nível gratuito.
- Fallback: OpenRouter, com créditos pré-pagos.
- Os dois são acessados pela API compatível com a da OpenAI, com um único cliente. Trocar de provedor é configuração, não código.
- Os modelos ficam em variáveis de ambiente (`GEMINI_MODEL`, `OPENROUTER_MODEL`).

## Regras
1. Toda resposta registra provedor e modelo, junto com tokens, custo e latência.
2. **Execuções de avaliação rodam sem fallback.** Se o provedor principal falhar, a execução falha. Misturar modelos numa mesma rodada invalida a comparação entre rodadas.
3. Quando houver um LLM avaliando respostas, o modelo avaliador é fixo e aparece no relatório.
4. Nenhum dado pessoal vai para o nível gratuito. Os termos do nível gratuito podem permitir uso do conteúdo para melhoria do produto; conferir os termos vigentes antes da v3, quando o usuário digitará perguntas livres.
5. O cliente trata limite de requisições com nova tentativa e espera crescente. A avaliação controla o ritmo das chamadas.

## Atualização (2026-10-08): custo zero
O autor exigiu que não haja pagamento além do que é gratuito.
- **Gemini:** `gemini-3.5-flash-lite`, gratuito na página de preços e o mais rápido nos testes (0,7 a 1 s por resposta, contra 1,8 a 3,3 s do `gemini-3.5-flash`, com as mesmas respostas). O custo zero depende do projeto do Google estar **sem faturamento**: aí, passado o limite, a API devolve 429 e nada é cobrado. Com faturamento, tudo é cobrado e não há teto rígido. Isso não se controla pelo código; confere-se no AI Studio.
- **OpenRouter:** só modelos `:free`, que não consomem crédito (cota de 1.000 requisições por dia). Reserva atual: `nvidia/nemotron-3-super-120b-a12b:free`, um dos que aceitam saída estruturada. A conta tem crédito comprado, e um modelo pago o consumiria; por isso a configuração recusa modelo sem `:free`, salvo `OPENROUTER_PERMITIR_PAGO=sim`.
- Apelidos `-latest` do Gemini são recusados: podem passar a apontar para outro modelo, de outro preço, e quebram a repetibilidade da avaliação.
- O conteúdo enviado ao nível gratuito pode ser usado pelos provedores para melhorar produtos. Hoje só vão normas públicas e perguntas de teste (regra 4).

## Alternativas consideradas
- **OpenRouter como principal**: resultados mais estáveis, mas com custo por chamada desde o início.
- **Só modelos `:free` do OpenRouter**: disponibilidade muda e o limite diário é baixo, então os resultados não se repetem.

## Consequências
- O limite do nível gratuito pode interromper uma avaliação longa. A avaliação precisa poder retomar de onde parou.
- O custo registrado será zero na maior parte das consultas. O relatório deve mostrar também o custo estimado a preço de tabela, para o número ter significado.
