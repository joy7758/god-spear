#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/Users/zhangbin/GitHub"
OUT="ADOPTION.md"

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
  cd "$repo" || continue

  # only include repos that have spear workflow
  if [[ ! -f ".github/workflows/spear.yml" ]]; then
    continue
  fi

  # get origin github url
  origin="$(git remote get-url origin 2>/dev/null || true)"
  if [[ "$origin" != *"github.com"* ]]; then
    continue
  fi

  # normalize owner/repo
  slug="$(echo "$origin" | sed -E 's|.*github.com[:/](.*)/(.*)\.git|\1/\2|')"

  echo "| \`$slug\` | ![spear-check](https://img.shields.io/github/actions/workflow/status/$slug/spear.yml?label=spear-check) |" >> "$OUT"
done

echo "" >> "$OUT"
echo "Last updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUT"
