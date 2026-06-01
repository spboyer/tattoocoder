---
title: "Exploring the new dotnet cli"
description: "Note: At the time of this post, the dotnet cli version being used 1.0.0-rc4-004771 available from GitHub dotnet/cli repo - https://github.com/dotnet/core/blob/master/release-notes/rc4-download.md I have been a long time fan of the yeoman generator for ASP.NET Core and still"
pubDate: "2017-02-10T19:10:28.000Z"
updatedDate: "2017-02-13T15:02:15.000Z"
heroImage: "/content/images/imported/exploring-the-new-dotnet-cli-cover.png"
tags:
  - "dotnet"
  - "dotnet-cli"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/exploring-the-new-dotnet-cli/"
---

![dotnet new cli](/content/images/imported/exploring-the-new-dotnet-cli-image-0.png)

_Note: At the time of this post, the dotnet cli version being used `1.0.0-rc4-004771` available from GitHub dotnet/cli repo - [https://github.com/dotnet/core/blob/master/release-notes/rc4-download.md](https://github.com/dotnet/core/blob/master/release-notes/rc4-download.md)_

I have been a long time fan of the [yeoman generator](https://github.com/omnisharp/generator-aspnet) for ASP.NET Core and still I would argue that it's still the most complete project creation utility for cross platform development.

With that said, the dotnet cli has really raised the bar for command line parity development tooling when comparing similar capabilities from other languages or frameworks where CLI is the first tool.

Historically, as you know, Visual Studio is the standard for "File->New Project" or anything to do with a .NET solution or project. If you can right-click it, it probably didn't get done.

First there was [generator-aspnet](https://github.com/omnisharp/generator-aspnet) with `yo aspnet` (still the best command).

Now we have `dotnet new`, `dotnet sln` and more...

## What's new?

-   **dotnet new**
-   **dotnet sln**
-   **dotnet add remove list**

### dotnet new

`dotnet new` isn't _really_ new, it's been there for a bit of time. We could create a couple of different types of applications using the `-t` option, but they were basic starter templates.

`dotnet new -t web` gave us a basic **Hello World** web application, but many developers were asking for more. Where was the webapi templates? What about adding NuGet packages? Authentication?

The `new` command now is driven by the [template system](https://github.com/dotnet/templating). A number of new templates, including webapi, are available!

```bash
Template Instantiation Commands for .NET Core CLI.

Usage: dotnet new [arguments] [options]

Arguments:
  template  The template to instantiate.

Options:
  -l|--list         List templates containing the specified name.
  -lang|--language  Specifies the language of the template to create
  -n|--name         The name for the output being created. If no name is specified, the name of the current directory is used.
  -o|--output       Location to place the generated output.
  -h|--help         Displays help for this command.
  -all|--show-all   Shows all templates

Templates                                 Short Name      Language      Tags
--------------------------------------------------------------------------------------
Console Application                       console         [C#], F#      Common/Console
Class library                             classlib        [C#], F#      Common/Library
Unit Test Project                         mstest          [C#], F#      Test/MSTest
xUnit Test Project                        xunit           [C#], F#      Test/xUnit
Empty ASP.NET Core Web Application        web             [C#]          Web/Empty
MVC ASP.NET Core Web Application          mvc             [C#], F#      Web/MVC
Web API ASP.NET Core Web Application      webapi          [C#]          Web/WebAPI
Solution File                             sln                           Solution

Examples:
    dotnet new mvc --auth None --framework netcoreapp1.0
    dotnet new console --framework netcoreapp1.0
    dotnet new --help
```

Language options, authentication, and the start of having multiple templates per type.

### dotnet sln

Another command added is `sln`. `dotnet sln` gives you the capability of adding, removing and listing projects (CRUD operations) in that .sln file.

In previous versions of the SDK, a `global.json` file was necessary to set folders and the version you were targeting.

```javascript
{
  "projects": [ "src", "test" ],
  "sdk": {
    "version": "1.0.0-preview2-1-003177"
  }
}
```

Now, using a combination of the `new` command and `sln` command; we can create a new solution file and then add any project in any folder location to it using `dotnet sln add folder/myproject.csproj` without having to manually manage the .json file or .sln files.

```bash
dotnet new sln -o mydotnetapp
```

Produces the following directory structure:

```bash
mydotnetapp
└── mydotnetapp.sln
```

Create and add **myproject** to the solution.

```bash
dotnet new web -n webapp -o mydotnetapp/src/myproject -lang C#
```

After the command completes, the directory structure looks like the following:

```bash
mydotnetapp
    ├── mydotnetapp.sln
    └── src
        └── myproject
            ├── Program.cs
            ├── Startup.cs
            ├── webapp.csproj
            └── wwwroot
```

Using the `-n` option allows for naming the **project** name and using the `-o` specifies the location to output the files.

To add the project to the solution file, use `dotnet sln add`:

```bash
dotnet sln mydotnetapp/mydotnetapp.sln add src/myproject/webapp.csproj 
```

_Note: The `sln add remove` commands on Unix/Linux terminals such as bash support globs. So the previous command could be written as `dotnet sln add mydotnetapp/mydotnetapp.sln **/**/*.csproj` and in this case it would've only added the one project. However, if there were more that one project in the _src_ folder, all of them are added._

### dotnet add remove list

These CRUD operations are used for adding, removing and listing the NuGet packages in a project or you may also use these to for project to project operations i.e. "Add Reference".

For example, if you wanted to add the very popular Newtonsoft.Json Nuget package to your app.proj, use the `add` command. The version number is optional, the latest version is used by default.

```bash
dotnet add Library.fsproj package Newtonsoft.Json -v 9.0.1
```

The other options on the package command are:

```bash
Options:
  -h|--help                                Show help information
  -v|--version <VERSION>                   Version for the package to be added.
  -f|--framework <FRAMEWORK>               Add reference only when targeting a specific framework
  -n|--no-restore                          Add reference without performing restore preview and compatibility check.
  -s|--source <SOURCE>                     Use specific NuGet package sources to use during the restore.
  --package-directory <PACKAGE_DIRECTORY>  Restore the packages to this Directory .
```

For adding **Project to Project** references, use the `add` command and pass the `reference` as the command instead of `package`. The following example adds the **Library.fsproj** class library project to the **App.fsproj** console app as a reference.

```
dotnet add App.fsproj reference ../Library/Library.fsproj
```

Now that the project is added, use the `list` command to see the references for a given project.

```bash
$ dotnet list App.fsproj reference

Project reference(s)
--------------------
..\Library\Library.fsproj
```

## What's next

What is the future of [generator-aspnet](https://github.com/omnisharp/generator-aspnet)? \[See the comment on the thread\] here([https://github.com/dotnet/cli/issues/2052#issuecomment-207031714](https://github.com/dotnet/cli/issues/2052#issuecomment-207031714)), in short the yeoman generator will be maintained an modified to utilize the same template engine that `dotnet` does ensuring parity.

## Resources

-   Checkout the [templating GitHub repository](https://github.com/dotnet/templating), there is a good resource on the wiki for what a template looks like - ["Runnable Project" Templates](https://github.com/dotnet/templating/wiki/%22Runnable-Project%22-Templates).
-   [dotnet/cli](https://github.com/dotnet/cli/) GitHub repo
-   [docs.microsoft.com](http://docs.microsoft.com)
