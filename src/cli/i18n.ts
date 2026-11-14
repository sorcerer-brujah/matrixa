/**
 * MATRIXÄ — i18n de la casa. Castellano por defecto, inglés opcional.
 *
 * Elección de idioma (mismo patrón síncrono que theme.ts, se fija al cargar):
 *   1. LETTA_LANG=es|en (variable de entorno)
 *   2. "language": "es"|"en" en ~/.letta/settings.json
 *   3. por defecto: es (somos españoles y point)
 *
 * t("clave", {x: 3}) sustituye {x}. Si falta la clave en el idioma activo,
 * cae al inglés y, si tampoco existe, devuelve la propia clave (nunca crash).
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export type Lang = "es" | "en";

let cached: Lang | null = null;

function detectLang(): Lang {
  const env = (process.env.LETTA_LANG || "").trim().toLowerCase();
  if (env.startsWith("en")) return "en";
  if (env.startsWith("es")) return "es";
  try {
    const raw = readFileSync(
      path.join(homedir(), ".letta", "settings.json"),
      "utf-8",
    );
    const lang = String(JSON.parse(raw)?.language ?? "")
      .trim()
      .toLowerCase();
    if (lang.startsWith("en")) return "en";
  } catch {
    /* sin settings: es por defecto */
  }
  return "es";
}

export function getLang(): Lang {
  if (!cached) cached = detectLang();
  return cached;
}

const EN: Record<string, string> = {
  "welcome.tagline": "· the hive in green",
  "welcome.subtitle":
    "D I G I T A L   S O R C E R E R   —   the forge of the hive",
  "welcome.version_suffix": " · matrixa",
  "welcome.wake": "· wake up, Neo…",
  "load.profiles": "Waking the hive…",
  "load.init_new": "Following the white rabbit…",
  "load.init_resume": "Replugging the rabbit hole…",
  "load.assembling": "Assembling reality…",
  "load.checking": "Checking for red pills…",
  "load.selecting": "Choosing your pill…",
  "load.default": "Decoding the Matrix…",
  "ph.help": 'Try "help me understand this codebase"',
  "ph.desktop": 'Try "help me organize my desktop"',
  "ph.debug": 'Try "debug this error"',
  "ph.explain": 'Try "explain what this function does"',
  "ph.review": 'Try "review this pull request"',
  "thinking.local": "decoding the Matrix",
};

const ES: Record<string, string> = {
  "welcome.tagline": "· la colmena en verde",
  "welcome.subtitle":
    "D I G I T A L   S O R C E R E R   —   la forja de la colmena",
  "welcome.version_suffix": " · matrixa",
  "welcome.wake": "· despierta, Neo…",
  "load.profiles": "Despertando a la colmena…",
  "load.init_new": "Siguiendo al conejo blanco…",
  "load.init_resume": "Reconectando con la madriguera…",
  "load.assembling": "Ensamblando la realidad…",
  "load.checking": "Buscando pastillas rojas…",
  "load.selecting": "Eligiendo tu pastilla…",
  "load.default": "Decodificando la Matrix…",
  "ph.help": "Prueba con «ayúdame a entender este código»",
  "ph.desktop": "Prueba con «ayúdame a ordenar el escritorio»",
  "ph.debug": "Prueba con «depura este error»",
  "ph.explain": "Prueba con «explícame qué hace esta función»",
  "thinking.local": "siguiendo al conejo blanco",
};

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const lang = getLang();
  let s = (lang === "en" ? EN[key] : (ES[key] ?? EN[key])) ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params))
      s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
