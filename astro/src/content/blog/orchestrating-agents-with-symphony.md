---
title: Orchestrating Agents with Symphony
date: 2026-11-27T12:00:00-06:00
draft: true
author: Josh Noll
tags:
  - AI
description: How I went from babysitting one Claude at a time to filing issues and letting headless agents open the PRs.
toc: false
---
When I started my SkillBridge as an Infrastructure engineer with [Unstructured](https://unstructured.io), I knew I was going to be drinking from a firehose.

What I didn’t realize was that the firehose I would be drinking from wasn’t a stream of learning how to write the best IaC using my sick neovim setup.

It was a firehose of learning how to run agents that write IaC for you.

<!-- TODO: confirm this Unstructured mention is okay to publish, and whether to name/credit the co-worker -->

It started like this. Fire up claude code. Give it a prompt like “We need to create a github actions workflow that automatically bumps the version on our umbrella charts”. Then… wait… watch claude’s silly filler words pass across the screen. “Combobulating” “Whatchamacalliting” “Whatevering”

Eventually, it stops. And I flip back to my super sick neovim setup to review the code it wrote. Then, I give it another prompt and the cycle repeats until I feel it’s good enough to open a PR with the work.

<!-- TODO: insert loop 1 diagram from the raw idea (prompt → wait → review) -->

In another version of this loop, I design the change with claude first. I ask questions and scope out the change before letting claude loose. A lot of back and forth questions like “How does this part work?” and “Explain how we’re guarding against this edge case.” until we land somewhere where I feel comfortable saying “okay, do it like that.”

Regardless, there’s a lot of waiting for the agent to work.

Then, I started to wonder what I was doing with my life with that second step. Why sit there and watch claude work when I can have *another* claude start working. So while I’m waiting, I started to go prompt other claudes…

After a few, I can usually go back to the first one and start the review on its work.

Or, you know, my ADHD takes over and that claude gets abandoned until Thursday.

<!-- TODO: insert loop 2 diagram from the raw idea (multiple Claudes, ADHD until Thursday) -->

Eventually, a co-worker shared his setup with me. And he explains that he built an agent orchestrator that essentially runs this process itself using openai’s [symphony spec](https://github.com/openai/symphony/blob/main/SPEC.md).

Ultimately, I realized there were two major ways I interacted with claude:

1. Scoping out a code change
2. Making the code change and opening a PR

Symphony is meant to automate the second part entirely. All of your interactions with claude become conversational. Scoping out changes and deciding *how they should be done*. Then you simply tell claude to “file a symphony issue”. The issue (or ticket) goes into your system and headless agents pick them up and work on them. You just wait for the PRs to roll in.

## How it actually works

In plain English, the Symphony spec is pretty simple. Your issue tracker is the queue. A long-running service polls that tracker, grabs eligible issues, and spins up a headless coding agent for each one in its own isolated workspace.

The agent does the work. It can comment on the issue, update the status, and open a PR. The run doesn’t even have to finish at “done.” The workflow can hand it back to you at something like “Human Review.”

How the agent should behave lives in the repo, in a `WORKFLOW.md` file, so the prompt and the runtime settings are versioned with the code.

That’s it. Issue goes in. Agent picks it up. PR comes out.

<!-- TODO: describe what I actually run and where. Link my symphony repo if it’s public. Include real config or the issue template, with a "Let's break it down." -->

<!-- TODO: add real gotchas: issues scoped too loosely, PRs that needed a second pass, how review changed. Don’t invent these. -->

<!-- TODO: add a third diagram of the new loop: talk → file issue → agents → PRs → review -->

This is commander’s intent again. My job is the scoping conversation and knowing what right looks like.

<!-- TODO: link the Commander's Intent post if it's live first -->

The job didn’t go away. It moved. Less typing code, more scoping work and reviewing PRs.

How are you running your agents: one at a time, a bunch of tabs, or something like this? If you want to nerd out about it, find me on LinkedIn.
