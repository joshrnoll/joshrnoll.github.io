#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p astro/public/homelab-diagram
cp homelab-diagram/viewer.html homelab-diagram/assets/homelab-diagram.svg astro/public/homelab-diagram/
# Resume HTML is inlined by the Astro page, so generate it before the site build.
if [[ "${SKIP_RESUME_BUILD:-0}" != 1 ]]; then
  (cd resume && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python make.py)
fi
(cd astro && npm ci && npm run build)
mkdir -p astro/dist/resume
# /resume/index.html is the Astro page (site navbar + status bar).
# Copy assets only; do not replace that page with the generated resume document.
find resume/src -mindepth 1 -maxdepth 1 ! -name 404.html ! -name index.html -exec cp -R {} astro/dist/resume/ \;
