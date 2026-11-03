---
date: 2025-06-01T12:35:25-04:00
draft: false
title: Set up Wyze v3 camera with wyze_mini_hacks firmware
tags:
  - homeassistant
  - cameras
  - wyze
---
The purpose of this setup is to set up a wyze v3 camera without using Wyze's cloud services and to adopt the stream into home assistant

## References

https://leo.leung.xyz/wiki/Wyze_Cam?ref=houndhillhomestead.com#Setup_a_Wyze_Cam_without_the_Wyze_App_or_internet

https://github.com/gtxaspec/wz_mini_hacks

## Install the latest supported firmware

The latest version of supported firmware for the Wyze v3 is 4.36.9.139 -- luckily leo's notes have a copy that can be downloaded [here](https://download.wyzecam.com/firmware/v3/demo_wcv3_4.36.9.139.zip) 

- Unzip this file to the root of a microsd card
- Insert the microsd card into the camera
- Hold the 'setup' button while plugging the camera in to power
- Wait until the camera light turns purple(indicates firmware is being flashed). Release the setup button and wait until the light turns red and blinks (indicates firmware flashing is complete)
- Power off the camera
## Set up the camera (without the Wyze app)
- Remove the sd card from the camera and delete all files and directories from it
- Clone the wz_mini_hacks repo to your computer/laptop
- copy the ***contents*** of the SD_ROOT directory to the microsd card
- Edit the file ```wz_mini/wz_mini.conf``` and change ```ENABLE_SELFHOSTED_MODE``` to true
- Copy your public ssh key to the wz_mini/etc/ssh/authorized_keys file:

```bash
echo $(cat ~/.ssh/id_rsa.pub) >> wz_mini/etc/ssh/authorized_keys
```

- Unmount the sd card from your computer and place it back into the camera
- power on the camera -- you will hear the camera say "WZ mini initializing first boot" then "Extracting swap. Please wait."
## Connect the camera to wifi
- When complete, the light will blink red
- Get a QR code for your wifi ready. You can use an iphone shortcut to do this, or use a website like [this one](https://codepen.io/ril3y/full/gXyzmO/)
- Press the setup button once, you should hear "Ready to connect"
- Hold the QR code in front of the camera. You will hear "QR code scanned" then "wifi connected"
## Update config via SSH
- Log in to your router to find out what IP address the camera was assigned by looking for its mac address (the MAC address is on the bottom of the camera)
- SSH into the camera with the username root

```bash
ssh root@192.168.0.123
```

- run ```wz_mini_edit.sh``` to edit the config file again. ***Don't edit the file directly using nano or vim while the camera is running.***
- Enable the GoRTC server by changing the following:

```
GO2RTC_SERVER_ENABLED="true"
GO2RTC_HI_RES_ENABLED="true"
GO2RTC_HI_RES_ENABLE_AUDIO="true"
GO2RTC_LOW_RES_ENABLED="true"
GO2RTC_LOW_RES_ENABLE_AUDIO="true"
```

- I also disabled auth since this camera will be blocked from internet access on my local lan:

```
RTSP_AUTH_DISABLE="true"
```

> NOTE: You will need to restart the camera after doing this. Just pull the unplug it and plug it back in. 

## Bask in the glory of your hacked Wyze camera

Visit the camera's stream using VLC with the following URL:

rtsp://192.168.0.123:8554/1080p?mp4

You can view other feeds by visiting the GoRTC web server at http://192.168.0.123:1984

