#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p astro/public/homelab-diagram
cp homelab-diagram/viewer.html homelab-diagram/assets/homelab-diagram.svg astro/public/homelab-diagram/
(cd astro && npm ci && npm run build)
if [[ "${SKIP_RESUME_BUILD:-0}" != 1 ]]; then
  (cd resume && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python make.py)
fi
mkdir -p astro/dist/resume
find resume/src -mindepth 1 -maxdepth 1 ! -name 404.html -exec cp -R {} astro/dist/resume/ \;
