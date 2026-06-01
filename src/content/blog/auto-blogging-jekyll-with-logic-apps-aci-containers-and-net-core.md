---
title: "Auto blogging Jekyll with Logic Apps, ACI Containers and .NET Core"
description: "All related links: https://www.theurlist.com/autobloggerpost Jekyll is a very popular way to host a static site on GitHub and posting new content is a simple as creating a markdown file and then committing it to the relative repo. GitHub takes care of the rest. See the help"
pubDate: "2019-05-16T21:51:51.000Z"
updatedDate: "2019-05-16T21:51:51.000Z"
tags:
  - "docker"
  - "azure"
  - "containers"
  - "dotnetcore"
  - "logicapps"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core/"
---

All related links: [https://www.theurlist.com/autobloggerpost](https://www.theurlist.com/autobloggerpost)

Jekyll is a very popular way to host a static site on GitHub and posting new content is a simple as creating a markdown file and then committing it to the relative repo. GitHub takes care of the rest.

> See the help pages at GitHub -> [Setting up your GitHub Pages site locally with Jekyll](https://help.github.com/en/articles/setting-up-your-github-pages-site-locally-with-jekyll)

This seemed like a great way for me to get started on a blog for some content that was being stored in a CMS. The view we are interested in is updated once a week and is accessible via [.NET Standard](https://docs.microsoft.com/en-us/dotnet/standard/net-standard) API.

There are a few options for making this happen. I could write a console application and execute it once a week to produce the file, then run through the `git` commands myself. Why would I do that?

#### What are we doing

Every Monday a new post must be created for the blog. instead of running the process manually using

```console
dotnet run myapp
git add newfile.md
git commit -m 'add new file'
git push
```

I wanted to completely automate the process. Using Docker, [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/), and [Azure Container Instances (ACI)](https://docs.microsoft.com/en-us/azure/container-instances/); managing the when to "start, stop and clean up" was pretty easy. However, there isn't a full GitHub connector in Logic Apps for performing the commands in git. So, I added `git` to my container and a **startup.sh** script to get this done.

-   [Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/) kicks off the process every Monday at 10:30 AM
-   [ACI Container Image](https://docs.microsoft.com/en-us/azure/container-instances/) runs [.NET Core](https://dot.net) Application
    -   Clones repo
    -   Calls CMS API for new data
    -   Produces new Markdown file
    -   Git commit, add, push
-   Logic App removes ACI Container
-   GitHub CI/CD runs to update the blog with new content
-   Logic App emails me
    -   Email contains logs for the container (git output)
    -   Asks for approval to Tweet announcement of new content
-   Logic App send new Tweet

#### Details, how was it done?

We will use the following components to build our Jekyll "autoblogger".

**Docker container**

Let's start with the container. It looks like an atypical [.NET Core](https://dot.net) 2.2 image with the exception that `git-core` is installed in the final image.

```docker
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 as build-env
WORKDIR /app

COPY autoblog/*.csproj ./
RUN dotnet restore

COPY ./autoblog ./
RUN dotnet publish -c Release -o out

# FINAL IMAGE
FROM mcr.microsoft.com/dotnet/core/runtime:2.2
WORKDIR /app
COPY --from=build-env /app/out .

# install git
RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git-core

COPY ./autoblog/startup.sh .
RUN chmod 777 startup.sh
ENTRYPOINT ["/bin/bash", "./startup.sh"]
```

The `startup.sh` file is where the _magic_ happens. When the container starts, we first configure git to use the deployment key stored as an environment variable ($token), clone the source repo into our working directory and re-init the repo (might be a bug only works if we do this).

Last, set the git user/email for any commits and then start the .NET Core console app.

```console
# ensure the git deploy token is used for commits
git config --global url."https://$token:@github.com/".insteadOf "https://github.com/"

# clone the source repository
git clone $source /app/$dir

# bug? must re-init the repo
# set the git user/email for commits
cd /app/$dir && \
  git init && \
  git config --global user.email "$email" && \
  git config --global user.name "$user"

# run the process for creating new entry
dotnet /app/autoblog.dll
```

All of the ENV variables are set when the ACI container is started using the Logic App

**.NET Core Application**

The console application running inside of the container which creates the formatted markdown page, git commits and pushes to the repo.

Here is the `Main()` paraphrased code.

```csharp
 static async Task Main(string[] args)
 {

   var root = $"/app/{Environment.GetEnvironmentVariable("dir")}";

   if (!Directory.Exists(root))
   {
     Directory.CreateDirectory(root);
   }

   var output = new System.Text.StringBuilder();
   output.AppendLine(Bash($"git -C {root} pull"));

   await GetContentRepositoryItemsAsync();

   var creator = new Creator.Post(ContentItems);
   try
   {
      var fileContents = await creator.Create();
      await File.WriteAllTextAsync(creator.FileName, fileContents);
   }
    catch (Exception ex)
   {
    Console.WriteLine(ex.ToString());
    throw ex;
   }

   output.AppendLine(Bash($"git add ."));
   output.AppendLine(Bash($"git commit -m '{creator.FileName} added'"));
   output.AppendLine(Bash("git push"));

   Console.WriteLine(output.ToString());
 }
```

The `Creator` class produces the file and once complete, we execute the git commands to push the newly created file the repo.

**Azure Logic App**

[Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/) enables the creation of powerful business workflows by integrating connectors for various services into a single graphical interface. With the connector for Azure Container Instances, you can run containerized applications as part of your Logic Apps workflow.

> [Azure Container Instances (ACI)](https://docs.microsoft.com/azure/container-instances/) is the easiest way to run containers in Azure. We can use it to run containers without worrying about provisioning infrastructure and we only pay for resources that are used.

In this case, we need to run the process every Monday at a set time to start the container process.

![logic app overview](/content/images/imported/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core-image-0.png)

The container image is built and stored in my private Azure Container Registry and is easily configured in the "Create container group" connector.

![logic app image1](/content/images/imported/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core-image-1.png)

The needed ENVIRONMENT variables can be configured here as well. Another option is to use the [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) Connector to share and secure secret keys across apps.

![logic app image ENV](/content/images/imported/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core-image-2.png)

Next, a variable `complete` is set to hold the status of the container. The `Until` task will run _until_ the state of the container is **Succeeded** and `complete` is **true**. If false, we add a `Delay` task of 10 seconds.

![logic app image condition](/content/images/imported/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core-image-3.png)

If the container group returns **Succeeded**, the logs are retrieved, the container group is cleaned up and an email approval is sent for the tweet.

![logic app true](/content/images/imported/auto-blogging-jekyll-with-logic-apps-aci-containers-and-net-core-image-4.png)

### Wrapping up

[Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/) is a fun productive way to build process flows and in this case, I was able to produce content using a code, containers and approval process without having any manual steps.
