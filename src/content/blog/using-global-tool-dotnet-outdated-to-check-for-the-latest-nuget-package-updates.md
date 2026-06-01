---
title: "Using global tool \"dotnet outdated\" to check for the latest NuGet package updates"
description: "Just recently the .NET Core June 2018 Update dropped and the ASP.NET Workshop I had just set up for CI/CD build was in need of an update to 2.1.1 (Release Notes). Get the latest 2.1.1 Runtime | 2.1.301 SDK from the downloads page"
pubDate: "2018-07-03T14:50:33.000Z"
updatedDate: "2018-07-03T14:50:33.000Z"
heroImage: "/content/images/imported/using-global-tool-dotnet-outdated-to-check-for-the-latest-nuget-package-updates-cover.png"
tags:
  - "dotnet"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/using-global-tool-dotnet-outdated-to-check-for-the-latest-nuget-package-updates/"
---

Just recently the [.NET Core June 2018 Update](https://blogs.msdn.microsoft.com/dotnet/2018/06/22/net-core-2-1-june-update/?WT.mc_id=none-blog-shboyer) dropped and the [ASP.NET Workshop I had just set up for CI/CD build](https://tattoocoder.com/learning-devops-and-building-the-asp-net-core-workshop-up-to-date/) was in need of an update to [2.1.1 (Release Notes)](https://github.com/dotnet/core/blob/master/release-notes/2.1/2.1.1.md).

-   Get the latest [2.1.1 Runtime](https://www.microsoft.com/net/download/all?WT.mc_id=none-blog-shboyer) | [2.1.301 SDK](https://www.microsoft.com/net/download/all?WT.mc_id=none-blog-shboyer) from the [downloads page at http://dot.net/](https://www.microsoft.com/net/download/all?WT.mc_id=none-blog-shboyer)

Looking through all of the `save-points` there are and of course the main `/src`, the challenge is to know what NuGet packages have changed and what versions are the latest etc., to be updated.

That is where a great .NET global tool, [`dotnet-outdated`](https://github.com/jerriep/dotnet-outdated) comes in to play.

-   Read more about [dotnet global tools in the docs](https://docs.microsoft.com/dotnet/core/tools/global-tools?WT.mc_id=none-blog-shboyer)

Install the tool using the .NET CLI - `dotnet tool install --global dotnet-outdated`, then I can either be at the solution(.sln) level or project(.csproj) level and type `dotnet outdated`.

![dotnet outdated output](/content/images/imported/using-global-tool-dotnet-outdated-to-check-for-the-latest-nuget-package-updates-image-0.png)

The output shows each NuGet package, the current version used and the latest version. You have an option to pass `-pr` if you'd like to look for Pre-Release versions too.

Another nice option is the `-vl` or Version Lock option, which allows for locking on Major or Minor when checking for outdated packages.

Updating each of the projects was very fast using the defaults, making the changes to the \*.csproj files and then having the CI/CD process do its magic upon commit.

This is another great example of where .NET global tools can make the experience better. Would love to see this tool give an option for auto-updating. It is open source at [https://github.com/jerriep/dotnet-outdated](https://github.com/jerriep/dotnet-outdated).
