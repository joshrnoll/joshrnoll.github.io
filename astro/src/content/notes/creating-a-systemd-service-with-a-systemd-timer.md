---
date: 2025-05-25T15:02:32-04:00
draft: false
title: Creating a systemd service with a systemd timer
tags:
  - linux
  - systemd
  - automation
---
# Creating a systemd service for a regular user using a systemd timer
A regular user's systemd service files will be located in the ```~/.config/systemd/user``` directory, which may not exist already (so you'll have to create it with ```mkdir```)

Assuming you'll want this service to start after all other default services have started, you'll want to find out what your system's default target is with:

```bash
sudo systemctl get-default
```

My system returns ```graphical.target```. If you're curious, you can see this target's dependencies with:

```
sudo systemctl list-dependencies graphical.target
```

## Create the service file

Now, create a file in the previously mentioned dir with the file extension of ```.service```

```bash
# publish-notes.service
[Unit]
Description="Publish notes to website"
After=graphical.target

[Service]
Type=oneshot
ExecStart=/usr/bin/bash /var/home/josh/.scripts/publish-notes.sh
```

The ```After=graphical.target``` entry is where we specify that this service should run *after* all other default services have started/ran.

In the service section, ```Type=oneshot``` is defined in the docs [here](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html):

> "Sometimes, units should just execute an action without keeping active processes, such as a filesystem check or a cleanup action on boot. For this, `Type=``oneshot` exists. Units of this type will wait until the process specified terminates and then fall back to being inactive."

This appears to be the best option for running a script that doesn't have any persisting processes. In the case of my publish-notes script, I'm copying some files and committing to a git repo, then exiting. So, oneshot seems to be most appropriate.
## Create the timer file

To use a systemd timer, you'll need to create a corresponding ```.timer``` file in the same directory (with the same name as the service file).

```bash
# publish-notes.timer
[Unit]
Description="Run publish-notes.sh at regular interval"

[Timer]
OnBootSec=5min
OnUnitActiveSec=24h
OnCalendar=Mon..Fri *-*-* 10:00:*
Unit=publish-notes.service

[Install]
WantedBy=graphical.target
```

Here we have several options in the *Timer* section. **You only don't need all of these, they're here for illustrative purposes:

#### OnBootSec=5min
This example defines a timer which triggers 5 minutes after the system boots

#### OnUnitActiveSec=24h
This defines a timer which triggers 24 hours after a service has been actived (ie. once per day)

#### OnCalendar
This defines a timer which triggers at fixed points in time, with similar syntax to cron

#### Unit
Here we define the service that is triggered by the timer (the one we created earlier)

In the *Install* section, we have a ```WantedBy``` entry. **This defines the target after which the timer is actived.** In my case, after my system's default target (effectively, after the system is 'warmed up').

## Enabling the service and timer
When creating a systemd service, you need to issue the command ```systemctl daemon reload``` to tell your system to read newly created service files. Because we set up the service as a regular user, we need to issue it with the ```--user``` flag:

```
systemctl --user daemon-reload
```

Then, enable the service (still using the ```--user``` flag):

```
systemctl --user enable publish-notes.service
```

Do the same for the timer:

```
systemctl --user enable publish-notes.timer
```