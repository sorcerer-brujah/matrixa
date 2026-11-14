#!/usr/bin/env python3
"""MATRIXÄ — ANSI (crudo, de scripts/matrixa-demo.tsx) a HTML con fondo negro.

Usado para disparar una captura PNG del tema sin abrir un segundo CLI:
  bun scripts/matrixa-demo.tsx /tmp/demo.ans && python3 tools/ansi2html.py /tmp/demo.ans /tmp/demo.html
  chromium --headless=new --window-size=1000,560 --screenshot=/tmp/demo.png file:///tmp/demo.html
Soporta SGR: reset, bold, dim, foreground/background truecolor (38;2/48;2).
"""
import html
import re
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/matrixa-demo.ans"
DST = sys.argv[2] if len(sys.argv) > 2 else "/tmp/matrixa-demo.html"

raw = open(SRC, "rb").read().decode("utf-8", "replace")
raw = re.sub(r"\x1b\[\?25l|\x1b\[\?25h|\x1b\[K", "", raw)
raw = re.sub(r"\x1b\[[0-9]*[A-F]", "", raw)  # movimientos de cursor simples

out, cur = [], {}
for part in re.split(r"(\x1b\[[0-9;]*m)", raw):
    m = re.fullmatch(r"\x1b\[([0-9;]*)m", part or "")
    if m:
        codes = [int(c) for c in m.group(1).split(";")] if m.group(1) else [0]
        i = 0
        while i < len(codes):
            c = codes[i]
            if c == 0:
                cur = {}
            elif c == 1:
                cur["b"] = 1
            elif c == 2:
                cur["dim"] = 1
            elif c in (38, 48) and i + 4 < len(codes) and codes[i + 1] == 2:
                key = "fg" if c == 38 else "bg"
                cur[key] = "#{:02x}{:02x}{:02x}".format(codes[i + 2], codes[i + 3], codes[i + 4])
                i += 4
            i += 1
        continue
    for txt in (part or "").split("\n"):
        s = html.escape(txt)
        st = []
        if cur.get("fg"):
            st.append(f"color:{cur['fg']}")
        if cur.get("bg"):
            st.append(f"background:{cur['bg']}")
        if cur.get("b"):
            st.append("font-weight:700")
        if cur.get("dim"):
            st.append("opacity:.55")
        out.append(f'<span style="{";".join(st)}">{s}</span><br>' if st else f"{s}<br>")

css = (
    "body{margin:16px;background:#050a07;color:#d6ffea;"
    'font-family:"JetBrainsMono","DejaVu Sans Mono",monospace;'
    "font-size:15px;line-height:1.35;white-space:pre}"
)
open(DST, "w", encoding="utf-8").write(
    f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(out)}</body></html>'
)
print(f"{SRC} -> {DST}")
