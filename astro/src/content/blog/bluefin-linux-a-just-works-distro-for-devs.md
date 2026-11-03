---
title: "Bluefin Linux: a Just Works Distro for Devs"
date: 2025-09-03T05:59:31-04:00
draft: false
author: Josh Noll
tags:
  - Linux
  - Software Development
image: /bluefin-linux-a-just-works-distro-for-devs/bluefin.svg
toc: true
---

# Introduction

I recently had the opportunity to attend the [Galvanize Software Development Immersive (SDI)](https://www.galvanize.com/software-development-immersive/), learning full-stack web development through HTML, CSS, vanilla JavaScript, React and Express. It's been a phenomenal course so far and I'm really enjoying the world of software development.

Throughout this course, I've been limited by some things. I've been limited by my own knowledge (or lack thereof). I've been limited by my experience (or lack thereof). I've been limited by my time (or lack thereof). But one thing that has not limited me, is my operating system.

## What is Bluefin?

Bluefin is a linux distribution built on [universal blue](https://universal-blue.org/), a cloud native linux image built with [bootc](https://github.com/bootc-dev/bootc). Essentially, your operating system is a container. Universal Blue images are based on Fedora CoreOS, a container-focused Fedora base with *automatic updates*.

The Universal Blue project has a few different images. [Aurora](https://getaurora.dev/en) for the everyday user, [Bazzite](https://bazzite.gg/) for the gamer, and, of course, [Bluefin](https://projectbluefin.io) for the developers.

## My Experience with Bluefin

I've been running Bluefin since ordering a new-to-me Thinkpad T14 off eBay for about 5 months now. There were a few things that worried me about using Bluefin. With Bluefin being a bit of an unconventional distro, I was worried, broadly, about two things: software compatibility and hardware compatibility.

### Hardware Compatibility

Put simply, I've had zero hardware issues. All of my bluetooth devices connect perfectly. Wifi works. The webcam works. The fingerprint reader works. My wacom drawing tablet works. Even secure boot works!

Now, this is linux, so take this with a grain of salt. Your mileage may vary. However, it's clear that Bluefin puts plenty of thought into hardware compatibility. When downloading their installer, there are even options to specify your kind of hardware to ensure the proper drivers are there.

### Software Compatibility

If you peruse the documentation, you'll notice that Bluefin doesn't have a traditional package manager. So there is no *apt install* this or *dnf install* that. You'll install software, primarily, in one of two ways:

- Using a Flatpak
- Using Homebrew (yep, the same thing that Mac's use. Turns out it works on Linux too)

You might think "dang, that's going to limit the kind of software I can run..."

Well, I thought the same thing. But as it turns out, most major software projects (particularly the open source ones) have a build out there for Flatpak and/or Homebrew. Here's a non-exhaustive list of software I've installed without issue:

- Obsidian
- Brave
- Slack
- Discord
- Bitwarden
- Zoom
- OBS Studio
- GIMP
- Inkscape
- LocalSend
- Spotify
- Raspberry Pi Imager

Not to mention that Bluefin comes with incredibly sensible defaults by default. Including VS Code.

For the software that doesn't install with one of these two methods, you can install it in a [distrobox](https://distrobox.it/) container, which is installed on Bluefin by default as well. Built into the terminal is a drop-down selector to switch to any of your distro-box containers and run any kind of command-line software directly from the terminal. So, if your favorite linter can only be installed with a .deb file, spin up an ubuntu distrobox and install it as if you were running ubuntu.

Graphical software can be installed this way too. Bluefin ships with a program called [Box Buddy](https://flathub.org/apps/io.github.dvlv.boxbuddyrs) which allows you to manage your distro boxes from a GUI. Inside of this GUI, you can add programs that were installed in your distroboxes to the Bluefin system menu. Once again, you'll never even notice that this stuff is running in a container.

## Issues

The only issues I've had cannot be blamed entirely on Bluefin itself. When purchasing this ThinkPad, I looked up a teardown video to ensure that the memory was upgradable. As it turns out, that was only for the Intel version... I got the AMD version which has soldered LPDDR5 RAM. So, I'm stuck with the 16GB that I thought I would be able to turn into 64GB for the cost of a couple of SODIMM sticks...

Because of this... in the moments when my crippling, undiagnosed ADHD has taken over and I have 37 chrome tabs open, 3 VS Code windows, 2 instances of Postman, Slack, Discord, and OBS Studio all running at the same time, Bluefin *does* freeze up on me. On a few occasions I have been forced to hold the power button to restart the computer. With every instance, however, this has been directly tied to running out of memory.

In the past, I've ran PopOS on a computer with only 16GB of memory (and a much older CPU than this one), and I don't recall the system ever freezing up like this one does. However, I also wasn't in a software development bootcamp at the time and was likely much more conservative with my usage.

# Conclusion

So, who is Bluefin for? Well, to properly answer that, I must first confess something...

I recently started using Arch... ***by the way...***

And the experience has been the exact opposite of using Bluefin. Things just don't work out of the box (even on a pre-built distro like [Omarchy](https://omarchy.org/) which is what I was using). On day one, I was unable to get into a Zoom breakout room because the pop-up selection window disappeared immediately when I moved my mouse. I spent 20 minutes editing hyprland configs before I could get into the room.

Here's the thing though. **I love it**. Using Arch is a persistent exercise in your problem-solving skills. Along the way, you learn new things, and you're frequently met with the satisfaction of 'fixing something.'

So, if you want to start using linux, but what I just describes turns your stomach. If you want something that 'just works.' -- Give Bluefin a try.

I'm still running Bluefin on that laptop. Because it just works. If I bork my Arch system, I know I can unplug my dock from my mini PC, plug it into my laptop and be back to work.