---
title: "My Plan for Homelab as Code"
date: 2025-02-19T15:33:39-05:00
draft: false
author: Josh Noll
tags:
  - Automation
  - Infrastructure as Code
  - Kubernetes
  - Linux
  - Ansible
  - Terraform
  - Talos
image: /my-plan-for-homelab-as-code/homelab-as-code.png
toc: true
---

## Introduction
I've spent the last several weeks playing around with Kubernetes in my homelab. I haven't actually migrated any services that I'm running to Kubernetes yet though. Not even close. I've spent this time in a true lab environment. I've been trying things out. I've been deploying things, destroying things and re-deploying things all in the name of understanding a little more about Kubernetes and GitOps. 

You can read some of my stream of consciousness at [this github repo](https://github.com/joshrnoll/kubernetes-demo-project). I also found myself on a small side quest at one point writing [this script](https://github.com/joshrnoll/talos-scripts) which was meant to configure a Kubernetes cluster on Talos linux. 

After successfully deploying a few things, I think I know enough to be dangerous. I've put together a plan to migrate my entire homelab to a CI/CD pipeline built around Kubernetes and GitOps. 

## The Current Situation
I recently [wrote a post](https://joshrnoll.com/how-i-deploy-services-in-my-homelab/) about how I deploy things in my homelab. The TL;DR is that I have an enormous Ansible playbook that is meant to manage and deploy everything from Linux server configurations to Docker containers. It works, but things break often enough for it to be annoying. Running the entire playbook takes forever and it's very prone to errors. 

Breaking things (and subsequently fixing them) is part of the homelab journey. I don't expect that this new idea I have for Homelab-as-Code is going to solve all my problems. If anything, it will just replace my current problems with different ones. But, hey, it's all part of the journey.

## The Goal
If I'm successful in this transition... the following things will happen when I push to my Homelab-as-Code git repository (on either GitHub or a self-hosted Gitea). These will be done with a combination of [GitHub/Gitea actions](https://github.com/features/actions) and a GitOps tool (most likely [Flux CD](https://fluxcd.io/)):

1. Run an Ansible playbook to conduct a baseline configuration of my Proxmox hosts and deploy any necessary virtual machine templates.<br></br>
2. Run Terraform code to ensure my desired virtual machines exist in my Proxmox cluster. This will include regular Ubuntu/Fedora VMs as well as VMs running Talos Linux for my Kubernetes cluster.<br></br>
3. Run an Ansible playbook to conduct a baseline configuration of all other servers (virtual machines that were just created by Terraform, as well as other bare-metal machines).<br></br>
4. Apply my Talos configuration to the VMs running Talos and ensures my Kubernetes cluster is bootstrapped.<br></br>
5. Ensure a GitOps tool (such as Flux) is installed on my Kubernetes cluster and bootstrapped against the appropriate git repository.<br></br>
6. Profit

The order of these things isn't set in stone, but I believe that they will most likely need to happen in the order defined above. 

## The Plan
It will take a while to get there. But I plan on writing about this process at every step of the way, documenting my learning journey as I go. Here's my plan. I'll write a minimum of one post for each step:

1. Deploy **two Kubernetes clusters** on Talos linux via Proxmox VMs:
    - One for "production" which will have 3 control plane nodes and 3 worker nodes.
    - One for "staging/testing" which will be a single node cluster to conserve resources.
    - Both will be on [Tailscale](https://tailscale.com), of course.<br></br>
2. Install and configure the Tailscale ingress controller and [Custom Resource Definitions (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) via [Helm](https://helm.sh).<br></br>
3. Install and configure [Longhorn](https://longhorn.io) for persistent storage via Helm.<br></br>
4. Install and configure the [Traefik](https://traefik.io) ingress controller to manage HTTPS certificates for my custom domain. Again, via Helm.<br></br>
5. Install and bootstrap Flux (or a similar tool, such as [ArgoCD](https://argoproj.github.io/cd/)) and deploy my first app to Kubernetes.<br></br>
6. Migrate data from my existing homelab setup to the Longhorn volume used by the app in Kubernetes.<br></br> 
7. Configure my GitOps tool to manage the Helm releases and configurations for Tailscale, Longhorn, Traefik and anything else I install via Helm. Also set up automatic container version updates for applications running in the cluster.<br></br>
8. Set up GitHub/Gitea actions to run an Ansible playbook for baselining Proxmox nodes and deploying VM templates.<br></br>
9. Learn Terraform and add Terraform code to my GitHub/Gitea actions pipeline.<br></br>
10. Validate that the pipeline works as intended -- begin migrating applications to Kubernetes. <br></br>
11. **This step is a** ***maybe***: Write my own containerized web application and deploy to my cluster using this new pipeline.<br></br>
12. Profit (or cry) at the potentially unnecessary complexity that I've injected into my life.

## Conclusion
The idea of Infrastructure-as-Code is fascinating to me and automation is one of my favorite things to learn about and practice. Learning a bit about Kubernetes and GitOps has opened my eyes to just how automated things can be and I'm very excited to get to work building my own CI/CD pipeline. My **Homelab-as-Code**.