#!/usr/bin/env python3
"""Regenera la máscara ART de MatrixWordmark con pyfiglet (ansi shadow).

Uso: python3 tools/wordmask.py "MATRIXÄ" > /tmp/art.txt
Pega las líneas en src/cli/components/MatrixWordmark.tsx (const ART).
"""
import sys

import pyfiglet

text = sys.argv[1] if len(sys.argv) > 1 else "MATRIXÄ"
art = pyfiglet.figlet_format(text, font="ansi_shadow")
lines = art.splitlines() or [""]
width = max(len(l) for l in lines)
print('const ART = [')
import json
for l in lines:
    print(f"  {json.dumps(l.ljust(width), ensure_ascii=False)},")
print('];')
