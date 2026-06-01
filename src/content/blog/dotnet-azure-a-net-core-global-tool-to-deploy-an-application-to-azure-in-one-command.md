---
title: "dotnet-azure : A .NET Core global tool to deploy an application to Azure in one command"
description: "The options for pushing your .NET Core application to the cloud are not lacking depending on what IDE or editor you have in front of you. Visual Studio has a rich GUI interface with choices to pick pursuant to the architecture of your app - Web, Containers, SQL Server, Registries,"
pubDate: "2019-04-19T15:23:15.000Z"
updatedDate: "2019-04-19T17:39:09.000Z"
tags:
  - "azure"
  - "dotnetcore"
  - "globaltools"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/dotnet-azure-a-net-core-global-tool-to-deploy-an-application-to-azure-in-one-command/"
---

![dotnet-azure-new-web](/content/images/imported/dotnet-azure-a-net-core-global-tool-to-deploy-an-application-to-azure-in-one-command-image-0.gif)

The options for pushing your .NET Core application to the cloud are not lacking depending on what IDE or editor you have in front of you.

[Visual Studio](https://visualstudio.microsoft.com/downloads/) has a rich GUI interface with choices to pick pursuant to the architecture of your app - Web, Containers, SQL Server, Registries, etc.; and for years has excelled at delivering a full experience.

[VS Code](https://code.visualstudio.com) offers a great Azure extension pack and in its own fashion delivers an experience to publish your web application directly to an AppService, Container and/or Registry too.

If the command line experience is more your "thing", the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) is available and any resource publish option can be had through the `az` command.

But what if you just wanted to `deploy` your application to Azure with a single command?

## Installation

**dotnet-azure** is a .NET Core global tool and available via NuGet. To install run the following command.

```console
dotnet tool install dotnet-azure --global
```

_Requirements - An Azure account is required, get one for [FREE](https://aka.ms/dotnet-azure) at [https://aka.ms/dotnet-azure](https://aka.ms/dotnet-azure)_

## Usage

Each command has a `-h|--help` option available.

`dotnet azure -h|--help`

### help

```console
Usage: dotnet-azure [options] [command]

Options:
  -?|-h|--help  Show help information

Commands:
  deploy        Deploy application to Azure App Service. Options are used for [NEW] application deployments only.
  login         Login into Azure
```

### login

Run `login` command first to authenticate against your Azure account. You'll be prompted to use a code and URL to authenticate.

`dotnet azure login`

```console
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XXXXXXXXX to authenticate.
```

### deploy

Use defaults, random generated application and resource group name. The current directory is assumed for application for deployment.

#### Examples

```console
dotnet azure deploy
```

Pass project folder.

```console
dotnet azure deploy \mynewproject
```

Pass all options.

```console
dotnet azure deploy --location westus --name fancywebapp --group fancywebgroup --plan BasicB1
```

Short hand for `location`, `name`, and `group`

```console
dotnet azure deploy -l eastus2 -n fancywebapp -g fancygroup
```

Full help output for **deploy** command.

```console
Deploy an application to Azure App Service. Options are used for [NEW] application deployments only.

Usage: dotnet-azure deploy [arguments] [options]

Arguments:
  AppPath

Options:
  -?|-h|--help                       Show help information
  -n|--name <APP_NAME>               Name of application, must be unique.
  -l|--location <LOCATION>           Region or location of app deployment. (eastus, westus, etc.)
  -g|--group <RESOURCE_GROUP>        Resource group name to create and use for deployment.
  -p|--plan <APP_SERVICE_PLAN_TYPE>  Type of App Service Plan to create for application. Options (BasicB1, SharedD1, FreeF1, PremiumP1 - more info https://aka.ms/azure-appserviceplans )
```

## What's Next?

Install it, provide feedback. Have ideas, contribute. Is this a good thing? Let me know [@spboyer](https://twitter.com/spboyer)

-   Github : [https://github.com/spboyer/dotnet-azure](https://github.com/spboyer/dotnet-azure)
