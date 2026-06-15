#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SRC="$REPO_DIR/skills/cross-risk-guardian"
SKILL_DST="$HOME/.claude/skills/cross-risk-guardian"

mkdir -p "$HOME/.claude/skills"

if [ -L "$SKILL_DST" ]; then
  current="$(readlink "$SKILL_DST")"
  if [ "$current" != "$SKILL_SRC" ]; then
    rm "$SKILL_DST"
    ln -s "$SKILL_SRC" "$SKILL_DST"
  fi
elif [ -e "$SKILL_DST" ]; then
  echo "ERROR: $SKILL_DST exists and is not a symlink." >&2
  exit 1
else
  ln -s "$SKILL_SRC" "$SKILL_DST"
fi

( cd "$SKILL_SRC" && CI=true npm ci --no-audit --no-fund --silent )
echo "ok cross-risk-guardian installed"
