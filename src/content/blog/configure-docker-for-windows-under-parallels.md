---
title: "Configure Docker for Windows under Parallels"
description: "I use OSX as my primary development machine but still at time run to Visual Studio for work stuff, new features I'm testing etc. The most recent reason is Visual Studio '15 Preview and the new Docker features that are quite awesome. I didn't want to fire up the ThinkPad,"
pubDate: "2016-11-13T18:16:55.000Z"
updatedDate: "2016-11-13T18:16:55.000Z"
heroImage: "/content/images/imported/configure-docker-for-windows-under-parallels-cover.png"
tags:
  - "docker"
  - "parallels"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/configure-docker-for-windows-under-parallels/"
---

I use OSX as my primary development machine but still at time run to Visual Studio for work stuff, new features I'm testing etc.

The most recent reason is [Visual Studio '15 Preview](https://www.visualstudio.com/visual-studio-pre-release-downloads/) and the new Docker features that are quite awesome. I didn't want to fire up the ThinkPad, connect it to the big monitor etc; so it was time to get Docker working on Parallels. Come to find out it was a few simple configurations.

![docker-parallels](/content/images/imported/configure-docker-for-windows-under-parallels-image-0.png)

Check the "Enable nested virtualization" option under **Hardware / CPU & Memory** - Advanced Settings of your Windows 10 VM.

Another setting I might suggest is setting the Memory somewhere between 4 - 8 GB of RAM or Docker may not start.

#### Shared Drives

A required configuration is to setup Shared Drives in Docker for Windows. The setting is required for the volume mapping and debugging support.

Right click the Docker icon in the System Tray, click Settings and select Shared Drives.

![shared-drives](/content/images/imported/configure-docker-for-windows-under-parallels-image-1.png)

#### Docker Related Content

-   [Building .NET Docker Images](https://docs.microsoft.com/en-us/dotnet/articles/core/docker/building-net-docker-images)
-   [Visual Studio 2015 Tools for Docker](https://docs.microsoft.com/en-us/dotnet/articles/core/docker/visual-studio-tools-for-docker)
-   [Running .NET 4.6 Framework console applications in Windows containers](https://docs.microsoft.com/en-us/dotnet/articles/framework/docker/console)
-   [Migrating ASP.NET MVC 4.6 Applications to Windows Containers](https://docs.microsoft.com/en-us/dotnet/articles/framework/docker/aspnetmvc)
