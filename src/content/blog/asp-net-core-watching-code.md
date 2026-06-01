---
title: "ASP.NET Core: Watching Code"
description: "Being able to edit code and see the changes on the fly is a big advantage when developing applications with all of the &quot;moving parts&quot; in today's tech stack. Simply hitting F5 doesn't cut it anymore. Everything needs to be compiled, minified, uglified, or transpiled to get your"
pubDate: "2016-05-18T11:00:00.000Z"
updatedDate: "2016-05-18T19:30:49.000Z"
heroImage: "/content/images/imported/asp-net-core-watching-code-cover.png"
tags:
  - "aspnetcore"
  - "dotnet"
  - "nodejs"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/asp-net-core-watching-code/"
---

![dotnet-watchingcode](/content/images/imported/asp-net-core-watching-code-image-0.png)

Being able to edit code and see the changes on the fly is a big advantage when developing applications with all of the "moving parts" in today's tech stack.

Simply hitting F5 doesn't cut it anymore. Everything needs to be compiled, minified, uglified, or transpiled to get your app to show up right.

On the node.js side of the dev stack I have been using [nodemon](https://github.com/remy/nodemon) to watch files for changes and execute whatever functions need to be run and restart the node server for my client apps during development.

```javascript
nodemon ./server.js localhost 8080
```

Early on in the ASP.NET Core days, beta 3, I creates a nuget package called [KMon](https://github.com/henriksen/kmon) that used nodemon under the covers to watch files and restart the kestrel server.

### dotnet-watch

Now there is **dotnet-watch**, described on the [github repo](https://github.com/aspnet/dotnet-watch) page as

"_a file watcher for dotnet that restarts the specified application when changes in the source code are detected_"

Installation is simple, just add the following to your project.json file.

```javascript
"tools": {
        "Microsoft.DotNet.Watcher.Tools": {
            "version": "1.0.0-*",
            "imports": "portable-net451+win8"
        }
    },
```

and `dotnet restore` to make sure that you can resolve the tool from NuGet.

Next, to run the application with watch

```bash
$ dotnet watch
```

As an example output for my [ng2-kestrel-appserver](https://tattoocoder.com/kestrel-as-a-static-server-for-angular/) application

```bash
DotNetWatcher] info: Running dotnet with the following arguments: run
[DotNetWatcher] info: dotnet process id: 27477
Project ng2-kestrel-appserver (.NETCoreApp,Version=v1.0) will be compiled because inputs were modified
Compiling ng2-kestrel-appserver for .NETCoreApp,Version=v1.0
Compilation succeeded.
    0 Warning(s)
    0 Error(s)
Time elapsed 00:00:04.5432721

dbug: Microsoft.AspNetCore.Hosting.Internal.WebHost[3]
      Hosting starting
dbug: Microsoft.AspNetCore.Hosting.Internal.WebHost[4]
      Hosting started
Hosting environment: Production
Content root path: /ng2-kestrel-appserver
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

The application starts up on the defined [http://url](http://url):port, in this case [http://localhost:5000](http://localhost:5000). If a change is made to any of the C# application files, the _watcher_ detects the change and restarts the application.

_removed unecessary usings from Startup.cs_

```bash
[DotNetWatcher] info: File changed: 
/ng2-kestrel-appserver/Startup.cs
[DotNetWatcher] info: Running dotnet with the following arguments: run
[DotNetWatcher] info: dotnet process id: 27610
Project ng2-kestrel-appserver (.NETCoreApp,Version=v1.0) will be compiled because inputs were modified
Compiling ng2-kestrel-appserver for .NETCoreApp,Version=v1.0
Compilation succeeded.
    0 Warning(s)
    0 Error(s)
Time elapsed 00:00:04.4233033
```

The re-compiliation is reasonably fast, depending on the change and size of the application.

I like this option as it's a core .NET option but is limited to just .NET.

If you are building an application that is composed of C#, TypeScript and/or other file types that need compilation etc or need some other transformative process; combining the `dotnet` command(s) and npm scripts may be another option.

### nodemon w/dotnet

Previous to **dotnet-watch** being available on OSX and Linux, I used nodemon with `dnx`, now `dotnet`, inside npm scripts to start and run my applications when in dev mode.

First add a **package.json** file to the root of your project, you may already have one depending on the project type.

This is the **package.json** from the [ng2-kestrel-appserver](https://tattoocoder.com/kestrel-as-a-static-server-for-angular/) project mentioned before.

```javascript
{
"name": "ng2-kestrel-appserver",
"version": "0.0.0",
"devDependencies": {
    "nodemon": "1.9.1",
    "gulp": "3.9.1",
    "gulp-cli": "1.2.1"
},
"scripts": {
     "start" : "nodemon --ignore htm,html,js,json --ignore obj/ --ignore bin/ --ext cs --delay 1000ms --exec \"dotnet run ASPNETCORE_ENVIRONMENT=Development\" -V"
   }
}
```

Using **nodemon**

-   ignore htm, html and javascript files as they do not need any work to be done if changed (refresh handles)
-   ignore **/bin** and **/obj** folders
-   **\--ext cs** : sets the process to watch file extension _.cs_ for changes
-   **\--delay 1000 ms** : way 1 second before restarting
-   **\--exec dotnet run ASPNETCORE\_ENVIRONMENT=Development** : start this command each time

To kickoff or start the application, use the following command

```bash
$ npm start
```

If we needed to compile TypeScript as well, for example, adding the TypeScript file type to the `--ext` and the compiler to the `--exec` would accomplish that in tandem.

i.e.

```bash
 "start" : "nodemon --ignore htm,html,js,json --ignore obj/ --ignore bin/ --ext cs,ts --delay 1000ms --exec \"tsc && dotnet run ASPNETCORE_ENVIRONMENT=Development\" -V"
```

Checkout the [ng2-kestrel-appserver](https://tattoocoder.com/kestrel-as-a-static-server-for-angular/) project and the [github repo](https://github.com/spboyer/ng2-kestrel-appserver).

Enjoy!
