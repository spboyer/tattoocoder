---
title: "Learning DevOps, building the ASP.NET Core Workshop, and keeping it up to date"
description: "DevOps is the union of people, process, and products to enable continuous delivery of value to our end users. – Donovan Brown Build Status BackEnd Web API FrontEnd Razor Page App How often have you gone to a GitHub repo and found that the sample code is not up to date"
pubDate: "2018-06-25T23:13:22.000Z"
updatedDate: "2018-07-04T16:19:08.000Z"
heroImage: "/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-cover.png"
tags:
  - "aspnetcore"
  - "azure"
  - "devops"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/learning-devops-and-building-the-asp-net-core-workshop-up-to-date/"
---

> DevOps is the union of people, process, and products to enable continuous delivery of value to our end users.

> – Donovan Brown

<table><tbody><tr><td><div style="font-size:smaller">Build Status</div><a href="https://dotnetfoundation.visualstudio.com/AspNetCoreWorkshop/_build/latest?definitionId=30"><img src="https://dotnetfoundation.visualstudio.com/AspNetCoreWorkshop/_apis/build/status/ASP.NET%20Workshop-ASP.NET%20Core-CI-import"></a></td><td><div style="font-size:smaller">BackEnd Web API</div><img src="https://dotnetfoundation.vsrm.visualstudio.com/_apis/public/Release/badge/a68bc2e9-c4e7-4af9-80a5-2cfdbcb4805f/1/2"></td><td><div style="font-size:smaller">FrontEnd Razor Page App</div><img src="https://msft-shayne.vsrm.visualstudio.com/_apis/public/Release/badge/6bb14994-33a9-43d6-b737-dd68d09428c1/2/3"></td></tr></tbody></table>

How often have you gone to a GitHub repo and found that the sample code is not up to date with the latest SDK, or doesn't even build?

