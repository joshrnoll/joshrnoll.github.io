---
title: "Git Autocomplete"
date: 2026-02-28T20:20:51-05:00
draft: false
author: Josh Noll
tags:
  - Git
image: /Git-Icon.png
toc: true
---

So, as it turns out, Git does have an auto-complete (or tab completion) feature.

Why this doesn't come out of the box in the year 2026? I don't know.

But, if you've been living in the hell of manually typing out feature branch names like I have, don't be like me. Configure git auto-completion:

## For bash on Linux

Download the bash completion script:

```bash
curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash
```

Add this to your `~/.bashrc` file:

```bash
source ~/.git-completion.bash
```

## For MacOS

Add the following to your `~/.zshrc` file:

```zsh
autoload -Uz compinit && compinit
```

> Note: after making either of these changes you'll want to reload your shell with either `exec bash` or `exec zsh` for them to take effect.

## You Are Welcome.
