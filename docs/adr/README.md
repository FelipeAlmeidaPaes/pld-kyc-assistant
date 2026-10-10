# Decisões de arquitetura

Cada decisão relevante fica registrada aqui, com contexto, alternativas e consequências. Uma decisão substituída não é apagada: ganha o status "Substituída por ADR NNNN".

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-stack.md) | TypeScript e Node.js, sem framework de RAG na v1 | Substituída em parte pela ADR 0007 |
| [0002](0002-provedor-llm.md) | Gemini (nível gratuito) como LLM principal, OpenRouter como fallback | Aceita |
| [0003](0003-embeddings.md) | Embeddings locais primeiro, comparados com API pela avaliação | Substituída em parte pela ADR 0009 |
| [0004](0004-banco-vetorial.md) | Qdrant local via Docker | Aceita |
| [0005](0005-corpus-v1.md) | Seis normas no corpus da v1, sempre pelo texto compilado | Aceita |
| [0006](0006-extracao-pdf.md) | Texto dos PDFs do BCB extraído com pdfjs-dist, sem dependência de sistema | Aceita |
| [0007](0007-tres-variantes.md) | Três variantes do RAG na v1: manual, LangChain e LangChain com divisor padrão | Aceita |
| [0008](0008-avaliacao.md) | Como a avaliação mede as variantes: conjunto, execução com retomada e métricas | Aceita |
| [0009](0009-embeddings-gemini.md) | Embeddings pela API do Gemini (`gemini-embedding-2`), com cache em disco | Aceita |
| [0010](0010-juiz.md) | Juiz do conteúdo das respostas: LLM gratuito de outra família, auditado pelo autor | Aceita |
| [0011](0011-cobertura-declarada.md) | Cobertura declarada pelo modelo no lugar da recusa de resposta parcial; 8 trechos | Aceita |
| [0012](0012-conferencia-de-valores.md) | Prazos, percentuais, valores e datas da resposta conferidos contra o texto citado | Aceita |
| [0013](0013-servidor-mcp.md) | Servidor MCP da v2: busca, leitura de dispositivo e conferência da resposta, por stdio e HTTP local | Aceita |
