---
title: "Setting up my WSL Environment - Azure CLI, Docker and .NET"
description: "I recently picked up a Surface Book to start showing that I could do my job regardless of the machine I had. My talks around using command line for ASP.NET Core and Azure have primarily been using my MacBook Pro so to add some diversity to my presentations a"
pubDate: "2017-11-11T15:48:43.000Z"
updatedDate: "2017-11-11T15:48:43.000Z"
heroImage: "/content/images/imported/setting-up-my-wsl-environment-azure-cli-docker-and-net-cover.png"
tags:
  - "wsl"
  - "docker"
  - "linux"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/setting-up-my-wsl-environment-azure-cli-docker-and-net/"
---

I recently picked up a Surface Book to start showing that I could do my job regardless of the machine I had. My talks around using command line for ASP.NET Core and Azure have primarily been using my MacBook Pro so to add some diversity to my presentations a core Windows machine is now in the bag too.

The Windows Subsystem for Linux is really something and I wanted to get it setup close to or if not the same as I have my OSX dev environment setup.

I use oh-my-zsh inside iTerm2 and a slew of .dotfiles for scripts and aliases for the command line stuff I like to do. Sure enough, talk about great timing, I saw a tweet fly by from [Jessica Deen](https://twitter.com/jldeen) \[for setting up a Bad Ass WSL environment\] - SOLD!([http://jessicadeen.com/tech/microsoft/badass-terminal-fcu-wsl-edition-oh-my-zsh-powerlevel9k-tmux-and-more/](http://jessicadeen.com/tech/microsoft/badass-terminal-fcu-wsl-edition-oh-my-zsh-powerlevel9k-tmux-and-more/)).

> Badass Terminal: FCU WSL Edition (oh-my-zsh, powerlevel9k, tmux, and more!) [https://t.co/aj06Ws2gUF](https://t.co/aj06Ws2gUF) [pic.twitter.com/WOZrSEsn3r](https://t.co/WOZrSEsn3r)
> 
> — Jessica Deen (@jldeen) [October 26, 2017](https://twitter.com/jldeen/status/923414109940584449?ref_src=twsrc%5Etfw)

Scott Hanselman also has a great write up for his experience doing a similar thing. [Setting up a Shiny Development Environment within Linux on Windows 10](https://www.hanselman.com/blog/SettingUpAShinyDevelopmentEnvironmentWithinLinuxOnWindows10.aspx)

I ran through Jessica's setup, tweaked a few items here and there and even setup VS Code to use it as my terminal.

```javascript
"terminal.integrated.shell.windows": "C:\\WINDOWS\\System32\\bash.exe",
"terminal.integrated.fontFamily": "UbuntuMono NF",
"workbench.panel.location": "bottom"
```

![VS Code with tmux terminal](/content/images/imported/setting-up-my-wsl-environment-azure-cli-docker-and-net-image-0.png)

## Azure CLI

The Azure CLI was easy! Jessica's script gave the option and responding `y` pip installed the cli.

`az login` to get the credentials and go to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and my shell is now all set to do the work I need to in Azure.

## .NET Core

For the most recent SDK, head to [http://dot.net](http://dot.net) and select the [downloads for Linux](https://www.microsoft.com/net/learn/get-started/linuxubuntu).

Setup the prerequisites and I just ran

```bash
$ sudo apt-get update
$ sudo apt-get install dotnet-sdk-2.0.2
```

## Docker

Docker for Windows I have installed for using with Visual Studio when needed, here I wanted to link Docker on WSL to the instance of the docker-daemon on Windows.

First open the settings on Docker for Windows and expose the daemon on **localhost:2375** by checking the box.

![Docker Settings](/content/images/imported/setting-up-my-wsl-environment-azure-cli-docker-and-net-image-1.png)

Next, in the WSL terminal install Docker and set the DOCKER\_HOST to point to the Docker-Machine running on Windows.

```bash
$ sudo apt install docker.io
$ export DOCKER_HOST=tcp://127.0.0.1:2375
```

Now you can pull the images in either the Windows CMD terminal or your WSL Terminal and see the Docker images using `docker images`.

![windows-docker](/content/images/imported/setting-up-my-wsl-environment-azure-cli-docker-and-net-image-2.png)

![wsl-docker](/content/images/imported/setting-up-my-wsl-environment-azure-cli-docker-and-net-image-3.png)

## Improving

The overall experience continues to improve. Even without the add-ins, .dotfiles, etc.; the point here is that given almost any machine and a command line you can have a productive development experience using .NET, Azure and Docker on Windows, OSX or Linux.

Thanks to Jessica [@jldeen](https://twitter.com/jldeen) for an awesome script and post!
