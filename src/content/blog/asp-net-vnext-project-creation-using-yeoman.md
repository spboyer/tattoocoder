---
title: "ASP.NET vNext Project Creation using Yeoman"
description: "Developing ASP.NET 5 applications using Visual Studio 2015 gives you a rich IDE experience, however now with ASP.NET now being cross platform that development IDE is not afforded to us on a Mac. Checkout this post Develop ASP.NET vNext Applications on a Mac for getting started. Using"
pubDate: "2014-12-06T20:51:31.000Z"
updatedDate: "2015-01-08T18:29:56.000Z"
heroImage: "http://yeoman.io/assets/img/tool-yo.5015.png"
tags:
  - "aspnet5"
  - "vnext"
  - "yeoman"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/asp-net-vnext-project-creation-using-yeoman/"
---

Developing ASP.NET 5 applications using Visual Studio 2015 gives you a rich IDE experience, however now with ASP.NET now being cross platform that development IDE is not afforded to us on a Mac.

Checkout this post [Develop ASP.NET vNext Applications on a Mac](http://blogs.msdn.com/b/webdev/archive/2014/08/12/develop-asp-net-vnext-applications-on-a-mac.aspx) for getting started.

Using the Yeoman generator **generator-aspnet** you will have the option to create one of the following application types:

```
$ yo aspnet
```

-   Web Application
-   MVC Application
-   Nancy Fx Application
-   Console Application
-   Class Library (recently added)

After your project is created you can get started in Sublime Text, vim, Brackets etc. Checkout [OmniSharp.net](http://omnisharp.net) for the supported development enviroments and tooling support information there.

Although the generator gets you started with the selected project type, adding additional item types can be less than ideal; depending on the environment.

Luckily Yeoman gives us the subgenerators. I put together **generator-aspnet-item** which you can get from npm.

```
$ npm install -g generator-aspnet-item
```

This generator allows you to create the additional ASP.NET 5 (vNext) project item types you would typically see from the Add > New Item dialog in Visual Studio.

![Visual Studio Add New Item](/content/images/imported/asp-net-vnext-project-creation-using-yeoman-image-0.png)

I can now add a new MvcController in my working folder by doing the following:

```
$ yo aspnet-item:MvcController NewPageController
You called the aspnet subgenerator with the arg NewPageController
NewPageController.cs created.
   create NewPageController.cs
```

There are other options you can see by looking at the Github repo [spboyer/generator-aspnet-item](https://github.com/spboyer/generator-aspnet-item).

I will be merging this functionality with the **generator-aspnet** yeoman generator within the next week. However, this one works by itself as well for creating all of the individual items too.

If there are any additional item types, templates please add issues to the [generator-aspnet](https://github.com/OmniSharp/generator-aspnet) repo. I think that a core WebAPI project type might be warranted.
