#!/usr/bin/env python3
"""Bundle the rendered SVG into a portable, offline HTML viewer."""

import base64
from pathlib import Path
import xml.etree.ElementTree as ET


root = Path(__file__).resolve().parent.parent
svg = (root / "assets/homelab-diagram.svg").read_bytes()
view_box = ET.fromstring(svg).attrib["viewBox"].split()
width, height = (float(value) for value in view_box[2:])
assert width > 0 and height > 0, "The SVG must have a positive viewBox size"

html = (root / "scripts/viewer-template.html").read_text(encoding="utf-8")
for token, value in {
    "__DIAGRAM_DATA_URL__": "data:image/svg+xml;base64," + base64.b64encode(svg).decode("ascii"),
    "__DIAGRAM_WIDTH__": f"{width:g}",
    "__DIAGRAM_HEIGHT__": f"{height:g}",
}.items():
    html = html.replace(token, value)

output = root / "viewer.html"
output.write_text(html, encoding="utf-8")
print(f"Built {output.name} ({output.stat().st_size:,} bytes)")