Over the last couple of weeks, I have jumped into updating (again) the [ASP.NET Core Workshop](https://github.com/dotnet-presentations/aspnetcore-app-workshop) the team uses for 1 and 2-day sessions at various conferences to .NET Core 2.1. However, as a part of that, we wanted to make sure that any future changes were checked and didn't just work on my machine.

The workshop has a lot in it, each with their own restore/save points and for a bonus, there is an Angular SPA Services options as well as Docker option too.

1.  [Session #1](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/1.%20Create%20BackEnd%20API%20project.md) | Get bits installed, build the back-end application with basic EF model
2.  [Session #2](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/2.%20Build%20out%20BackEnd%20and%20Refactor.md) | Build out back-end, extract EF model
3.  [Session #3](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/3.%20Add%20front-end%2C%20render%20agenda%2C%20set%20up%20front-end%20models.md) | Add front-end, render agenda, set up front-end models
4.  [Session #4](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/4.%20Add%20auth%20features.md) | Add authentication, add admin policy, allow editing sessions, users can sign-in with Twitter and Google, custom auth tag helper
5.  [Session #5](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/5.%20Add%20personal%20agenda.md) | Add user association and personal agenda
6.  [Session #6](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/6.%20Deployment.md) | Deployment, Azure and other production environments, configuring environments, diagnostics |
7.  [Session #7](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/7.%20Challenges.md) | Challenges
8.  [Session #8](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/8.%20SPA%20FrontEnd.md) | SPA front-end

### Updating the code

Migrating from 2.0 -> 2.1 is not overly hard as [documented in the blog](https://docs.microsoft.com/aspnet/core/migration/20_21?view=aspnetcore-2.1&WT.mc_id=cicd-blog-shboyer) post when it was released. It's more about not missing one of the \*csproj files, or NuGet packages etc., and making sure that each project can do a `dotnet restore`, `dotnet build`. Of course, if those checks pass, `dotnet publish` where appropriate and there is the Docker thing too...

### Visual Studio Team System

[VSTS](https://visualstudio.microsoft.com/team-services/?WT.mc_id=blog-twitter-shboyer) is awesome, more than I thought. I have used Travis and Circle CI in the past on my open source projects and I'm familiar with Jenkins. Looking at what I needed to accomplish, this was the right tool for the job.

#### Building the pipeline

First I just need to get the code from the repo by using the oAuth connector from GitHub.

![Github connetor](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-3.png)

Next, it was pretty easy to add each of the steps for building the app in every save point. I accomplished that by creating a "[phase](https://docs.microsoft.com/vsts/pipelines/process/phases?view=vsts&tabs=web&WT.mc_id=cicd-blog-shboyer)" for each.

Here the first phase builds the code in the `/src` folder, which is the completed workshop, and produces two [artifacts](https://docs.microsoft.com/vsts/pipelines/release/artifacts?view=vsts&WT.mc_id=cicd-blog-shboyer); **backend.zip** (Web API app) and **frontend.zip** (Razor Pages app)

![Phase example](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-4.png)

Multiple "phases" are built and when the build is initiated, either manually or via trigger (PR or merge), they will can in parallel, sequentially or both depending on the build agent availability and/or dependencies between phases.

This screenshot shows all of the phases completed and a summary of each of the steps for the "Completed Workshop" phase or job.

![Completed Source Code](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-5.png)

Here is the summary of the steps of the Docker option.

![Docker Phase](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-6.png)

Clicking on any of the individual steps within the phase shows detailed logs of what occurred.

![Detailed log](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-7.png)

#### Releases

When the build completes successfully, the artifacts from the first phase **backend.zip** and **frontend.zip** are available as triggers for a release to occur. Here we've set up a release so whenever a successful build is completed and new artifacts are available; the **backend.zip** and **frontend.zip** are each deployed to an Azure App Service via web deploy.

![Release Workflow](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-8.png)

### Other releases

As a part of the build process, in the "deployment-docker" build phase we are creating a number of Docker images. **frontend**, **backend** and a **nginx proxy** image which are pushed to an Azure Container Registry (ACR).

A [multi-container Azure App Service in Linux](https://azure.microsoft.com/blog/app-service-adding-multi-container-capabilities-and-linux-support-for-app-service-environment/?WT.mc_id=cicd-blog-shboyer) has a webhook that is notified when these images are updated and pulls them to this new service.

### Custom agents, Docker, and more goodness

Each build pipeline and/or phase can be configured to have a specific build agent. This is what hosts the [VSTS agent to perform the build](https://docs.microsoft.com/vsts/pipelines/agents/hosted?view=vsts&WT.mc_id=cicd-blog-shboyer#use-a-microsoft-hosted-agent). In the workshop build, we've set it up to build on a Linux Host. However, we could've selected Windows, Mac OSX or configured our own agent.

### Using a Docker VSTS Agent

The VSTS Team publishes many different options for running the vsts-agent inside of Docker. [See the repo on Docker Hub](https://hub.docker.com/r/microsoft/vsts-agent/)

You will need a [**Personal Access token**](https://docs.microsoft.com/vsts/pipelines/agents/v2-linux?view=vsts&WT.mc_id=cicd-blog-shboyer#permissions) from your Visual Studio Team Services instance.

I used the `microsoft/vsts-agent:ubuntu-16.04-tfs-2017-u1-docker-17.03.0-ce-standard` image as it included the Docker Compose capabilities needed to produce and push the images to ACR.

> Note that you cannot run "Docker in Docker", so we need to run docker tasks inside the agent-container by binding the docker sock from the host to the container.

```bash
docker run 
  -e VSTS_ACCOUNT=myinstance-shayne \ƒ

  -e TFS_HOST=myinstance-shayne \
  -e VSTS_TOKEN=xxxxxxxxxxxxxxxxceyeqvu3thm6rxdfjooo3tgquyu6qu26a \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -it microsoft/vsts-agent:ubuntu-16.04-tfs-2017-u1-docker-17.03.0-ce-standard
```

Running the container downloads the vsts agents and attaches it to the build server as an available agent for builds. It was fun to experiment with this. I ran 4 on my Mac, started a few in Azure Container Service (this took a while to start, the images are 3 Gb) and set them for non-Docker build phases.

![local docker agents](/content/images/imported/learning-devops-and-building-the-asp-net-core-workshop-up-to-date-image-9.png)

### Resources

Getting started with VSTS is super easy; check out the docs example for .NET Core - [Build your first CI/CD pipeline for .NET Core](https://docs.microsoft.com/vsts/pipelines/apps/aspnet/build-aspnet-core?view=vsts&tabs=gitvsts%2Cweb%2Cdeploy-windows&WT.mc_id=cicd-blog-shboyer)
