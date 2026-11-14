#!/usr/bin/env bash
# MATRIXÄ — arranca el fork (nuestra versión de Letta Code) en su propia
# ventana foot, con la fuente y tamaño que pide el logo ASCII (190 columnas).
# Atajo de la casa: SUPER + M (bindings.lua).
set -euo pipefail
REPO="$(cd "$(dirname "$(readlink -f "$0")")/../Projects/matrixa" 2>/dev/null && pwd || true)"
[ -d "$REPO" ] || REPO="$HOME/Projects/matrixa"
cd "$REPO"
export LETTA_THEME="${LETTA_THEME:-matrixa}"
exec foot --app-id=MATRIXA -c "$REPO/desktop/matrixa-foot.ini" -e bash -lc \
  "cd '$REPO' && bun --loader=.md:text --loader=.mdx:text --loader=.txt:text run src/index.ts --resume"
