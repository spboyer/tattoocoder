---
title: "Finding your next .NET Open Source project using the command line"
description: "Many years ago I wanted to jump into a project in open source but had no idea where to start. I had worked with node.js, .NET and some other web-based technology but wasn't sure where to start and GitHub was new to me. Ironically, I fell onto Omnisharp and"
pubDate: "2018-12-10T19:26:15.000Z"
updatedDate: "2018-12-10T19:27:06.000Z"
heroImage: "/content/images/imported/finding-your-next-net-open-source-project-using-the-command-line-cover.png"
tags:
  - "dotnet"
  - "dotnet-cli"
  - "globaltools"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/finding-your-next-net-open-source-project-using-the-command-line/"
---

Many years ago I wanted to jump into a project in open source but had no idea where to start. I had worked with node.js, .NET and some other web-based technology but wasn't sure where to start and GitHub was new to me. Ironically, I fell onto Omnisharp and the .NET Core `yo aspnet` projects through my Microsoft MVP Summit meetings that year.

Flicking through Twitter, as one does, I came across an announcement from a friend Tierny ([@bitandbang](https://twitter.com/bitandbang)) where he had started a CLI tool for node.js projects called "[good-first-issue](https://github.com/bnb/good-first-issue)" to find random GitHub Issues for projects submitted to his tool.

There are a ton of open source projects asking for help on issues that have a low barrier to entry. These issues are typically tagged or labeled with **good-first-issue**, **up-for-grabs**, **helpwanted**, etc. Finding them can be hard, a good start is [https://up-for-grabs.net](https://up-for-grabs.net) .

### up-for-grabs.net

There are over 700 projects currently available [on the site](https://up-for-grabs.net). Everything from C++, Java, TypeScript, Ruby, Django, Go and more is available in the filters.

If you have a project and are looking for help get it added by submitting your own project(s) via their GitHub - [https://github.com/up-for-grabs/up-for-grabs.net](https://github.com/up-for-grabs/up-for-grabs.net). There is even a yeoman generator for getting the yaml correct - `yo up-for-grabs`.

### upforgrabs - .NET Projects

As a .NET developer, I wanted to create something like Tierny had, so I went the [global tool](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools-how-to-create) route.

Using the latest [.NET Core 2.2 SDK](http://dot.net/download), created **upforgrabs**.

**Install it now** `dotnet tool install -g upforgrabs`  
  
[https://github.com/spboyer/upforgrabs](https://github.com/spboyer/upforgrabs)

![](/content/images/imported/finding-your-next-net-open-source-project-using-the-command-line-image-0.gif)

The source of the data is, in fact, the same project list from [https://up-for-grabs.net](https://up-for-grabs.net), which is filtered specifically to .NET type projects.

### Getting the data

Each project for the site is stored in a yaml file under `up-for-grabs.net/_data/projects/`. However consuming 700 or so yaml files, filtering, etc. on every call from a console app is not very efficient.

The solution, Docker and [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-overview). Here I used a .NET Core Alpine Linux container and installed Subversion.

Why Subversion? GitHub does not have a way to get a specific folder from a repository. Using Subversion I downloaded the `/projects` folder to process all the files.

```console
# install subversion for alpine
RUN apk --no-cache add subversion
# download the data for projects
RUN svn export https://github.com/up-for-grabs/up-for-grabs.net/trunk/_data/projects data
```

Once the yaml is downloaded, using Newtonsoft.JSON, they are combined and converted to a single **project.json** file.

```csharp
var files = from file in Directory.EnumerateFiles(@"data", "*.yml", SearchOption.AllDirectories)
                  select new
                  {
                    File = file,
                    Lines = File.ReadAllText(file)
                  };

      Console.WriteLine("Processing files...");
      foreach (var f in files)
      {
        //Console.WriteLine("Processing " + f.File);
        try
        {
          var deserializer = new Deserializer();
          var content = new StringReader(f.Lines);
          var yamlObject = deserializer.Deserialize<Project>(content);

          result.Add(yamlObject);
        }
        catch (Exception ex)
        {
          errors.Add(new Error() { name = f.File, info = ex.Message, exception = ex.Source });
          continue;
        }
      }

      JsonSerializer serializer = new JsonSerializer();
      using (StreamWriter sw = new StreamWriter(outputPath))
      using (JsonWriter writer = new JsonTextWriter(sw))
      {
        serializer.Serialize(writer, result);
      }

      PostFile(outputPath).Wait();
    }
```

**PostFile()** writes the final file to an Azure CDN using the [Azure SDK](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet?tabs=linux).

> See my previous post on using an [Azure CDN and serverless](https://tattoocoder.com/use-serverless-functions-and-cdn-to-speed-up-api-data-calls/) to speed up API calls.

```csharp
private static async Task PostFile(string file)
    {
      CloudStorageAccount storageAccount;
      CloudBlobContainer cloudBlobContainer;

      string storageConnectionString = Environment.GetEnvironmentVariable("storageconnectionstring");
      if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
      {
        try
        {
          // Create the CloudBlobClient that represents the Blob storage endpoint for the storage account.
          Console.WriteLine("Checking for/creating blob container");
          CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
          cloudBlobContainer = cloudBlobClient.GetContainerReference("up-for-grabs");
          await cloudBlobContainer.CreateIfNotExistsAsync();

          // Set the permissions so the blobs are public.
          BlobContainerPermissions permissions = new BlobContainerPermissions
          {
            PublicAccess = BlobContainerPublicAccessType.Blob
          };
          await cloudBlobContainer.SetPermissionsAsync(permissions);

          Console.WriteLine("Pushing to CDN");
          CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference("projects.json");
          cloudBlockBlob.Properties.ContentType = "application/json";

          await cloudBlockBlob.UploadFromFileAsync(file);

        }
        catch (StorageException ex)
        {
          Console.WriteLine("Error returned from the service: {0}", ex.Message);
        }
        finally
        {
          Console.WriteLine("Process complete.");
        }
      }
    }
  }
```

### Keeping it Fresh w/ Azure DevOps

In order to keep the **project.json** feed up to date, I set up a scheduled build using [Azure Devops](https://docs.microsoft.com/en-us/azure/devops/pipelines/languages/dotnet-core?view=vsts&tabs=yaml) and Container Instances.

-   Runs nightly
-   Builds the container, getting the new YAML data
-   Pushes to Azure Container Registry
-   Runs the container in Container Instances, pushing the json file to the CDN
-   Destroys the Container Instance ensuring only runtime billing.

Here is the build pipeline YAML

```yaml
resources:
- repo: self
queue:
  name: Hosted Ubuntu 1604
steps:
- task: Docker@1
  displayName: 'Build Docker Image'
  inputs:
    azureSubscriptionEndpoint: 'shboyer (5ca082f3-***)'
    azureContainerRegistry: shayne.azurecr.io
    arguments: '--no-cache'
    imageName: 'up-for-grabs-feed:$(Build.BuildId)'
    includeLatestTag: true

- task: Docker@1
  displayName: 'Push to ACR'
  inputs:
    azureSubscriptionEndpoint: 'shboyer (5ca082f3-***)'
    azureContainerRegistry: shayne.azurecr.io
    command: 'Push an image'
    imageName: 'up-for-grabs-feed:$(Build.BuildId)'
```

Upon successful build, the Release Pipeline executes. This has the Start/Destroy of the ACI Container.

```console
az container create \
    --resource-group up-for-grabs \
    --name firsttimersfeed \
    --image $(acrLoginServer)/up-for-grabs-feed:$(Release.Artifacts._up-for-grabs-feed.BuildId) \
    --dns-name-label up-for-grabs-feed \
    --restart-policy OnFailure \
    --registry-login-server $(acrLoginServer) \
    --registry-username $(acrName) \
    --registry-password $(acrPassword) \
    -e 'storageconnectionstring'='$(storageconnectionstring)'
```

Cleanup of the container

```console
az container delete -n firsttimersfeed -g up-for-grabs -y
```

The repository for the "feed project" is available here - [https://github.com/spboyer/up-for-grabs-feed](https://github.com/spboyer/up-for-grabs-feed).

### Feedback

There are more than 290 .NET open source projects currently in the list. If you're looking for a new project to get into, this is an easy way to get there.

Open a command line and type `upforgrabs`.

Let me know what you think!
