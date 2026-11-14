/**
 * MATRIXÄ — reproductor de logos de celda.
 *
 * Consume máscaras generadas por tools/logomask.py a partir del logo del
 * usuario (imagen con fondo plano → rejilla del terminal). Cada celda es un
 * "píxel grande"; los niveles 1..3 eligen el glifo y el color de la rampa.
 * Con varias máscaras (frames apilados en la imagen original) el logo anima
 * en loop, sincronizado con la lluvia de alrededor.
 *
 * Mientras el logo no esté generado, este módulo no se usa (la cabecera va
 * con MatrixRain + texto).
 */

import { Box } from "ink";
import { useEffect, useState } from "react";
import { Text } from "./Text";

export type LogoCell = 0 | 1 | 2 | 3;
export type LogoFrame = LogoCell[][];

// rampa de la casa: plomo tenue → fósforo medio → fósforo vivo → incandescente
const RAMP: Record<LogoCell, { fg: string; ch: string }> = {
  0: { fg: "#020702", ch: " " },
  1: { fg: "#0a3b12", ch: "▓" },
  2: { fg: "#00b400", ch: "█" },
  3: { fg: "#DFFFDF", ch: "█" },
};

export function CellLogo({
  frames,
  intervalMs = 220,
}: {
  frames: LogoFrame[];
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (frames.length < 2) return;
    const iv = setInterval(
      () => setI((x) => (x + 1) % frames.length),
      intervalMs,
    );
    return () => clearInterval(iv);
  }, [frames.length, intervalMs]);

  const frame = frames[i % frames.length] ?? [];
  return (
    <Box flexDirection="column">
      {frame.map((row, y) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rejilla de píxel fija por posición
        <Box key={y} flexDirection="row" height={1}>
          {row.map((cell, x) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: celda fija del logo
            <Text key={x} color={RAMP[cell].fg}>
              {RAMP[cell].ch}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}
