#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CMS_DIR="/Users/jianglanbo/Cursor/insurhi-cms-admin"

if [ ! -d "$CMS_DIR" ]; then
  echo "CMS directory not found: $CMS_DIR"
  echo "Please create insurhi-cms-admin first."
  exit 1
fi

cleanup() {
  if [ -n "${CMS_PID:-}" ] && kill -0 "$CMS_PID" 2>/dev/null; then
    kill "$CMS_PID" || true
  fi
  if [ -n "${WEB_PID:-}" ] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting CMS admin on http://localhost:3000 ..."
(
  cd "$CMS_DIR"
  npm run dev -- --port 3000
) &
CMS_PID=$!

sleep 2

echo "Starting frontend on http://localhost:3002 ..."
(
  cd "$ROOT_DIR"
  PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000 npm run dev -- --port 3002
) &
WEB_PID=$!

wait "$CMS_PID" "$WEB_PID"
