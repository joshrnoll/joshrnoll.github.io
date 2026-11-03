---
date: 2025-07-11T07:00:50-04:00
draft: false
title: Backing up dotfiles with chezmoi
tags:
  - dotfiles
  - chezmoi
  - github
---
On Bluefin, chezmoi is installed by default. But it can be installed using ```brew```

```
brew install chezmoi
```

> BEFORE YOU BEGIN: Before getting started, create a github repo called ***dotfiles***

1. Initialize chezmoi

```
chezmoi init
```

2. Add a dotfile that you want to manage with chezmoi

```
chezmoi add ~/.bashrc
```

3. When editing the file, use chezmoi

```
chezmoi edit ~/.bashrc
```

4. Apply changes

```bash
chezmoi -v apply
```

NOTE: you can view differences with ```chezmoi diff```

```
chezmoi cd
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:$GITHUB_USERNAME/dotfiles.git
git branch -M main
git push -u origin main

```

