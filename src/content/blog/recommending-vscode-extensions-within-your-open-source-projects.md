---
title: "Recommending VSCode extensions within your Open Source projects"
description: "Do you run an open-source project? Use Visual Studio Code and its extensive set of extensions when maintaining your project or even coding day to day? If you have an extension or set of them you prefer/recommend for your projects; you can enable other contributors by informing them with"
pubDate: "2019-08-14T19:23:57.000Z"
updatedDate: "2019-08-14T19:23:57.000Z"
heroImage: "/content/images/imported/recommending-vscode-extensions-within-your-open-source-projects-cover.png"
tags:
  - "vscode"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/recommending-vscode-extensions-within-your-open-source-projects/"
---

Do you run an open-source project? Use [Visual Studio Code](https://code.visualstudio.com) and its extensive set of [extensions](https://marketplace.visualstudio.com/vscode) when maintaining your project or even coding day to day?

If you have an extension or set of them you prefer/recommend for your projects; you can enable other contributors by informing them with an alert showing any like.

![Recommended Extension](/content/images/imported/recommending-vscode-extensions-within-your-open-source-projects-image-0.png)

Clicking on **Show Recommendations** opens the **Workspace Recommendations**

![workspace recommended](/content/images/imported/recommending-vscode-extensions-within-your-open-source-projects-image-1.png)

Details allows you to also ignore Ignore the recommendation as well.

![details](/content/images/imported/recommending-vscode-extensions-within-your-open-source-projects-image-2.png)

### Enabling in your repository

Add a `.vscode` folder, if not already there for your debugging setup, and create a new file named: `extensions.json` with the following structure.

```javascript
{
	"recommendations": [
		"msjsdiag.debugger-for-chrome"
	]
}
```

The `recommendations[]` contains the extensions identifier from the Visual Studio Marketplace.

If I were to add recommended extensions for the [ASP.NET Core Workshop](https://github.com/dotnet-presentations/aspnetcore-app-workshop) for instance. The `extensions.json` file would likely look something like this.

```javascript
{
	"recommendations": [
                "ms-vscode.csharp",
                "VisualStudioExptTeam.vscodeintellicode",
                "ms-mssql.mssql",
                "ms-vscode.azure-account",
                "ms-azuretools.vscode-azureappservice",
		"ms-azuretools.vscode-docker",
                "MS-vsliveshare.vsliveshare-pack"
	]
}
```

-   [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)
-   [Visual Studio Intellicode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
-   [SQL Server](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql)
-   [Azure Account](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)
-   [Azure App Service](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)
-   [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
-   [VS Live Share Pack](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack)

### Simple and clean

A small addition to help contributors discover extensions you utilize as well as use to add to the projects you're maintaining, and completely optional.
