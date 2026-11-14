#!/usr/bin/env bash
# MATRIXÄ — instala delta + difftastic (OK del usuario 14-nov) y configura git
# de forma SEGURA para agentes: delta solo como pager INTERACTIVO (los pipes
# de los agentes siguen viendo diff crudo), difftastic como alias opt-in.
set -euo pipefail

echo "[1/3] instalando git-delta y difftastic (pide sudo a propósito)"
sudo pacman -S --needed --noconfirm git-delta difftastic

echo "[2/3] configuración de git (interactiva y segura para no-tty)"
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'
git config --global delta.navigate true
git config --global delta.line-numbers true
git config --global delta.side-by-side false
git config --global merge.conflictStyle zdiff3
git config --global alias.dt '!difft'   # uso opt-in: git dt <ref>

echo "[3/3] verificación"
delta --version
difft --version
echo "listo: delta como pager humano; 'git dt' para difftastic; los pipes de los agentes no cambian."
