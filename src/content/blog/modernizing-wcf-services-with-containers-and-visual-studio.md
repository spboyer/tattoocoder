---
title: "Modernizing WCF Services with containers and Visual Studio"
description: "There are a number of reasons for moving long-standing .NET Framework applications like WCF, and ASP.NET Webforms to containers and then into containers or &quot;modernizing legacy heritage apps&quot;. DevOps - Once the application is set up in a container, build a CI/CD pipeline to build and"
pubDate: "2019-06-14T19:45:29.000Z"
updatedDate: "2019-06-14T19:45:29.000Z"
heroImage: "/content/images/imported/modernizing-wcf-services-with-containers-and-visual-studio-cover.png"
tags:
  - "wcf"
  - "docker"
  - "azure"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/modernizing-wcf-services-with-containers-and-visual-studio/"
---

There are a number of reasons for moving long-standing .NET Framework applications like WCF, and ASP.NET Webforms to containers and then into containers or "modernizing ~legacy~ heritage apps".

1.  DevOps - Once the application is set up in a container, build a CI/CD pipeline to build and push the applications to the cloud in a streamlined fashion.
    
2.  Velocity - In addition to the CI/CD features, the ability to version the container, ease of deployment and rollback in the event of failures is easier.
    
3.  Leverage other cloud services - Add Application Insights or logging, managed database services, and other PAAS offerings.
    

## Where to start

[Visual Studio 2019](https://visualstudio.com) has the Docker tooling built into the workloads. You will need to install [Docker for Windows](https://docs.docker.com/docker-for-windows/) and ensure [Windows Containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers) are enabled.

Open your WCF application in VS 2019, right-click the project file and select Add -> Docker Support.

![](/content/images/imported/modernizing-wcf-services-with-containers-and-visual-studio-image-0.png)

The Docker tooling for Visual Studio will inspect the application and add the appropriate Dockerfile for your application.

In the case of WCF, the following Dockerfile is added to your solution.

```docker
FROM mcr.microsoft.com/dotnet/framework/wcf:4.7.2-windowsservercore-ltsc2019
ARG source
WORKDIR /inetpub/wwwroot
COPY ${source:-obj/Docker/publish} .
```

Now when you run your application, select "Docker" from the Debug menu and the WCF Test Client will launch and add the container url for the service.

> If the WCF Test Client does not load, be sure to check that the workload is selected in the Visual Studio 2019 Installer.

Upon looking at the `*csproj` file, you should see that there are new entries for starting the new container with F5.

```xml
<DockerLaunchAction>LaunchWcfTestClient</DockerLaunchAction><DockerLaunchUrl>http://{ServiceIPAddress}/MyService.svc</DockerLaunchUrl>
```

The WCF Client will start and add the new container URL endpoint to test against instead of `http://localhost...`. All of your breakpoints and debugging will now happen within the container as the debugger is attached to the container as opposed to the local machine host.

## Building the Docker Image

When you click Debug or press F5, the image is built for your application by Visual Studio, after the base image is pulled. This may take some time as this is a Windows Container image and ~1.59 Gb compressed.

If you are familiar with Docker, you're likely to try and use the standard `docker build` or `docker run` commands. However, will fail using the command line if the proper MSBuild command is not run to produce the appropriate output.

We have to build the WCF application first either using Visual Studio or MSBuild. The Docker tooling for VS, actually runs an MSBuild command behind the scenes to create the `obj/Docker/publish` folder, compile the app and copy the output there prior to running the `docker run` command.

This is important in the event we move to a DevOps scenario. The command need to run on the command line and in Azure DevOps is:

```console
msbuild /t:ContainerBuild /p:Configuration=Release
```

### Pushing the image to a registry

Give a project name i.e. `hellowcf` will produce a docker image named `hellowcf:latest`. From here, you may want to **tag** the image with an appropriate version number, or other identifier prior to pushing it to a registry.

For example, tagging with a **buildId** and pushing it to an Azure Container registry.

```console
docker tag hellowcf:latest myregistry.azure.cr/hellowcf:1234

docker push myregistry.azure.cr/hellowcf:1234
```

### Using Visual Studio

Visual Studio has a rich UI for publishing your applications and with containers, the same is true.

The publish dialog has options for [deploying to a container registry (Azure Container Registry, Docker Hub, Custom)](https://docs.microsoft.com/en-us/visualstudio/containers/hosting-web-apps-in-docker?view=vs-2019) or [deploying the built container image direct to Azure App Service](https://docs.microsoft.com/en-us/visualstudio/containers/deploy-app-service?view=vs-2019) right from the UI.

![](https://docs.microsoft.com/en-us/visualstudio/containers/media/hosting-web-apps-in-docker/vs-acr-provisioning-dialog.png?view=vs-2019)

## Publishing the application

In this scenario, a WCF application was used however it could as easily have been an ASP.NET WebForms app or a console service.

For the WCF app, Windows Containers on AppService is a great first step and if you have a number of components to your architecture that is needing to spin up at once; AKS - [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli) now supports Windows Containers as well.

Console apps or services that run once and while, or on timers to perform work is when a service like [Azure Container instances](https://docs.microsoft.com/en-us/azure/container-instances/) is a great fit.

The point here is getting your long-standing and stable applications into a container without re-writing or re-architecting the solution and still take advantage of cloud native type practices.

## Additional Reading

[Deploying Existing .NET Apps as Windows Containers](https://docs.microsoft.com/en-us/dotnet/standard/modernize-with-azure-and-containers/modernize-existing-apps-to-cloud-optimized/deploy-existing-net-apps-as-windows-containers)
