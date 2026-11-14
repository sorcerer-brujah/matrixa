#!/usr/bin/env node
/**
 * MATRIXÄ — hook PreToolUse: enruta comandos simples por rtk (compresor de
 * salida para contextos LLM, 60-90% menos tokens en git/ls/gh/test…).
 *
 * Protocola: recibe JSON por stdin (tool_input.command), responde
 * hookSpecificOutput.updatedInput con el comando envuelto SI:
 *   · rtk está instalado (una sola comprobación por proceso)
 *   · el comando es simple (sin pipes, ; , $, backticks, redirecciones)
 *   · su primer token está en la lista proxy de rtk
 * Cualquier otra cosa pasa quieta (exit 0 sin salida = no-op).
 */
import { spawnSync } from "node:child_process";

const RTK_CMDS = new Set([
  "git", "gh", "glab", "ls", "tree", "read", "env", "log",
  "pnpm", "dotnet", "cargo", "npm", "npx", "pytest", "go",
  "ruff", "eslint", "docker", "kubectl", "make", "tsc",
]);

let rtkAvailable = null;
function haveRtk() {
  if (rtkAvailable === null) {
    const p = spawnSync("rtk", ["--help"], { encoding: "utf-8", timeout: 4000 });
    rtkAvailable = p.status === 0;
  }
  return rtkAvailable;
}

function readStdin() {
  return new Promise((resolve) => {
    let buf = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (c) => (buf += c));
    process.stdin.on("end", () => resolve(buf));
    setTimeout(() => resolve(buf), 1500);
  });
}

const raw = await readStdin();
if (raw.trim()) {
  try {
    const input = JSON.parse(raw);
    const cmd = input?.tool_input?.command;
    if (typeof cmd === "string" && cmd.length > 0) {
      const first = cmd.trim().split(/\s+/)[0];
      if (
        RTK_CMDS.has(first) &&
        !/[|;&`$><]|\$\(/.test(cmd) &&
        !cmd.trim().startsWith("git push --force") &&
        haveRtk()
      ) {
        process.stdout.write(
          JSON.stringify({
            hookSpecificOutput: {
              hookEventName: "PreToolUse",
              updatedInput: { ...input.tool_input, command: "rtk " + cmd.trim() },
            },
          }),
        );
      }
    }
  } catch {
    /* no-op silencioso: nunca bloquear por un fallo del hook */
  }
}
process.exit(0);
