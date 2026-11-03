---
date: 2025-05-11T07:10:17-04:00
draft: false
title: From-Scratch Rebuild Process
tags:
  - homelab
  - disasterrecovery
---

In the event of a disaster, rebuilding the entire homelab once homelab-as-code is complete should look like this:

- Install Proxmox on desired hosts
- Set up desired VM storage (ha-zfs-storage, ceph etc.)
- Add hosts to cluster & set up HA
- Add new hostname & IPs to ansible inventory group(s)
- Add a new host_vars file for each new host (delete old ones as necessary)
- Verify proper storage is referenced in proxmox setup playbook
- Generate new API key and add to secrets.yaml
- Manually run:
	- proxmox setup playbook
	- terraform to provision VMs
	- talos bootstrap script
	- *get new kubeconfig using talosctl*
	- use kubectl to apply manifests for *infrastructure* resources:
		- tailscale
		- traefik
		- longhorn
		- authentik
		- gitea
	- restore authentik/gitea from backups
	- install & bootstrap flux against gitea repo
- The rest should happen ***automagically***
- 