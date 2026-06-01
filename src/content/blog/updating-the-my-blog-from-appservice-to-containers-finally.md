---
title: "Updating the my blog from AppService to Containers...finally"
description: "I have been running the well known ghost blogging platform on Azure AppService since ghost was version 0.10, about 8 years. In fact, it was before Azure had resource groups. This means that it's Node on Windows Servers and I'm doing a bit of maintenance for upgrading the version"
pubDate: "2020-01-17T18:53:34.000Z"
updatedDate: "2020-01-18T03:36:31.000Z"
heroImage: "https://images.unsplash.com/photo-1455487890814-f11ab4eaec4b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
tags:
  - "azure"
  - "docker"
  - "ghost"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/updating-the-my-blog-from-appservice-to-containers-finally/"
---

I have been running the well known [ghost blogging platform](https://ghost.org) on [Azure AppService](https://docs.microsoft.com/azure/app-service/?WT.mc_id=-blog-shboyer) since ghost was version 0.10, about 8 years. In fact, it was before Azure had resource groups.

This means that it's Node on Windows Servers and I'm doing a bit of maintenance for upgrading the version of the platform. Running things like gulp.js scripts for builds and so and hoping for [Kudu](https://github.com/projectkudu/kudu/wiki) to do my git deployment after a couple of tries because I am running on a small box and there are limitations for networking and npm and start scripts to complete in enough time.

After a few successful upgrades, it became overwhelmingly painful to try and make the updates and life, work, etc. got in the way and now ghost is on version 3.2 and I am far too behind to try and do a manual update. So the jump to containers makes sense.

* * *

> The data conversion was a little more work as I had to install ghost 1.0, import my data > export it and then import to 3.0.

# Choosing the setup

I am using the latest **ghost:3.2-alpine** image available on Docker Hub.  

`$ docker run -d -p 3001:2368 ghost:3.2-alpine`

It uses SQLite by default as the backend, but also offers MySQL which I'll use as an option through MySQL on Azure.

## Analytics

I have been using Google Analytics for the past 12 years on my blog and want to continue with this solution. However, if you're starting a new solution, [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview?WT.mc_id=-blog-shboyer) is a quick click option when creating your AppService instance.

Create a new Dockerfile and add [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview?WT.mc_id=-blog-shboyer) in this manner:

```
FROM ghost:3.2-alpine

# Add app-insights globally
RUN npm install -g applicationinsights

# Link app insights to avoid rebuild/validate projects npm package tree
RUN cd current && npm link applicationinsights 

# ENV APPINSIGHTS_INSTRUMENTATIONKEY xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
RUN sed  -i.bak -e "/var startTime = Date.now(),/a appInsights = require('applicationinsights'), " \
                -e "/ghost, express, common, urlService, parentApp;/a appInsights.setup().start();" current/index.js
```

> You'll need to build your own Dockerfile and host it in a repository. i.e. Azure Container Registry, Docker Hub, GitHub etc.

This adds the npm package for [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview?WT.mc_id=-blog-shboyer) and adds the script to the **index,js** files of the application. Be sure to add your **APPINSIGHTS\_INSTRUMENTATIONKEY** environment variable to your App Service Configuration.

## Azure Web App for Containers

As I mentioned, the previous version was hosted in Azure App Service on Windows (Node 10 + Windows). Now we are moving to Linux (Alpine) on [Web App for Containers](https://docs.microsoft.com/en-us/azure/app-service/containers/).

[Creating the app service](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-cli?WT.mc_id=-blog-shboyer) was really simple. A single command line got the job started for me.  (ok maybe 2, need a service plan too)

```
# Created my S1 service plan
az appservice plan create -n spboyerblog20 -g spboyer --is-linux - "East US" --sku S1 --number-of-workers 1

# Create the app service with the alpine 3.2 ghost image
az webapp create -n spboyer -g spboyer -p spboyerblog20 -i ghost:3.2-alpine
```

### MySQL

  
I have setup the database backend using [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/?WT.mc_id=-blog-shboyer) selecting bare minimums and an auto growth option - Basic, 1 vCore(s), 10 GB.

The data connections are set as ENV variables in my application settings.

![](/content/images/imported/updating-the-my-blog-from-appservice-to-containers-finally-image-0.png)

_Database settings for MySQL_

Using a service for my data takes care of the potential data loss should the container fail. However, there are files like my **themes and images** that I want to make sure I don't lose if the container decides to restart or when I put in a customer container and CI/CD.  Enter -> [Azure Storage](https://docs.microsoft.com/azure/storage/?WT.mc_id=-blog-shboyer) and [Path mappings in Web App for Containers](https://docs.microsoft.com/azure/app-service/containers/how-to-serve-content-from-azure-storage?WT.mc_id=-blog-shboyer)!

I created a File Share in my storage account called **contentfiles,** where I can upload/update this content as well as interact with it using any SDK or even an Azure Function.

![](/content/images/imported/updating-the-my-blog-from-appservice-to-containers-finally-image-1.png)

Next, to map the path to the container set it in the **Path mappings** section of my configuration.

![](/content/images/imported/updating-the-my-blog-from-appservice-to-containers-finally-image-2.png)

_Path Mappings_

> Be sure to set the ENV in configuration    
> **paths\_\_contentPath** to **/var/lib/ghost/content\_files**

This can also be done using the Azure CLI, however I found it easier using the GUI for this task.

`az webapp config storage-account add -g <resource-group> --custom-id Content-name [Storage Account Name] --share-name contentfiles --access-key [Storage Account Key] mount-path /var/lib/ghost/content_files`

## Other configuration settings

-   NODE\_ENV : production
-   url : <appname>.azurewebsites.net OR your custom domain (cause links to break)
-   WEBSITES\_PORT : 2368 (internal port for ghost) - this my be a regression for auto detecting port used by containers.
-   PORT : 2368  (internal port for ghost) - this my be a regression for auto detecting port used by containers. _not a duplicate_

## Additional Notable changes

I run Cloudflare for DNS and caching, so there were some changes I needed to make for my custom domains. The DNS changes took about 30 seconds to make the A, CNAME and TXT updates. Either it's much easier or I know what I'm doing.

Caching was purged, pushed a button and SSL - done, comes free with Cloudflare.

* * *

After all that, very happy. Was great and Azure was super easy to get setup on containers and now I am positioned for CI/CD on GitHub Actions or Azure DevOps or whatever I want. Bring on the updates!
