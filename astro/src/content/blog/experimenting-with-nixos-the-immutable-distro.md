---
title: 'Experimenting with NixOS: The Immutable Distro'
date: '2023-10-23T01:25:17+00:00'
author: 'Josh Noll'
draft: false
image: /wp-content/uploads/2023/10/logo.webp
tags:
  - Automation
  - Linux
description: My experience trying out NixOS
---

As a desktop linux user, things break all the time. Got your display configuration working? Well, that broke again. Finally get your microphone to sound normal and not like you’re underwater? Hello kernel update! Make a change to a configuration file to fix one thing, and you break something else. Uninstall a package that you didn’t think you needed, only to find out that it was a dependency of something you did. The list goes on and the tinkering never stops.

You might ask why one would bother using desktop linux in this case. Why not just use something that the rest of the world uses like Windows or MacOS? Well, the answer to that question is:

Because I’m a nerd (and maybe a masochist).

I get an odd sense of satisfaction every time I fix a problem with my computer. I enjoy the learning process that comes with tinkering and troubleshooting. But, sometimes I just need it to work. If I do something adventurous that ends up breaking a critical component of my system, it would be nice to have the ability to restore myself back to a working state with a single command.

## Immutability

This concept is called immutability and it’s a concept in programming that refers to the inability to change the state of something after it’s been created. It doesn’t mean that it can’t be changed, it just means that its state is preserved. Think of it as keeping the object “safe.” There’s an excellent Medium article describing immutability by Mátyás Lancelot Bors. You can read it [here.](https://medium.com/@mlbors/what-is-immutability-3877edd74e38)

What does this mean for an operating system? Well, immutability can protect you from your curious self. When you decide to get adventurous and break things, an immutable operating system will either:

1. Preserve its state, allowing you to easily roll back to it, or
2. Not allow you to make the change in the first place

## Enter NixOS

![](/wp-content/uploads/2023/10/logo.webp)

NixOS has just that. It takes an Infrastructure as Code (IaC) approach to your operating system. Instead of manually configuring your system after install by poking around in the settings, running endless commands in the terminal, and rebooting several times, you can declare your configuration in a single file. Installing a new package, enabling a service, or even changing your desktop experience from KDE to GNOME can be done by simply adding or removing a few lines in the configuration.nix file, located at /etc/nixos/configuration.nix, and running:

```bash
sudo nixos-rebuild switch
```

 This command will immediately make all the necessary changes declared in your configuration.nix file and make that configuration the default for booting. Because NixOS doesn’t overwrite your previous configurations, it’s possible to rollback to any previous configuration in the boot menu.

![](/wp-content/uploads/2023/10/boot_menu.jpeg)

You can also roll back to the most recent previous configuration by running:

```bash
sudo nixos-rebuild switch --rollback
```

The catch though is that your configuration.nix file will persist no matter what build you boot into. So once you make a change and save over it, you won’t be able to go back and see the differences between configurations. But because it’s just a file, you can keep your configuration.nix file in a separate version control system (something like git). Or you can just make a backup copy every time you make a change with something like:

```bash
sudo cp /etc/nixos/configuration.nix /path/to/backup/configuration.nix.bak
```

## Experimenting

NixOS has a pre-built VirtualBox VM that you can deploy instantly and play with. You can download it [here.](https://nixos.org/download#nixos-virtualbox) Be warned: I found this box to be a little finnicky. First, I wanted to check out the configurartion.nix file. So, I logged in with the credentials demo/demo:

![](/wp-content/uploads/2023/10/nix-01.png)

Then I ran:

```bash
sudo nano /etc/nixos/configuration.nix
```

This will open up the configuration.nix file for the system. Changes made here will make changes to the system’s overall configuration. The default configuration file looks like this:

```bash
{ config, pkgs, ... }:

{
  imports = [ <nixpkgs/nixos/modules/installer/virtualbox-demo.nix> ];

  # Let demo build as a trusted user.
# nix.settings.trusted-users = [ "demo" ];

# Mount a VirtualBox shared folder.
# This is configurable in the VirtualBox menu at
# Machine / Settings / Shared Folders.
# fileSystems."/mnt" = {
#   fsType = "vboxsf";
#   device = "nameofdevicetomount";
#   options = [ "rw" ];
# };

# By default, the NixOS VirtualBox demo image includes SDDM and Plasma.
# If you prefer another desktop manager or display manager, you may want
# to disable the default.
# services.xserver.desktopManager.plasma5.enable = lib.mkForce false;
# services.xserver.displayManager.sddm.enable = lib.mkForce false;

# Enable GDM/GNOME by uncommenting above two lines and two lines below.
# services.xserver.displayManager.gdm.enable = true;
# services.xserver.desktopManager.gnome.enable = true;

# Set your time zone.
# time.timeZone = "Europe/Amsterdam";

# List packages installed in system profile. To search, run:
# \$ nix search wget
# environment.systemPackages = with pkgs; [
#   wget vim
# ];

# Enable the OpenSSH daemon.
# services.openssh.enable = true;

}
```

You can see that almost the entire file is commented out. It looks like everything is coming from a single module import. But it also looks like we can uncomment a few lines and switch from a KDE Plasma desktop environment to a GNOME desktop environment. I tried this and followed it up by running:

```bash
sudo nixos-rebuild switch
```

This didn’t appear to have the desired affect. This brought me into a TTY; something that looked like this.

![](/wp-content/uploads/2023/10/tty-1024x247.jpeg)

I logged into the TTY and ran the reboot command. Afterwards the system did boot into a GNOME desktop environment. After witnessing this I assume that it’s best practice in NixOS to reboot the system after making major changes like adding or removing a desktop environment. This could be done by running:

```bash
sudo nixos-rebuild switch && sudo reboot now
```

But NixOS has a built-in way of doing this which is a little more streamlined. Instead of using the ***switch*** option, we can use the ***boot*** option to build the new configuration and set it as the new boot default, but not immediately switch to it.

```bash
sudo nixos-rebuild boot
```

Then we can reboot our system whenever we’re ready for the desired changes to take effect. So I reverted my demo machine to snapshot and tried this approach instead. However, I was still greeted with a TTY initially on first boot. After letting it sit for a few seconds, it did switch into GNOME on it’s own though.

I can only attribute this behavior to one of two things:

1. I have no idea what I am doing
2. The VirtualBox demo from Nix’s website has a special configuration that is causing it to behave differently than a machine built with the graphical installer would.

![](/wp-content/uploads/2023/10/graphical_installer.webp)

It’s also possible that both of these things are causing this behavior. Regardless, I decided at this point to nuke the demo machine and build my own VM with the NixOS graphical installer ISO. The installer is very intuitive and easy to work with. It boots into a live environment with a GNOME desktop so you can play around a bit before you run the install. I, however, sent it with the full install immediately. It is a VM after all.

The graphical installer does require an internet connection to run, so keep that in mind if you try this for yourself. After clicking next several times, I chose GNOME as my desktop experience. Once I was all booted up and logged in I took a look at my configuration.nix file:

```bash
{ config, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "nixos"; # Define your hostname.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Enable networking
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "America/Chicago";

  # Select internationalisation properties.
  i18n.defaultLocale = "en_US.UTF-8";

  i18n.extraLocaleSettings = {
    LC_ADDRESS = "en_US.UTF-8";
    LC_IDENTIFICATION = "en_US.UTF-8";
    LC_MEASUREMENT = "en_US.UTF-8";
    LC_MONETARY = "en_US.UTF-8";
    LC_NAME = "en_US.UTF-8";
    LC_NUMERIC = "en_US.UTF-8";
    LC_PAPER = "en_US.UTF-8";
    LC_TELEPHONE = "en_US.UTF-8";
    LC_TIME = "en_US.UTF-8";
  };

  # Enable the X11 windowing system.
  services.xserver.enable = true;

  # Enable the GNOME Desktop Environment.
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

  # Configure keymap in X11
  services.xserver = {
    layout = "us";
    xkbVariant = "";
  };

  # Enable CUPS to print documents.
  services.printing.enable = true;

  # Enable sound with pipewire.
  sound.enable = true;
  hardware.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    #jack.enable = true;

    # use the example session manager (no others are packaged yet so this is enabled by default,
    # no need to redefine it in your config for now)
    #media-session.enable = true;
  };

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.josh = {
    isNormalUser = true;
    description = "Joshua Noll";
    extraGroups = [ "networkmanager" "wheel" ];
    packages = with pkgs; [
      firefox
    #  thunderbird
    ];
  };

  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
  #  vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  #  wget
  ];

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  # services.openssh.enable = true;

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "23.05"; # Did you read the comment?

}

```

Now, this seems much more representative of a true NixOS environment. Even without having a deep understanding of the Nix language, I can generally understand the configurations being set here. Now, a quick google search brings me back to the two lines that will give me a KDE Plasma desktop experience rather than GNOME.

```bash
services.xserver.displayManager.sddm.enable = true;
services.xserver.desktopManager.plasma5.enable = true;
```

So, I replaced these two lines with the two lines referencing GNOME:

```bash
  # Enable the GNOME Desktop Environment.
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;
```

Then, I rebuilt the system setting my new configuration as the boot default without immediately switching to it.

```bash
sudo nixos-rebuild boot
```

And wouldn’t you know it… after a reboot, I have a completely different desktop environment! Normally, properly switching to a different DE can be quite the effort. And having multiple installed at one time can sometimes cause weird issues. NixOS makes it super easy to switch back and forth.

Now let’s get some real customization going. I’m going to revert back to my original configuration, since I really do want a GNOME desktop.

```
sudo nixos-rebuild switch --rollback
```

Now that I’m back into my GNOME desktop environment, I’m going to edit my configuration.nix file to remove the two lines that I added for KDE and add the two lines for GNOME back in. If I don’t do this the system will rebuild the KDE desktop back into my configuration the next time I run nixos-rebuild.

Now, let’s zero in on this part of the configuration file:

```bash
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
  #  vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  #  wget
  ];
```

Right now, there are no packages listed. The only two are commented out. This means we are only getting the default packages that come stock with NixOS and any packages that are dependencies of any other parts of the configuration, like the desktop environment. To customize this, I changed it to:

```bash
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
   vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
   wget
   brave
   bitwarden
   git
   handbrake
   vscode
   tilix
   neofetch
  ];
```

Now, this obviously isn’t an all-encompassing list for me right now, but it’s enough to test how efficiently NixOS can install and manage packages. My question about rebooting remains. Does NixOS require a reboot after each rebuild? Or will I have access to these packages if I just switch into my new configuration? I decided to try building the configuration without rebooting, so I ran:

```bash
sudo nixos-rebuild switch
```

And… lo and behold, the packages were available immediately! I could open all the applications like Brave and Bitwarden, and run the command-line tools like git and neofetch as well. The only thing I did notice is that the app icons didn’t appear until after rebooting. Searching them in GNOME showed the default icon (the one you sometimes get if you download an appimage file).

## Conclusion

NixOS seems like a very powerful OS for those who value immutability. It requires some reading and education before being able to truly experiment with, and for this reason it may be intimidating to many. For anyone who does choose to undertake this as an operating system, it definitely will take some getting used to. It not only requires some understanding of key concepts such as immutability, but it also requires learning a whole new syntax and language. Regardless, I definitely plan to dive deeper into NixOS and potentially even take it as my next distro-hop.