---
title: "Using Flux to Deploy Apps With GitOps"
date: 2025-03-05T04:36:40-05:00
draft: true
author: Josh Noll
tags:
  - Kubernetes
  - GitOps
  - Flux
  - Git
  - Infrastructure as Code
description: How I use FluxCD to deploy apps to my Kubernetes clusters.
toc: true
---

## Introduction

## Install and Bootstrap Flux

Install flux CLI
```
brew install fluxcd/tap/flux
```

check context
```
kubectl config current-context
```

```
kubectl config use-context <context-name>
```

Export token
```
export GITEA_TOKEN=<gt-token>
```

Bootstrap flux
```
flux bootstrap gitea \
--token-auth \
--owner=joshrnoll \
--repository=homelab-as-code \
--branch=main \
--path=clusters/staging \
--personal \
--hostname=gitea.mydomain.com
```

If you fudge up and bootstrap against the wrong repo

```
flux uninstall --namespace=flux-system
```