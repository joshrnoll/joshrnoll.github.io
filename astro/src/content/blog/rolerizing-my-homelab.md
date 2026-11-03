---
title: "Rolerizing My Homelab"
date: 2024-09-24T06:22:59-04:00
draft: true
author: Josh Noll
tags:
  - Automation
  - Ansible
image: /ansiblelogo.png
description: How I'm converting my messy homelab playbook into Ansible roles
toc: true
---

## Introduction

I've recently thrust myself into an irreversible nosedive down the rabbit hole that is Ansible. It all started with the idea of [automating my homelab](/content/blog/ansible-for-infrastructure-lessons-learned-in-my-homelab-automation-efforts.md). And the humble playbook that once was, has grown into a behemoth of half-completed ideas and poorly written code. At some point I took a step back and looked at [the repo](https://github.com/joshrnoll/ansible-playbook-homelab)... and realized it was a disaster.

I was constantly repeating myself. A cardinal sin in the world of programming and automation. My fix was to write a [role](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html) for everything I found myself repeathing. A term I've coined *rolerizing*.

## How to Write a Role

After realizing my sins I did a little research on how to write good Ansible code. Jeff Geerling's book [Ansible for DevOps](https://www.ansiblefordevops.com/) covers Ansible roles, but I hadn't yet dabbled. It turns out that a role is just like a funciton. A piece of code that you can use over and over. You write it in a way that it accepts a few values and suddenly you can adopt that code for the same use case multiple times over. 

So how do you write a role? Obviously, I recommend digging into Jeff's book for a good overview. The official Ansible docs are also a great place to start. But another good way to start would be to run this command:

```bash
ansible-galaxy role init <your-role-name-here>
```

Replace the placeholder with a role name of your choice. Call it ```test``` or ```demo```... whatever you want. This command will spit out a directory with whatever you named the role. If you cd into this directory, you will see contents that look like this:

```
├── defaults
│   └── main.yml
├── files
├── handlers
│   └── main.yml
├── meta
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
├── templates
├── tests
│   ├── inventory
│   └── test.yml
└── vars
    └── main.yml    
```
Let's unpack this a bit. We have a few sections here, but I'm going to gloss over a few and zone in on a few.

### Tasks
This is where you're going to write the meat and potatoes of your role. Those tasks that you're writing over and over again in your playbooks? Those go here. 

### Defaults & Vars
You'll notice a directory called ```defaults``` and a directory called ```vars```. It can be difficult to understand these two. They're both spots to put variables. 

### Handlers
[Handlers](https://joshrnoll.com/how-handlers-work-in-ansible/)

### Tests
This is where you can write playbooks to test your roles.

### Templates
Jinja2 templates

### Meta
This is where you'll add information for your role. Only needed if you're publishing to Ansible Galaxy

### README.md
A readme file for your role. 
