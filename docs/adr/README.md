# Decisões de arquitetura

Cada decisão relevante fica registrada aqui, com contexto, alternativas e consequências. Uma decisão substituída não é apagada: ganha o status "Substituída por ADR NNNN".

| ADR | Decisão | Status |
|---|---|---|
| [0001](0001-stack.md) | TypeScript e Node.js, sem framework de RAG na v1 | Aceita |
| [0002](0002-provedor-llm.md) | Gemini (nível gratuito) como LLM principal, OpenRouter como fallback | Aceita |
| [0003](0003-embeddings.md) | Embeddings locais primeiro, comparados com API pela avaliação | Aceita |
| [0004](0004-banco-vetorial.md) | Qdrant local via Docker | Aceita |
| [0005](0005-corpus-v1.md) | Seis normas no corpus da v1, sempre pelo texto compilado | Aceita |
| [0006](0006-extracao-pdf.md) | Texto dos PDFs do BCB extraído com pdfjs-dist, sem dependência de sistema | Aceita |
