---
title: "Setting up ASP.NET Core debugging in VS Code"
description: "UPDATE: Now Version 1.0 of Visual Studio Released - Same steps apply for Version 1.0. In the most recent ASP.NET Community Standup (http://live.asp.net), Damian walked through the steps of getting RC2 debugging setup inside of Visual Studio Code - Insiders Build. Here are the"
pubDate: "2016-04-14T23:00:00.000Z"
updatedDate: "2016-04-22T15:23:20.000Z"
heroImage: "/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-cover.png"
tags:
  - "aspnetcore"
  - "debugging"
  - "vscode"
  - "dotnet-cli"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/setting-up-asp-net-core-debugging-in-vs-code/"
---

**UPDATE: Now Version 1.0 of Visual Studio Released** - Same steps apply for Version 1.0.

In the most recent ASP.NET Community Standup ([http://live.asp.net](https://live.asp.net)), Damian walked through the steps of getting RC2 debugging setup inside of Visual Studio Code - Insiders Build.

Here are the steps.

## Install the dotnet SDK for your OS

Go to https://github.com/dotnet/cli#installers-and-binaries and select the proper link for your OS in the \*\*.NET Core SDK Installer\*\* column and install this. As a note, if you have a previous version of this installed you may need to manually remove the \*\*dotnet\*\* folder from the installation location prior as the installer will not overwrite, and it \*fails\* silently.

Check that you are good to go by looking at `--info` output and checking the version number.

```
$ dotnet --info
```

## Download Visual Studio Code - Insiders Build

Go to http://code.visualstudio.com and click the "March Insiders Release" and get the proper version for your OS.

![insiders](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-0.png)

![insiders2](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-1.png)

_If you are on OSX you'll need to extract the app and copy to your "Applications" folder_

## Download omnisharp-vscode extension

Next, go grab the extension from the github repo - https://github.com/OmniSharp/omnisharp-vscode/releases ![ext-repo](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-markdown-0.png)

Yes, it is a **.vsix** file extension. Download this and then open the Insiders build of VS Code and do **File -> Open** this file.

![fileopen](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-2.png)

Nothing will happen for 2-5 seconds, be patient, until you see the prompt to restart.

![restart prompt](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-3.png)

Restart VS Code.

## Clone aspnet/cli-examples repository

Now we need to get a "current" dotnet-cli / RC2 application to open. Best place is the **cli-samples** repo [https://github.com/aspnet/cli-samples](https://github.com/aspnet/cli-samples), so head there and clone the repo.

Open and of the individual projects, **HelloMvcAPI** for example. You'll see in the status bar that the .NET Core Debugger is downloading. You can open the output window as well and see the **coreclr-debug** output as well.

![](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-4.png)

![installed](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-5.png)

Head over to the left and select the debug icon, click the "play" icon to start debugging.

![running](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-6.png)

## Summary

![](/content/images/imported/setting-up-asp-net-core-debugging-in-vs-code-image-7.jpg) This is ASP.NET Core, no Mono, running on OSX. I can see and inspect the variables (top left) step through the code. I have a built in debug console. Boom! It is in fact a new Microsoft.
