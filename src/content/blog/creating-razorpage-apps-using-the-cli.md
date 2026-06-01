---
title: "Creating RazorPage apps using the CLI"
description: "While I was creating a recent test application with Razor Pages, I found myself clicking the &quot;new file&quot; button in VS Code too many times when I wanted to add a new Page. I really love the .NET CLI and with every release, there seems to be something"
pubDate: "2018-05-03T20:55:16.000Z"
updatedDate: "2018-06-04T13:18:02.000Z"
tags:
  - "aspnetcore"
  - "razorpages"
  - "dotnetcore"
  - "dotnet-cli"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/creating-razorpage-apps-using-the-cli/"
---

While I was creating a recent test application with [Razor Pages](https://docs.microsoft.com/aspnet/core/mvc/razor-pages/?view=aspnetcore-2.1&tabs=netcore-cli&WT.mc_id=blog-twitter-shboyer), I found myself clicking the "new file" button in VS Code too many times when I wanted to add a new Page.

![vscode new file](/content/images/imported/creating-razorpage-apps-using-the-cli-image-0.png)

I really love the .NET CLI and with every release, there seems to be something I discover that has been added to either the core functionality or the templates. Running `dotnet new` this time around I fell upon the `page` template...

![what is this?](/content/images/imported/creating-razorpage-apps-using-the-cli-image-1.gif)

Within your application, run `dotnet new page` and a new Razor Page is added to to the project. See the `-h|--help` _some items removed for brevity_

```bash
$ dotnet new page -h

  -n, --name          The name for the output being created. If no name is specified, the name of the current directory is used.
  -o, --output        Location to place the generated output.

Razor Page (C#)
Author: Microsoft
Description: A Razor page with or without a page model
Options:
  -na|--namespace     namespace for the generated code
                      string - Optional
                      Default: MyApp.Namespace

  -np|--no-pagemodel  create page without a PageModel
                      bool - Optional
                      Default: false / (*) true

* Indicates the value used if the switch is provided without a value.
```

Given this info I was able to quickly add a new page.

> Should this be a default setting in the CLI? See [Issue# 9194](https://github.com/dotnet/cli/issues/9194)

```bash
$ dotnet new page -n Index -na myapp.Pages.Area -o Pages/Area
```

Creating a variable for the namespace made this shorter.

```bash
$ ns=-na=myapp.Pages
```

Then I can just create a new page using the shorter command.

```bash
$ dotnet new page -n Index $ns.Area -o Pages/Area
```

[Razor Pages](https://docs.microsoft.com/aspnet/core/mvc/razor-pages/?view=aspnetcore-2.1&tabs=netcore-cli&WT.mc_id=blog-twitter-shboyer) is a super easy way to get going on web app and now adding the additional pages too using the CLI is just as easy. Looking forward to some of the other scaffolding pieces making it into the CLI as well as the previous `yo aspnet` functionality I helped build back in the beta days.

[CodeProject](https://www.codeproject.com/script/Articles/BlogFeedList.aspx?amid=2961115)
