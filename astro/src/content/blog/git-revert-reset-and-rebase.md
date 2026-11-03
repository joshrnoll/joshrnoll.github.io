---
title: "Git Revert, Reset and Rebase"
date: 2026-02-21T08:13:15-05:00
draft: false
author: Josh Noll
tags:
  - git
image: /Git-Icon.png
toc: true
---

Git is really easy when you're working by yourself. For the longest time, I've used git, GitHub and Gitea on personal side projects. All I really knew how to do was push to main and watch the world burn. Then, I went through the Galvanize Software Development Immersive (SDI) course and suddenly had to collaborate with teammates.

Unfortunately, that didn't change much. Everyone still did the basics:

```bash
git add .
```

```bash
git commit -m "a very poorly written commit message"
```

```bash
git push origin main
```

Eventually, we figured out how to use branching to make changes on a new branch and merge to main when they were ready. What was our branching strategy you ask?

Chaos. Chaos was our strategy.

Sometimes we worked on long-lived branches like `backend`. Sometimes people kept a personal branch like `josh`. And sometimes we did feature branches. We started with a `dev` branch and quickly abandoned it in favor of merging directly into main. When we ran into conflicts, we had a fool-proof playbook.

1. Panic
2. Ask AI
3. Accept defeat, and deal with whatever was broken on the next commit

Recently, though, I started a skillbridge internship with a fast-moving startup. Needless to say... there's still Chaos. But, at least it's organized chaos.

My first PR initially got the coveted "LGTM" by the first reviewer. But, then my manager got around to taking a look...

"Hey, your code got flagged by the cursor bot for something... and also it doesn't work."

Damn.

So, I had to fix my code (obviously), but I wasn't sure whether that meant opening a new PR, or if the PR would update automatically based on new commits to that branch.

Turns out it's the latter. My manager tells me I can either revert, or rebase and the PR will automatically track the ref to that branch.

So, this forced me to spin myself up on the differences between `git reset`, `git revert`, and `git rebase`. All things I knew existed but have never used in practice.

I have found it easiest to grasp a new concept when I can map it to a good analogy. So, after some reading, here's what I came up with:

## git revert

Using `git revert` is kind of like making a mistake on a whiteboard and, rather than using the eraser, you just line through the mistake and write the correction below it.

This will make a _new commit_ that reverts the changes that caused the bug. So it kind of looks like this:

##### A (some code) --> B (some code with a bug) --> C (the same code as A)

## git reset

This is your true clean slate. A reset will _rewrite history_, eliminating the mistake from the git log entirely. It's like making a mistake on a whiteboard and using the eraser. So, you end up with something like this:

##### A (some code) --> B (some code with a bug)

Then you run `git reset` and end up with just:

##### A (some code)

## git rebase

This is where things get a bit more interesting. `git rebase` is like rewriting the story of how you got to where you are. Instead of just fixing a mistake, you're going back and changing the story.

Imagine you're writing something out on a whiteboard with a couple of coworkers. You have a few paragraphs written, but then your teammate writes something off to the side with an arrow directing it in-between your two paragraphs.

Running `git rebase` is kind of like saying "okay let's rewrite this" and walking over to another whiteboard, writing the paragraphs with your teammates paragraph in the correct spot.

So, let's say that you're working on a feature branch while your teammate pushes changes to main. Your commit history might look like this:

```
      C (your feature work)
     /
A---B (main branch)
    \
     D---E (teammate's new commits on main)
```

When you rebase your feature branch onto the updated main, git replays your commits (C) on top of the latest main branch commits (D and E). So it becomes:

```
A---B---D---E (main branch)
             \
              C* (your feature work, now based on latest main)
```

The key difference here is that `C*` is technically a new commit (with a different hash) even though it contains the same changes as `C`. You've essentially rewritten history to make it appear as though you started your work from the latest version of main, rather than from an older point.

## When to use each one

`git revert` is the safest option of the three. You have a clear history of what happened, what went wrong and how it was fixed. You should use this any time you've pushed to a shared/public branch and need to correct an error.

`git reset` on the other hand is best used on local-only oopsies. If you've made some mistakes, but you _haven't pushed to remote yet_, and you just want a do-over, then use `git reset`.

So, when do you use `git rebase`? A good use case is if you're working on a personal branch and there have been updates to main while you've been working. Rather than merging those changes, you can rebase in front of them.
