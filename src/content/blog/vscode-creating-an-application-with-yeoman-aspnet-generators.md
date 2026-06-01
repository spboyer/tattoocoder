---
title: "VSCode: Creating an Application with Yeoman aspnet generators"
description: "Getting Started Visual Studio Code Go get Visual Studio Code! http://code.visualstudio.com, the all new cross platform development tool from Microsoft. Runtime You'll need DNX, formerly known as K or KRE (K Runtime Environment). You can get the full instructions on the ASP.NET Github repo. If you"
pubDate: "2015-04-30T02:25:18.000Z"
updatedDate: "2015-09-15T20:25:08.000Z"
tags:
  - "vscode"
  - "aspnet5"
  - "xplat"
  - "dnx"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/vscode-creating-an-application-with-yeoman-aspnet-generators/"
---

## Getting Started

#### Visual Studio Code

Go get Visual Studio Code! http://code.visualstudio.com, the all new cross platform development tool from Microsoft.  
![](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-0.png)

#### Runtime

You'll need DNX, formerly known as K or KRE (K Runtime Environment).

You can get the full instructions on the [ASP.NET Github repo](https://github.com/aspnet/home#getting-started-with-aspnet-5-and-dnx). If you have been running the K Runtime, you can uninstall if you deem necessary; however DNX can and will run side by side.

On OSX, the install is simple with Homebrew

```
$ brew tap aspnet/dnx
$ brew update
$ brew install dnvm
```

This will install the toooling you need (dnx, dnu, dnvm) as well as mono 4.0.1.

#### generator-aspnet

If you are starting a new project, it is recommended starting with the aspnet generator as "File > New Project".

Install the generators using `npm`

```
npm install -g yo generator-aspnet
```

If you are not already using bower, grunt and/or gulp; grab those tools as well. If you are not already using these you'll become familiar as a part of the new modern develpoment stack.

```
npm install -g bower grunt-cli gulp-cli
```

### New Project

Open terminal or cmd, depending on your OS. And type `yo aspnet` (still my favorite thing to type)  
![yo](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-1.png)  
Select **Web Application**, enter your application name and hit .

Next your project is created.  
![projectdone](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-2.png)

The final directions from the generator is to do the following:

```
Your project is now created, you can use the following commands to get going
    dnu restore
    dnu build
    dnx . run for console projects
    dnx . kestrel or dnx . web for web projects
```

First you will want to `cd myWebApp` and then

1.  dnu restore - download nuget, npm and bower resources
2.  dnu build - builds the application
3.  dnx . kestrel or dnx . web - starts the self host server for the application where \[.\] is the path of the application.

All of this can be accomplished from the command line, however VSCode is where we'll be editing the project.

### VS Code

Note: John Papa has a great set of posts on Visual Studio Code here http://www.johnpapa.net/visual-studio-code/ - be sure to check them out.

Open VSCode and open the project folder by clicking **File>Open** or (⌥⌘O).

![project](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-3.png)

First we want to restore (**dnu restore**) the nuget, npm and bower packages. Press Command+P (⌘P) to open the command window and then type **restore**.  
![restore](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-4.png)

Hit enter and a terminal window launches to execute the command.  
![restoring](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-5.png)  
_Note: you may see a notification that you have to relaunch after restoring, update of vscode in the future may resolve_

Now we can do the same (⌘P) and now type **kestrel** to run the application.  
![compile](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-6.png)

This starts the **kestrel** self host server. Browse to [http://localhost:5001](http://localhost:5001) and we're done! Web app running on OSX created using Yeoman editing in VSCode.

![webapp](/content/images/imported/vscode-creating-an-application-with-yeoman-aspnet-generators-image-7.png)

aspnet generator issues log here - http://github.com/omnisharp/generator-aspnet/issues  
VS Code - http://code.visualstudio.com/
