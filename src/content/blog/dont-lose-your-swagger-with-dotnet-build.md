---
title: "Don't lose your swagger with dotnet build"
description: "See GitHub Issue #795 for the details and discussion. One of the undocumented changes of converting from project.json to csproj, was the &lt;DocumentationFile&gt; no longer automatically copied to the output folder during the build or publish process. There have been multiple solutions, both pre and post publish"
pubDate: "2017-03-28T15:54:15.000Z"
updatedDate: "2017-03-28T17:11:43.000Z"
heroImage: "/content/images/imported/dont-lose-your-swagger-with-dotnet-build-cover.jpg"
tags:
  - "aspnetcore"
  - "dotnet"
  - "swagger"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/dont-lose-your-swagger-with-dotnet-build/"
---

See GitHub [Issue #795](https://github.com/dotnet/sdk/issues/795) for the details and discussion.

One of the [undocumented changes](https://docs.microsoft.com/en-us/dotnet/articles/core/migration/) of converting from project.json to csproj, was the `<DocumentationFile>` no longer automatically copied to the output folder during the build or publish process.

There have been multiple solutions, both `pre` and `post` publish scripts. However, understanding how MSBUILD works and finding the simplest way is key. Thanks to [Eric Erhardt](https://github.com/eerhardt)'s [latest comment here](https://github.com/dotnet/sdk/issues/795#issuecomment-289782712) I think that this is the cleanest way.

Add the following snippet to the .csproj to enable the copy of the documentation file to the output folder.

It supports the **F5** options as well as the `dotnet build` / `dotnet publish` CLI commands.

Another important option tested was the ability to pass a custom **output** folder using the `--o|--output` parameter.

```bash
dotnet publish -c Release -o myreleasefolder
```

### Other options

You can also add additional output locations to the `<DocumentationFile>` node.

### Resources

An example project is available on GitHub at [https://github.com/spboyer/copydocfile-example](https://github.com/spboyer/copydocfile-example) for reference.

-   [Migrating .NET Core projects to the .csproj format](https://docs.microsoft.com/en-us/dotnet/articles/core/migration/)
-   [Project.json to MSBuild conversion guide](http://www.natemcmaster.com/blog/2017/01/19/project-json-to-csproj/)
