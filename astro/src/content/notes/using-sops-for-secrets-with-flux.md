---
date: 2025-05-11T07:10:17-04:00
draft: false
title: Using SOPS for Secrets with Flux
tags:
  - fluxcd
  - gitops
  - secretsmanagement
---

- **Age is used for encryption in the following examples**
- In the flux-system folder of your repo, add a kustomization file telling flux where your secrets are and what kubernetes secret holds the private keys:

```YAML
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: secrets
  namespace: flux-system
spec:
  interval: 10m0s
  path: ./secrets/staging # Path to where the secrets are in the repo
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  decryption:
    provider: sops
    secretRef:
      name: sops-age-key # Kubernetes secret that has private key (create manually)
```

- Create a kubernetes secret with the age private key:
```YAML
---
apiVersion: v1
kind: Secret
metadata:
  name: sops-age-key
  namespace: flux-system # Doesn't work with default namespace
data:
  identity.agekey: <BASE64>
```

- Add a .sops.yaml file to your path defined in the kustomization file:
```
creation_rules:
  - path_regex: .*.yaml
    encrypted_regex: ^(data|stringData)$
    age: <age-public-key>
```
*This file tells sops/flux that any .yaml file in this directory will have the keys of data and/or stringData encrypted using the provided age key*

> NOTE: You cannot edit unencrypted fields in a file that has been encrypted in any way. Decrypting the file after a manual change like this will produce this error:
> 
> MAC mismatch. File has D6B60BF87772FE715ED3C1C9250C9D26A52C827FAE1DB5C97193C3F5F27B6917B51C19BBD63A88225855CD2ED119C8CE06865D0E48C583F909623D807812DC65, computed D7097A942B3FFEB9F5DE801C3C239BB3769B1E2CB4A40B81319E53C712E26C0DC56DC3B5D90F1B49FAC7EE8D98FE3F187FF51787AF357A797DD013952886DF91
> 
> You must unencrypt the file, make the change and then re-encrypt the file. Ex:

```
sops --decrypt --in-place tailscale-secrets.yaml
```
Then make necessary changes and re-encrypt.
```
sops --encrypt --in-place tailscale.yaml
```

> NOTE: 