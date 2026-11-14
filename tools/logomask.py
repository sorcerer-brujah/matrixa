#!/usr/bin/env python3
"""MATRIXÄ — de LOGO del usuario (PNG/JPEG, fondo plano) a máscaras para el terminal.

El logo vive en ~/Downloads; este tool lo trocea a la rejilla del CLI
(celdas de carácter, anchura ~92-104) y emite TypeScript listo para pegar:

    python3 tools/logomask.py ~/Downloads/mi-logo.png [--cols 92] [--rows 8]

- Si la imagen mide N veces el alto pedido, se asume que trae N FRAMES
  apilados (animación) y emite un array de máscaras.
- Luminancia de cada celda -> 0..3 (negro, tenue, medio, vivo): el componente
  decide los colores; aquí solo sale geometría.
- El chroma (color de fondo detectado del borde) cuenta como 0.

Idempotente: reimprime y ya. Salida: por stdout.
"""
import argparse
import collections

import numpy as np
from PIL import Image

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("imagen")
    ap.add_argument("--cols", type=int, default=92)
    ap.add_argument("--rows", type=int, default=8)
    ap.add_argument("--frames", type=int, default=1)
    args = ap.parse_args()

    im = Image.open(args.imagen).convert("RGB")
    w, h = im.size
    fh = round(h / args.frames)
    a = np.asarray(im)

    # fondo = color del marco (croma o negro)
    borde = np.concatenate([a[0, ::7].reshape(-1, 3), a[-1, ::7].reshape(-1, 3),
                            a[::7, 0], a[::7, -1]])
    fondo = np.median(borde.astype(int), axis=0)

    masks = []
    for k in range(args.frames):
        rec = a[k * fh:(k + 1) * fh]
        # quitar fondo: distancia al color base
        d = np.abs(rec.astype(int) - fondo).sum(axis=2)
        lum = rec.astype(float) @ [0.2126, 0.7152, 0.0722]
        lum = np.where(d < 70, 0.0, lum)
        # remuestrear a la rejilla del terminal (celda = ~8x16 px reales: factor 0.5)
        cell = np.zeros((args.rows, args.cols), dtype=np.uint8)
        ch = rec.shape[0] / args.rows
        cw = rec.shape[1] / args.cols
        for y in range(args.rows):
            for x in range(args.cols):
                block = lum[int(y * ch):max(int(y * ch) + 1, int((y + 1) * ch)),
                            int(x * cw):max(int(x * cw) + 1, int((x + 1) * cw))]
                v = block.max() if block.size else 0.0
                m = block.mean() if block.size else 0.0
                nivel = int(min(3, (0.55 * v + 0.45 * m) // 64))
                cell[y, x] = nivel
        masks.append(cell)

    print("export const LOGO_MASKS = [")
    for cell in masks:
        print("  [")
        for row in cell:
            print('    "' + "".join(str(int(v)) for v in row) + '",')
        print("  ],")
    print("];")


if __name__ == "__main__":
    main()
