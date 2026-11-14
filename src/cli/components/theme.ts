/**
 * MATRIXÄ — selector de paleta (fork de letta-code).
 *
 * El tema se elige de forma SINCRONA al cargar el módulo, porque `colors.ts`
 * captura la paleta al importarse (los componentes no preguntan en cada render):
 *   1. variable de entorno LETTA_THEME=matrixa|brand
 *   2. clave "theme" en ~/.letta/settings.json (campo que el CLI oficial ignora)
 *   3. por defecto: brand (comportamiento upstream intacto)
 *
 * Nada de esto toca la instalación de pipx: solo nuestra rama `matrixa` lo usa.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export type PaletteName = "brand" | "matrixa";

let cached: PaletteName | null = null;

function detect(): PaletteName {
  const env = (process.env.LETTA_THEME || "").trim().toLowerCase();
  if (env === "matrixa") return "matrixa";
  if (env === "brand" || env === "default" || env === "upstream")
    return "brand";
  try {
    const raw = readFileSync(
      path.join(homedir(), ".letta", "settings.json"),
      "utf-8",
    );
    const theme = String(JSON.parse(raw)?.theme ?? "")
      .trim()
      .toLowerCase();
    if (theme === "matrixa") return "matrixa";
  } catch {
    /* sin settings legible: brand */
  }
  return "brand";
}

export function getPalette(): PaletteName {
  if (!cached) cached = detect();
  return cached;
}
