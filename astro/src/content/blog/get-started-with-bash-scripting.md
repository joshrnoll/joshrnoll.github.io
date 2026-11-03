---
title: 'Get Started with Bash Scripting'
date: '2023-08-24T20:35:45+00:00'
author: 'Josh Noll'
draft: false
tags:
  - Automation
  - Bash
  - How-To
  - Linux
description: A tutorial on the basics of bash scripting
toc: true
---

Have you ever typed the same command more than once? If you answered yes, then this post is for you. If you answered no, well then you’re probably a liar.

Either way, let’s cover the basics of Bash scripting. I’m assuming that you have at least some knowledge of basic Linux commands and, if you want to follow along, you’ll need terminal access to a Linux system with root privileges. Please don’t use a production system in your workplace… Use a test environment or a machine at home.

Ideally you’ll use Fedora (specifically Fedora 38) as that is what I’m using in the examples, but it will be possible to follow along on another distribution as long as you aren’t blindly copy-pasting.

## What is Bash?

Bash stands for ‘Bourne Again Shell’ and it is the default shell used in most UNIX based operating systems. It was developed in 1989 to replace the original ‘Bourne Shell.’

But what even is a ‘shell?’ Well, we’re not talking about the kind that sally sells down by the seashore. We’re talking about a program that allows you to interact with your computer. Shells generally come in two flavors — Command Line Interface (CLI) or Graphical User Interface (GUI). If you’re reading this on a Windows or Mac, then you’re interacting with a GUI shell.

In Linux, however, it’s common to conduct many (if not all) of your tasks using the terminal, or the CLI. In this case, the shell you’ll interact with is bash. Instead of clicking on buttons or dragging scrollbars across your screen, you will interact with your computer entirely with your keyboard by typing out commands.

For example, if you type this command into a bash terminal:

```bash
echo "Hello World!"
```

You’ll get this output:

```bash
Hello World!
```

The command ‘echo’ is a simple one. It prints stuff to the screen. So the command goes:

```bash
echo "stuff you want to be on the screen"
```

But bash can do a lot more than just print words to the screen. But if you’re reading an article about bash scripting, I’m guessing you know that already. What this article will do is arm you with the tools to automate things you do in your bash terminal.

## Why Write Scripts?

