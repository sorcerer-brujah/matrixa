#!/usr/bin/env python3
"""MATRIXÄ — ANSI (stream de reescritura de Ink) → HTML del FOTOGRAMA FINAL.

pyte reproduce la secuencia completa en un terminal virtual; lo que queda es la
pantalla tal cual la vería el usuario: celdas con glifo, fg y bg reales.

Uso: python3 tools/ansi2html.py [in.ans] [out.html] [cols] [filas]
"""
import html
import re
import sys

import pyte

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/matrixa-demo.ans"
DST = sys.argv[2] if len(sys.argv) > 2 else "/tmp/matrixa-demo.html"
COLS = int(sys.argv[3]) if len(sys.argv) > 3 else 96
ROWS = int(sys.argv[4]) if len(sys.argv) > 4 else 40

data = open(SRC, "rb").read().decode("utf-8", "replace")

screen = pyte.Screen(COLS, ROWS)
stream = pyte.Stream(screen)
# arrancar desde pantalla limpia
stream.feed("\x1b[2J\x1b[H")
stream.feed(data)

def to_hex(v):
    # pyte da componentes 0..255 como cadenas
    try:
        return "#{:02x}{:02x}{:02x}".format(int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16))
    except Exception:
        return None

lines_html = []
for y in range(ROWS):
    parts, run, run_style = [], [], None
    for x in range(COLS):
        ch = screen.buffer[y][x]
        fg = ch.fg if isinstance(ch.fg, str) and len(ch.fg) == 6 else None
        bg = ch.bg if isinstance(ch.bg, str) and len(ch.bg) == 6 else None
        style = ("color:#" + fg if fg else "") + (";background:#" + bg if bg else "") + (
            ";font-weight:700" if ch.bold else ""
        )
        if style != run_style:
            if run:
                key = run_style or ""
                parts.append(
                    f'<span style="{key}">{html.escape("".join(run))}</span>'
                    if key
                    else html.escape("".join(run))
                )
            run, run_style = [], style
        run.append(ch.data if ch.data else " ")
    if run:
        parts.append(
            f'<span style="{run_style}">{html.escape("".join(run))}</span>'
            if run_style
            else html.escape("".join(run))
        )
    line = "".join(parts)
    texto_plano = re.sub(r"<[^>]+>", "", line)
    if texto_plano.strip():
        lines_html.append(line + "<br>")
    elif any(("<span" in p and "#" in p and "background" in p) for p in parts):
        # fila visualmente vacía pero con fondos pintados: conservar hueco
        lines_html.append((line or " ") + "<br>")

# recortar filas totalmente vacías por debajo del contenido
while lines_html and not re.sub(r"<[^>]+>", "", lines_html[-1]).strip():
    lines_html.pop()

css = (
    "body{margin:14px;background:#000;color:#d9f2df;"
    'font-family:"JetBrainsMono","DejaVu Sans Mono",monospace;'
    "font-size:14px;line-height:1.28;white-space:pre}"
)
open(DST, "w", encoding="utf-8").write(
    f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(lines_html)}</body></html>'
)
print(f"{SRC} -> {DST} ({COLS}x{ROWS}, fotograma final)")
