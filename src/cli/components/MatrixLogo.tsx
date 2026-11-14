/**
 * MATRIXÄ — el arte ASCII de Carlos TAL CUAL.
 *
 * Sin remuestrear, sin bloques, sin adelgazar: cada fila del bloque que él
 * pegó se dibífica carácter a carácter, como vino. Lo único que añade el
 * terminal es COLOR por clase de trazo:
 *   · cuerpo ($@#%&*+= y letras densas)   → fósforo / incandescente
 *   · lluvia (\ | / ( ) { } < > ~ ^ etc.) → verde medio / pino
 *   · espacio                             → aire
 * Si el terminal resulta más estrecho que el arte, NO se machaca: se pide
 * al usuario que ensanche la ventana (arranca con ~190 columnas).
 */
import { Box } from "ink";
import LOGO_TEXT from "@/cli/logo/logo-raw.txt";

const LOGO_RAW: string[] = LOGO_TEXT.replace(/\n+$/u, "").split("\n");

import { Text } from "./Text";

const GRUESO = new Set([
  "$",
  "@",
  "#",
  "%",
  "&",
  "*",
  "+",
  "=",
  "█",
  "▓",
  "m",
  "w",
  "O",
  "Q",
]);
const DIGITOS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const T_INCAN = "#d6ffd6";
const T_FOSFORO = "#7dfba0";

function tinte(c: string, par: boolean): string | undefined {
  if (c === " ") return undefined;
  if (GRUESO.has(c)) return par ? T_INCAN : T_FOSFORO;
  if (DIGITOS.has(c)) return T_FOSFORO;
  // lluvia de trazos finos: verde casi negro, que el logo se lea limpio
  return "#123f22";
}

/** Trocea una fila en tramos del mismo estado (grueso/digito/fino/aire) para emitir pocos <Text>. */
function tramos(fila: string): Array<{ seg: string; color?: string }> {
  const out: Array<{ seg: string; color?: string }> = [];
  let i = 0;
  let par = true;
  while (i < fila.length) {
    const c0 = fila[i]!;
    const col0 = tinte(c0, i % 2 === 0);
    let j = i + 1;
    while (j < fila.length && tinte(fila[j]!, j % 2 === 0) === col0) j++;
    out.push({ seg: fila.slice(i, j), color: col0 });
    i = j;
    par = !par;
  }
  return out;
}

export function MatrixLogo() {
  return (
    <Box flexDirection="column">
      {LOGO_RAW.map((fila, y) => {
        const limpia = fila.replace(/\s+$/u, "");
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: filas fijas del arte
          <Box key={`l${y}`} flexDirection="row" height={1}>
            {tramos(limpia).map((t, k) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: tramos fijos de la fila
              <Text key={`t${k}`} color={t.color}>
                {t.seg}
              </Text>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