Let’s take a more practical example though. Let’s say you want to install docker, one of the most popular container engines. First let’s go to the [official docker website](https://www.docker.com/) to find the [installation instructions](https://docs.docker.com/engine/install/fedora/). My current distribution of choice is Fedora. Make sure you look up the installation instructions for your distribution. The commands required to install docker, according to their documentation, are:

```bash
sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo docker run hello-world
```

So, breaking it down it looks like there’s a few things happening here. We’re removing any existing installations of docker to avoid conflicts. Then we’re installing some plugins for the dnf package manager, adding a repository, installing the docker packages and finally starting the docker service and verifying the installation by running ‘hello-world.’

Of course, you can copy and paste these commands easily from the docker documentation. But what if we could boil these commands down to just running this:

```bash
sudo ./dockerinstall.sh
```

That would be a lot simpler right? especially if you’re installing docker on multiple machines. Well, that’s exactly what I’m going to show you how to do!

## Start Scripting

Bash isn’t a programming language, but you can treat it like one. By saving commands to a file, and then executing that file, you’ll create a script. Rather than manually typing the same commands over and over (or tabbing through your command history over and over), you can just call the script and let bash do all that work for you.

Try it now:

```bash
nano ./myfirstscript.sh
```

This will open the nano text editor inside of a newly created file named *myfirstscript.sh* — add the following content to the file:

```bash
echo "This is my first script!"
```

Press ctrl+x and then press y to save your file. Now let’s try to run the script:

```bash
./myfirstscript.sh
```

But oh… we get this?

```
bash: ./myfirstscript.sh: Permission denied
```

Well, heck we must have forgotten to use sudo! Sudo stands for ‘super user do’ and allows you to elevate your privileges to root for the command that follows. So let’s try:

```
sudo ./myfirstscript.sh
```

You’ll be prompted for your password, and then… huh, well now we get this?

```bash
sudo: ./myfirstscript.sh: command not found
```

Well, the reason we’re getting these errors is because our script is missing something. Although the file is saved with the appropriate .sh file extension, the interpreter doesn’t know what interactive shell it should be referencing when executing it. One way to tell the interpreter to explicitly use bash is by calling the script with the ‘bash’ command:

```bash
bash ./myfirstscript.sh
```

But this is bad practice. We’re trying to reduce the number of things we have to type, not add to it! This is where the ‘shebang’ comes in. It’s also commonly referred to as the ‘hashbang’, and it’s a way of specifying to the interpreter explicitly which shell to use when interpreting the remainder of the script. Try adding the following to your *myfirstscript.sh* file:

```bash
#!/bin/bash
echo "This is my first script!"
```

The #! syntax is built into the shell and basically says “Hey, computer, interpret the rest of this file with the programs that exist in this path:” — /bin/bash is where the binaries for the bash shell live. If we were writing a python script, we could write a shebang like this:

```python
#!/usr/bin/python
```

But we’re writing a bash script, so if you were blindly copy and pasting, now would be a good time to remove that python shebang! But the shebang hasn’t solved all our problems. If you run your script now, you’ll still get permission denied:

```bash
bash: ./myfirstscript.sh: Permission denied
```

Why is that? I thought we fixed all this with the shebang! Well, there’s one last piece of the puzzle. Humor me and run:

```bash
ls -l
```

You’ll see that the file does not have any execute permissions assigned to it. If it did, you would see one or more x’s in the output:

```bash
total 4
-rw-r--r--. 1 josh josh 44 Aug 24 14:03 myfirstscript.sh
```

Simple fix! Let’s run the following command to add execute permissions:

```bash
chmod +x ./myfirstscript.sh
```

Now if you run ls -l again, you should see that the file has executable file permissions.

```bash
total 4
-rwxr-xr-x. 1 josh josh 44 Aug 24 14:03 myfirstscript.sh
```

Keep in mind, this command adds global execute permissions. Meaning you, root, and any other users on the system can execute the script. I’ll go over Linux file permissions in more detail in another post.

## Your First Script

Alright, enough talk. Let’s write your first real script! The following is an example of a simple Hello World script. The first line is a shebang, which we covered earlier.

The next few lines are comments. The pound symbol will render everything that follows as a comment rather than code (unless immediately followed by a bang/exclamation point — denoting a shebang). Comments can be used to add descriptions within your script, or headers with information containing things like the author, version, date etc. It’s generally best practice to include some kind of header information in your scripts, so I’ve included one here.

Finally, we have the command — echo “Hello World!”

```bash
#!/bin/bash

#########################################
# Author: Joshua Noll
# Version: 1.0
# Date: 24 August 2024
# Description: My first bash script
# Usage: ./hello-world.sh
#########################################

#Print text to the terminal
echo "Hello World!" 
```

Copy this script and save it to a file named hello-world.sh

Then, add executable permissions to the file:

```bash
chmod +x ./hello-world.sh
```

Now, run the script:

```bash
./hello-world.sh
```

Did your terminal greet you with a friendly “Hello World!”? If you got any errors, double check the syntax on your shebang and the file permissions.

## Something Useful

Okay, now how do we write something actually useful? Well, remember earlier when we looked up how to install docker? Let’s paste all of those commands into a bash script (***remember, these commands are for Fedora! If you are running a different distribution be sure to look up the appropriate commands in the docker docs!***):

```bash
#!/bin/bash

#########################################
# Author: Joshua Noll
# Version: 1.0
# Date: 24 August 2024
# Description: Install docker
# Usage: ./dockerinstall.sh
#########################################

sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo docker run hello-world
```

Okay, but wait! Don’t run this as it is. There are a couple of tweaks we should make.

First of all, each command within the script is run with sudo. It’s generally bad practice to add sudo within the script itself (unless you add some checks and balances that are well outside the scope of this article). Furthermore, this will prompt us for the sudo password with each line. So we’ll have to type our password six times! Remember, we’re trying to automate things here. So, let’s rip out the sudos inside the script and, when we call the script later, we can run the script itself with sudo.

```bash
#!/bin/bash

#########################################
# Author: Joshua Noll
# Version: 1.1
# Date: 24 August 2024
# Description: Install docker
# Usage: sudo ./dockerinstall.sh
#########################################

dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
dnf -y install dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl start docker
docker run hello-world
```

Note that I’ve incremented the version number in the header block. This is just a recommended practice. There are better ways of version controlling your scripts, like using git. But in the absence of true version control, it’s a good idea to do this so you can at least see when changes were made.

Okay, functionally, we’re all set now. But isn’t that hard to read? Do you know what’s going on within this script at a glance? Probably not. That’s where comments come in! Let’s add some comments to make the script more readable and help our future-selves know what we were doing when we wrote it:

```bash
#!/bin/bash

#########################################
# Author: Joshua Noll
# Version: 1.2
# Date: 24 August 2024
# Description: Install docker
# Usage: sudo ./dockerinstall.sh
#########################################

#Uninstall old versions
dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine

#Set up the repository
dnf -y install dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

#Install the latest version of docker
dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

#Start the docker service
systemctl start docker

#Verify the installation
docker run hello-world
```

And there we have it! Be sure to add executable permissions to the script:

```bash
chmod +x ./dockerinstall.sh
```

Now, let’s run our script! Be sure to run it with sudo as we discussed.

```bash
sudo ./dockerinstall.sh
```

Your terminal will pop up with a bunch of stuff that will make you feel like you’re in the Matrix. Make sure you respond to the Y/N prompts as they appear.

If all went well, the last thing you should see pop up is this:

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

Congratulations! You just automated something! Now you can take this script to other Fedora machines to install docker, rather than looking up the commands in the documentation again and copy-pasting each one manually.

## Don’t Stop Here!

You now have the principle knowledge to start writing scripts. So go out and write some! Or make this one better. Think about all the things this script doesn’t do. What if you want the script to check to see if docker is already installed first? What if you want to pull a specific container afterward rather than hello world? Try to do things I didn’t teach you here. When you get stuck, google it. Ask ChatGPT. Dive into a book on bash scripting. The information is out there and the possibilities are endless.