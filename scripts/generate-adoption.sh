#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/Users/zhangbin/GitHub"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT_DIR/ADOPTION.md"

echo "# Adoption (Dogfooding Evidence)" > "$OUT"
echo "" >> "$OUT"
echo "The following repositories have **spear-check (CI-only)** enabled and pinned to \`god-spear@0.2.0\`." >> "$OUT"
echo "" >> "$OUT"
echo "> This page is generated from local repos under \`$BASE_DIR\`." >> "$OUT"
echo "" >> "$OUT"
echo "| Repo | spear-check |" >> "$OUT"
echo "|---|---|" >> "$OUT"

find "$BASE_DIR" -maxdepth 2 -type d -name ".git" -print0 | while IFS= read -r -d '' g; do
  repo="${g%/.git}"

  # only include repos that have spear workflow
  if [[ ! -f "$repo/.github/workflows/spear.yml" ]]; then
    continue
  fi

  # get origin github url
  origin="$(git -C "$repo" remote get-url origin 2>/dev/null || true)"
  if [[ "$origin" != *"github.com"* ]]; then
    continue
  fi

  # normalize owner/repo for both SSH and HTTPS remotes
  slug="$origin"
  slug="${slug#git@github.com:}"
  slug="${slug#https://github.com/}"
  slug="${slug#http://github.com/}"
  slug="${slug%.git}"

  echo "| \`$slug\` | ![spear-check](https://img.shields.io/github/actions/workflow/status/$slug/spear.yml?label=spear-check) |" >> "$OUT"
done

echo "" >> "$OUT"
echo "Last updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUT"
