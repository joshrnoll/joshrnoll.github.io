---
date: 2025-05-12T05:27:50-04:00
draft: false
title: Ephemeral Tailscale Nodes on Talos Linux
tags:
  - kubernetes
  - talos
  - tailscale
---
Recently, we had an internet outage that lasted most of the day.

All of the nodes on my Talos cluster have been provisioned using a Tailscale Authkey. All Tailscale Authkey's expire after a maximum of 90 days. 

Normally, I would use a Tailscale Oauth Client, which does not expire, however, the Talos Taillscale extension docs said to use an Authkey. 

I happened to have configured this Authkey to deploy machines as *ephemeral nodes.*

An ephemeral node is as it sounds: it removes itself from your tailnet after coming offline (usually takes a minute or two).

Unfortunately, for me, my internet outage happened about the same time that this Authkey had expired. So, when my nodes came back online, they were unable to authenticate to my tailnet. 

I'll be testing using an Authkey, which will expire after 1x day, but does not provision machines as ephemeral nodes. 