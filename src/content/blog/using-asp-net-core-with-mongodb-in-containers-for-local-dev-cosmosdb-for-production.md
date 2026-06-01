---
title: "Using ASP.NET Core with MongoDB in containers for local dev, CosmosDB for production"
description: "If nothing else is true, containers have made local development on a platform so much easier. If you want to use SQL Server for your backend just docker pull microsoft/mssql-server-linux and you can start up an instance with a few parameters. Azure CosmosDB is not available as a container,"
pubDate: "2018-10-18T19:08:22.000Z"
updatedDate: "2018-10-18T19:08:22.000Z"
heroImage: "/content/images/imported/using-asp-net-core-with-mongodb-in-containers-for-local-dev-cosmosdb-for-production-cover.png"
tags:
  - "azure"
  - "mongodb"
  - "cosmosdb"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/using-asp-net-core-with-mongodb-in-containers-for-local-dev-cosmosdb-for-production/"
---

If nothing else is true, containers have made local development on a platform so much easier. If you want to use SQL Server for your backend just `docker pull microsoft/mssql-server-linux` and you can start up an instance with a few parameters.

[Azure CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/) is not available as a container, however, MongoDB is available and happens to be a database I have used in previous applications. [MongoDB is one of the many APIs that CosmosDB supports](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction); locally I can develop against an instance of Mongo either in a container or installed and simply change the connection string for my production instance.

The flexibility of being able to use MongoDB and then just changing a connection string to use CosmosDB is a nice capability if you have exisiting applications that are using Mongo and you are looking for the globally scalable and features that CosmosDB offers.

> If you need to **migrate data** from MongoDB applications to CosmosDB [see this doc for the steps](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-migrate).

### Creating the Databases

For MongoDB locally, using Docker is super simple. Run `docker pull mongo`, and now you can use this in your application.

```console
docker run --name mongo mongo
```

Visual Studio Code has a CosmosDB extension as a part of the [Azure Extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-azureextensionpack) that allows you to interact with Mongo Databases as well as CosmosDB instances.

![CosmosDB Extension](/content/images/imported/using-asp-net-core-with-mongodb-in-containers-for-local-dev-cosmosdb-for-production-image-0.png)

This extension also allows you to create your CosmosDB instance right from VS Code, or you can create it in the Azure portal or even using the [Azure CLI](https://docs.microsoft.com/en-us/azure/cosmos-db/cli-samples).

![Create Database](/content/images/imported/using-asp-net-core-with-mongodb-in-containers-for-local-dev-cosmosdb-for-production-image-1.png)

However you like to create the instance, it can all happen in the same tool and that's awesome for me.

### Local Development

The app is a basic [ASP.NET Core Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-2.1&tabs=visual-studio-code) application which list "Running Races" that have been reviewed.

![run race review page](/content/images/imported/using-asp-net-core-with-mongodb-in-containers-for-local-dev-cosmosdb-for-production-image-2.png)

Both the app and the database are set to use containers and docker-compose to orchestrate them.

**Application Dockerfile**

```docker
FROM microsoft/dotnet:2.1.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 443

FROM microsoft/dotnet:2.1.403-sdk AS build
WORKDIR /src
COPY runracereview.csproj .
RUN dotnet restore
COPY . .
WORKDIR /src
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "runracereview.dll"]
```

**docker-compose**

```docker
version: "3"
services:
  runracreview:
    container_name: runracereview
    restart: always
    build:
      context: ./runracereview
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80
    ports:
      - "57270:80"
      - "44348:443"
    volumes:
      - ${HOME}/.microsoft/usersecrets/:/root/.microsoft/usersecrets
      - ${HOME}/.aspnet/https:/root/.aspnet/https/
    links:
      - mongo
  mongo:
    container_name: mongo
    image: mongo
    volumes:
      - ${WEBAPP_STORAGE_HOME}/site:/data/db
      #- ./data:/data/db
    ports:
      - "27017:27017"
```

Notice that in the compose file that the **mongo** image has a volume mapped to `${WEBAPP_STORAGE_HOME}/site:/data/db`, this is done to persist the test data locally as to not reload the data everytime the container is spun up.

> Check out the Microsoft Learn course : [Build a .NET Core app for Azure Cosmos DB in Visual Studio Code](https://docs.microsoft.com/en-us/learn/modules/build-cosmos-db-app-with-vscode/) - **FREE**

#### Setting up the app

Getting the connection to the database are done using the Configuration settings base on the Environment.

In **appsettings.Development.json**, the configuration for Mongo is added, and for Production, the CosmosDB connection string is set in **appsettings.Production.json**. The [ConfigurationBuilder](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.1) loads the appropriate file based on the environment.

```javascript
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "Container" : "mongodb://mongo:27017",
    "Database": "Races"
  },
```

**Startup.cs** configures the **Settings** options.

```csharp
 services.Configure<Settings>(
      options =>
      {
        options.ConnectionString = Configuration.GetSection("MongoDb:ConnectionString").Value;
        options.Database = Configuration.GetSection("MongoDb:Database").Value;
        options.Container = Configuration.GetSection("MongoDb:Container").Value;
        options.IsContained = Configuration["DOTNET_RUNNING_IN_CONTAINER"] != null;
      });
```

> If you are running .NET Core applications in a container you can inspect the Environment variable `DOTNET_RUNNING_IN_CONTAINER` to determine if this is true.

If the application is running in a container and in Development then the [Settings class](https://github.com/spboyer/runracereview/blob/master/runracereview/Settings.cs#L13) returns the proper connection string for the container.

### Simple but ...

Being able to work locally and iterate on a simple set of data without having to hit the production data constantly, or be concerned with the **UH OH** moments when trying new things is an advantage of this setup.

Code for this application is available on GitHub : [https://github.com/spboyer/runracereview](https://github.com/spboyer/runracereview)
