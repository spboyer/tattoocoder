---
title: "Preparing for dotnet cli"
description: "There was a ton of cool that came out of the Connect()(http://connect2015.visualstudio.com/) event. For me the announcement of ASP.NET 5 going RC was a great milestone. Go Live License with support Linux, Windows, OS X Installers available - http://get.asp.net Checkout Cleanshave available"
pubDate: "2015-11-20T18:28:10.000Z"
updatedDate: "2015-11-23T11:44:10.000Z"
tags:
  - "dotnet-cli"
  - "aspnet5"
  - "connect"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/preparing-for-dotnet-cli/"
---

There was a ton of cool that came out of the Connect()([http://connect2015.visualstudio.com/](http://connect2015.visualstudio.com/)) event. For me the announcement of ASP.NET 5 going RC was a great milestone.

-   Go Live License with support
-   Linux, Windows, OS X
-   Installers available - [http://get.asp.net](https://get.asp.net)

> Checkout [_Cleanshave_](https://github.com/spboyer/cleanshave) available on GitHub an ASP.NET 5 & Angular 2 template called .

There were a bunch of other items announced such as open sourcing **Visual Studio Code** ([http://github.com/microsoft/vscode](https://github.com/microsoft/vscode)) and showing off [**Glimpse**](http://getglimpse.com/).

### What's Next

One of the things shown was the **dotnet cli**. This is the next iteration of the command line tooling for .NET. Currently we are typing `dnx run` for console applications or `dnx web` for web apps. The `dnu restore` command is used to download and install the packages from nuget. And there are a list of other commands related to `dnx`,`dnu`.

In the next release, **RC2**, slated for sometime in Q1 2016. The commands will be reduced to:

```
dotnet run
dotnet compile
dotnet pack
dotnet restore
dotnet publish
```

Notice that consistency with the actual command name **dotnet**? If you have been in other technologies like node.js, ruby or python; the cli is similar on that platform. Typing **node \[arg\]** or **python \[arg\]**.

In the interest of getting the fingers ready, I created a simple function/alias for the current _common_ `dnx`,`dnu` commands and mapped them to the new `dotnet` command for my OS X dev machine.

I added this to my `~/.bashrc` and now to run my ASP.NET 5 web apps I can type `dotnet restore` and `dotnet run`.

```
### dnvm list ...
### dnx web -> dotnet run
### dnx run -> dotnet run
### dnu publish -> dotnet publish
### dnu build -> dotnet compile
### dnu restore -> dotnet restore
### dnu install -> dotnet install

function dotnet() {
     local c=$1;
     local args=$2;
     local opt=$3

case $c in
'run')      dnx web
            ;;
'publish')  dnu publish $args $opt
            ;;
'compile') dnu build $args $opt
           ;;
'restore') dnu restore
           ;;
'install') dnu install $args $opt
           ;;
'list')    dnvm list
           ;;
 esac
}

```

#### Summary

Of course, some of this is subject to change. And the `dnx` and `dnu` commands are still valid and operable. Feel free to share.

#### Links

Scott Hanselman Summary of Connect() - [http://www.hanselman.com/blog/ASPNET5AndNETCoreRC1InContextPlusAllTheConnect2015News.aspx](http://www.hanselman.com/blog/ASPNET5AndNETCoreRC1InContextPlusAllTheConnect2015News.aspx)
