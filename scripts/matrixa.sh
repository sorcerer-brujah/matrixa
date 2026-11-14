#!/usr/bin/env bash
# MATRIXÄ — lanza el CLI de este fork con el tema de la casa.
# No toca la instalación de pipx ni los settings globales.
export LETTA_THEME=matrixa
export LETTA_DEBUG="${LETTA_DEBUG:-1}"
exec bun --loader=.md:text --loader=.mdx:text --loader=.txt:text run src/index.ts "$@"
