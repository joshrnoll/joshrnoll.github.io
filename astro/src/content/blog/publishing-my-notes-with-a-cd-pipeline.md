---
title: "Publishing My Notes With a CD Pipeline"
date: 2025-06-02T05:18:32-04:00
draft: true
author: Josh Noll
tags:
  - Automation
  - Gitea Actions
  - Hugo
description: How I built an automated CD pipeline for publishing Obsidian notes to my Hugo site
toc: true
---

## Introduction
I have recently been beating myself up about not posting regularly to this blog. It's not due to writer's block though. I have no shortage of ideas on things to write about. It's just that writing these posts is a bit of a time consuming process.

A lot of what I write about is a technical project that I've already completed. Usually, while doing the project, I'll take fairly detailed notes in [Obsidian](https://obsidian.md). These notes are critical in my ability to write up a detailed blog post.

I don't generally write outlines or have any kind of stringent planning process for my posts. Usually, I just start writing. Within an hour or so (depending on the content), I'll have an initial draft done. Then I need to proofread it to make sure I'm communicating the message that I want. Then I need to proofread again for spelling and grammar. Then I need to make sure that the formatting looks right; images are aligned properly, I've used the correct heading sizes etc.

When it's ready to publish, I push the changes to my Gitea repository and run my deployment script to push the site changes to the Azure storage account where the site is hosted.

It's a bit of a time consuming process. As a result, I have a pretty decent backlog of posts that I want to write. But, just as often I'll have a conversation with someone about a project I've done (but haven't written about yet) and they'll say something to the effect of "That's cool, can you show me how you did that? Do you have a how-to guide?" and I'll just share my Obsidian notes with them.

So, I thought to myself... what if I had a site that was just my raw, unpolished notes on the things I'm working on? And what if it was automated to the point that all I had to do was check a box if I wanted a note published, and I could be confident that it would be on my website shortly thereafter?

This line of thinking is what resulted in [notes.joshrnoll.com](https://notes.joshrnoll.com). This post is about how I automated the publishing of my notes to it.

## Obsidian - Where I take my notes
Obsidian is a fantastic note taking tool for the nerdy tinkerers and folks who want control of their own data. It's foundation is nothing more than [markdown](https://en.wikipedia.org/wiki/Markdown) files which exist locally on your system. It doesn't use a proprietary database to store your data, meaning that if you ever want to take your notes elsewhere, you can do so. Anything that reads and/or renders markdown will give you access to your notes. You could even open them up in notepad (for all you Windows masochists out there).

It also has a huge repository of both official and community developed plugins that allow you to really customize your note taking experience. It's available on just about every platform too: iOS, Android, Mac, Windows and Linux. Because, at the end of the day, all of my notes are just markdown files, this means I can run custom scripts and code against them.

## Hugo - Where I publish my notes
[I've written a little about Hugo before](https://joshrnoll.com/migrating-my-website-to-azure/). The TL;DR is that it's an awesome static site generator (similar to Jekyll). You pick a theme, fill out a config file, run the command ```hugo``` and suddenly you have a website. I like it so much more than a higher level of abstraction like WordPress because you have direct access to the code. I've taken advantage of this a few times on this site; making tweaks to the HTML and CSS in the theme so that I can really get the site to look how I want it to.

The other great thing about Hugo is that your content is written in markdown. This means that I can drop a note from my Obsidian vault into the content directory of my Hugo site and it will be rendered as a post. There are minor differences in the formatting between Obsidian and Hugo; particularly when it comes to link references. Obsidian uses wiki-style links by default whereas Hugo uses markdown-style links. You can change your Obsidian settings so that the default link style is markdown-style, but the file paths still won't quite match up as they need to.

## The Plan

##### **Step One:** Copy files (which are flagged to be published somehow) from my Obsidian vault directory to the content directory of my Hugo site.
##### **Step Two:** Run git commit/push to the Hugo repository.
##### **Step Three:** Gitea actions copies the changed/updated files to the Azure storage account, automatically publishing notes to the website.
##### **Step Four:** Execute steps 1-3 automatically, based on either a filesystem trigger or a timer.

### Step 1
