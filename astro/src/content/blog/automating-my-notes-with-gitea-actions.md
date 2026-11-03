---
title: "Automating My Notes With Gitea Actions"
date: 2025-06-17T20:10:56-04:00
draft: false
author: Josh Noll
tags:
  - Continuous Delivery
  - DevOps
  - Gitea
  - Gitea Actions
  - Notes
image: /automating-my-notes.png
description: How I automated the publishing of my notes to https://notes.joshrnoll.com with Gitea actions.
toc: true
---

## Introduction
Recently, [I spun up a whole 'nother website in the name of procrastination.](https://www.linkedin.com/posts/joshrnoll_home-activity-7327303037956354049-VdbA?utm_source=share&utm_medium=member_desktop&rcm=ACoAADQ4hdQB1l090rq_JdRTVJdZ1AtdRdGiRe8)

The idea was this...

Sometimes, I convince myself that I don't have the time to write a whole blog post about something cool I did. But, yet... I took notes while I did it. So, really, I kind of already wrote about it. What if I could just share the unapologetically messy and incomplete notes? Something that an internet passerby could still gain some value from, even if it's not very polished or coherent.

#### My notes
First, a quick *note* on how I take notes (pun intended... I'm a dad now, it's in my blood):

I use [Obsidian](https://obsidian.md), which I am absolutely obsessed with. Here's the TL;DR on why Obsidian is awesome:

  - Every note you take is just a markdown file. Move it, copy it, back it up with scripts or third party tools. The world is your oyster.
  - The plugin ecosystem is amazing. You can customize the experience to the absolute fullest.
  - The app is available on every platform and you can sync across devices either with Obsidian's hosted service, or do it for free with the [remotely-save plugin](https://github.com/remotely-save/remotely-save).

Eventually, I'll be writing a dedicated blog post on how I personally use it for note-taking and productivity tasks

### Publishing my notes before I automated it

I publish notes to https://notes.joshrnoll.com in the same way that I publish blog posts to this site: by using [Hugo](https://gohugo.io).

With Hugo, you write your post in a simple markdown file and the HTML and CSS are taken care of by the theme you select. Running the command:
```
hugo
```
will publish your site to the **```public```** directory and you are responsible for serving those static files. This can be done with a VPS running a web server like nginx or apache... or it can be done with a cloud storage account that has static site hosting enabled (my preferred method). If you're curious about the details on how to do that, [I wrote a post about how I did it in Azure](https://joshrnoll.com/migrating-my-website-to-azure/).

Hugo even has a built-in utility for deploying to a cloud storage account. So, to publish changes to your site, all you need to do is run:

```
hugo deploy
```

This will sync any changes to to your cloud storage account and update your site.

Since Obsidian stores all notes in a simple *.md* file, this means I can copy my notes to the Hugo project directory and publish them to my notes site. **The manual workflow looks like this:**

1. Copy a note from my obsidian vault to my Hugo project directory.
2. Add the necessary [frontmatter](https://https://gohugo.io/content-management/front-matter/) that Hugo is expecting.
3. Commit my changes to git (Hugo doesn't actually care about this, but it's best practice).
4. Run **```hugo```** to build the site locally and then **```hugo deploy```** to publish the note to the site.

## Automating the process
Remember the whole reason I started this thing in the first place? Because I was procrastinating?

Yeah... I'm not gonna be doing all of that every time I take a note. I'm gonna need all of that to happen automatically, and silently in the background.

Don't worry, I built a solution. The source code to everything I'm about to talk about is in [this repo](https://github.com/joshrnoll/publish-notes-script). It's not that pretty, and there's lots of room for improvement, but it gets the job done.

Now, let me give you the details...

### The metadata

First, let's talk about Hugo frontmatter. Frontmatter is nothing more than a way to add metadata to a document. Originally meant for YAML files, Hugo uses it for markdown files to add metadata to your posts. Here's an example:

```markdown
---
date: 2025-06-29T15:31:10-04:00
draft: "false"
title: This is an Example
hideReply: "true"
publishNote: "true"
tags:
  - Example1
  - Example2
---

# This is a post

With some content

```

Hugo interprets this metadata and adds it to the HTML of your post *automagically*. Notice the date at the top of this post? (The one you're reading right now). The source code of this post contains a date field just like the one above which is used to create that date. Other things like the title and tags are all interpreted from this frontmatter as well. The **```draft```** field tells Hugo whether to actually publish this post or not.

### The python script

With this in mind, I formulated a plan. I would use this frontmatter to determine whether the note was one I wished to publish or not by adding a **```publishNote```** key with a boolean value in the frontmatter. Then, I got to writing some hasty code.

A python script would search through my Obsidian vault for any file containing the **```publishNote```** field in the frontmatter. If this was set to **```true```**, It would copy the file to the Hugo project directory. If it was **```false```**, it would pass over it.

I quickly realized that the script had no way to tell whether there were changes to a note. Once a note had been copied to the Hugo directory, it would be skipped on every subsequent run of the script. So, I added a check that would compare a hash of the two files (assuming it already existed in the Hugo directory). If the hash was the same, the file would be skipped. If it was different, the content in the Obsidian vault would win and overwrite the file in the Hugo directory.

This is just one of many optimizations that are sure to come... or maybe not, if I continue to treat a temporary solution as permanent. Only time will tell.

### The Obsidian template

This workflow is, of course, contingent on that frontmatter existing in the first place. Obsidian, by default, doesn't include it. So I needed a way to make sure that it was always there.

Remember how I said that Obsidian is infinitely customizable? A native feature of Obsidian is the template feature, which allows you to define a template for creating new notes. Maybe you have a certain format that you journal in every day, or a certain format that you take notes while reading. You can define a template in Obsidian for it so that you're not rewriting the same stuff every time you take a note.

My template file looks like this:

```markdown
---
date: {{date}}T{{time}}
draft: "false"
title:
hideReply: "true"
publishNote: "false"
tags:
---
```

The ```{{date}}``` and ```{{time}}``` fields are variables which will automatically fill in the current date and time. You can customize the date and time format in Obsidian's settings. The reason for the **T** in between them is because Hugo uses [ISO 8601 date formatting](https://en.wikipedia.org/wiki/ISO_8601) by default. This will produce a result that looks like this:

```
2025-06-30T05:58:43-04:00
```

With all of this set up, I can create a new, blank note in Obsidian and just start writing. If I decide that I want to publish the note, I simply click on the *Insert Template* button on the sidebar, select this template, and set **```publishNote```** to **```true```**.

<img src="/automating-my-notes-with-gitea-actions/obsidian-template-1.png" height=350 HSPACE=15 VSPACE=15>
<img src="/automating-my-notes-with-gitea-actions/obsidian-template-2.png" height=350 HSPACE=15 VSPACE=15>
<img src="/automating-my-notes-with-gitea-actions/obsidian-template-3.png" height=350 HSPACE=15 VSPACE=15>

### The Gitea action

Now, just because I get files moved from one folder to another on my local system doesn't mean they're getting published anywhere. I'm still missing the following steps in my workflow:

- Run the **```hugo```** command to build the site into the **```public```** directory.
- Run the **```hugo deploy```** command to push the changes to my Azure blob storage account where the site is hosted.

This can be accomplished with a CI/CD tool like GitHub actions. Since I host the repo for this site on a self-hosted [Gitea](https://about.gitea.com/) server, I decided to use Gitea actions (which are designed to be compatible with GitHub actions, so if you're looking at copying this setup, you could use GitHub actions as well).

Here's the YAML in the ```.gitea/workflows``` section of the site's repo:

```YAML
name: Publish Notes
on:
  push:
    branches:
      - main

jobs:
  publish_notes:
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Install Homebrew and Hugo
        env:
          AZURE_STORAGE_ACCOUNT_AUTH_MODE: key
          AZURE_STORAGE_ACCOUNT: ${{ secrets.AZURE_STORAGE_ACCOUNT }}
          AZURE_STORAGE_SAS_TOKEN: ${{ secrets.AZURE_STORAGE_SAS_TOKEN }}
        run: |
          /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
          echo >> /root/.bashrc
          echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> /root/.bashrc
          eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
          brew install hugo
          hugo && hugo deploy --target=production
```
We have two secrets that will need to be defined in the Web UI of the repo: **```AZURE_STORAGE_ACCOUNT```** and **```AZURE_STORAGE_ACCOUNT_SAS_TOKEN```**.

With those two defined, this action will:

1. Check out the source code
2. Install Homebrew and add it to the runner's **```$PATH```**
3. Use Homebrew to install Hugo
4. Run **```hugo```** to build the site into the **```public```** directory, and then **```hugo deploy --target=production```** to deploy changes to the Azure storage account.

This, too, could use some optimization since I later found out that there are pre-written actions for Hugo that would bypass the need to install Homebrew and Hugo directly onto the runner. But, hey, for now... it works!

### The bash script

So, now I have a script that copies the files where they need to go, and I have a CD pipeline built that will *automagically* publish the notes on git push... But... That means **I still need to manually git push.**

To fix that, I whipped up a quick bash script that simply activates the python venv, runs the python script, then git adds, commits and pushes any changes.

So, now, I just need to run one bash script to make all of that happen.

### The systemd timer

Well, for me, that ***still*** wasn't automated enough. So I took it one final step further by ensuring this script was run every day at a certain time.

My plan, initially, was to use cron for this. However, it turns out that my current distribution of choice, [Bluefin](https://projectbluefin.io), doesn't ship with the **```crontab```** command. So, I took the opportunity to learn about systemd timers.

At the expense of additional complexity, using a systemd timer comes with the added benefits of more granular control. You can define dependencies for the service, its output is logged in the system journal, and you can start/stop it with the **```systemctl```** command.

Before creating the timer, I needed to create a systemd *service* that would run the script. In a file called ```publish-notes.service```, I added the following:

```
# publish-notes.service

[Unit]
Description="Publish notes to website"
After=default.target

[Service]
Type=oneshot
ExecStart=/usr/bin/bash /var/home/josh/.scripts/publish-notes.sh
```

The above file essentially says: "After all other required services have started (default.target), run the publish-notes.sh script using the bash shell"

The **```type=oneshot```** tells systemd to wait until this process is complete before starting any follow-on processes.

Since this service would be ran as a regular user rather than system-wide, it would go in the **```~/.config/systemd/user```** directory. This directory doesn't exist by default, so I had to create it.

```bash
mkdir -p ~/.config/systemd/user
```

Then, in the same directory, I added the following to a file named ```publish-notes.timer```.

```
# publish-notes.timer

[Unit]
Description="Run publish-notes.sh at regular interval"

[Timer]
OnCalendar=*-*-* 00:00:00
Unit=publish-notes.service

[Install]
WantedBy=default.target
```

This is the equivalent to cron job using **```crontab```**. The above file is saying: "Every day at midnight (OnCalendar=*-*-* 00:00:00) run the publish-notes service (Unit=publish-notes.service)."

**```WantedBy=default.target```** tells systemd when to start this timer (in this case, along with the default system startup processes).

Before enabling the service and the timer, I needed to run:

```bash
systemctl --user daemon-reload
```

Finally, start and enable the timer

```bash
systemctl --user start publish-notes.timer && systemctl --user enable publish-notes.timer
```

And, enable the service:

```bash
systemctl --user enable publish-notes.service
```

## Conclusion

Now, every day at midnight, any new notes (or changes to existing ones) will be published to https://notes.joshrnoll.com. Additionally, if I ever want to publish notes outside of that schedule, I can just run:

```bash
systemctl --user start publish-notes.service
```

I can also use journalctl to check the logs of the service:

```bash
journalctl --user -u publish-notes.service | tail -15
Jul 01 00:00:22 bluefin bash[3914803]: File Test Deployment Notes.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File kubectl.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Kubernetes Components.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Ephemeral Tailscale Nodes on Talos Linux.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Labels and Selectors vs Annotations.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Proxmox Initial Setup.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Python Virtual Environments.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File LLM System Prompts.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Ping Sweep Command - Linux.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File Volume Negates Luck.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914803]: File CASP Study Notes.md already exists in /var/home/josh/gitea/notes-joshrnoll/content/notes. Skipping.
Jul 01 00:00:22 bluefin bash[3914810]: Already on 'main'
Jul 01 00:00:22 bluefin bash[3914810]: Your branch is up to date with 'origin/main'.
Jul 01 00:00:22 bluefin bash[3914795]: No changes published, skipping push
Jul 01 00:00:22 bluefin systemd[3954]: Finished publish-notes.service - "Publish notes to website".
```

Reckless automation complete. Time for coffee.

The source code for this project can be found [here](https://github.com/joshrnoll/publish-notes-script).

Do you think this kind of stuff is cool? [Follow an connect with me on LinkedIn](https://linkedin.com/in/joshrnoll)! Let's nerd out together.