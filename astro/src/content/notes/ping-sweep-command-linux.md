---
date: 2025-06-26T05:46:55-04:00
draft: false
title: Ping Sweep Command - Linux
tags:
  - linux
  - bash
---
```
for i in {1..254} ;do (ping -c 1 192.168.0.$i | grep "bytes from" &) ;done
```
