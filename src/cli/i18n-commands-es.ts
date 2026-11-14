/**
 * MATRIXÄ i18n — batch B: descripciones de comandos en castellano.
 * Clave = texto inglés canónico del registry; valor = su traducción.
 * td() se aplica en los puntos de PRESENTACIÓN (autocomplete, /help), no en el
 * registry: las claves programáticas y los tests siguen hablando inglés.
 */

const ES_COMMAND_DESCS: Record<string, string> = {
  "Browse agents (pinned, Letta Code, all)":
    "Ver agentes (fijados, MATRIXÄ, todos)",
  "Switch model": "Cambiar modelo",
  "Initialize (or re-init) your agent's memory":
    "Inicializar (o reinicializar) la memoria de tu agente",
  "Investigate an agent issue in this conversation":
    "Investigar un problema del agente en esta conversación",
  "Reflect on memory (alias for /reflect; Cloud reflects this conversation)":
    "Reflexionar sobre la memoria (alias de /reflect; en Cloud reflexiona esta conversación)",
  "Launch reflection (/reflect [--recent N | --conversation ID ... | --auto] [--instruction TEXT])":
    "Lanzar reflexión (/reflect [--recent N | --conversation ID ... | --auto] [--instruction TEXTO])",
  "Configure sleep-time reflection trigger and merge settings":
    "Configurar el disparador y la fusión de la reflexión en reposo",
  "Alias for /reflect": "Alias de /reflect",
  "Experimental blind A/B reflection model comparison":
    "Comparación ciega A/B de modelos de reflexión (experimental)",
  "Browse available skills": "Ver habilidades disponibles",
  "Enter skill creation mode (/skill-creator [description])":
    "Entrar en modo creación de habilidad (/skill-creator [descripción])",
  "View your agent's memory": "Ver la memoria de tu agente",
  "Open the Memory Palace in your browser":
    "Abrir el Palacio de la Memoria en el navegador",
  "Configure compaction mode settings": "Configurar el modo de compactación",
  "Set or reset the max context window":
    "Ajustar o resetear la ventana de contexto",
  "Manage filesystem-backed memory (/memfs [enable|sync|reset])":
    "Gestionar la memoria en ficheros (/memfs [enable|sync|reset])",
  "Search messages across all agents (/search [query])":
    "Buscar mensajes en todos los agentes (/search [consulta])",
  "Connect your LLM API keys (OpenAI, Anthropic, etc.)":
    "Conectar tus claves de API de LLMs (OpenAI, Anthropic, etc.)",
  "Clear in-context messages": "Vaciar los mensajes en contexto",
  "Reset all agent messages (destructive)":
    "Reiniciar todos los mensajes del agente (destruye)",
  "Change working directory for this TUI session (/chdir <path>)":
    "Cambiar el directorio de trabajo de esta sesión (/chdir <ruta>)",
  "Alias for /chdir": "Alias de /chdir",
  "Start a new conversation (keep agent memory)":
    "Empezar una conversación nueva (la memoria se conserva)",
  "Fork the current conversation": "Bifurcar la conversación actual",
  "Fork conversation and ask a side question (/btw <question>)":
    "Bifurcar y hacer una pregunta al margen (/btw <pregunta>)",
  "Pin current agent (/pin [name])": "Fijar el agente actual (/pin [nombre])",
  "Unpin current agent": "Dejar de fijar el agente actual",
  "Rename agent or conversation (/rename agent [name]|convo [name])":
    "Renombrar agente o conversación (/rename agent [nombre]|convo [nombre])",
  "Update the current agent's description (/description <text>)":
    "Actualizar la descripción del agente (/description <texto>)",
  "Switch toolset (replaces /link and /unlink)":
    "Cambiar el juego de herramientas (sucede a /link y /unlink)",
  "Toggle experiments": "Activar o desactivar experimentos",
  "Reload settings and local mods": "Recargar ajustes y mods locales",
  "Run mod learning targets": "Ejecutar los objetivos de aprendizaje de mods",
  "Open agent in ADE (browser)": "Abrir el agente en ADE (navegador)",
  "Switch system prompt": "Cambiar el prompt de sistema",
  "Switch personality": "Cambiar la personalidad",
  "Manage custom subagents": "Gestionar subagentes personalizados",
  "Manage MCP servers (add, connect with OAuth)":
    "Gestionar servidores MCP (añadir, conectar con OAuth)",
  "Manage plain variables for shell commands":
    "Gestionar variables normales para comandos de shell",
  "Manage secrets for shell commands":
    "Gestionar secretos para comandos de shell",
  "Push this agent's memory repo to an additional git remote":
    "Empujar el repo de memoria del agente a un git remoto adicional",
  "Show session usage statistics and balance":
    "Ver estadísticas de uso de la sesión y el saldo",
  "Show context window usage": "Ver el uso de la ventana de contexto",
  "Recompile current agent + conversation (warning: this will evict the cache and increase costs)":
    "Recompilar agente y conversación actuales (aviso: vacía la caché y encarece)",
  "Send feedback to the Letta team": "Enviar comentarios al equipo MATRIXÄ",
  "Show available commands": "Ver los comandos disponibles",
  "Manage hooks configuration": "Gestionar la configuración de hooks",
  "Customize the bottom statusline": "Personalizar la barra de estado inferior",
  "Configure terminal window title":
    "Configurar el título de la ventana del terminal",
  "Toggle Tab shortcut for reasoning tiers (/reasoning-tab on|off|status)":
    "Activar o apagar Tab para cambiar los niveles de razonamiento (/reasoning-tab on|off|status)",
  "Show or hide system reminders": "Mostrar u ocultar avisos del sistema",
  "Setup terminal shortcuts [--revert]":
    "Configurar atajos de terminal [--revert]",
  "Setup Letta Code GitHub Action in this repo":
    "Montar la GitHub Action de MATRIXÄ en este repo",
  "Show background shell processes": "Ver procesos de shell en segundo plano",
  "Show workflow runs, their agents, and token usage":
    "Ver ejecuciones de workflow, sus agentes y tokens gastados",
  "Exit this session": "Salir de esta sesión",
  "Sign in with Letta": "Entrar con MATRIXÄ",
  "Clear saved credentials and exit":
    "Borrar las credenciales guardadas y salir",
  "Toggle token streaming on/off":
    "Activar o desactivar el streaming de tokens",
  "Summarize conversation history (compaction) with optional mode":
    "Resumir el historial de la conversación (compactación) con modo opcional",
  "Alias for /context-limit": "Alias de /context-limit",
  "Attach all Letta Code tools to agent (deprecated, use /toolset instead)":
    "Adjuntar todas las herramientas de MATRIXÄ al agente (obsoleto: usa /toolset)",
  "Remove all Letta Code tools from agent (deprecated, use /toolset instead)":
    "Quitar todas las herramientas de MATRIXÄ del agente (obsoleto: usa /toolset)",
  "Resume a previous conversation": "Retomar una conversación anterior",
  "Browse pinned agents": "Ver agentes fijados",
};

export function td(desc: string): string {
  return ES_COMMAND_DESCS[desc] ?? desc;
}
