#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_MESSAGE="chore(release): publish static snapshot"

cd "${ROOT_DIR}"

COMMIT_MESSAGE="${RELEASE_MESSAGE:-$DEFAULT_MESSAGE}"
STAGE_ALL="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      COMMIT_MESSAGE="${2:-}"
      shift 2
      ;;
    --all)
      STAGE_ALL="1"
      shift
      ;;
    *)
      echo "Unknown arg: $1"
      echo "Usage: npm run release:push -- [--all] [-m \"commit message\"]"
      exit 1
      ;;
  esac
done

if [[ -z "${COMMIT_MESSAGE}" ]]; then
  echo "Commit message cannot be empty."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  if [[ "${STAGE_ALL}" == "1" ]]; then
    git add -A
  else
    git add content/cms-content.json
  fi
else
  echo "No changes detected. Nothing to commit."
  exit 0
fi

if [[ -z "$(git diff --cached --name-only)" ]]; then
  echo "No staged changes. Use --all if you also want to include code/doc edits."
  exit 1
fi

git commit -m "${COMMIT_MESSAGE}"
git push origin main

echo ""
echo "Push complete."
