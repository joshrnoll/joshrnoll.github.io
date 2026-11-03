---
date: 2025-06-17T11:12:37-04:00
draft: false
title: Proxmox Initial Setup
tags:
  - linux
  - proxmox
---
## Disable enterprise and enable no-subscription repo

**As of Proxmox 8, this can all be done through the GUI as well by clicking on a node and going to updates --> repositories

Disable the enterprise repo:

```bash
nano /etc/apt/sources.list.d/pve-enterprise.list
```

There should be one line in this file. Comment it out:
`
```bash
# deb https://enterprise.proxmox.com/debian/pve bookworm pve-enterprise
```

Add the pve-no-subscription repo to the file ```/etc/apt/sources.list```

```bash
deb http://ftp.debian.org/debian bookworm main contrib
deb http://ftp.debian.org/debian bookworm-updates main contrib

# Proxmox VE pve-no-subscription repository provided by proxmox.com,
# NOT recommended for production use
deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription

# security updates
deb http://security.debian.org/debian-security bookworm-security main contrib
```

***Change the ceph enterprise repo to no-subscription***. It should look like this:
```bash
cat /etc/apt/sources.list.d/ceph.list
deb http://download.proxmox.com/debian/ceph-quincy bookworm no-subscription
```

If it has an enterprise repo as it's only entry, either remove it or comment it out and add the above repo instead

Finally, do an ```apt update && apt upgrade```

## Enable IOMMU
https://www.servethehome.com/how-to-pass-through-pcie-nics-with-proxmox-ve-on-intel-and-amd/

