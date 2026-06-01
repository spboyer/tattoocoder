---
title: "Push your images to Azure CDN on publish with gulp"
description: "Performance is always at the top of my mind when developing a web app. Using tools such as WebPageTest where a common hit against your grade will be the lack of CDN use will affect performance. Use of CDN - Each request for a piece of content to the web"
pubDate: "2017-07-14T18:41:39.000Z"
updatedDate: "2017-07-14T18:42:14.000Z"
tags:
  - "azuredev"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/push-your-images-to-azure-cdn-on-publish-with-gulp/"
---

Performance is always at the top of my mind when developing a web app. Using tools such as [WebPageTest](https://www.webpagetest.org/) where a common hit against your grade will be the lack of CDN use will affect performance.

> **Use of CDN** -  
> Each request for a piece of content to the web server has to travel from the user's browser all the way to the server and back. As you get further and further from the server this can become a significant amount of time (which adds up quickly as there are more requests on the page). Ultimately the time it takes is limited by the speed of light so there's not much you can do except to move your server closer to the users. That is exactly what a Content Distribution Network (CDN) does. They have servers all over the world that are close to users and they can serve a web site's static content from servers close to users. The only case where it doesn't make sense to use a CDN is if all of the users for a web site are close to the web server already (like for a community web site). ref: [webpagetest.org/docs/using-webpagetest/quick-start-quide](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/quick-start-quide#TOC-Use-of-CDN)

## Setting up a CDN on Azure

It literally takes about five minutes to get setup. Check out the walkthrough here.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jYb5YLNY8nk" frameborder="0" allowfullscreen=""></iframe>

## An example app

Code available on github - [https://github.com/spboyer/pagescdn](https://github.com/spboyer/pagescdn)

In this example, I am using ASP.NET Core Razor Pages. You can create the app using Visual Studio 2017 or at the command line on any OS using:

```bash
$ dotnet new razor
```

By default, the code includes the [bundling configuration](https://docs.microsoft.com/en-us/aspnet/core/client-side/bundling-and-minification) (`bundleconfig.json`) which defines the input and output parameters for the applications JavaScript and CSS assets. Following, the [docs we'll add a gulp.js file](https://docs.microsoft.com/en-us/aspnet/core/client-side/bundling-and-minification#consuming-bundleconfigjson-from-gulp) and add the needed code for changing over to a gulp process for bundling and minification as well as adding the npm packages for pushing the images to the CDN.

### gulp task

Pushing the images to the Azure CDN is accomplished through a gulp task.

```javascript
var azure = require('gulp-azure-storage');

gulp.task("pushimages", function() {
    return gulp.src("wwwroot/images/**")
      .pipe(azure.upload({
          account:    process.env.ACCOUNT_NAME,
          key:        process.env.ACCOUNT_KEY,
          container:  process.env.CONTAINER_NAME
      }));
  });
```

The `gulp-azure-storage` npm package requires three parameters:

-   ACCOUNT\_NAME : This is the name of the Storage Account in Azure
-   ACCOUNT\_KEY : The Access Key for the Storage Account.
-   CONTAINER\_NAME : The name of the Container within the Storage Account i.e. "images"

Notice the script accesses the values from `process.env.*`, in my case the values are set via script locally prior to running. _I have a \_development.sh and \_production.sh file allowing for testing each environment_

```bash
#!/bin/bash
ASPNETCORE_ENVIRONMENT="Development"
ACCOUNT_NAME="my-account-name"
ACCOUNT_KEY="really-long-key-value"
CONTAINER_NAME="images"

echo "ASP.NET Environment:" $ASPNETCORE_ENVIRONMENT
echo "Storage Account: " $ACCOUNT_NAME
echo "Account Key: " $ACCOUNT_KEY
echo "Container Name: " $CONTAINER_NAME
```

For CI/CD processes like VSTS or Travis etc.; set these ENV variables where appropriate in the build scripts.

## CDN Image

A custom TagHelper for CDN based Images is used to get the image from the CDN and has a Fallback Image Source if the image is not available.

The TagHelper inherits from the ImageTagHelper and uses the `asp-append-version` attribute for cache busting to ensure the most up to date version of the image is available.

The CDNImage TagHelper is pretty straightforward. It sets the **src** and appends the **version** querystring if the boolean is set.

```csharp
if (AppendVersion)
      {
        EnsureFileVersionProvider();

        Src = output.Attributes[SrcAttributeName].Value as string;

        // Check if the CDN Base URI is set and add to the src attribute
        if (!string.IsNullOrWhiteSpace(CdnUri))
        {
          output.Attributes.SetAttribute(SrcAttributeName, string.Format("{0}{1}", CdnUri, _fileVersionProvider.AddFileVersionToPath(Src)));
        }
      }
```

For error handling, using JavaScript to set the **src** if there is a 404 on the original requested image.

```csharp
//Retrieve any existing onerror handler code
      var onError = output.Attributes[OnErrorAttributeName]?.Value as string;

      //Check if there's a fallback source and no onerror handler
      if (!string.IsNullOrWhiteSpace(FallbackSrc) && string.IsNullOrWhiteSpace(onError))
      {
        string resolvedUrl;
        if (TryResolveUrl(FallbackSrc, out resolvedUrl))
        {
          FallbackSrc = resolvedUrl;
        }

        if (AppendVersion)
        {
          FallbackSrc = _fileVersionProvider.AddFileVersionToPath(FallbackSrc);
        }

        //Apply fallback handler code
        onError = $"this.src='{FallbackSrc}';console.log('{Src} NOT FOUND.')";
        output.Attributes.SetAttribute(OnErrorAttributeName, onError);
      }
```

**HTML Source**

```html
<img src="/images/captamerica.jpg"
    asp-cdn-uri="https://shboyer2.azureedge.net"
    asp-append-version="true" alt="Captain America"
    asp-fallback-src="~/images/deadpool.jpg"
/>
```

**HTML Rendered**

```html
<img
  src="https://shboyer2.azureedge.net/images/captamerica.jpg?v=yY-cpsYC7lzzUnWEx7riu6MHWngzWa90Z1x6JzsM_hM"
  alt="Captain America"
  onerror="this.src='/images/deadpool.jpg?v=nMTfG6JvY--KrkqZP7mEuXOz8EpkcYZALf2-QGN5yeU';console.log('/images/captamerica.jpg?v=yY-cpsYC7lzzUnWEx7riu6MHWngzWa90Z1x6JzsM_hM NOT FOUND.')"
>
```

Rendered image from the CDN.

![](/content/images/imported/push-your-images-to-azure-cdn-on-publish-with-gulp-image-0.png)

When the image is not found the **asp-fallback-src** image is set as the **src** and a message is written to the console. The message could easily be written to a logging provider as well.

![](/content/images/imported/push-your-images-to-azure-cdn-on-publish-with-gulp-image-1.png)

## Wrapping Up

The pushing of the assets is done via JavaScript! This means it is not limited to ASP.NET Core. Use in Angular, React, Vue or whatever makes you happy.
