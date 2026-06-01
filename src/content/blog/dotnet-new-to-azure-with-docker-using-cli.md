---
title: "dotnet new angular to Azure with Docker using CLI"
description: "Visual Studio 2017 has been released and the features are great for Windows developers. However along with it comes .NET Core 1.0 tooling and large improvements to the command line experience for macOS and Linux users developing ASP.NET Core applications. One of the prevalent features shown off in"
pubDate: "2017-03-09T23:45:45.000Z"
updatedDate: "2017-04-11T13:04:36.000Z"
heroImage: "/content/images/imported/dotnet-new-to-azure-with-docker-using-cli-cover.png"
tags:
  - "dotnet"
  - "docker"
  - "azure"
  - "cli"
  - "azure-cli"
  - "azuredev"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/dotnet-new-to-azure-with-docker-using-cli/"
---

Visual Studio 2017 has been released and the features are great for Windows developers. However along with it comes .NET Core 1.0 tooling and large improvements to the command line experience for macOS and Linux users developing ASP.NET Core applications.

One of the prevalent features shown off in VS 2017 is the Docker support and capabilities to push to Azure App Service.

Using the Azure CLI 2.0, Docker and .NET CLI these same capabilities can be accomplished without friction and with just as much success and satisfaction.

## dotnet new

The new command now is driven by a whole new template system. A number of new templates, including webapi, are available with the ability to install and create custom ones.

Read more about `dotnet new` and the dotnet CLI at [Exploring the new dotnet cli](https://tattoocoder.com/exploring-the-new-dotnet-cli/).

### add SpaTemplates

Install the ASP.NET Core Spa Templates for `dotnet new` using the following command.

```console
dotnet new --install Microsoft.AspNetCore.SpaTemplates::*
```

Now you can use `dotnet new angular` to create a new Angular application. React, Aurelia, and Knockout are also included in the templates installed with SpaTemplates.

### Creating a new Angular app

If there is a piece of advice when using any CLI (Command Line Interface), it is to first look at the `-h|--help` and inspect the options that are available. If there is not documentation available; `--help` can be a great place to find some 'er help.

The option we will use here is `-n|--name` which sets the name of the application and the location or folder. It is a preference for me as I tend to forget to create the folder and `cd`.

`dotnet new angular -n aspnetcoreweb`

Run `dotnet restore` to install the NuGet dependencies.

To install the client-side dependencies, run `npm install` to download the packages defined in _package.json_ prior to running the application.

Start the application with `ASPNETCORE_ENVIRONMENT=Development dotnet run`

webpack is used to bundle and minify the client app (Angular, JavaScript, CSS etc.) and places those resources in the **wwwroot/dist** folder. When the **ASPNETCORE\_ENVIRONMENT** is set to **Development**, webpack watches for changes in the Client App and reloads any changes.

### Add Docker support

_The Dockerfile assumes the app has been published into the **published** folder. To achieve this, use `dotnet publish -o published -c Release`_

`dotnet new` templates do not come with Dockerfiles out of the box. However, adding what is needed for this project is minimal.

Add a new file named `Dockerfile` to the root of your project with the following contents.

```dockerfile
# base image for ASP.NET Core
# automatically exposes PORT 80
FROM microsoft/aspnetcore:1.1.1

# install nodejs for angular, webpack middleware
RUN apt-get update
RUN apt-get -f install
RUN apt-get install -y wget
RUN wget -qO- https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y build-essential nodejs

# set the working directory
WORKDIR /app

# set the environment to Production
ENV ASPNETCORE_ENVIRONMENT Production

# copy the published folder created using
# dotnet publish -o published -c Release
COPY published ./

# set the entrypoint of the application
ENTRYPOINT ["dotnet", "aspnetcoreweb.dll"]
```

To make your build context as small as possible add a **.dockerignore** file to the root folder of your project with the following contents.

```
*
!published
```

Create the Docker image for your application using the **tag** `-t` option to set the name of the image. This should correspond to the **dockerhub-username/dockerhub-repositoryname**. _Create an account at [http://hub.docker.com](http://hub.docker.com)_

```
docker build -t spboyer/aspnetcoreweb .
```

Use `docker images` from terminal to verify that the image was built with the tag. In my case I have `spboyer/aspnetcoreweb` with a `TAG` of latest.

Login and push image to Docker hub.

```
$ docker login

$ docker push spboyer/aspnetcore:latest
```

## Azure CLI

The Azure CLI 2.0 is Azure's new command line experience for managing Azure resources. It runs on Windows, macOS and Linux. [Get the installer for your OS here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

Login using command line. _If you have two factor authentication, this method doesn't work_\*

```
az login -u <username> -p <password>
```

## Creating a web app on Azure with a custom Docker image

The following bash script creates a resource group, an AppService plan, and the web app on the using Linux. The final command configures the web app container to use the Docker image we pushed to Docker hub.

```bash
#/bin/bash

# Variables
appName="aspnetcore-docker"
location="WestUS"
dockerHubContainerPath="spboyer/aspnetcore:latest"
resourceGroup="aspnetcore-docker"
plan="AppServiceDocker"

# Create a Resource Group
az group create --name $resourceGroup --location $location

# Create an App Service Plan
az appservice plan create --name $plan --resource-group $resourceGroup --location $location --is-linux --sku S1

# Create a Web App
az appservice web create --name $appName --plan $plan --resource-group $resourceGroup

# Configure Web App with a Custom Docker Container from Docker Hub
az appservice web config container update --docker-custom-image-name $dockerHubContainerPath --name $appName --resource-group $resourceGroup
```
