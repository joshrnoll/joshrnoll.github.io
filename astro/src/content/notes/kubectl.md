---
date: 2025-06-15T05:22:21-04:00
draft: false
title: kubectl
tags:
  - kubernetes
---
### Working with multiple clusters
- Check the name of the cluster in your kubeconfig file (default path ~/.kube/config)
```YAML
- context:
	cluster: nollhomelab
	namespace: default
	user: admin@nollhomelab
name: admin@nollhomelab
```
- Switch to the desired context based on the 'name' field:
```
kubectl config use-context admin@nollhomelab
```
