---
title: "dotnet new templates for serverless functions"
description: "Since .NET Core was announced, I've really been loving the command line experience for .NET Core. Being able to use dotnet new to start a new application regardless of the OS or what shell/terminal experience is on a machine is the way to happiness. The Azure Functions team has"
pubDate: "2018-08-08T15:01:27.000Z"
updatedDate: "2018-08-08T15:09:15.000Z"
heroImage: "/content/images/imported/dotnet-new-templates-for-serverless-functions-cover.png"
tags:
  - "azure-functions"
  - "azure mobile services"
  - "serverless"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/dotnet-new-templates-for-serverless-functions/"
---

Since [.NET Core](https://www.microsoft.com/net/download/dotnet-core/2.0?utm_source=shboyer&utm_medium=blog&utm_campaign=blog&WT.mc_id=none-blog-shboyer) was announced, I've really been loving the command line experience for .NET Core. Being able to use `dotnet new` to start a new application regardless of the OS or what shell/terminal experience is on a machine is the way to happiness.

The [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/) team has put together some fancy new templates for creating serverless apps now.

## Getting the new templates installed

.NET Core templates are all just NuGet packages and installed using `dotnet new -i <package-path>`. In this case, the templates are on a private feed, so you need to get them **nupkg** files from [https://functionscdn.azureedge.net/public/cli-feed-v3.json](https://functionscdn.azureedge.net/public/cli-feed-v3.json).

The latest current version right now is from the feed:

```javascript
    "2.3.3": {
      "Microsoft.NET.Sdk.Functions": "1.0.14",
      "cli": "https://functionscdn.azureedge.net/public/2.0.1-beta.34/Azure.Functions.Cli.win-x86.2.0.1-beta.34.zip",
      "nodeVersion": "8.11.1",
      "localEntryPoint": "func.exe",
      "itemTemplates": "https://www.myget.org/F/azure-appservice/api/v2/package/Azure.Functions.Templates/2.0.0-beta-10224",
      "projectTemplates": "https://www.myget.org/F/azure-appservice/api/v2/package/Microsoft.AzureFunctions.ProjectTemplates/2.0.0-beta-10224",
      "templateApiZip": "https://functionscdn.azureedge.net/public/TemplatesApi/2.0.0-beta-10224.zip",
      "sha2": "4A2B808E86AE4C4DEF38A2A14270D19EC384648AD1FDF635921A64F609D41098",
      "FUNCTIONS_EXTENSION_VERSION": "beta",
      "requiredRuntime": ".NET Core",
      "minimumRuntimeVersion": "2.1"
```

Download the **projectTemplates** and **itemTemplates** nupkg files and install them using the command:

```console
dotnet new -i ~/Downloads/Azure.Functions.Templates.2.0.0-beta-10224.nupkg"
dotnet new -i ~/Downloads/Microsoft.AzureFunctions.ProjectTemplates.2.0.0-beta-10224.nupkg"
```

Now when `dotnet new` is run, the Azure Function templates are available.

```console
Templates                                         Short Name                          Language          Tags
-------------------------------------------------------------------------------------------------------------------------------
QueueTrigger                                      Queue                               [C#]              Azure Function
HttpTrigger                                       Http                                [C#]              Azure Function
BlobTrigger                                       Blob                                [C#]              Azure Function
TimerTrigger                                      Timer                               [C#]              Azure Function
DurableFunctionsOrchestration                     DurableFunctionsOrchestration       [C#]              Azure Function
SendGrid                                          SendGrid                            [C#]              Azure Function
EventHubTrigger                                   EventHub                            [C#]              Azure Function
ServiceBusQueueTrigger                            SBQueue                             [C#]              Azure Function
ServiceBusTopicTrigger                            SBTopic                             [C#]              Azure Function
EventGridTrigger                                  EventGrid                           [C#]              Azure Function
Azure Functions                                   azureFunctionsProjectTemplates      [C#]              AzureFunctions/ClassLib
```

## Creating a quick function app

```console

# initial a new Azure Function application
dotnet new azurefunction --output myfunctionapp

# change dir
cd myfunctionapp

# add a new HttpTrigger Function 
dotnet new http --name echo 

# directory
.
├── echo.cs
├── host.json
├── local.settings.json
└── myfunctionapp.csproj
```

Now that I have initialized my app and first function, I could start the app using the [functions cli](https://github.com/Azure/azure-functions-core-tools#readme) with `func host start` but I want to be able to be able to debug the app, and deploy. I can open the project using [VS Code](https://code.visualstudio.com/) using `code .` or in my case I use the [Insiders Build](https://code.visualstudio.com/insiders) `code-insiders .`

> I have the [Azure Extension Pack for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-azureextensionpack) installed which includes the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) which allows you quickly browse, create, manage, deploy, and even [debug functions locally](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).

I am prompted with a notification that this is an Azure Function created outside of VS Code, and it is asking to add the assets for setting up debugging. Click Yes.

![VS Code Debug Assets Prompt](/content/images/imported/dotnet-new-templates-for-serverless-functions-image-0.png)

Now I can hit F5, add break points, and inspect my code just as I would expect from a great tooling experience but also have the ability to add new functions. Using the integrated terminal in VS Code you can see that the endpoint `http://localhost:7071/api/echo` is available.

![VS Code Screenshot of new function app](/content/images/imported/dotnet-new-templates-for-serverless-functions-image-1.png)

If we wanted to add an additional HttpTrigger, use the following command:

```console
# using -n as the short form for --name and -na short for namespace
dotnet new http -n echo2 -na myfunctionapp 
```

Or if you prefer a UI experience in VS Code, there is the Functions Extension for adding a new one as well.

![UI Option for new function](/content/images/imported/dotnet-new-templates-for-serverless-functions-image-2.png)

-   Click on the "Add new function"
-   Select the folder you want to work in
-   Select the type of function
-   Type the name of the function
-   Type the name of the namespace
-   ... potentially other options.

Both options are great depending on how you like to work. The templates are in line with how I work for all .NET Core applications now and I spend much of my time using command line tools like Docker, Kubernetes and the Azure CLI.

The Azure Functions are open source at [https://github.com/Azure/azure-functions-templates](https://github.com/Azure/azure-functions-templates) please provide feedback. [Azure Function development, debugging and deployment in Visual Studio](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs) is available as well.
