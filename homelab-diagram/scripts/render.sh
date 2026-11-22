#!/usr/bin/env bash
# Render the light (whiteboard) and dark (chalkboard) diagrams, then rebuild viewer.html.
# Needs D2 v0.9.0 on PATH, or D2=/path/to/d2.
set -euo pipefail
cd "$(dirname "$0")/.."

d2="${D2:-d2}"
fonts=.fonts
mkdir -p "$fonts"
for weight in Regular Bold; do
  font="$fonts/Kalam-$weight.ttf"
  [ -f "$font" ] || curl -fsSL -o "$font" "https://github.com/google/fonts/raw/main/ofl/kalam/Kalam-$weight.ttf"
done

render() {
  "$d2" --font-regular "$fonts/Kalam-Regular.ttf" --font-italic "$fonts/Kalam-Regular.ttf" \
    --font-bold "$fonts/Kalam-Bold.ttf" --font-semibold "$fonts/Kalam-Bold.ttf" "$1" "$2"
}
render homelab-diagram-light.d2 assets/homelab-diagram.svg
render homelab-diagram-dark.d2 assets/homelab-diagram-dark.svg
python3 scripts/build-viewer.py
