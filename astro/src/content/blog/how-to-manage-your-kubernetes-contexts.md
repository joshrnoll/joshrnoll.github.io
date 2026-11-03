---
title: "How to Manage Your Kubernetes Contexts"
date: 2026-02-25T05:44:27-05:00
draft: false
author: Josh Noll
tags:
  - kubernetes
  - kubeconfig
image: /k8s.svg.png
toc: true
---

At the company I'm doing my SkillBridge internship with, we have a lot of Kubernetes environments to work with. After asking my manager how he handles his contexts, I realized there's two main camps. You can either use a single kubeconfig with mutliple contexts, or you can have one kubeconfig per environment. You could mix these two methods as well, but I could see that getting messy really quickly.

## Multiple kubeconfigs

If you manage your environments with one kubeconfig per environment, then you're going to need a way to switch between them. `kubectl` has two built-in ways of doing this.

### The `--kubeconfig` flag

You can pas the `--kubeconfig` flag with each command to specify which environment. Obviously, this is the most cumbersome way to handle it, but it does work. For example:

```
kubectl get nodes --kubeconfig ~/.kube/envs/prod.yaml
```

### The KUBECONFIG environment variable

Now, obviously, you don't want to type all that out every time. So, kubectl can also get your kubeconfig from the KUBECONFIG environment variable. Meaning that to change to a different cluster (context), you would have to run:

```bash
export KUBECONFIG="$HOME/.kube/envs/prod.yaml"
```

Still a lot of typing, but at least you're not doing it every time. This is where you'll want to add some customization to your `.bashrc` or `.zshrc`. Here's one way to do it:

```bash
function kube(){
    export KUBECONFIG="$HOME/.kube/envs/$1.yaml"
}
```

With this in your shell configuration you could run `kube prod` to switch to your prod environment or `kube test` to switch to your test environment etc.

## One kubconfig, multiple contexts

The other option is to maintain everything in a single kubeconfig file with each environment having their own context. `kubectl` has a built-in way to mange your contexts, but it's a little clunky.

To check the current context that you're on:

```
kubectl config current-context
```

Not to be confused with the command to _list all_ of your contexts:

```
kubectl config get-contexts
```

And to switch to a different context:

```
kubectl config use-context
```

I don't know about you, but that's still too much typing for me. Luckily, there are open source tools to make this experience better, like [kubectx](https://https://github.com/ahmetb/kubectx). This opens a fuzzy finder with fzf that allows you to quickly switch between your contexts. It comes bundles with `kubens` which does the same thing for namespaces

## My preference

I'm still exploring my favorite way to do a lot of things, but I think I'm going to find myself in camp #2. I love the experience of the fuzzy finder that `kubectx` provides. It gives me same feel as my neovim experience with Telescope.

If you think I'm wrong, roast me on LinkedIn. I'm always down for a battle.
