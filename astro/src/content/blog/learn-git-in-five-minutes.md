---
title: "Learn Git in Five Minutes"
date: 2024-08-14T20:05:18-04:00
draft: false
author: Josh Noll
tags:
  - Git
  - DevOps
  - Automation
image: /Git-Icon.png
description: A quick lesson on how to get started with git.
toc: true
---
# Learn Git in Five Minutes
The purpose of this post is to get you up and running with git in about 5 minutes. If it takes you longer than that... well, I don't have an SLA associated with this post so, maybe just read faster.

You'll learn enough to get you curious. This won't be comprehensive, but should give you the tools you need to get you started.

## Quick Intro
If you're a software developer, you probably already know what git is and you're just looking for a quick tutorial on how to get started. If that's the case, skip ahead.

If you're like I once was, you may be a homelabber who doesn't know what you're missing out on. [Git](https://git-scm.com/) is a version control system written by Linus Torvalds (yep, the guy that wrote the Linux kernel), and it's not just for software developers. 

If you are already comfortable in the terminal, git is a great way to keep all kinds of files under version control. Do you have a bunch of text files, docker compose files, and various other configuration files that keep your homelab afloat? Wouldn't it be nice if you could roll back when you mess something up? How about sharing some of them with your internet friends by posting the updates on GitHub or GitLab?

I can honestly say that taking the few minutes to sit down and learn the basics of git has been a game changer for me. Hopefully it will be for you too.

You'll need to install git, of course. I won't cover that in this post, but I believe in you and your google skills. The remainder of this post assumes that you have git installed, and have a Linux terminal to follow along in.

### Git User Settings 

The first thing we'll need to do is configure our git user settings. This isn't an online account that you need to sign up for. If you have a GitHub or GitLab account, they don't necessarily have to match. You can set these values to whatever you like. But these values will be used in the metadata for your commits. If you'll be collaborating with other people, make sure they're correct:

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

### Creating a Repo

Then, we'll make a new directory and initialize our first repository:

```bash
mkdir demo-repo
cd demo-repo
git init
```

You'll see some output that looks like this:

```
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint:
hint: 	git config --global init.defaultBranch <name>
hint:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint:
hint: 	git branch -m <name>
Initialized empty Git repository in /home/josh/demo-repo/.git/
```
So what happened? Git made a hidden directory called ```.git``` , where it stores all of its config files. Other than that, the demo-repo directory is just like any other. 

### Adding and Committing Files
Let's add a file to it. 

```bash
touch file1.txt
echo "The quick brown fox jumps over the lazy dog" >> file1.txt
```
Before we commit changes, we need to stage them for commit. You can stage everything with:

```bash
git add .
```

Or, you can stage individual files like this:

```bash
git add file1.txt
```

Now, we'll commit the changes:

```bash
git commit -m "initial commit"
```

What's with the ```-m "initial commit"``` I hear you ask? That's just a message that goes along with your commit. Use these to describe the changes you've made each time you commit. They will show in the commit history. 

### Resetting 
Now, let's commit some bad changes on accident. Edit your text file, adding a period along with this deliberate typo:

```
The quick brown fox jumped over the lszy dog. 
```

You can check what files have been modified with

```bash
git status
```

Which will give you output like:

```bash
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   file1.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
Now, let's commit our typo, pretending we didn't notice for now.

```bash
git add .
git commit -m "added a period"
```
Oh no! Your website doesn't work anymore. Or docker container, or whatever this is. Let's look back at our commit history with:

```bash
git log
```
Which should give you this output:

```bash
commit 8759afb1203fdcd19f7c3adf9344ae0370c27dd6 (HEAD -> master)
Author: John Doe <johndoe@example.com>
Date:   Thu Aug 15 05:31:04 2024 -0400

    added a period

commit 0503e59ce70334f41097b6e0307bfb09da763d75
Author: John Doe <johndoe@example.com>
Date:   Thu Aug 15 05:29:16 2024 -0400

    initial commit
```

To get output that's easier to read once you have a long commit history, use the ```--oneline``` flag:

```bash
git log --oneline
```

Which will give you this output:

```bash
8759afb (HEAD -> master) added a period
0503e59 initial commit
```

Those random strings are the commit IDs that we can use to reset back to a previous commit. **Resetting** will bring you back to the desired commit, erasing the commit history.

#### Resetting a Commit Without its File Changes
If you don't want to revert the actual changes in the file, and just want to undo your commit, run:

```bash
git reset 0503e59 # <-- note that this is the ID of the initial commit, replace this with whatever commit ID that you're resetting to.
```

We'll get some output explaining that we have unstaged changes now. If we cat the file, we'll still see our typo.

```bash
Unstaged changes after reset:
M	file1.txt
```
```bash
$ cat file1.txt

The quick brown fox jumped over the lszy dog.
```

But, if we run ```git log --oneline``` we should see that we're back to our initial commit:

```bash
0503e59 (HEAD -> master) initial commit
```
#### Resetting a Commit and its File Changes
Let's say we want the file changes reverted as well. We'll re-commit our changes:

```bash
git commit -m "added a period"
```

Now, let's use ```git reset``` again, but with the ```--hard``` flag:

```bash
git reset 0503e59 --hard
```

Which should give you this output:

```bash
HEAD is now at 0503e59 initial commit
```

Now, if we cat the file we should see that our changes have been reverted:

```bash
$ cat file1.txt

The quick brown fox jumped over the lazy dog
```
## Conclusion
And, you're off! I'll cover more git features in future posts, but this is enough to get you started with keeping your files under version control. Happy nerding!