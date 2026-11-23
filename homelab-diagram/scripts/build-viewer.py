#!/usr/bin/env python3
"""Bundle the light and dark SVGs into a portable, offline HTML viewer."""

import base64
from pathlib import Path
import xml.etree.ElementTree as ET


root = Path(__file__).resolve().parent.parent
light = (root / "assets/homelab-diagram.svg").read_bytes()
dark = (root / "assets/homelab-diagram-dark.svg").read_bytes()


def size(svg):
    view_box = ET.fromstring(svg).attrib["viewBox"].split()
    return tuple(float(value) for value in view_box[2:])


width, height = size(light)
assert width > 0 and height > 0, "The SVG must have a positive viewBox size"
assert size(dark) == (width, height), "The light and dark SVGs must share a layout"


def data_url(svg):
    return "data:image/svg+xml;base64," + base64.b64encode(svg).decode("ascii")


html = (root / "scripts/viewer-template.html").read_text(encoding="utf-8")
for token, value in {
    "__DIAGRAM_LIGHT_URL__": data_url(light),
    "__DIAGRAM_DARK_URL__": data_url(dark),
    "__DIAGRAM_WIDTH__": f"{width:g}",
    "__DIAGRAM_HEIGHT__": f"{height:g}",
}.items():
    html = html.replace(token, value)

output = root / "viewer.html"
output.write_text(html, encoding="utf-8")
print(f"Built {output.name} ({output.stat().st_size:,} bytes)")
