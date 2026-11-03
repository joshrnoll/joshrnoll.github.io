---
title: "How Handlers Work in Ansible"
date: 2024-09-19T05:30:04-04:00
draft: false
author: Josh Noll
tags:
  - Automation
  - Ansible
image: /ansiblelogo.png
description: A quick overview of Ansible handlers
toc: true
---

## Introduction

I recently ran into a frustration while working on some Ansible roles. I was attempting to use an Ansible handler to reset the SSH connection after making a change to a user. 

My role was attempting to install Docker, add the Ansible User to the Docker Group, and deploy a container. However, the addition of the user to the Docker group wouldn't take effect until the connection was reset (until that user logged out and logged back in). 

So, I created a handler to reset the connection whenever the task of adding the user to the Docker group produced a 'changed' status. Much to my dismay, however, no matter how many times I double checked that I had notified the handler correctly, the connection would not reset and the play would fail. 

## What is an Ansible Handler?
When writing automation logic, there are often times when you need something to execute conditionally. "If this happens, then do this." Ansible supports conditionals like this. You could write something like:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      register: useradded

    - name: Reset connection
      ansible.builtin.meta: reset_connection
      when: useradded.changed
```

There's two problems with doing it this way:

1. The ansible.builtin.meta module doesn't support conditionals. **So this task will always fail.**
2. It's not a very 'Ansiblely' way of doing it -- because handlers exist.

**A handler is simply a task that that can be ran on change.** So, since I was adding a user to a group, needed changes to take effect before continuing, I figured that I could just *notify* the handler like this:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      notify:
        - Reset connection

  handlers:
    - name: Reset connection
      ansible.builtin.meta: reset_connection
```

Notice the only difference is that we've taken the meta task outside of the 'tasks' section and placed it in a new 'handler' section. Then, in the task which adds the user to the docker group, we *notify* the handler. 

We've also gotten rid of the useradded variable and the when conditional because they're no longer needed. 

## The Problem

This works fine in a play as simple as the example given. But let's add to it and see where this breaks down:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      notify:
        - Reset connection

    - name: Deploy a container
      community.general.docker_container:
        ...
        # This will fail if the user wasn't already in the docker group

  handlers:
    - name: Reset connection
      ansible.builtin.meta: reset_connection
```

As you can see, the task of deploying a container fails. But why? Isn't the handler notified to reset the connection? Now, of course, we could just re-run the playbook. And since Ansible is [idempotent](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html#desired-state-and-idempotency), it will detect that the user is already a member of the Docker group and skip that task. Then, it will deploy the container without issue because the connection was reset when the playbook failed. But having to run a playbook twice in order for all desired changes to happen isn't conducive to automation efforts. 

Let's take a closer look at the [docs](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_handlers.html)... In reference to Ansible's example playbook on handlers it states:

"In this example playbook, the Apache server is restarted by the handler ***after all tasks are completed in the play.***"

So, the connection isn't going to be reset until **ALL tasks** in that play have completed. But, in our case, because one of those tasks is dependent on that handler being run, the play will fail. Subsequently, the handler is never run at all. 

### The Open Issue

Wouldn't it be useful to inform Ansible that we want the handler to run immediately? Maybe with something like:

**IF YOU'RE SKIM READING - NOTIFY_NOW DOESN'T ACTUALLY EXIST**

```YAML
- name: A task with a handler
  ansible.builtin.sometask:
    something: something
  notify_now:
    - Some Handler
```

Well, a bunch of other folks thought so too. And it looks like there's been [an open issue](https://github.com/ansible/ansible/issues/10829) since 2015 requesting the feature. It was closed sometime in 2022 because none of the devs ever picked it up. If you ever read through open issues on Ansible's github, you'll notice that the devs can be a bit opinionated. 

It seems their stance on this issue is that the feature simply isn't necessary, or at least worth the effort to develop, because you can solve the problem with tools that already exist in Ansible. So let's take a look at those solutions. 

### Flushing Handlers

Ansible does have a feature that can solve this problem. You can *flush* the handlers at any point in the play. This will tell Ansible to force **all** notified handlers to run, not just one. In our case, only one handler has been notified, so this works just fine:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      notify:
        - Reset connection

    - name: Force handler to run
      ansible.builtin.meta: flush_handlers

    - name: Deploy a container
      community.general.docker_container:
        ...
        # This will NOT fail

  handlers:
    - name: Reset connection
      ansible.builtin.meta: reset_connection
```

## My Solution

Now, let's say you had multiple handlers. You want one to be run after all tasks have completed, but you need another to run immediately:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Include some other role with its own handlers
      ansible.builtin.include_role: some_role
    
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      notify:
        - Reset connection

    # This will cause any handlers built into 
    # some_role to run, along with the meta
    # task to reset the connection
    - name: Force handler to run
      ansible.builtin.meta: flush_handlers

    - name: Deploy a container
      community.general.docker_container:
        ...

  handlers:
    - name: Reset connection
      ansible.builtin.meta: reset_connection
```

In the above example, we're supposing that we don't want the handlers in some_role to execute until the entire play has completed. However, we do want to reset the connection before the entire play has completed. Well, Ansible doesn't let you flush handlers one at a time, so how can we accomplish this? 

There is a workaround. We can put the handler in another file and conditionally use **include_tasks** to dynamically reset the connection on change. Here's how we do it.

In a file called reset-connection.yml, we add this:

```YAML
- name: Reset connection
  ansible.builtin.meta: reset_connection
```

Then, we make the following modifications to our playbook:

```YAML
- name: Add user to Docker group and deploy a container
  hosts: all

  tasks:
    - name: Include some other role with its own handlers
      ansible.builtin.include_role: some_role
    
    - name: Add user to docker group
      become: true
      ansible.builtin.user:
        name: "{{ ansible_user }}"
        groups: 
          - docker
        append: true
      register: useradded

    - name: Reset connection if user was added
      ansible.builtin.include_tasks: reset-connection.yml
      when: useradded.changed

    - name: Deploy a container
      community.general.docker_container:
        ...
```

In this final example, we're bringing back variables and conditionals to dynamically include a task from a separate file only when the previous task produces a 'changed' status. The drawback to this method is, as your playbook grows, this can cause it to become cumbersome and unorganized if you have many files containing a single task for the purpose of dynamically including them. 

## Conclusion

It would be much more efficient to have a built in feature of Ansible allowing us to flush individual handlers so that they run immediately. However, given the many other ways that we can solve this problem with the existing tools Ansible gives us, I understand the developers' hesitancy to pursue this. It seems like they're taking an "If it ain't broke, don't fix it." mindset and I can respect that.  
