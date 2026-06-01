---
title: "kmon! ASP.NET 5 Where are my changes?"
description: "One of the new features in Visual Studio 2015 for ASP.NET 5 is an agile development environment. What that means is now when you makes changes to your code, there is no need to re-compile to see the changes in the browser. ![picard kmon](/content/images/2014/12/kmon."
pubDate: "2014-12-13T14:04:55.000Z"
updatedDate: "2015-01-08T18:29:44.000Z"
tags:
  - "aspnet5"
  - "nuget"
  - "kmon"
  - "omnisharp"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/kmon-asp-net-5-where-are-my-changes/"
---

One of the new features in Visual Studio 2015 for ASP.NET 5 is an agile development environment. What that means is now when you makes changes to your code, there is no need to re-compile to see the changes in the browser.

![picard kmon](/content/images/imported/kmon-asp-net-5-where-are-my-changes-markdown-0.jpg)

> Visual Studio uses the Roslyn compiler to enable this dynamic compilation. You still have all of the structure and power of a compiled framework, but the development experience feels more like an interpreted language. See more here - [ASP.NET 5 Overview](https://www.asp.net/vnext/overview/aspnet-vnext/aspnet-5-overview)

This is a great new feature for Visual Studio users, but the new awesome is you now have a choice of what IDE you may use. That's where [kmon](https://github.com/henriksen/kmon) comes in.

kmon, pronounced kuh-mon, is an ASP.NET project command that watches the working directory of your project for changes to the files and restarts the web server automatically so that you have the same frictionless development experience that Visual Studio is presenting through the use of the Roslyn compiler.

This process is accomplished through wrapping nodemon, a node module that is designed to watch files and restart and/or execute processes.

#### Requirements

-   node.js - [nodejs.org](http://nodejs.org)
-   nodemon - `npm install -g nodemon`

#### Adding kmon to your project

kmon is a nuget package, [version 0.3.0](http://www.nuget.org/packages/kmon/) is the latest.

`kpm install kmon`

Next, you need to add the command to the commands portion of the project.json file and set the options.

```language-javascript
"commands": {
    /* Change the port number when you are self hosting this application */
    "web": "Microsoft.AspNet.Hosting --server Microsoft.AspNet.Server.WebListener --server.urls http://localhost:5000",
    "kestrel": "Microsoft.AspNet.Hosting --server Kestrel --server.urls http://localhost:5004",
    "gen": "Microsoft.Framework.CodeGeneration",
    "ef": "EntityFramework.Commands",
    "mon" : "kmon --ext cs,json,js --server web"
},
```

the options are:

-   \--ext : the extensions of the files you would like to watch, the defaults are cs,json,js.
-   \--server : the web server that you are going to use. `web` for Windows, and `kestrel` for Linux, OSX. Default is `web`.

If you are using Brackets, for example, as your editor; open terminal and cd to your working folder and run the following command:

`$ k kmon --server kestrel`

This command starts nodemon which subsequently starts kestrel.  
![terminal screen shot - started](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-0.png)

Now you can open the application in a browser, note the server url that is defined in the kestrel command within the project.json file `"kestrel": "Microsoft.AspNet.Hosting --server Kestrel --server.urls http://localhost:5004"`  
![web screen shot](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-1.png)

Here is a shot of the Brackets editor, note the **Name = "Shayne Boyer"** of the User class.  
![brackets before](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-2.png)

I change the **Name** property to **kmon!** and hit save in Brackets, nodemon detects the changes, and restarts kestrel.  
![terminal changes made](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-3.png)

Go back to the browser hit refresh and we are set. No rebuild step, no shutdown of the browser etc.  
![web screen shot](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-4.png)

### Sublime & Kulture

Using Sublime Text and the Kulture add-in you can get a UI experience and not have to use the command line.

From Sublime Text do CMD + Shift + P, Run **K** Commands and you will see that the **k mon** command now shows in the options. Click the command and you will get the same experience.

![Sublime Text 3 screenshot](/content/images/imported/kmon-asp-net-5-where-are-my-changes-image-5.png)

See more about [Kulture](https://github.com/OmniSharp/Kulture) & [Omnisharp](http://omnisharp.net)

#### So..Why a command? Why not Grunt, Gulp, etc...

Good question. Sure you can certainly use Gulp for example. There is an add-in [gulp-aspnet-k](https://github.com/tugberkugurlu/gulp-aspnet-k) that works.

```language-javascript
gulp.task('aspnet-run', aspnetk({
    kCommand: 'kestrel' //default is 'web'
}));
```

Here were the options that were on the table, when it was proposed - summarized from [OmniSharp/Kulture - Issue #5](https://github.com/OmniSharp/Kulture/issues/5) _it was originally called kestrelmon_

_**1\. Create an ASP.NET Command**_

Kulture and other editors have built in support for discovering and invoking commands in project. This is how kestrel,web, etc show up in the respective editors. So if we create a new command (that ships in a NuGet package) and users add an entry in the commands section pointing to it things will just work. When this command is invoked it will make the appropriate call to nodemon. This will work for editors and command line users.

_**2\. Update Kulture and bake it in**_

Kulture currently has built in support for kpm restore,kpm build & kpm pack. This is added to the sublime command list here. We could add a new kestrelmon command there as well.

In short, Option 1 gave more reach to all editors and long term options.

#### Feedback

Would love to see some feedback, feature requests - if there is something else we need this to do? Or keep it simple??
