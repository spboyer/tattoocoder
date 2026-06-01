---
title: "Lift and Shift, Migrating Nerd Dinner to the cloud using Docker"
description: "Modernizing legacy apps has become the theme towards the end of this year or also known as \"Lift and Shift\". Nerd Dinner is an ASP.NET 4.7 app..."
pubDate: "2017-11-07T02:54:04.000Z"
updatedDate: "2017-11-07T21:52:28.000Z"
heroImage: "/content/images/imported/liftandshift-nerd-dinner-cover.png"
tags:
  - "aspnet"
  - "docker"
  - "liftandshift"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/liftandshift-nerd-dinner/"
---

Modernizing legacy apps has become the theme towards the end of this year or also known as "Lift and Shift". This means taking the monolithic applications built with blood, sweat, and tears and now move them to the cloud.

Nerd Dinner ([https://nerddinner.codeplex.com/](https://nerddinner.codeplex.com/)) is an MVC application written back in 2010, the last edit was ~Sept 6, 2013 to the **mvc4** branch.

I grabbed the mvc branch and copied it over to [https://github.com/spboyer/nerddinner-mvc4](https://github.com/spboyer/nerddinner-mvc4) and fired it up in Visual Studio 2017.

The plan:

-   Migrate the LocalDB to SQL Server in Azure
-   Using the Docker tools in Visual Studio 2017, add the Docker files
-   Publish Docker Images to Azure Container Registry (ACR)
-   Push the new Docker images from ACR to Azure Container Instances (ACI)

Most importantly, in a real scenario, we want to make ZERO actual code changes to accommodate the Lift & Shift scenario.

But how?

## Decisions

When you decide to modernize your web applications and move them to the cloud, you don’t necessarily have to fully re-architect your apps. Establishing an environment that emulates your on-premises architecture and putting your application "gets" you there, but doesn't accomplish much more than that. It's like parking your car in someone else's garage, that they are responsible for taking care of the power etc.

Re-architecting an application by using an advanced approach like micro-services isn't always an option, because of cost and time restraints. Ripping apart the app and re-writing what sometimes can be years of work and iterations of people and business decisions probably wouldn't be the advised first step.

Depending on the type of application, re-architecting your apps might not be necessary. But adding a Dockerfile, and maybe migrating the database to a service offering like Azure's SQL Database require no code change other than connection strings.

Let's see how to accomplish that.

### Migrating the database

The first issue I came across was the original LocalDB was in 2012, had to find and install that from the download center; luckily the prompt had the proper link.

![install LocalDB 2012](/content/images/imported/liftandshift-nerd-dinner-image-0.png)

Next, I created a new SQL Azure instance in the portal following the [gettting started docs](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).

Now that that was established, open the SQL Server Object Explorer in Visual Studio and added the connection for the SQL Azure database.

To get the schema and data moved from the LocalDB to the new SQL Azure instance, right-click the LocalDB Instance and first select the Schema Compare tool and walk through the simple wizard. Repeat for the Data Compare.

![Schema Compare](/content/images/imported/liftandshift-nerd-dinner-image-1.png)

![Schema Compare 2](/content/images/imported/liftandshift-nerd-dinner-image-2.png)

![Schema Compare 3](/content/images/imported/liftandshift-nerd-dinner-image-3.png)

#### Connection Strings

In order to accomplish the "zero code change mantra", using web.config transforms is the best way to accomplish this at this times.

_Note - we should use the JUST released 4.7.1 [Configuration Builders](https://blogs.msdn.microsoft.com/dotnet/2017/10/17/announcing-the-net-framework-4-7-1/) but requires a NuGet package and some additonal changes. However, allows for the same capabilities as .NET Core in that we could load configuration from Environment variable and use Docker Secrets._

Here we'll add a new web.release.config with a new entry

```xml
<connectionStrings>
      <add name="DefaultConnection" 
        connectionString="Data Source=my.sql.azure.database;Initial Catalog=nerddinner-auth-sql;Persist Security Info=True;User ID=MyUsername;Password=MyPassword;" providerName="System.Data.SqlClient" 
        xdt:Transform="SetAttributes" xdt:Locator="Match(name)"/>
</connectionStrings>
```

This allows us to have a config for production, dev, etc. and not check in the secret connection string information.

### Adding Docker

Visual Studio has great support for Docker. All we have to do is right-click the project, select **Add->Docker Support**.

VS then add the Docker file, compose files and a specific Docker project to the solution. It also inspects the project to determine the proper base image to use for your project.

In the case of Nerd Dinner, it chose to use `microsoft/aspnet:4.7`. Here is the complete file.

```text
FROM microsoft/aspnet:4.7
ARG source
WORKDIR /inetpub/wwwroot
COPY ${source:-obj/Docker/publish} .
```

In this instance, I am choosing to change the base image to `microsoft/aspnet:4.7.1-windowsservercore-1709`. It was just released, and it about 1/2 the overall size. Given that we are needing to use Windows images on .NET Full Framework, Linux images are not an option and size, in this case, will matter for publishing.

Upon adding the Dockerfile, Visual Studio downloads the base image subsequently builds your dev images.

```bash
REPOSITORY                             TAG                            IMAGE ID            SIZE
nerddinner                             latest                         dab11d87b9b9        5.94GB
nerddinner                             dev                            a373bd4fc9fd        5.93GB
microsoft/aspnet                       4.7.1-windowsservercore-1709   e480e1342d04        5.93GB
```

I can run the application locally and debug within the Docker container using VS to test the connectivity to the SQL Azure instance. Once I have validated that, we can publish the image to a new or existing Azure Container Registry using the same publishing wizard we are familiar from previous versions of Visual Studio.

![publish wizard](/content/images/imported/liftandshift-nerd-dinner-image-4.png)

![publish wizard 2](/content/images/imported/liftandshift-nerd-dinner-image-5.png)

When publishing, the production Docker image is created and pushed to the Azure Container Registry. Once both the ACR and Docker images are established, we have options as to where the application can be deployed.

-   Azure Container Instances
-   Azure Container Service
-   Service Fabric

In this case, we will use a since instance Windows Container on ACI to bring up Nerd Dinner. This can be accomplished using the Azure CLI.

```bash
az group create --name nerddinnerapp --location westus

az container create --name nerddinnerapp --resource-group nerddinnerapp --os-type windows --image nerddinner.azurecr.io/nerddinner:latest --ip-address public
```

Looking at my containers `az container list -o table`, Nerd Dinner is available at [http://13.90.214.200/](http://13.90.214.200/) . _The map requires a new Bing key_

## Benefits of Lift & Shift

This model is about making a few cloud optimizations to gain some significant benefits from the cloud, without changing the core architecture of the application.

Now that the application is in a container, taking advantage of adding a CI/CD pipeline (also available in Visual Studio) to build/publish/deploy these containers is what is known as a "DevOps Ready" app.

Beyond that, adding additional Azure features like Application Insights for monitoring, SQL Advisor to auto-tune the database and/or make suggestions to reduce costs through the reduction of lost downtime or poor performance.

Stay tuned for more to come on Nerd Dinner's evolution and the Lift & Shift story.

See the code for this at : [https://github.com/spboyer/nerddinner-mvc4/tree/docker](https://github.com/spboyer/nerddinner-mvc4/tree/docker)
