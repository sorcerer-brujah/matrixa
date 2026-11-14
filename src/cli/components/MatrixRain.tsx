/**
 * MATRIXÄ — Lluvia digital para la bienvenida (calibrada a la referencia del cine:
 * verde puro de canal G sobre negro, cabezas incandescentes, sin cian).
 *
 * Cada columna lleva varias gotas vivas a la vez (cola), como en 1.webp.
 * Se dibuja por celdas: fondo negro-verdoso + glifo verde con atenuación por
 * la edad en el rastro. Solo activa con la paleta de la casa.
 */

import { Box } from "ink";
import { useEffect, useMemo, useState } from "react";
import { Text } from "./Text";

// Sólo ANCHO MEDIO (halfwidth): los katakana fullwidth medían 2 columnas en
// ink y each fila lluvia ocupaba dos filas reales (huecos de 0% alternando).
const GLYPHS = Array.from(
  "0123456789ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝｯｷｽﾒﾂﾘｴﾃ",
);

const CELL_BG = "#020702"; // negro con una gota de verde: el fondo del cine

type Drop = { head: number; speed: number; len: number; seed: number };

function newDrop(rows: number, first = false): Drop {
  return {
    head: first ? Math.random() * rows * 2 : -Math.random() * rows * 1.5,
    speed: 0.3 + Math.random() * 0.65,
    len: 9 + Math.floor(Math.random() * 10),
    seed: Math.floor(Math.random() * GLYPHS.length),
  };
}

// rastro: [color glifo, fondo] — canal verde puro, la cabeza casi blanca
const TRAIL: Array<[string, string]> = [
  ["#CFFFDF", "#06190a"], // cabeza incandescente con halo
  ["#00E400", "#041304"],
  ["#00CC00", "#031003"],
  ["#00B000", "#030d03"],
  ["#009600", "#020b02"],
  ["#007e00", "#020902"],
  ["#006600", "#010701"],
  ["#005000", "#010601"],
  ["#003c00", "#010401"],
  ["#002a00", "#010301"],
  ["#001c00", CELL_BG],
  ["#001200", CELL_BG],
];

export function MatrixRain({
  cols = 72,
  rows = 8,
  dropsPerCol = 3,
}: {
  cols?: number;
  rows?: number;
  dropsPerCol?: number;
}) {
  const initial = useMemo(
    () =>
      Array.from({ length: cols }, () =>
        Array.from({ length: dropsPerCol }, (_, k) => newDrop(rows, k === 0)),
      ),
    [cols, rows, dropsPerCol],
  );
  const [columns, setColumns] = useState<Drop[][]>(initial);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setColumns((prev) =>
        prev.map((col) =>
          col.map((d) => {
            const head = d.head + d.speed;
            if (head - d.len > rows + 2) return newDrop(rows);
            return { ...d, head };
          }),
        ),
      );
      setFrame((f) => f + 1);
    }, 90);
    return () => clearInterval(iv);
  }, [rows]);

  const grid: Array<Array<{ ch: string; fg: string; bg: string } | null>> = [];
  for (let r = 0; r < rows; r++) {
    const line: Array<{ ch: string; fg: string; bg: string } | null> = [];
    for (let c = 0; c < cols; c++) {
      let cell: { ch: string; fg: string; bg: string } | null = null;
      for (const d of columns[c] ?? []) {
        const age = Math.floor(d.head) - r;
        if (age < 0 || age >= TRAIL.length) continue;
        const t = TRAIL[age] ?? TRAIL[TRAIL.length - 1]!;
        const gi = (d.seed + r * 3 + c * 7 + frame) % GLYPHS.length;
        cell = { ch: GLYPHS[gi] ?? "0", fg: t[0]!, bg: t[1]! }; // el último gana: más brillante abajo
      }
      line.push(cell);
    }
    grid.push(line);
  }

  return (
    <Box flexDirection="column">
      {grid.map((line, r) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: la rejilla de la lluvia es fija por posición
        <Box key={r} flexDirection="row" height={1}>
          {line.map((cell, c) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: celda fija de la matriz
            <Text
              key={c}
              backgroundColor={cell ? cell.bg : CELL_BG}
              color={cell ? cell.fg : CELL_BG}
            >
              {cell ? cell.ch : " "}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
}
