---
title: "How I Vibe Code"
date: 2026-02-22T20:36:08-05:00
draft: false
author: Josh Noll
tags:
  - Vibe Coding
  - AI
  - Claude Code
  - OpenCode
  - Goose
image: /how-i-vibe-code/featured.jpg
toc: true
---

There's no escaping it. Vibe coding, AI assisted engineering, spec driven development or whatever you want to call it... It's here to stay. I was resistant at first, especially being so new to the world of software development. But, I knew that if I didn't learn how to use these tools, I would be quickly left behind.

That's why I've embraced using tools like Claude Code, [Goose](https://block.github.io/goose), and [OpenCode](https://opencode.ai); trying to deeply integrate them into my workflows. Honestly, I know I've only scratched the surface on what these things can do.

In this article, I'll quickly cover my process for "vibe coding". It's a little more involved than telling the model "Build the thing. No mistakes." but it's also fairly simple

## PRD.md

Peter Steinberger, the creator of the now famous [OpenClaw](https://openclaw.ai), recently put it perfectly in an interview. He says to try and put yourself in the shoes of the model. After receiving a prompt you are completely in the dark. You have no other context. You can't ask any more questions. And you know nothing about the codebase. So, if all you have is "make the form work" or "fix the broken api call", you're probably going to perform the task poorly.

That's why I always start with a `PRD.md` file: the product requirements document. This should cover as much detail as possible about what you're building. What is it? What problem are you solving? What language are you using? What is the tech stack? How are you hosting it? How are you maintaining it? Who are the users?

You might be thinking "Well, damn that's a lot to write..." Well, here's the thing. You don't have to write it!

I always start with a prompt that sounds like this:

```
Help me build a PRD.md for this project. We're building a calendar syncing app that keeps multiple google calendars in sync. Ask me any questions you need to understand the project more.
```

The model will then, essentially, interview you. I particularly like how OpenCode does this, as it presents you a menu of multiple choice questions. You can either go with the model's suggestion, or write in your answer. It really streamlines the process.

Once the `PRD.md` file is generated, give it a quick read through. Little things can be easily edited manually, but if there is anything wildly off or missing, just prompt the model again.

## TODO.md

I've often noticed the model will create a `TODO` section in the `PRD.md`. I like to manage this as a separate file, so I'll ask the model to move it to a dedicated `TODO.md`. This allows you to manually add TODO items that you can reference in prompts later. At the top I'll keep a `Fixes` section so that I can later prompt something like:

```
Tackle all the items in the `Fixes` section of the TODO list.
```

## AGENTS.md

Once the `PRD.md` and `TODO.md` files are as complete as it possibly can be, it's now time to generate the `AGENTS.md` file. This file is automatically loaded into context on every prompt. Whatever is in this file is essentially prepended to your prompt every time, which means that there are a couple things to consider:

1. Remember what Peter said about the model being in the dark? This helps alleviate that a little. It turns a bad prompt into a slightly better prompt. You can load this up with locations of key files, testing strategies, commands and styling preferences. The model will see that every time and be kept on track rather than developing in the dark.

2. If your `AGENTS.md` file is enormous, your usage is going to spike. The larger it is, the more tokens you use, so it's best to keep this as concise as possible. Your `PRD.md` file can be as large as it needs to be, but your `AGENTS.md` file should only contain critical information that the model _needs_ to know on every prompt.

> NOTE: If you're wondering why you've never heard of `AGENTS.md`, you're probably a heavy Claude Code user.
>
> For some reason, Anthropic still refuses to accept the `AGENTS.md` standard that everyone else has.
> So, for Claude Code, it's still `CLAUDE.md`
>
> A symlink is an easy workaround:
>
> `ln -s AGENTS.md CLAUDE.md`

## The prompt

With a solid `PRD.md`, `TODO.md` and `AGENTS.md`, you're ready for your prompt. Now, you don't have to worry about the model being in the dark. The `AGENTS.md` file will provide the initial context it needs to get started (referencing the `PRD.md` where appropriate). And now, you can give it a crappy prompt and feel good about it.

```
Alright Claude. Build the thing. No mistakes.
```

Just kidding. Kind of. Honestly? That would probably work just as well if you have a good `PRD.md`, `TODO.md` and `AGENTS.md`. But, I usually say something as simple as:

```
Let's get an MVP started.
```

Then, you grab your coffee, kick your feet up, and wait for your next million dollar idea to be built.

Or your website of cat pictures. Whatever your thing is. I'm not judging.

## Supervise and Refine

The military taught me about something called the troop leading procedures. Naturally, they like to make everything a checklist. I won't bore you with the details, but the final step is always **supervise and refine.**

And this was always a running joke. As an officer, I would joke around saying "If you need me, I'll be conducting step 8 of the troop leading procedures."

But it's funny that, now, I find myself returning to this with supervising AI models. You can't just trust that the "no mistakes" prompt is gonna be the last one. Even if you have a killer `PRD.md`. Sometimes, the model will do something off... I'll look at the code and something makes alarm bells go off. Maybe it's using a library I've never heard of, or using some kind of syntax I don't recognize. **This is the time to ask the model why.** Sometimes, it's a learning opportunity for me. Sometimes, I'm correcting the model. But, the bottom line is: _you have to be able to read the code, and you have to be diligent about supervising._

Can you get by without doing either of those things? Sure.

But, not for long. At some point, your software is either going to break or get hacked if you don't even know how to read it.
