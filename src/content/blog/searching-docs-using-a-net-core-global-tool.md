---
title: "Searching docs using a .NET Core global tool"
description: "In 2016 at the MVP Summit hackathon I put together a .NET Core CLI Tool to search for docs on docs.microsoft.com and it worked well, but there were some shortcomings. It was scoped to the project, and there was no way to install the Nuget package using the"
pubDate: "2018-04-10T13:29:45.000Z"
updatedDate: "2018-04-10T13:29:45.000Z"
tags:
  - "dotnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/searching-docs-using-a-net-core-global-tool/"
---

In 2016 at the MVP Summit hackathon I put together a .NET Core CLI Tool to search for docs on [docs.microsoft.com](https://docs.microsoft.com) and it worked well, but there were some shortcomings. It was scoped to the project, and there was no way to install the Nuget package using the command line tools or package manager.

```xml
<ItemGroup>
 <DotNetCliToolReference Include="dotnet-doc" Version="1.0.0" />
</ItemGroup>
```

Now with the availability of .NET Core Global tools, [see announcement post here](https://blogs.msdn.microsoft.com/dotnet/2018/02/27/announcing-net-core-2-1-preview-1/?WT.mc_id=globaltools-twitter-shboyer), where we can install the Nuget package globally like a node.js package `npm install -g <package_name>`, I took a few hours to update the project.

```bash
dotnet install tool -g dotnet-doc
```

## Getting Started

[Nate McMaster](https://github.com/natemcmaster) has a great intro on [.NET Core Global Tools and Gotchas](https://www.natemcmaster.com/blog/2018/02/02/dotnet-global-tool/) where he explains some ins/outs, a getting started template, packaging the tool and so on.

I am just converting the project from the `project.json`, whoa that's a bit ago, to a global tool project I just need to add a **.csproj** file and delete the **project.json** file. However, I could use the template from Nate's post too to start new.

```bash
dotnet new dotnet-doc --command-name docs
```

The **dotnet-docs.csproj** file has really one important entry stating that this is a global tool and one to state what the command name is, other than that it's JUST a console application.

```xml
<PropertyGroup>
  <ToolCommandName>docs</ToolCommandName>
  <PackAsTool>true</PackAsTool>
  <IsPackable>true</IsPackable>
  <OutputType>Exe</OutputType>
  <TargetFramework>netcoreapp2.0</TargetFramework>
  <Version>1.0.1</Version>
  <Description>Global tool for searching docs.microsoft.com</Description>

  <!-- Workaround only required for early previews of .NET Core tools. Can be removed when .NET Core 2.1 is released. -->    <NETCorePlatformsImplicitPackageVersion>2.0.1</NETCorePlatformsImplicitPackageVersion>
</PropertyGroup>
```

Package the application using `dotnet pack`.

```bash
dotnet pack --output ./
```

Tested the installation using the local package.

```bash
dotnet install tool -g dotnet-doc --source ./
```

Ran a few tests; help, searching, etc.

```bash
# help
docs -h

# search for 'mvc 5' content (launches default browser)
docs 'mvc 5'

# output to the console
docs '.NET Docker' --console --number 3
Items found: 14687

Introduction to .NET and Docker
https://docs.microsoft.com/en-us/dotnet/core/docker/intro-net-docker

Docker on .NET Framework
https://docs.microsoft.com/en-us/dotnet/framework/docker/

Docker and .NET Core
https://docs.microsoft.com/en-us/dotnet/core/docker/
```

## Cleanup and publish

There is no uninstall, for now you'll need to manually remove the packages from the `.dotnet` folder [as mentioned in Nate's post](https://www.natemcmaster.com/blog/2018/02/02/dotnet-global-tool/#gotcha-1---there-is-no-uninstall-yet).

```bash
rm -rf $HOME/.dotnet/tools/docs
rm -rf $HOME/.dotnet/toolspkgs/dotnet-doc
```

Publish the [package to Nuget](https://www.nuget.org/packages/dotnet-doc/1.0.1) and install officially.

```bash
dotnet install tool -g dotnet-doc
```

Code is available on [Github](https://github.com/spboyer/dotnet-doc), share, [submit issues](https://github.com/spboyer/dotnet-doc/issues) and PR's welcome!
