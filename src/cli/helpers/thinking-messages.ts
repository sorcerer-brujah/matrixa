// MATRIXÄ — verbos de la casa: el agent no "piensa", hackea la Matrix.
const MATRIXA_THINKING_VERBS_ES = Object.freeze([
  "descifrando la señal",
  "procesando el entorno",
  "ejecutando protocolos",
  "sincronizando contexto",
  "auditando el sistema",
  "compilando intenciones",
  "mapeando dependencias",
  "estabilizando la sesión",
  "decodificando la Matrix",
]);
const MATRIXA_THINKING_VERBS = Object.freeze([
  "decoding the signal",
  "processing the matrix",
  "running protocols",
  "syncing context",
  "auditing the system",
  "compiling intent",
  "mapping dependencies",
  "stabilizing session",
  "decrypting the stream",
]);

import { getPalette } from "@/cli/components/theme"; // MATRIXÄ
// Machine god AI themed thinking verbs
import { getLang } from "@/cli/i18n"; // MATRIXÄ

const THINKING_VERBS = Object.freeze([
  "thinking",
  "processing",
  "computing",
  "calculating",
  "analyzing",
  "synthesizing",
  "deliberating",
  "cogitating",
  "reflecting",
  "reasoning",
  "spinning",
  "focusing",
  "machinating",
  "contemplating",
  "ruminating",
  "considering",
  "pondering",
  "evaluating",
  "assessing",
  "inferring",
  "deducing",
  "interpreting",
  "formulating",
  "strategizing",
  "orchestrating",
  "optimizing",
  "calibrating",
  "indexing",
  "compiling",
  "rendering",
  "executing",
  "initializing",
  "absolutely right",
  "thinking about thinking",
  "metathinking",
  "learning",
  "adapting",
  "evolving",
  "remembering",
  "absorbing",
  "internalizing",
] as const);

export const SYSTEM_PROMPT_UPGRADE_TIP =
  "Use /system to upgrade to the latest default prompt.";

export const THINKING_TIPS = Object.freeze([
  "Use /palace to inspect your agent's memory palace.",
  "Use /reflect to launch a background reflection agent to update memory.",
  "Use /search [query] to search messages across all agents.",
  "Use /init to initialize (or re-init) your agent's memory.",
] as const);

const THINKING_TIPS_WITH_SYSTEM_UPGRADE = Object.freeze([
  ...THINKING_TIPS,
  SYSTEM_PROMPT_UPGRADE_TIP,
] as const);

type ThinkingVerb = (typeof THINKING_VERBS)[number];

const PAST_TENSE_VERBS: Record<ThinkingVerb, string> = {
  thinking: "thought",
  processing: "processed",
  computing: "computed",
  calculating: "calculated",
  analyzing: "analyzed",
  synthesizing: "synthesized",
  deliberating: "deliberated",
  cogitating: "cogitated",
  reflecting: "reflected",
  reasoning: "reasoned",
  spinning: "spun",
  focusing: "focused",
  machinating: "machinated",
  contemplating: "contemplated",
  ruminating: "ruminated",
  considering: "considered",
  pondering: "pondered",
  evaluating: "evaluated",
  assessing: "assessed",
  inferring: "inferred",
  deducing: "deduced",
  interpreting: "interpreted",
  formulating: "formulated",
  strategizing: "strategized",
  orchestrating: "orchestrated",
  optimizing: "optimized",
  calibrating: "calibrated",
  indexing: "indexed",
  compiling: "compiled",
  rendering: "rendered",
  executing: "executed",
  initializing: "initialized",
  "absolutely right": "was absolutely right",
  "thinking about thinking": "thought about thinking",
  metathinking: "did metathinking",
  learning: "learned",
  adapting: "adapted",
  evolving: "evolved",
  remembering: "remembered",
  absorbing: "absorbed",
  internalizing: "internalized",
};

// Get a random thinking verb (e.g., "thinking", "processing")
function getRandomVerb(): string {
  // MATRIXÄ: si el tema de la casa está activo, elige de sus verbos
  if (getPalette() === "matrixa") {
    // MATRIXÄ i18n: en la casa se piensa en castellano
    const pool =
      getLang() === "en" ? MATRIXA_THINKING_VERBS : MATRIXA_THINKING_VERBS_ES;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] ?? "decoding the Matrix";
  }
  const index = Math.floor(Math.random() * THINKING_VERBS.length);
  return THINKING_VERBS[index] ?? "thinking";
}

// Get a random thinking verb phrase (e.g., "is thinking", "is processing")
export function getRandomThinkingVerb(): string {
  return `is ${getRandomVerb()}`;
}

// Get a random past tense verb (e.g., "thought", "processed")
export function getRandomPastTenseVerb(): string {
  const verb = getRandomVerb() as ThinkingVerb;
  return PAST_TENSE_VERBS[verb] ?? "completed";
}

export function getRandomThinkingTip(options?: {
  includeSystemPromptUpgradeTip?: boolean;
}): string {
  const tipPool =
    (options?.includeSystemPromptUpgradeTip ?? true)
      ? THINKING_TIPS_WITH_SYSTEM_UPGRADE
      : THINKING_TIPS;
  const index = Math.floor(Math.random() * tipPool.length);
  return tipPool[index] ?? tipPool[0] ?? THINKING_TIPS[0] ?? "";
}
