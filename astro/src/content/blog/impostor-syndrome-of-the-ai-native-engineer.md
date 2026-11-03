---
id: impostor-syndrome-of-the-ai-native-engineer
aliases: []
tags:
  - Artificial Intelligence
  - Impostor Syndrome
  - Career
  - Software Engineering
author: Josh Noll
date: 2026-06-25T06:14:57-0500
draft: false
image: ""
title: Impostor Syndrome of the AI Native Engineer
toc: false
---
Imagine being seated in the cockpit of a Boeing 737.

You're in the copilot seat as a brand-new hire. But you've never been to pilot school. You just have a passion for aviation, having played Flight Simulator for years. You're in all of the aviation subreddits and Twitter threads. You spend time reading the 737 manual just for fun. You speak the language and interview well. You've just never flown _for real._

You've dreamed of this moment, and now, here you are. During your interview, talking about your extravagant Flight Simulator setup (a topic that makes the average person’s eyes gloss over) worked in your favor. You don't have the traditional background, but Delta Air Lines has taken a chance on you.

And you don't feel like you deserve to be there one bit. You feel like every other pilot silently thinks that you don't deserve to be there, that you didn't "earn it," or that, at any moment, you might ask the dumb question that gets you fired.

Or, worse yet, you'll crash a fully loaded 737 into an urban metropolis, causing a national tragedy.

## AI-Native Engineering

There's a term that's been floating around the internet, which I've started to embrace as a way of describing myself: *an AI-native engineer*.

The term is meant to describe an engineer who does not possess deep experience in the pre-AI era. Outside of my bootcamp, and some "pre-AI-era, self-taught elbow-grease", I don't have the scars from losing hours of my life debugging production code that ultimately surfaced a missing semicolon or misplaced parentheses. I haven't written hundreds of thousands of lines of code. I haven't read hundreds of thousands of lines of code either. The only engineering world I've known is one where humans make decisions and agents do much of the implementation.

This makes the rules different for me than they were for the engineers who came before me. I don't spend my time fighting new syntax that I'm unfamiliar with or debugging for-loops. Since starting my new job, I've *written* precisely *zero* lines of code by hand. But I've contributed in ways that I would have never thought possible. Though I may not excel at handwriting code from a blank file, I am learning to recognize patterns and make decisions based on the right ones. *I'm learning my craft not from the bottom up, but from the top down.*

As a former Army Infantryman who became a Systems Engineer with a passion and a homelab, I went through a coding bootcamp right when Claude Code was released. And I managed to land a dream job when I transitioned out of the military.

But, I feel like I can relate to the mythical Flight Simulator enthusiast who just got hired by Delta Air Lines.

I'll concede that the comparison may be a bit dramatic because, although I work on production systems, a failure of mine would not result in the catastrophic loss of a commercial aircraft or the deaths of 230+ people, nor would it cause a national tragedy (I hope, anyway).

That feeling, however, is real. What I used to tinker with during the early morning hours, I now do professionally. The stakes that used to be only as high as my Jellyfin server failing to play a movie I wanted to watch are now as high as costing a company millions of dollars in revenue.

Every time I'm asked a question that I don't know the answer to. Every time I'm unsure about the first step in troubleshooting an issue. Every time I fail to contribute meaningfully to a conversation about architecture or design. There is a little voice in my head that says:

> "It's only a matter of time before they find out that agents are doing all the work, and that you actually have no idea what you're doing."

## Impostor syndrome in the AI-era

This is what impostor syndrome feels like. And engineers of all levels have always experienced it. In fact, some would say that it never really goes away.

It's also not a new problem. It's been around since before agentic coding practices became commonplace. But now, particularly as an *AI-native* engineer, it's exacerbated by the knowledge that my experience looks nothing like, and will look nothing like, that of the senior, staff, and principal engineers around me. Agents now do the work that, in another life, would be sharpening my skills professionally, which is a very conflicting feeling.

They've disrupted the relationship between effort, output, and competence. I can now produce work far beyond what my experience would traditionally suggest, and without writing a single line of code myself.

When I focus on how much work I can do with an agent, I overestimate my own abilities. When I focus on how much of the work I could do without an agent, I underestimate them. In one moment, I feel capable of building anything. In the next, I wonder whether I could build anything at all.

This is the AI-native engineer's paradox: illusions of competence living alongside illusions of incompetence.

### Illusions of Competence

Let's revisit the pilot analogy for a minute. Imagine that, on your first day at Delta, you're given access to a revolutionary new AI-driven autopilot. All you're really doing is feeding the flight plan into it. The plane takes off by itself, climbs to cruising altitude by itself, steers toward the proper headings by itself, descends, and lands all by itself. You're just there to make sure that it was fed the correct flight plan and to step in if the plane goes off the rails.

