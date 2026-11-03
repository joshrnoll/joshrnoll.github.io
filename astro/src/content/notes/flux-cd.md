---
date: 2025-05-11T07:10:17-04:00
draft: false
title: Flux CD
tags:
  - kubernetes
  - fluxcd
  - gitops
---
### Installation
1. Create a PAT in Gitea with the following permissions:
	- read:misc
	- write:repository
	- write:user
2. Store the PAT in an env variable (save it to a PW manager too):
```
export GITEA_TOKEN=<gt-token>
```
3. Ensure your context in kubectl is set to the desired cluster:
```
kubectl config current-context
```
If the output is not your desired context, use the following to change it
```
kubectl config use-context <context-name>
```
4. Bootstrap flux:
```
flux bootstrap gitea \
--token-auth \
--owner=joshrnoll \
--repository=flux-demo \
--branch=main \
--path=clusters/demo \
--personal \
--hostname=gitea.nollhome.casa
```

> ensure that the *path* argument is the desired path *within the repo* -- if the repo or path does not already exist, flux will create them

5. Clone the repo and cd into the cluster directory:
```
git clone https://gitea.nollhome.casa/joshrnoll/flux-demo.git && cd flux-demo
```
6. Create an apps directory and a subdirectory for your first app:
```
mkdir -p apps/uptime-kuma/deploy
```
7. Create a kustomization yaml file for the app:
```
flux create kustomization uptime-kuma \
    --source=GitRepository/flux-system \
    --path="./apps/uptime-kuma/deploy" \
    --prune=true \
    --interval=60m \
    --wait=true \
    --health-check-timeout=3m \
    --export > ./clusters/demo/flux-system/apps.yaml
```
8. Add the apps.yml file to your kustomization.yaml file in flux system directory:
```YAML
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- gotk-components.yaml
- gotk-sync.yaml
- apps.yaml # <-- Add this
```
9. Add your deployment manifests to the ```apps/uptime-kuma/deploy``` directory. 
Your final directory structure should look something like this:

```
.
├── apps
│   └── uptime-kuma
│       └── deploy
│           └── uptime-kuma.yml
└── clusters
    └── demo
        └── flux-system
            ├── apps.yaml
            ├── gotk-components.yaml
            ├── gotk-sync.yaml
            └── kustomization.yaml
```

1. Git add, commit and push and watch the magic happen!

### Troubleshooting
To manually pause management of a resource in Flux, use ```flux suspend``` and ```flux resume``` commands:
```
flux suspend helmrelease tailscale -n tailscale
```
then
```
flux resume helmrelease tailscale -n tailscale
```