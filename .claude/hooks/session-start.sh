#!/bin/bash
# Início de sessão do Claude Code na nuvem: autor dos commits e dependências.
set -euo pipefail

# Só na nuvem. Na máquina do autor, o git e o node_modules já são dele.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# A sessão na nuvem começa com "Claude" como usuário do git. Os commits são do autor do
# projeto, com o Claude como coautor na linha Co-Authored-By (CLAUDE.md, Convenções).
# E-mail privado do GitHub, o mesmo dos commits dele na main.
git config user.name "Felipe de Almeida Paes"
git config user.email "41527579+FelipeAlmeidaPaes@users.noreply.github.com"

# Dependências para os testes e a checagem de tipos. npm install (e não npm ci) aproveita o
# node_modules que o contêiner guarda entre sessões; o .npmrc evita baixar os binários de CUDA.
npm install --no-audit --no-fund
