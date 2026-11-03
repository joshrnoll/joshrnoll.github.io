---
date: 2025-05-11T07:10:17-04:00
draft: false
title: Kubernetes Notes
tags:
  - kubernetes
---

## Questions
- How would I put a deployment on a different physical subnet than the cluster? Is this possible?

## Namespace
- virtual cluster
- used for organizing apps
- volumes are available globally
- kubens -- tool for changing namespace so that you don't have to provide flag when command is run
## Ingress
- LoadBalancer == external service
- External service has targetport and nodeport
- Internal service has no nodeport
- **Entrypoint** --> external server that forwards requests to cluster (proxy like traefik)
- 
## Helm
- Helm Charts -- kind of like dockerhub but for kubernetes configurations
- Example, elastic stack is the same across most deployments so it is packaged in Helm
- Templating engine --> like jinja2
- Structure:
		mychart/
			Chart.yaml
			values.yaml
			charts/
			templates/
## Service
Services use selectors which point to labels on pods for requests to be forwarded to

### Config Files
Each config has API version and 'Kind' (deployment, service, etc)
2. Metadata
3. Specification (meat & potatoes)
Template -- config file inside config file

### Persistent Volumes and PVCs
- Mount path configured under container via 'volumeMount'
- PVC specified under 'volumes'
- Persistent volume defined in its own file
```YAML
apiVersion: v1
kind: Pod
metadata:
	name: my-pod
spec:
	containers:
		- name: myfrontend
		  image: nginx
		  volumeMounts:
		  - MountPath: "/var/www/html"
		    name: my-data
	volumes:
		- name: my-data
		  persistentVolumeClaim:
		    claimName: my-pvc
```
