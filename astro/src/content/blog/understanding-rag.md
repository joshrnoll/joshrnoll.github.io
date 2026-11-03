---
title: "Understanding RAG"
date: 2026-02-26T06:38:08-05:00
draft: false
author: Josh Noll
tags:
  - AI
  - RAG
  - Neural Networks
image: /understanding-rag/featured.png
toc: true
---

I recently went down a rabbit hole trying to understand how LLMs can answer questions with relevant information based on a website's current documentation. You know, those documentation sites that pair the search feature with an AI chat button.

If you've been an AI user for any amount of time, you know that sometimes the LLM gets it wrong. It might have a date wrong. It might use outdated syntax for a command or a programming language that you're working with. It might even fabricate something entirely; this is often called a _hallucination_.

Large Language Models (LLMs) are trained on enormous, text-based datasets. But, even with this enormous amount of data, they don't always have the right context surrounding what you're asking. Think of an LLM like a genius savant with photographic memory. They go into the library and read every single book. Now, they're able to answer questions on quantum physics, world history, or psychology. But they won't be able to tell you anything about the clown that was arrested on 35th street yesterday for jaywalking because that story was in the paper this morning, and the library didn't have that paper.

But this genius savant has an ego. He knows an enormous amount of stuff. So he _thinks_ he knows everything. So, when you question him about the clown that was arrested, he'll just make up a story that sounds believable because his ego won't let him admit that he doesn't know. That's what we call a _hallucination._

So, what if you could hand today's paper to the savant and say "Read this quick." Then, you ask about the clown. Suddenly the genius with an ego will be able to give you an accurate answer about Crosswalkin` Clyde, the law-breaking jester.

That's what Retrieval Augmented Generation (or RAG) is.

So, how does it work?

## Vector Databases

To understand how RAG works, we need to understand a bit about how vector databases work. They're like SQL databases which store data in rows and columns and they're not like NoSQL databases which store data in JSON-structured documents. They store mathematical representations of their inputs.

Take these two strings of text:

"I can't wake up in the morning without coffee."

"Caffeine is my vice; without it I'm not alive."

Are they similar? Most humans would say yes. They represent a very similar (nearly identical) message. But the text is entirely different. No two words are the same.

A vector database would be able to map these two strings of text based on their similarity using their mathematical representations. An over-simplified example would be:

"I can't wake up in the morning without coffee." --> 123

"Caffeine is my vice; without it I'm not alive." --> 124

"Public Outcry after Crosswalkin' Clyde sentenced to 9 years." --> 998

123 is close to 124, so the text is similar. But 123 is really far from 998. So that pair is dissimilar.

## Embedding Models

So how do we go from a string of text to 123 or 998? That's where an embedding model comes in. Embedding models aren't like LLMs. Although they take text, they don't output regular text. They output _embeddings_ which are those mathematical representations that get stored in the vector database.

## Retrieval

So, now, let's say you wanted an LLM chat assistant to be able to answer questions based on your internal documentation. You could index your documentation with an embedding model and store that information into a vector database. For example, each paragraph could be stored as an embedding.

Then, you program your chat assistant to run the embedding model against the prompt that comes in. This gives you that mathematical representation of every prompt, which allows you to write additional logic that retrieves 3-5 relevant embeddings from the vector database. Stuff all of that into the context before the LLM responds, and boom. Now the LLM can answer questions about your internal documentation.
