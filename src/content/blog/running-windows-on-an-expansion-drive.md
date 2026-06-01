---
title: "Running Windows on an Expansion Drive"
description: "A few years back I made the jump to a Mac for my daily driver development machine for many reasons but there were a few times that I needed to fire up Visual Studio or Visio just for productivity or project specific reasons. Parallels has been my go to for"
pubDate: "2016-08-17T21:00:00.000Z"
updatedDate: "2016-08-17T21:36:54.000Z"
heroImage: "/content/images/imported/running-windows-on-an-expansion-drive-cover.png"
tags:
  - "parallels"
  - "windows"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/running-windows-on-an-expansion-drive/"
---

A few years back I made the jump to a Mac for my daily driver development machine for many reasons but there were a few times that I needed to fire up Visual Studio or Visio just for productivity or project specific reasons.

Parallels has been my go to for hosting Windows VMs, but with the poor choice of the 256gb drive, cause everything was suppose to be offline, I tend to bump up against the limit more recently. Cleaning off temp files, recent Windows install files, old projects etc is tedious regardless of the utilities that are available.

I have found a solution, [Transcend makes JetDrive Lite](http://us.transcend-info.com/apple/jetdrivelite/) that sits flush in SD slot on the MacBook Pro and has 64GB, 128GB, and 256GB options ([depending on your MBP version](http://www.transcend-info.com/Support/FAQ-846)).

I grabbed a [128GB version from Amazon for $65.99 USD](http://amzn.to/2bttIse). I would've gotten the 256GB, but my early 2013 MBP only supports the 128GB.

Pretty simple to get it installed, just unpack and put it in the slot. Open the Disk Utility and format the drive. Choose _OS X Extended (Journaled)_ for the format.

![diskutil](/content/images/imported/running-windows-on-an-expansion-drive-image-0.png)

Once complete you can either create a _new_ Parallels VM (pvm) there or move your existing one there.

I have not had any performance issues at all with the drive, in fact it seems to run better. Only issue I have had is sometimes it appears to be unrecognized, and re-seating the drive (re-inserting) fixes the issue.

It sits really flush in the side slot, no worries of damage or breaking off which I've had by accidentally leaving a mouse usb dongle in the slot.

![installed](/content/images/imported/running-windows-on-an-expansion-drive-image-1.png)
