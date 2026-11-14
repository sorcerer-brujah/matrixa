#!/usr/bin/env python3
"""MATRIXÄ — remuestrea el arte ASCII del usuario a la rejilla del terminal.

Técnica: 2 filas de arte por celda con bloques de media altura (▀▄█) y
densidad por celda → tinte. Fiel a trazos finos; la media simple (▓▒░) los
destruía (logo-estática del 14-nov, retrabajado).
Salida: filas + score de fidelidad (correlación con el original remuestreado).
"""
import sys


def load(path, lo=38, hi=88):
    lines = [l.rstrip("\n").rstrip() for l in open(path, encoding="utf-8").read().splitlines()[lo:hi]]
    while lines and not lines[0].strip(): lines.pop(0)
    while lines and not lines[-1].strip(): lines.pop()
    return lines


def inkmap(art):
    W = max(len(l) for l in art)
    return [[1 if x < len(l) and l[x] not in " ·.-_:;'" else 0 for x in range(W)] for l in art]


def raster(b, ROWS=16, COLS=92):
    H2, W2 = len(b), len(b[0])
    out = []
    for gy in range(ROWS):
        y0 = gy * H2 // ROWS
        y1 = max(y0 + 1, (gy + 1) * H2 // ROWS)
        ym = (y0 + y1) // 2  # mitad de la celda
        fila, dens = "", []
        for gx in range(COLS):
            xa = gx * W2 // COLS
            xb = max(xa + 1, (gx + 1) * W2 // COLS)
            top = sum(b[y][x] for y in range(y0, ym) for x in range(xa, xb))
            bot = sum(b[y][x] for y in range(ym, y1) for x in range(xa, xb))
            at = (ym - y0) * (xb - xa); ab = (y1 - ym) * (xb - xa)
            t, d = top / max(1, at), bot / max(1, ab)
            if t < 0.06 and d < 0.06:
                ch = " "
            elif t >= 0.45 and d >= 0.45:
                ch = "█"
            elif t >= 0.30 and d >= 0.12:
                ch = "█" if t >= 0.6 and d >= 0.6 else ("▀" if t > d * 1.7 else "▄" if d > t * 1.7 else "█")
            elif t > d:
                ch = "▀"
            else:
                ch = "▄"
            fila += ch
            dens.append((t + d) / 2)
        out.append((fila.rstrip(), dens))
    return out


def fidelity(b, cells, ROWS=16, COLS=92):
    # reconstruye bitmap desde las celdas y compara con b remuestreada igual
    H2, W2 = len(b), len(b[0])
    ok = tot = 0
    for gy in range(ROWS):
        y0 = gy * H2 // ROWS; y1 = max(y0 + 1, (gy + 1) * H2 // ROWS); ym = (y0 + y1) // 2
        for gx in range(COLS):
            xa = gx * W2 // COLS; xb = max(xa + 1, (gx + 1) * W2 // COLS)
            zone = [b[y][x] for y in range(y0, y1) for x in range(xa, xb)]
            z = sum(zone) / max(1, len(zone))
            ch = cells[gy][0][gx] if gx < len(cells[gy][0]) else " "
            has = ch != " "
            if z > 0.25 and has: ok += 1
            if z > 0.25: tot += 1
    return ok / max(1, tot)


if __name__ == "__main__":
    art = load(sys.argv[1] if len(sys.argv) > 1 else "/home/leoben/logo-art.txt")
    b = inkmap(art)
    best = None
    for R in (12, 14, 16, 18, 20):
        cells = raster(b, R, 92)
        f = fidelity(b, cells, R, 92)
        print(f"ROWS={R:2d} fidelidad={f:.2f}")
        if best is None or f > best[0] + 0.02:
            best = (f, R, cells)
    f, R, cells = best
    print(f"== elegido ROWS={R} f={f:.2f} ==")
    for fila, _ in cells:
        print(fila)
