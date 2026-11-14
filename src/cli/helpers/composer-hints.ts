/**
 * MATRIXÄ i18n — pistas del composer vacío, extraídas de InputRich.tsx.
 * El ratchet de tamaño pide partir por responsabilidad; esto es una
 * responsabilidad aparte. Las claves van por i18n; la última no tiene
 * clave en ES y t() la devuelve tal cual (fallback inglés).
 */
export const COMPOSER_HINT_KEYS = [
  "ph.help",
  "ph.desktop",
  "ph.debug",
  "ph.explain",
  'Try "review this pull request"',
];

export function nextHintIndex(i: number): number {
  return (i + 1) % COMPOSER_HINT_KEYS.length;
}

export function composerHint(i: number): string {
  return (
    COMPOSER_HINT_KEYS[i % COMPOSER_HINT_KEYS.length] ?? COMPOSER_HINT_KEYS[0]!
  );
}
