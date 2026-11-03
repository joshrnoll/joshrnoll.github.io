---
date: 2025-07-13T07:19:12-04:00
draft: false
title: Change Configured DNS with resolvectl
tags:
  - linux
  - dns
  - fedora
---
Check the interface you want to set DNS on:

```
resolvectl status
```

Set the new DNS servers:

```
sudo resolveclt dns <interface-name> <first-dns-server-ip> <nth-dns-server-ip>
```

Flush cache and test:
```
resolvectl flush caches && ping google.com
```
