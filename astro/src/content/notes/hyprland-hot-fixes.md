---
date: 2025-08-19T06:24:57-04:00
draft: false
title: Hyprland Hot-Fixes
tags:
  - hyprland
  - linux
  - archlinux
---
## Pop-ups disappear immediately when moving mouse in zoom

https://wiki.hypr.land/FAQ/#some-of-my-drop-downpop-up-windows-in-apps-disappeardont-open-at-cursor-position

1. Open terminal and run ```sleep 3 && hyprctl monitors```. The sleep command will give you a few seconds to click the button in zoom that opens the broken pop-up window. Look in the output for something that looks like this:
```
Window 5585c5b20310 -> menu window:
	mapped: 1
	hidden: 0
	at: 1138,894
	size: 489,311
	workspace: 4 (4)
	floating: 1
	pseudo: 0
	monitor: 0
	class: zoom
	title: menu window
	initialClass: zoom
	initialTitle: menu window
	pid: 4440
	xwayland: 1
	pinned: 0
	fullscreen: 0
	fullscreenClient: 0
	grouped: 0
	tags:
	swallowing: 0
	focusHistoryID: 0
	inhibitingIdle: 0
	xdgTag:
	xdgDescription:
```

> note: after adding the first line listed below, I still couldn't get into the breakout room because the 'join' button pop-up window would also disappear. I repeated the step above to find that window and add the second line below. 

1. Use this info to add the following to hyprland.conf. In my case, I'm using Omarchy, so the file is located at ```~./config/hypr/hyprland.conf```:
```bash
# Fix disappearing pop-ups in zoom
windowrule = stayfocused, title:^(menu window)$, class:^(zoom)$
windowrule = stayfocused, title:^(confirm window)$, class:^(zoom)$
```

## Wacom tablet can't select via buttons or tapping
- Tried this but it doesn't fix it:
https://thomaspurnell.com/003_wacom_graphics_hyprland/wacom_hyprland.html
