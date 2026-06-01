---
title: "Exploring the Docker Extension for VS Code and .NET Core"
description: "The Docker extension for VS Code was recently updated to better support .NET Core applications and the experience is super nice! The extension already has great support for building your containers, pushing images to Docker Hub, Azure Container Registry and tasks such as running a specific image or tagging an"
pubDate: "2018-10-04T15:56:49.000Z"
updatedDate: "2018-10-04T15:56:49.000Z"
heroImage: "/content/images/imported/exploring-the-docker-extension-for-vs-code-and-net-core-cover.png"
tags:
  - "docker"
  - "vscode"
  - "dotnetcore"
  - "azure"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/exploring-the-docker-extension-for-vs-code-and-net-core/"
---

The [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker) was recently updated to better support .NET Core applications and the experience is super nice!

The extension already has great support for building your containers, pushing images to Docker Hub, [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/) and tasks such as running a specific image or tagging an image too. However, adding a Dockerfile to an ASP.NET Core application was not updated to support the [microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet/) base images.

The Docker extension can be downloaded separately or is also available as a part of the [Azure extension pack for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-azureextensionpack) which provides a number of other extensions for working with the many cloud services without leaving the editor.

First, I'll start by creating a quick Razor Pages app with the .NET CLI, change to the output directory and open in VS Code.

```console
> dotnet new razor -o dotnet-docker-vscode
> cd dotnet-docker-vscode
> code .
```

Using the extension, I can now add the needed Dockerfile using the Command Pallete, CMD + Shift + P (MacOS) or Ctrl + Shift + P (Win), type **Docker** and the options are presented.

![add docker file](/content/images/imported/exploring-the-docker-extension-for-vs-code-and-net-core-image-0.gif)

The extension adds the appropriate Dockerfile for ASP.NET Core 2.1

```dockerfile
FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY ["dotnet-docker-vscode.csproj", "./"]
RUN dotnet restore "./dotnet-docker-vscode.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "dotnet-docker-vscode.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "dotnet-docker-vscode.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "dotnet-docker-vscode.dll"]
```

Again using the extension we can build the image. When doing so it does ask for a tag, and in this case I will prefix it with my Azure Container Registry name for pushing to later.

![build the image](/content/images/imported/exploring-the-docker-extension-for-vs-code-and-net-core-image-1.gif)

Expanding the **Images** section, we can see the **shayne.azurecr.io/dotnet-docker-vscode** image available now. Right-clicking the entry show the options you would expect; aligning with the most common commands from the Docker CLI.

![docker image right-click](/content/images/imported/exploring-the-docker-extension-for-vs-code-and-net-core-image-2.png)

The option I can select here is to **Push** the image now to my Azure Container Registry.

> You may need to authenticate to your ACR which can be accomplished in the terminal using `az acr login --name {name of your registry}` should you get an error when pushing your image.

Now that the image is available in my private registry I can use the App Service extension to create an instance of the application using [App Service on Linux](https://docs.microsoft.com/en-us/azure/app-service/containers/) and push my container.

![create app service instance](/content/images/imported/exploring-the-docker-extension-for-vs-code-and-net-core-image-3.gif)

All of these tasks we can accomplish without leaving Visual Studio Code. There are a bunch of great extensions for developing whatever language or stack you like. For .NET Core, Azure and Docker development the following are some of my favorites.

-   [Azure extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-azureextensionpack)
-   [Docker extension for VS Code](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
-   [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
-   [mssql](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql)
-   [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

### Challenge

There is a challenge here for you...go download the extension. Build something, publish it and let me know. I want to hear the feedback on the extension and experience.
