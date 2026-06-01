---
title: "Use serverless functions and CDN to speed up API data calls"
description: "ASP.NET Core 2.1 added some great features for making external API calls easier to manage when there are network failures, or the service itself might be down. Scott Hanselman has a great series of posts where he has updated to take advantage of these features. Announcement on HttpClientFactory"
pubDate: "2018-07-05T21:56:54.000Z"
updatedDate: "2018-07-05T22:22:31.000Z"
heroImage: "/content/images/imported/use-serverless-functions-and-cdn-to-speed-up-api-data-calls-cover.png"
tags:
  - "serverless"
  - "cdn"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/use-serverless-functions-and-cdn-to-speed-up-api-data-calls/"
---

ASP.NET Core 2.1 added some great features for making external API calls easier to manage when there are network failures, or the service itself might be down. Scott Hanselman [has a great series of posts](https://www.hanselman.com/blog/HttpClientFactoryForTypedHttpClientInstancesInASPNETCore21.aspx) where he has updated to take advantage of these features.

-   [Announcement on HttpClientFactory](https://blogs.msdn.microsoft.com/webdev/2018/02/28/asp-net-core-2-1-preview1-introducing-httpclient-factory/?WT.mc_id=none-twitter-shboyer) and [documentation at docs.microsoft.com](https://docs.microsoft.com/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1&WT.mc_id=none-blog-shboyer)
-   [Download .NET Core 2.1](https://www.microsoft.com/net/download?WT.mc_id=none-twitter-shboyer)

Using [Polly](https://github.com/App-vNext/Polly) we can set up a retry policy, stating a number of retries to attempt and at what interval.

```csharp
services.AddHttpClient<MyClient>().
    AddTransientHttpErrorPolicy(policyBuilder => policyBuilder.CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 2,
            durationOfBreak: TimeSpan.FromMinutes(1)
    ));
```

As I was reading through the [docs](https://docs.microsoft.com/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1&WT.mc_id=none-blog-shboyer) and making the changes to the ASP.NET Core workshop, it struck me to push this work to the cloud.

In our workshop app; when the page is requested, the server sends another request to the API to get the session data for example. Even though this is an async request, the application front end is still essentially waiting for the data to render the view.

Other problems we may have to handle:

-   Is the API running or available
-   Caching, do we need to hit this data again or on every request
-   Latency, is the service or network slow

HttpClientFactory and Polly, in combination, account for most or all of these situations (except for caching).

I'd rather hit a reliable endpoint for the data just as I do for bootstrap.

### Using a CDN

We already trust CDNs (Content Distribution Network) for many of our web resources. Frontend assets like css, javascript, fonts and of course images are very common to pull from. They have servers all over the world that are close to users and they can serve a web site's static content from servers close to users. So why not put your data there too, as long as it doesn't change that often.

I created a [CDN in Azure](https://docs.microsoft.com/azure/cdn?WT.mc_id=none-blog-shboyer) in under 5 minutes for storing my images, here is the video of how to get that done.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jYb5YLNY8nk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>

A couple settings for ensuring the caching is unique for the data the app is pulling. For my app I set the CDN to cache every unique URL.

![cache settings](/content/images/imported/use-serverless-functions-and-cdn-to-speed-up-api-data-calls-image-0.png)

See more [about caching and how it works](https://docs.microsoft.com/azure/cdn/cdn-how-caching-works?WT.mc_id=none-blog-shboyer). Another advantage is [Azure CDN also supports HTTP/2](https://docs.microsoft.com/azure/cdn/cdn-http2?WT.mc_id=none-blog-shboyer) by default with nothing to configure, this is another advantage for free.

Now that our CDN and settings are complete, we need to get the data there.

### Using serverless Azure Functions to get and upload the data

I decided to use an [Azure Timer Function](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-scheduled-function?WT.mc_id=none-blog-shboyer) and set it to run every 2 minutes.

> In this example, I am using .NET Core and targeting the [Azure Functions V2 Runtime](https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=none-blog-shboyer).

-   `CloudBlockBlob` - the output stream
-   `[Blob("images/sessions.json", FileAccess.Write)]` - binding for our storage account which is also where the CDN is set to point to. `images` is the **folder** or **container**.

```csharp
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Workshop.Function
{
  public static class cdn_cache_thing
  {
    private static HttpClient client = new HttpClient { BaseAddress = new Uri("https://aspnetcorews-backend.azurewebsites.net") };

    [FunctionName("cdn-cache-thing")]
    public static async Task Run(
        [TimerTrigger("0 */2 * * * *")]TimerInfo myTimer,
        [Blob("images/sessions.json", FileAccess.Write)] CloudBlockBlob sessionFile,
        TraceWriter log)
    {
      using (var response = await client.GetAsync("/api/Sessions"))
      {
        var responseStream = await response.Content.ReadAsStreamAsync();
        sessionFile.Properties.ContentType = "application/json";
        await sessionFile.UploadFromStreamAsync(responseStream);
      }
    }
  }
}

```

In a **local.settings.json** file, a connection string to our storage is set. In the portal, this connection is stored in the Application Settings.

```javascript
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=shboyer...
```

Every 2 minutes the event fires and the file is created in the storage container. Using [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/?WT.mc_id=none-blog-shboyer), I can see the details of the file.

![Storage Explorer](/content/images/imported/use-serverless-functions-and-cdn-to-speed-up-api-data-calls-image-1.png)

Using the CDN endpoint in the browser to get the data. It's **50ms** on the first GET, **~7ms** on each additional **GET**.

![CDN Browser View](/content/images/imported/use-serverless-functions-and-cdn-to-speed-up-api-data-calls-image-2.png)

-   [Download Storage Explorer](https://azure.microsoft.com/features/storage-explorer/?WT.mc_id=none-blog-shboyer) to browse your assets.

### Thoughts?

This is a pattern that I've used in the past, with console apps, to push data to the edge and lighten the work on my backend servers.

I can control the cache, handle errors, deal with changes in any downstream services if the APIs change all while keeping my front end apps fast.
