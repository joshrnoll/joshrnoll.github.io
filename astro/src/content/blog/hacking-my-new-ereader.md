---
title: "Hacking My New Ereader"
date: 2025-02-27T05:49:22-05:00
draft: true
author: Josh Noll
tags: []
toc: true
---

## Introduction

I've been using an Amazon Kindle for years now, and I love it. 

Well, I love the hardware... I don't love the fact that *I don't actually own my books...*

See, you used to be able to download a copy of your e-book files from your amazon account. These files would be in amazon's proprietary file format... but you could convert them to nearly any other universal e-book format using a tool like [Calibre](https://www.calibre-ebook.com/).

This gave me the peace of mind that Amazon was allowing me to truly own the book I was paying for. My access to the book wasn't contingent on my access to the Amazon ecosystem. I could grab a copy of the file both for the peace of mind of having a backup copy, as well as the liberty to do what I wanted with the content. 

However, as of this month, [amazon is killing that feature](https://www.pcmag.com/how-to/download-kindle-books-to-computer-before-amazon-kills-feature-feb-26). And they have therefore killed my trust that any e-book content I purchase from them will every truly be owned by me. So, I took this as a sign that it was time... not to upgrade my Kindle paperwhite from 2015... but to ditch Kindle altogether. 

And okay... here's where I admit that the title is a bit of clickbait. Make no mistake, I didn't do any real hacking here. I just used some developer tools and installed some custom software to build a solution that fit my niche use case.

***Why wouldn't you just go back to physical books?***

I love reading from a physical book from time to time. But, there's something about an e-reader that just clicks with me. The E-ink displays trick my brain just enough to feel like I'm reading on actual paper. There's no opportunity for me to be distracted by quickly checking a message or flipping over to YouTube. Plus, the ability to choose from up to hundreds of books at one time allows my ADHD-brain the opportunity to flip quickly to another book when I get bored with the one that I'm currently reading (rather than turning to scrolling on social media or watching YouTube).

## My Requirements

I had five primary considerations on my quest for the perfect e-reader:

1. I didn't want it to be from a sketchy manufacturer.
2. It had to have a backlight (preferably with the ability to adjust the warmth for nighttime reading)
3. I didn't want to spend much more than $250.00

I had come across the open-source project, [KoReader](https://koreader.rocks/). This OS is meant to be installed on [Kobo](https://us.kobobooks.com/collections/ereaders) devices, but has support for many other manufacturers such as Remarkable, Pocketbook and even jailbroken Kindles!

A non-all-inclusive list of factors I didn't care about:

- stylus support
- screen resolution
- screen color vs. B&W
- screen size (I was hoping for slightly larger than my current kindle, but whatever)
- on-board storage (I never even came close to filling the 4GB on my current kindle)

When you start looking in to e-readers, you'll quickly realize that there are an overwhelming amount of options. Here are the reasons I didn't go with any of the other more popular brands:

- **Boox devices**: They come from a Chinese company/manufacturer, there's a Russian clone of their website that sells Russian knockoffs of their devices, and I don't want any of that smoke.
- **Pocketbook devices**: I couldn't find a known way to install Tailscale on these devices.
- **Remarkable**: Overpriced, no known way to install Tailscale, and a lot of their features require a subscription.