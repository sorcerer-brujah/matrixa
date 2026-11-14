# MATRIXÄ — guía del fork

## Que es esto
MATRIXÄ es nuestra copia de Letta Code (el CLI con el que hablamos los agentes) con
identidad propia: paleta verde fósforo, mensaje de "pensando" de la casa y, poco a
poco, mejoras que el upstream no tiene o no aún. Basado en `letta-ai/letta-code`
(Apache-2.0; los cabeceras de autoría original se conservan intactas).

## Lanza r
```bash
cd ~/Projects/matrixa
bun install            # solo la primera vez (bun via mise)
./scripts/matrixa.sh   # = bun run src/index.ts con LETTA_THEME=matrixa
```
El `letta` de pipx (producción) no se toca: el fork vive en `src/` tal cual, sin compilar.

## El tema
- `src/cli/components/theme.ts` — decide la paleta al cargar: env `LETTA_THEME=matrixa` >
  `"theme":"matrixa"` en `~/.letta/settings.json` > `brand` (comportamiento oficial).
- `src/cli/components/colors.ts` — añade `brandColorsMatrixa` y la elige; añade
  `shellSyntaxMatrixa` y fondo de mensaje de usuario `#0B2416`. Todos los componentes
  heredan porque upstream centralizó el color aquí.
- `src/cli/helpers/thinking-messages.ts` — verbos de la casa ("decoding the Matrix",
  "summoning Elvis", "consulting the census") cuando el tema está activo.

## Ver el tema sin abrir un segundo CLI
```bash
LETTA_THEME=matrixa FORCE_COLOR=3 bun scripts/matrixa-demo.tsx /tmp/demo.ans
python3 tools/ansi2html.py /tmp/demo.ans /tmp/demo.html
chromium --headless=new --window-size=1000,560 --screenshot=/tmp/demo.png file:///tmp/demo.html
```
(Necesario FORCE_COLOR: chalk desactiva el color cuando la salida no es TTY.)

## Sincronizar con upstream
```bash
git fetch upstream
git merge upstream/main        # resuelve conflictos; los nuestros están marcados con MATRIXÄ
bun run typecheck && bunx biome check src/
```

## Reglas del repo (AGENTS.md, para todos los agentes de la casa)
- Cambios no triviales: rama/worktree propio; nunca `--amend`; commits nuevos.
- Checks antes de dar nada por bueno: `bun run check` (o al menos typecheck + biome de lo tocado).
- No romper el modo `brand`: todo lo visual cuelga de `getPalette() === "matrixa"`.

## Backlog (por priorizar con Carlos)
1. Banner de arranque propio (ascii "MATRIXÄ" + prompt de shell de la casa) en AnimatedLogo/welcome.
2. Cajas de input/bordes con estilo consola (borderStyle double en modo matrixa).
3. Sonidos por agente integrados con el sistema de Zero (fin de turno, aprobación pendiente).
4. Footer con coste/tokens de la sesión en vivo.
5. Tema por agente (cada uno de la colmena con su acento de color).
