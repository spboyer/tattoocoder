---
title: "Cross platform code coverage arrives for .NET Core"
description: "If you have done any node.js development and have been required to hit code coverage marks prior to check in or CI/CD builds; you probably have used a tool like istanbul to check your percentages. image from instabul.js.org Getting code coverage reports on the command line"
pubDate: "2018-03-21T13:23:55.000Z"
updatedDate: "2018-03-23T13:55:24.000Z"
tags:
  - "dotnetcore"
  - "testing"
  - "opensource"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/cross-platform-code-coverage-arrives-for-net-core/"
---

If you have done any node.js development and have been required to hit code coverage marks prior to check in or CI/CD builds; you probably have used a tool like [istanbul](https://istanbul.js.org/) to check your percentages.

![](https://istanbul.js.org/assets/terminal.png)  
_image from instabul.js.org_

Getting code coverage reports on the command line for .NET Core has been a gap, and unless you are using Visual Studio Test or a 3rd party pay for play; getting this information was still only Windows only.

A few weeks ago I attended a hackathon at the Microsoft MVP Summit and saw a glimpse into [coverlet](https://github.com/tonerdo/coverlet) from [Toni Solarin (@tonerdo)](https://twitter.com/tonerdo) and he has hit the nail on the head!

Using the quick test example on the docs site: [Unit testing C# with MSTest and .NET Core](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest?WT.mc_id=opensource-blog-shboyer). I created the project(s), added the coverlet NuGet package and ran `dotnet test`.

Create the solution and projects.

```bash
# create the solution file
dotnet new sln -n testing-coverlet

# create the class library project
dotnet new classlib -n PrimeService

# create the mstest project
dotnet new mstest -n PrimeService.Tests

# add the projects to the solution file
dotnet sln add **/**/*.csproj

# add the reference to the classib project
cd PrimeService.Tests
dotnet add reference ../PrimeService/PrimeService.csproj
```

Copy the code examples from the [docs](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest?WT.mc_id=opensource-blog-shboyer).

To add **coverlet**, it is just a NuGet package. So, just like any other we can add it to the PrimeServices.Tests project.

```bash
dotnet add package coverlet.msbuild
```

And because it integrates directly with `dotnet test` there is no other work to do. Just run `dotnet test` and pass the parameter `/p:CollectCoverage=true` to enable the output.

And we get the output:

```bash
Build completed.

Test run for /PrimeService.Tests/bin/Debug/netcoreapp2.0/PrimeService.Tests.d
ll(.NETCoreApp,Version=v2.0)
Microsoft (R) Test Execution Command Line Tool Version 15.3.0-preview-20170628-02
Copyright (c) Microsoft Corporation.  All rights reserved.

Starting test execution, please wait...

Total tests: 5. Passed: 5. Failed: 0. Skipped: 0.
Test Run Successful.
Test execution time: 0.8314 Seconds

Calculating coverage result...
  Generating report '/PrimeService.Tests/coverage.json'

+--------------+----------+
| Module       | Coverage |
+--------------+----------+
| PrimeService | 66%      |
+--------------+----------+
```

This is just the start of what I am sure to be much more to come. It is another open source [.NET Core project](https://github.com/tonerdo/coverlet), so contribute, [provide feedback](https://github.com/tonerdo/coverlet/issues) and praise this work!

My full example [available here on Github](https://github.com/spboyer/coverlet-test)
