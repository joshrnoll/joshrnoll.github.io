---
title: "My First Git Rebase"
date: 2026-02-23T15:27:22-05:00
draft: false
author: Josh Noll
tags:
  - git
image: /Git-Icon.png
toc: true
---

I've been learning way more about git than I bargained for this week.

Real quick article today. I learned how to use `git rebase` to squash commits today.

What does it mean to squash a commit?

Let's say you make a change in one file, and make a commit. Then you realize you forgot to make that exact same change in another file. So you make the change and make _another_ commit. Now, your commit history is a little muddied because you really made one change, but you have two commits to show for it.

Squashing commits means taking those two commits, and creating a single commit out of them. You basically melt them into one. (I'm avoiding using the term `merge` here because that's a whole concept in itself).

So here's how you can do it in that scenario. Assuming your most recent commit is one of the two aforementioned, you can run:

```bash
git rebase -i HEAD~2
```

The `-i` flag tells git to do the rebase interactively (it will open a file for you to edit where you can specify the commits to squash), and the `HEAD~2` will show the two most recent commits in that interactive window.

It should bring up something like this:

```
pick 1234567 First commit message
pick 89abcde Second commit message

# Rebase 0fedcba..89abcde onto 0fedcba (2 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

To squash the two commits, you would simply change the second one from `pick` to `squash`

```
pick 1234567 First commit message
squash 89abcde Second commit message
```

Save and exit that file, then VIOLA! You've done a `git rebase`.

I did this for the first time today and felt like a real boy. Git is more fun with friends.
