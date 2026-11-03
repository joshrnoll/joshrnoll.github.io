---
title: "Ansible, Tailscale and Traefik - Oh My!"
date: 2024-10-27T07:06:13-04:00
draft: true
author: Josh Noll
tags: []
toc: true
---

## Introduction

- traefik on the same docker host
- using traefik-kop to connect traefik to other docker hosts
  - traefik-kop connects to host port (published port) which is a problem because when using tailscale, I don't publish ports to the host
    - solution was to set kop.bind.ip to tailscale ip
    - automating the ip with a dynamic variable
- creating a template with service_name
