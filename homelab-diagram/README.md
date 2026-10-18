<img src="assets/icon.svg" width="64" height="64" alt="">

## My Homelab Diagram

Homelab topology: bare-metal Talos, standalone Proxmox, tiered NAS storage, and UniFi VLANs.

**Zoom and pan:** download [viewer.html](viewer.html) using GitHub's **Download raw file** button, then open it in your browser. After cloning the repo, open `viewer.html` directly. It works offline with no server or extra packages.

Drag to pan, scroll or pinch to zoom, and use **Fit diagram** to see the whole topology. Keyboard controls: arrow keys to pan, `+` / `-` to zoom, `F` to fit, and `0` for actual size.

[![Homelab topology diagram](assets/homelab-diagram.svg)](assets/homelab-diagram.svg)

Edit [homelab-diagram.d2](homelab-diagram.d2), then regenerate the SVG with [D2](https://d2lang.com/) (rendered with v0.9.0):

```sh
d2 --layout elk --theme 200 homelab-diagram.d2 assets/homelab-diagram.svg
python3 scripts/build-viewer.py
```

The second command embeds the SVG in `viewer.html`. To change the viewer controls or layout, edit [scripts/viewer-template.html](scripts/viewer-template.html) and rebuild it.

Created in [T3 Code](https://t3.codes).