So, consequently, your first few flights go excellently. And your team commends you for how well they go. You start to feel like a real pilot. At times, this gives you a huge confidence boost. You feel like you could fly any plane anywhere. You start to fly aircraft that you've never even explored in Flight Simulator before.

This is very much how I feel as an AI-native engineer. Within my first few weeks on the job, I built and deployed an automatically updating documentation site with a RAG-powered AI chat widget. I automated updates to umbrella charts. I wrote code for Kubernetes operators. 

Could I have done any of that without the help of Claude Code? Definitely not at that pace.

By hand, it would have taken me upwards of six months to even get comfortable touching the code that I was touching. Instead, I did it in a few weeks. Without agents, I would have had to:

- Brush up on Python
- Learn Go
- Learn the Kubernetes API (from the perspective of writing an Operator)
- Learn FastAPI
- Learn how to write code for a Temporal worker
- Learn how to build custom components in Docusaurus
- Learn how to store data in Redis
- Learn how to index data into ChromaDB
- Learn how to write a Helm chart
- Learn how to chain Helm charts together into Umbrella charts
- Learn how to write tests for both Python and Go
- And a whole lot more...

But the agent did all of that for me.

With the false sense of security that agents often provide, I started to feel like I could build anything. There are two bottlenecks: code reviews and tokens. (And, as the industry explores AI code review more and more, the former becomes less of a bottleneck every day.)

If I have an idea, I can build it. It doesn't matter if I've never written in that language before. It doesn't matter if I've never used that framework before. It doesn't matter if I've never deployed to Kubernetes before. Whenever I'm not sure of a direction to go, I can just ask the agent. I am limited only by my imagination.

But, even with this new superpower... there's still a constant voice in my head... insisting that I didn't really build that thing; the agent did. *I didn't really fly that plane, the autopilot did.*

### Illusions of Incompetence

This voice can be loud. It can be so loud that it masks the reality that, if I didn't have a good foundation, the autopilot wouldn't have a direction to go. Remember all of those things that I "would have had to do" if it weren't for the agent? Well, guess what.

***I actually did all of those things.***

I just did them a lot differently (and a lot faster) than I would have without an agent.

It's easy to think "anyone could do this" when the effort feels so low and the output feels so high. But the only reason the effort feels low is because I'm focused on the wrong thing: *writing the code.* That part is incredibly low effort now. But precisely *because* writing the code is so easy, it makes architecting a good system harder than ever.

Remember how I said that I'm limited only by my imagination? I'm not. I'm limited by my *foundation.* But my foundation is getting stronger every day.

Although Claude Code wrote every single line of code for that docs site, those updates to the Kubernetes operator, and the GitHub actions for the Umbrella charts, it didn't *engineer* the systems. I made every high-level decision. I corrected the agent's assumptions. I challenged its decisions. I provided it with context and constraints.

All along the way, the agent was inferring its environment, assuming my intentions and theorizing user interactions with the system. It was my responsibility to ensure that its assumptions were correct.

On multiple occasions, they weren't. It made bad assumptions about the Kubernetes environment. It made bad assumptions about CI. It made bad assumptions about testing.

Correcting these mistakes didn't require knowledge of the most pythonic way to write a for-loop. It required the kind of higher level thinking that can often be exhausting engineering work. *It required a good foundation.* So, I may not be sharpening my saw by writing code... but I am sharpening it by engineering systems. One used to require the other, but that's just not the case anymore.

There is a unique fear I feel as an AI-native engineer. It stems from the rumination on the scar tissue that I'm not building. The scar tissue that the senior, staff and principal engineers around me have. But, I am building scar tissue. My scars just look different. 

Building that docs site taught me things. Automating those umbrella chart updates taught me things. Updating that Kubernetes operator also taught me things. Each lesson was something I learned without writing a single line of code myself.

## What does the future look like?

It's easy to jump to the conclusion that "coding is solved" or that "software engineering is dead" because of AI. But, recall that we were once made to practice long division and told that we wouldn't always have a calculator in our pocket. And, surprisingly, now that everyone has a calculator in their pocket, still not everyone is a professional mathematician. I think the same is true of coding. Coding is becoming more and more democratized, but *engineering* is not.

I'm excited for the future of engineering: far less time spent writing code and more time spent designing good systems. Writing code used to be an integral part of *learning* to engineer good systems. Without that practice, you couldn't develop the foundation required to design one. Now, you can develop that foundation by iterating with agents.

This means that an AI-native engineer's scars will look different from those of the engineers who came before them. And their impostor syndrome looks different too. It's hard to believe there's a path to competence that doesn't involve hours and hours of wrestling with syntax in an IDE. 

But, a lot of things are hard to believe. I never thought I would be where I am today. Yet, here I am.

If you're an engineer (of any kind) who's struggling with impostor syndrome, just know that you're not alone, and you're capable of so much more than you think.
