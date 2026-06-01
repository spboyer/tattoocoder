---
title: "Simplifying Bundling and Minification in ASP.NET Core"
description: "The decisions around what to use for packaging client side libraries is still a length discussion. Mostly, if not always, will start and stop with &quot;It Depends...&quot;. However, getting started with something and being able to build upon that is a good starting point rather than what some"
pubDate: "2017-03-01T17:29:16.000Z"
updatedDate: "2017-03-17T19:33:21.000Z"
heroImage: "/content/images/imported/simplifying-bundling-and-minification-asp-net-core-cover.png"
tags:
  - "aspnetcore"
  - "bundling"
  - "minify"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/simplifying-bundling-and-minification-asp-net-core/"
---

The decisions around what to use for packaging client side libraries is still a length discussion. Mostly, if not always, will start and stop with "It Depends...".

However, getting started with _something_ and being able to build upon that is a good starting point rather than what some call "Paralysis through analysis".

## Bundler & Minifier

When this component was originally available, only Visual Studio 2015 / 2017 users could take advantage through the use of an [extension (VSIX)](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.BundlerMinifier) or you could use `dotnet bundle` by adding a dotnet tools CLI package to your project.

Now, in the recent update, the [NuGet package](https://www.nuget.org/packages/BuildBundlerMinifier) fully integrates with MSBuild and you can take advantage of using the bundling and minify capabilities as a part of the `dotnet build` or `dotnet clean` command.

## Quick look at the structure

The `dotnet new` MVC templates ship with a bundleconfig.json file which is a configuration file used to define how your JavaScript and other client side assets should be packaged up for deployment.

The default file looks like this.

```javascript
[
  {
    "outputFileName": "wwwroot/css/site.min.css",
    "inputFiles": [
      "wwwroot/css/site.css"
    ]
  },
  {
    "outputFileName": "wwwroot/js/site.min.js",
    "inputFiles": [
      "wwwroot/js/site.js"
    ],
    "minify": {
      "enabled": true,
      "renameLocals": true
    },
    "sourceMap": false
  }
]
```

Each "bundle" in the array defines the `outputFileName`, `inputFiles` and [other options](https://github.com/madskristensen/BundlerMinifier/wiki/bundleconfig.json-specs). Depending on the output file type, there are different configuration options available as well; [CSS](https://github.com/madskristensen/BundlerMinifier/wiki/cssminifier), [JavaScript](https://github.com/madskristensen/BundlerMinifier/wiki/jsminifier), or [HTML](https://github.com/madskristensen/BundlerMinifier/wiki/htmlminifier).

### Create a new mvc project

Use the command line, bash or integrated terminal in VS Code.

`dotnet new mvc -o mybundleapp`

Add the NuGet package to your project using the `dotnet add package` command.

```bash
dotnet add package BuildBundlerMinifier
```

Run `dotnet restore` to install any outstanding dependencies. _Note: `dotnet add package` automatically runs restore for the specified package_.

Now when we run `dotnet build`, the Output window displays the information concerning the bundling and minification according to what is configured in `bundleconfig.json`.

```bash
$ dotnet build
Microsoft (R) Build Engine version 15.1.545.13942
Copyright (C) Microsoft Corporation. All rights reserved.

  Bundler: Begin processing bundleconfig.json
        Minified wwwroot/css/site.min.css
  Bundler: Done processing bundleconfig.json
  mybundleapp -> /mybundleapp/bin/Debug/netcoreapp1.0/mybundleapp.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:03.89
```

If you run `dotnet clean`, the NuGet package also cleans the \*.min.css and/or \*.min.js files.

```bash
$ dotnet clean
Microsoft (R) Build Engine version 15.1.545.13942
Copyright (C) Microsoft Corporation. All rights reserved.

  Bundler: Cleaning output from bundleconfig.json
  Bundler: Done cleaning output file from bundleconfig.json
```

If you have an application that requires a greater set of complexity for packaging scripts, Gulp is a great option. However, to get started with minimal friction - use this and convert to Gulp later...or whatever you want to use.

See [docs.microsoft.com](https://docs.microsoft.com/en-us/aspnet/core/client-side/bundling-and-minification) for more information on Bundling and Minification using this component, Gulp, and Grunt.

Thanks to [Mads Kristensen](https://twitter.com/mkristensen) for always making great stuff for ASP.NET and Visual Studio.
