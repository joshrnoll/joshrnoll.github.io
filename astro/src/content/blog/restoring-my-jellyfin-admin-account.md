---
title: "Restoring My Jellyfin Admin Account"
date: 2024-11-09T05:51:43-05:00
draft: false
author: Josh Noll
tags:
  - Homelab
  - Permissions
  - Database
  - Media
  - SQL
image: /jellyfin.png
description: How I restored my jellyfin admin account permissions after breaking them.
toc: true
---

## Introduction

I've recently been attempting to implement single-sign-on (SSO) in my homelab using [Authentik](https://goauthentik.io). I've wrote a litte about that adventure so far. You can read that article [here](https://joshrnoll.com/implementing-sso-using-authentik-and-nginx-reverse-proxy-manager/).

Well, recently, I attempted integrating Authentik with [Jellyfin](https://jellyfin.org), my self-hosted media server of choice. This requires a [third-party plugin](https://github.com/9p4/jellyfin-plugin-sso), which does seem to work largely as expected. 

Unfortunately, what I didn't realize was that the plugin auto-creates a new Jellyfin user account once a user is authenticated. If a user already exists on Jellyfin with the same username as the user that was just authenticated in Authentik, it will overwrite its permissions based on how you configured the plugin. 

Well, my Jellyfin admin account and my Authentik account had the same username... and I did not configure the plugin to give authenticated users admin permissions. So, I can still access Jellyfin... but I have no access to the admin interface. 

Let's fix that. 

## My train of thought
After the initial heart attack wore off, I began my google searching. Of course, coming across the few Reddit threads of cynical folks saying "I hope you have good backups!" didn't help. And that is largely what you'll come across if you search "how to restore admin permissions on jellyfin" or "lost admin access jellyfin."

So, I took a step back and thought to myself... 

Jellyfin uses a sqlite database... Which means that each user and their corresponding permissions are stored in that database. 

So, in theory, running a few SQL commands to manipulate my user's entry in the database could restore my admin permissions.

Well, as it turns out, the official Jellyfin docs have a [guide on doing exactly that](https://jellyfin.org/docs/general/administration/troubleshooting#fix-admin-user-permissions).

## Execing into the container
The guide in question makes some assumptions that you know where your db file is. I didn't exactly know, so I had to do a little exploring. 

Since I run Jellyfin in a Docker container, the first step was to exec into the container. You'll need to SSH into the host where the container is running, or use a [Docker context](https://docs.docker.com/engine/manage-resources/contexts/), then run:

```
docker exec -it jellyfin sh
```

Where ```jellyfin``` is the name of the container, and ```sh``` is the command we're running. In this case, I'm entering the shell. The ```-it``` allows an interactive terminal. This allows me to interact directly with the container through shell commands. 

### Finding the DB file

Now that I'm in the container's shell, I needed to find the db file. The easiest way would be to use the *find* command:

```
find . -name "jellyfin.db"
```

This produced the following output:

```
find: ‘./proc/158/task/158/fdinfo’: Permission denied
find: ‘./proc/158/task/171/fdinfo’: Permission denied
find: ‘./proc/158/task/176/fdinfo’: Permission denied
find: ‘./proc/158/task/177/fdinfo’: Permission denied
find: ‘./proc/158/task/178/fdinfo’: Permission denied
find: ‘./proc/158/task/179/fdinfo’: Permission denied
find: ‘./proc/158/task/181/fdinfo’: Permission denied
find: ‘./proc/158/task/182/fdinfo’: Permission denied
find: ‘./proc/158/task/183/fdinfo’: Permission denied
find: ‘./proc/158/task/184/fdinfo’: Permission denied
find: ‘./proc/158/task/185/fdinfo’: Permission denied
find: ‘./proc/158/task/187/fdinfo’: Permission denied
find: ‘./proc/158/task/190/fdinfo’: Permission denied
find: ‘./proc/158/task/200/fdinfo’: Permission denied
find: ‘./proc/158/task/259/fdinfo’: Permission denied
find: ‘./proc/158/task/260/fdinfo’: Permission denied
find: ‘./proc/158/task/289/fdinfo’: Permission denied
find: ‘./proc/158/task/588/fdinfo’: Permission denied
find: ‘./proc/158/map_files’: Permission denied
find: ‘./proc/158/fdinfo’: Permission denied
./config/data/data/jellyfin.db
```

Notice the last line. This tells me that my jellyfin.db file is located at /config/data/data/jellyfin.db 

### Opening the DB with SQLite3

I attempted to run the following command to open the database with sqlite3:

```
sqlite3 ./config/data/data/jellyfin.db
```

But that produced:

```
sh: 34: sqlite3: not found
```

Turns out sqlite3 isn't installed in this container image. To confirm which package manager I would need to use to install it, I double checked what OS base image the container is built on by running:

```
cat /etc/os-release
```

Which produced:

```
PRETTY_NAME="Ubuntu 24.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.1 LTS (Noble Numbat)"
VERSION_CODENAME=noble
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=noble
LOGO=ubuntu-logo
```

Okay, so this is Ubuntu, which means we're using apt. Let's run:

```
apt update && apt install sqlite3
```

Once installed we can re-run the command to open the database with sqlite3. This should bring us to the following prompt:

```
sqlite>
```
### Manipulating the user entry
Based on the guide, I ran the following query to check the current permissions of my user, where 'josh' is the name of the user:

```
sqlite> SELECT Value,Kind FROM Permissions WHERE UserId IN (SELECT Id FROM Users WHERE Username = 'josh');
```

This produced:

```
0|0
0|2
1|1
1|15
1|14
1|16
1|10
1|11
1|13
1|7
1|19
1|17
1|4
1|12
1|8
0|6
0|5
1|3
1|9
0|20
1|18
0|21
0|22
0|23
```

Now, the guide states that the first row should be a '1' or '0' indicated whether or not the permission, denoted in the second row, is assigned or not. Determining which permissions the numbers in the second row correspond to can be done by referencing the [link](https://github.com/jellyfin/jellyfin/blob/master/Jellyfin.Data/Enums/PermissionKind.cs) provided in the guide. 

This is a link to the source code, so we're actually looking directly at the source of truth to determine the permissions. Not some poorly written documentation that may be outdated or contain typos. **This is why I love open source!**

So the important permission is the very first one: 'IsAdministrator' which is denoted by '0' in the second column. We need that to read ```1|0``` rather than ```0|0```.

So, I ran the following suggested SQL command to update my permissions:

```
sqlite> UPDATE Permissions SET Value = 1 WHERE (Kind = 0 OR Kind = 3 OR Kind = 4 OR Kind = 5 OR Kind = 6 OR Kind = 7 OR Kind = 8 OR Kind = 9 OR Kind = 10 OR Kind = 11 OR Kind = 12 OR Kind = 13 OR Kind = 14 OR Kind = 15 OR Kind = 16 OR Kind = 17 OR Kind = 18 OR Kind = 19 OR Kind = 20 OR Kind = 21) AND UserId IN (SELECT Id FROM Users WHERE Username = 'josh');
```
Then re-ran the previous query to double check my permissions and got:

```
1|0
0|2
1|1
1|15
1|14
1|16
1|10
1|11
1|13
1|7
1|19
1|17
1|4
1|12
1|8
1|6
1|5
1|3
1|9
1|20
1|18
1|21
0|22
0|23
```
### It's not working...
Success! I'm an administrator again. I closed the database with:

```
.exit
```
My success was short lived... When I logged back in to Jellyfin, I still had no access to the admin dashboard. Interesting... 

Hopping back to the terminal and re-running the query to check my permissions revealed that my account indeed had reverted back to ```0|0```. 

Now, I'm unsure why this worked... but this time I SSHed into the host rather than execing into the container, and repeated all of the previous steps directly on the host. Since the Jellyfin data directory is a bind mount, I was able to access the database directly from the host system. 

I stopped the container with:

```
docker stop jellyfin
```

Then, repeated all of the previous steps, and started the container again. 

```
docker start jellyfin
```
### Success!

Finally, logging back in with my **local username/password** gave me access to the admin dashboard again! Now, as I suspected, logging back in with my Authentik credentials via SSO, overwrote my permissions again. Luckily, these steps weren't difficult to repeat. Now, I can dig into the SSO configuration and figure out how to set the permissions correctly so that they don't get overwritten...

## Conclusion

I'm not exactly sure why this didn't work until I ran the commands from the host machine. I suspect that the container has a process writing to the database which couldn't be overwritten until it was stopped. But I'm honestly not sure. If you know, please reach out to me on linkedin, I'd love to share some nerd talk and learn something new!