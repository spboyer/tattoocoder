---
title: "Upgrading from Windows 7 to Windows 8 RTM - Bootcamp"
description: "So I spent last night leaping into the upgrade process on my MacBook Pro from Windows 7 to Windows 8 Pro. Now, some may call it leaping off, ridicule me for being a .NET guy and having a Mac, but that's a whole other conversation. I wanted to just point"
pubDate: "2012-08-16T15:49:00.000Z"
updatedDate: "2012-08-29T01:48:21.000Z"
tags:
  - "windows_8"
  - "boot__camp"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/upgrading_from_windows_7_to_windows_8_rtm_bootcamp/"
---

So I spent last night leaping into the upgrade process on my MacBook Pro from Windows 7 to Windows 8 Pro.  Now, some may call it leaping off, ridicule me for being a .NET guy and having a Mac, but that's a whole other conversation.  I wanted to just point out a few tidbits about the experience.

### Things to have on hand

-   BootCamp CD
    
-   find it, burn it whatever\* USB Mouse
    
-   if you are using a wireless, Bluetooth mouse your drivers will or may get jacked up when you make the upgrade cause mine did.\* Time!
    

### Upgrading in place

This was a pretty standard process.  I downloaded the RTM from MSDN and burned it to DVD, made sure I wrote down the key and slipped in the DVD and hit the go button.

Standard wizard upgrade, nothing to dis-similar from the upgrade process from Vista to Windows 7. Screens are quite nice.

They great thing here was, I only had one or two reboots. BUT! that's when the fun starts.

### Boot Camp Stuff

Once you go through the who are you, what wireless / network screens and you get through the logon screen.  Please DO NOT reboot!

I did that and lost my keyboard, ugh the pain!  If that happens here is the work around.

In the lower left hand part of the screen there is the usability icon, click on this and enable the "On Screen Keyboard".  Please be patient as again, depending on your configuration the responsiveness may be latent. Once that appears, either use that or in my case the keyboard was enabled at least for me to login.

Next steps.

1.  Uninstall Boot Camp from Windows.

-   Do not repair. This can install additional copies of the Apple drivers and further send you into frustration. And in the end you will uninstall anyway.2. Insert your Boot Camp CD and run the installer.Make sure that you select the default boot OS, if that's your thing.  Also check the Apple Updates if you are using an original Boot Camp CD.  I might suggest creating a new one from the iOS side of the PC since it will download the most recent version.

And that's it.  I would mention that these are my suggestions based on my experience and I am fully operational on a MacBook Pro 13" 8GB Ram running Windows 8 Pro and loving it.

Biggest issue for me was getting the trackpad to work, which lead me to uninstall Boot Camp and reinstall.  This was a result of having the multiple copies of the drivers as I mentioned above.
