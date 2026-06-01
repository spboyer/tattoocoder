---
title: "Troubleshooting Installing .NET Core 1.1 RTM on OSX"
description: ".NET Core 1.1 RTM was announced yesterday along with Visual Studio for Mac! So of course, I jumped right over to install them both. During the install of the 1.1 version of .NET Core from the downloads page, hit a snag on OSX. If you have seen recent"
pubDate: "2016-11-17T20:39:31.000Z"
updatedDate: "2017-02-14T20:03:27.000Z"
tags:
  - "dotnet"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/troubleshooting-installing-net-core-1-1-rtm-on-osx/"
---

.NET Core 1.1 RTM was announced yesterday along with [Visual Studio for Mac](https://t.co/3bGzj89idU)! So of course, I jumped right over to install them both. During the install of the 1.1 version of .NET Core from the [downloads page](https://www.microsoft.com/net/download/core), hit a snag on OSX.

If you have seen recent Scott Hanselman talk ASP.NET Core, there is a slide he uses where he references "How do you like your ASP.NET?"

![hanselman-steak](/content/images/imported/troubleshooting-installing-net-core-1-1-rtm-on-osx-image-0.png)

I'm somewhere between "medium-rare" and "medium-well", depends on the machine I am using.

I had the preview bits installed which had a version of `1.0.0-preview2.1-003155` and now the RC 1.1 is released with version of `1.0.0-preview2-1-003177`. When running the command `dotnet --info` I was getting the incorrect version even though I was using the proper installer (multiple times) but to no avail nothing was getting updated. Or at least I thought.

The issue here is that semver was taking over. The previous version number of 1.0.0-preview2.1-003155 is actually a higher version number than 1.0.0-preview2-1-003177. Why? Because 2.1 is higher than 2-1 in versioning.

So how do we fix this?

Using the downloads to install the RTM relase:

-   dotnet-osx-x64.1.1.0.pkg
-   dotnet-dev-osx-x64.1.0.0-preview2-1-003177.pkg

`dotnet --info` was returning

```
.NET Command Line Tools (1.0.0-preview2-1-003155)
 
Product Information:
 Version:            1.0.0-preview2-1-003155
 Commit SHA-1 hash:  d7b0190bd4
 
Runtime Environment:
 OS Name:     Mac OS X
 OS Version:  10.12
 OS Platform: Darwin
 RID:         osx.10.12-x64
```

The version was incorrect, I was looking for 1.0.0-preview2-1-003177.

### Reset dotnet on your machine

There is a "Reset my dotnet" or [uinstall](https://github.com/dotnet/cli/tree/rel/1.0.0/scripts/obtain/uninstall) for [OSX](https://github.com/dotnet/cli/blob/rel/1.0.0/scripts/obtain/uninstall/dotnet-uninstall-pkgs.sh) and [Linux](https://github.com/dotnet/cli/blob/rel/1.0.0/scripts/obtain/uninstall/dotnet-uninstall-debian-packages.sh) in the [cli Github Repo](https://github.com/dotnet/cli).

I didn't want to remove all of the versions, but looking at the script, it did give me the insight needed to know how to get rid of the one version.

Get the list of the packages installed running the following command:

```
pkgutil --pkgs | grep "com.microsoft.dotnet"
```

On my machine I had the following:

```
com.microsoft.dotnet.dev.1.0.0-preview2-003121.component.osx.x64
com.microsoft.dotnet.dev.1.0.0-preview2-003131.component.osx.x64
com.microsoft.dotnet.dev.1.0.0-preview2-1-003177.component.osx.x64
com.microsoft.dotnet.dev.1.0.0-preview2.1-003155.component.osx.x64
com.microsoft.dotnet.hostfxr.1.1.0.component.osx.x64
com.microsoft.dotnet.hostfxr.component.osx.x64
com.microsoft.dotnet.sharedframework.Microsoft.NETCore.App.1.0.0.component.osx.x64
com.microsoft.dotnet.sharedframework.Microsoft.NETCore.App.1.0.1.component.osx.x64
com.microsoft.dotnet.sharedframework.Microsoft.NETCore.App.1.1.0-preview1-001100-00.component.osx.x64
com.microsoft.dotnet.sharedframework.Microsoft.NETCore.App.1.1.0.component.osx.x64
com.microsoft.dotnet.sharedhost.component.osx.x64
```

There were a couple of bad seeds here I needed to remove, the **preview2.1-003155** version and **1.1.0-preview1-001100-00**

Remove the preview version

```
sudo pkgutil --force --forget "com.microsoft.dotnet.dev.1.0.0-preview2.1-003155.component.osx.x64"
rm -rf /usr/local/share/dotnet/sdk/1.0.0-preview2.1-003155/
```

Remove the preview1.1 version

```
sudo pkgutil --force --forget "com.microsoft.dotnet.sharedframework.Microsoft.NETCore.App.1.1.0-preview1-001100-00.component.osx.x64"
```

The last step is to remove any SDK(s) that are installed. SDK install folders are located in **/usr/local/share/dotnet/sdk/**

```
rm -rf /usr/local/share/dotnet/sdk/1.0.0-preview2.1-003155/
```

Close and restart any terminal / bash/ zsh shells and run `dotnet --info` to see that you are running the current version.

```
$ dotnet --info
.NET Command Line Tools (1.0.0-preview2-1-003177)

Product Information:
 Version:            1.0.0-preview2-1-003177
 Commit SHA-1 hash:  a2df9c2576

Runtime Environment:
 OS Name:     Mac OS X
 OS Version:  10.12
 OS Platform: Darwin
 RID:         osx.10.12-x64
```
