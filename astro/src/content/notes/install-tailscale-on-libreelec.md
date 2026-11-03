---
date: 2025-07-14T10:41:55-04:00
draft: false
title: Install Tailscale on LibreELEC
tags:
  - tailscale
  - raspberrypi
  - libreelec
  - kodi
---
1. SSH Into LibreElec
2. cd into the ```/storage``` directory and download the latest release of tailscale from the URL that corresponds with your CPU architecture https://pkgs.tailscale.com/stable/#static
   
```
cd /storage && wget https://pkgs.tailscale.com/stable/tailscale_1.84.0_arm64.tgz
```

3. Extract the file (optionally remove the tar to save space and keep the directory cleaner)

```bash
tar xzvf ailscale_1.84.0_arm64.tgz \
rm tailscale_1.84.0_arm64.tgz # optional
```

4. Create a file called ```autostart.sh``` in the ```/storage/.config``` directory and make it executable.

```bash
nano /storage/.config/autostart.sh && chmod +x /storage/.config/autostart.sh
```

Add the following contents:

```bash
(
cd /storage/tailscale_1.84.0_arm64 &&
./tailscaled --state=tailscaled.state
) &
```


