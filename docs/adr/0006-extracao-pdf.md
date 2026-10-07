# ADR 0006: Texto dos PDFs do BCB extraído com pdfjs-dist

- Status: Aceita
- Data: 2026-10-07

## Contexto
O BCB só publica o texto compilado da Circular 3.978 e da Carta Circular 4.001 em PDF (`_v<N>_L.pdf`); o HTML da API é a redação original (ADR 0005). O PDF não tem estrutura de parágrafo: só trechos de texto com posição. É preciso remontar cada dispositivo sem colar um no outro, porque a citação depende disso.

Proposta pelo Claude e aceita pelo autor "por enquanto": revisar se aparecer PDF que esta abordagem não leia bem.

## Alternativas
| Opção | A favor | Contra |
|---|---|---|
| `pdftotext` (poppler) | Extração de layout madura | Dependência de sistema na máquina do autor e no CI; saída em texto corrido, a estrutura ainda precisa ser deduzida |
| `pdfjs-dist` (Mozilla) | Só `npm install`; devolve posição e tamanho de fonte de cada trecho | Linhas e parágrafos precisam ser remontados no código |
| `unpdf` | API mais simples sobre o pdfjs | Camada a mais sobre o mesmo motor, sem ganho para o caso |

## Decisão
- `pdfjs-dist`, versão exata (6.3.289). A saída do parser é versionada no Git e não deve mudar por atualização silenciosa da biblioteca.
- Parágrafos remontados pela geometria (`src/ingest/pdf.ts`): na mesma página, espaço entre linhas maior que 1,5 vez a altura da fonte abre parágrafo; na virada de página, abre se a linha não começa na margem. Linhas com fonte menor que a do corpo (cabeçalho "Público", rodapé "Página N de M") são descartadas. Hífen no fim da linha é de palavra composta ("11-A") e é mantido.
- Os parágrafos passam pelo mesmo parser de dispositivos das leis do Planalto (`src/ingest/dispositivos.ts`).

## Verificação feita
- Cada dispositivo extraído foi procurado, literalmente, no texto do `pdftotext`: 379/379 na Circular 3.978 e 187/189 na Carta Circular 4.001. As duas diferenças são espaço antes de ";" no PDF ("partes ;").
- Nenhum caminho de citação duplicado nas seis normas.
- A conferência achou dois níveis que o parser não conhecia: item ("1.", "2.") dentro de alínea, na Circular 3.978, e alínea de duas letras ("aa)" a "ae)"), na Carta Circular 4.001.

## Consequências
- `npm install` basta, em qualquer sistema e no CI.
- O CLI avisa quando um parágrafo do BCB não abre dispositivo, porque isso significa que ele foi colado no anterior. Também avisa quando são descartadas mais linhas de fonte menor do que cabeçalho e rodapé explicariam.
- Os limiares (1,5 vez a altura da fonte, margem pelo x mais frequente) foram calibrados em dois PDFs do BCB. Um PDF com outra diagramação pode exigir ajuste; os avisos acima são a rede de segurança.
