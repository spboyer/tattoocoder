---
title: "Why should we care about containers for development"
description: "There has probably been more than one time in your development career where you've spent a few hours troubleshooting an issue only to find out it was a dependency or versions issue right? Environments varying from one to next, outdated components and setting up development machines are frustrations we can"
pubDate: "2018-05-16T21:08:30.000Z"
updatedDate: "2018-06-04T13:17:47.000Z"
heroImage: "/content/images/imported/why-should-we-care-about-containers-for-development-cover.png"
tags:
  - "azure"
  - "docker"
  - "containers"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/why-should-we-care-about-containers-for-development/"
---

There has probably been more than one time in your development career where you've spent a few hours troubleshooting an issue only to find out it was a dependency or versions issue right?

Environments varying from one to next, outdated components and setting up development machines are frustrations we can all do without.

Some of these issues we've solved with VMs, but managing the entire machine and underutilizing them for each environment is costly. This is where containers have come to solve many challenges.

## Why Containers

It's no doubt that you have heard the buzz about containers over the last year or longer. If not containers, then some technology, framework, or tooling associated with it; Docker, Kubernetes, microservices are just a few of these. What are are the benefits from a developer perspective?

## Works on my machine

The scenario of each environment your code or application is deployed to could be different. How many servers, the configuration of CPU, RAM, etc. may vary from Development, QA, and Production and there is no guarantee the app will perform the same. Using containers provides the capability to define these parameters upon startup such that each image has the same requirements regardless of where it is deployed.

```bash
docker run --cpus=2 --memory=1.5g myapp
```

## Microservices

Applications that are comprised of many services may not be developed in the same language or framework. If you are developing a service in .NET Core for instance that calls a downstream service written in Node.js or Go, the development team responsible for that service can build the container image and make it available in your private registry.

Using a docker-compose file, you can then bring in that container image without needing Node.js or Go installed on your machine and test your calls against the development version.

```dockerversion:
services:

  nodeservice:
    image: nodeservice:dev
    environment:
      - NODE_ENV=Development

  namesweb:
    depends_on:
      - nodeservice
    image: namesweb
    build:
      context: .
      dockerfile: namesweb/Dockerfile
    environment:
      - NODE_SERVICE_ENDPOINT=NodeService-Dev
    ports:
      - "57270:80"
```

## Test Data

There are a rare amount of applications that do not involve data and maintaining an instance of your production system locally can be a task. Installing the tools, platform, server etc., as well as keeping all of these items up to date is above an beyond what you'd probably want to worry about as a developer.

Here in this docker-compose file an instance of SQL Server on Linux is started and with a script file, the test database is created, and finally, test data is loaded using the [Bulk Copy tool](https://docs.microsoft.com/sql/linux/sql-server-linux-migrate-bcp?view=sql-server-linux-2017&WT.mc_id=whycontainers-blog-shboyer).

```docker
version: '3.0'
services:

  mssql:
    image: microsoft/mssql-server-linux:latest
    container_name: mssql
    ports:
      - 1433:1433
    volumes:
      - /var/opt/mssql
      # we copy our scripts onto the container
      - ./sql:/usr/src/app
    # bash will be executed from that path, our scripts folder
    working_dir: /usr/src/app
    # run the entrypoint.sh that will import the data AND sqlserver
    command: sh -c ' chmod +x ./start.sh; ./start.sh & /opt/mssql/bin/sqlservr;'
    environment:
      ACCEPT_EULA: 'Y'
      SA_PASSWORD: P@$$w0rd
```

### start.sh

```bash
#!/bin/bash
wait_time=20s

echo creating resources in $wait_time
sleep $wait_time
echo starting...

echo 'creating Names DB'
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -i ./init.sql

echo 'creating Names Table'
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $SA_PASSWORD -i ./data/NameTable.sql

echo 'importing data...'
# Bulk load data from a csv file
/opt/mssql-tools/bin/bcp Names in data/Names.csv -S 0.0.0.0 -U sa -P $SA_PASSWORD -d Names -c -t ','

echo 'add uniqueid column'
/opt/mssql-tools/bin/sqlcmd -S localhost -d Names -U SA -P $SA_PASSWORD -I -Q "ALTER TABLE Names ADD ID UniqueIdentifier DEFAULT newid() NOT NULL;"

echo 'checking data'
/opt/mssql-tools/bin/sqlcmd -S localhost -d Names -U SA -P $SA_PASSWORD -I -Q "SELECT TOP 5 ID,FullName FROM Names;"
```

### init.sql & NameTable.sql

```text
DROP DATABASE Names

CREATE DATABASE Names;
GO

USE Names;
GO

CREATE TABLE Names(
  LastName nvarchar(max),
  FirstName nvarchar(max),
  FullName nvarchar(max)
);
GO
```

Using this test database image a subset of the production data is loaded and available for the application to use. The `container_name: mssql` is set as the **server name** for the connection string. All that is needed for the application is to hit this server now is a change to the setting.

> If you are using docker-compose for all of the containers, the DNS name resolution is handled automatically. To use the database container individually, get the IP Address by using the command `docker inspect -f "{{ .NetworkSettings.IPAddress }}" <containerId>`

```json
"ConnectionStrings": {
    "NamesConnection": "Server=mssql;Initial Catalog=Names;User=sa;Password=P@55w0rd;MultipleActiveResultSets=true"
  }
```

## Deployment

Never is there a scenario of deploying applications easy, right? Rolling back on failures ever a harder story and at times this is almost in itself another deployment.

Whether you are using a full CI/CD system to build your containers, command line tooling through `docker build` or Visual Studio Docker Tools; all of the dependencies are isolated to the image when deployed to the host machine from a registry, it is still that same container.

Should there be problems with a deployment, things do go wrong, rolling a deployment back a version can be as simple as changing the version number of an image from 1.1 to 1.0 and your app is reset.

## Summary

Containers provide a packaging and deployment mechanism for our application and its dependencies. The container registry is a powerful concept that helps with the deployment and distribution of our application.

Containers also improve the "inner loop" of our development experience when working locally, particularly as we trend towards building microservices over monolithic applications. They provide greater parity across local and remote environments including the cloud and help our infrastructure to become more immutable.

The vibrant ecosystem of tooling around containers also help us consume cloud-native platforms and development methodologies. Whether we are using serverless containers, a PaaS platform that supports containers, or an orchestrator like Kubernetes, we focus on our application instead of thinking about and managing the individual host or hosts we deploy it to.

## Resources

-   [Azure Container Dev Center](https://docs.microsoft.com/azure/containers/?WT.mc_id=whycontainers-blog-shboyer)
-   [Visual Studio Docker Tools](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/visual-studio-tools-for-docker?view=aspnetcore-2.1&WT.mc_id=whycontainers-blog-shboyer)
-   [Azure Container Instances](https://docs.microsoft.com/azure/container-instances/container-instances-overview?WT.mc_id=whycontainers-blog-shboyer)
-   [Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/intro-kubernetes?WT.mc_id=whycontainers-blog-shboyer)
-   [SQL Server on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-overview?view=sql-server-linux-2017&WT.mc_id=whycontainers-blog-shboyer)

[CodeProject](https://www.codeproject.com/script/Articles/BlogFeedList.aspx?amid=2961115)
