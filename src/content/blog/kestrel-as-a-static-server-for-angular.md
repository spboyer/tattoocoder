---
title: "Kestrel as a Static Server for Angular"
description: "Available on github : https://github.com/spboyer/ng2-kestrel-appserver Selecting the server architecture may or may not be a pivotal point in your application design...but it maybe it should. Micro-services, SOA, 12 Factor, ZDD and all of the other buzzwords do in fact have merit, getting away from the monolith"
pubDate: "2016-04-12T03:34:36.000Z"
updatedDate: "2016-11-21T19:16:59.000Z"
heroImage: "/content/images/imported/kestrel-as-a-static-server-for-angular-cover.png"
tags:
  - "kestrel"
  - "aspnetcore"
  - "angular2"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/kestrel-as-a-static-server-for-angular/"
---

Available on github : [https://github.com/spboyer/ng2-kestrel-appserver](https://github.com/spboyer/ng2-kestrel-appserver)

Selecting the server architecture may or may not be a pivotal point in your application design...but it maybe it should.

Micro-services, SOA, 12 Factor, ZDD and all of the other buzzwords do in fact have merit, getting away from the monolith application and "putting all of you eggs in one basket" server apps are a think of the past. Right?

The core message here is "do one thing and do it well". So why would you couple your dynamic and static content into a single application?

Static content doesn't change (often), scaling needs aren't 1:1 with the web api layers. However, there are some needs that the simple use of a CDN (Content Delivery Network) like cloudfare or Akamai just won't solve.

1.  Caching
2.  Compression
3.  Deep Linking
4.  SEO
5.  Internationalization (i18n)
6.  Custom Routing

This is where using nginx or node.js w/Express fits the bill.

> What web server do you use for angular in production? [#angular](https://twitter.com/hashtag/angular?src=hash) [@angularjs](https://twitter.com/angularjs)
> 
> — Shayne Boyer (@spboyer) [April 11, 2016](https://twitter.com/spboyer/status/719667199091335170)

## nginx vs. node.js

**nginx** is a very popular server, provides capabilities beyond web server functions such as comparable features to ha-proxy. However, in the event you need to write custom modules, extend or support; C or C++ is the language of choice.

**node.js**, with Express performs very well, scales and would be hard to argue its uptake in the tech world for use in this case. Another large benefit with node.js is that it's JavaScript, offers a large and ever growing community for middleware to fit the needs mentioned above as well as any business specific module you would need to write.

## Using node.js

Using Express with node.js, a static web server is pretty simple to put together.

gist: [https://gist.github.com/spboyer/1aa7ac47bf0631a30d9eafd7b1af1186](https://gist.github.com/spboyer/1aa7ac47bf0631a30d9eafd7b1af1186)

```javascript
var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();
var staticRoot = __dirname + '/';
app.set('port', (process.env.PORT || 3000));
app.use(express.static(staticRoot));

app.use(function(req, res, next){
    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }
    fs.createReadStream(staticRoot + 'index.html').pipe(res);
});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
```

Pretty straight forward:

-   index.html is the default file
-   if the request has a '.', assume it's a file and try to serve it
-   if the request has an 'accept' header of html, xml, or json serve it.
-   otherwise assume its a route in the SPA and send it along to Angular.

This example doesn't have compression (gzip) included but we could easily add it with a middleware component.

```
var compression = require('compression');
app.use(compression())
```

A easy solution, couple lines and done. A big benefit and there are a ton of middleware components available - [http://expressjs.com/en/resources/middleware.html](http://expressjs.com/en/resources/middleware.html)

## Using Kestrel

So if node is fitting the bill, why would we want to use Kestrel? First, it's 6x faster than node.js for static / plain text operations - [https://github.com/aspnet/benchmarks#plain-text-with-http-pipelining](https://github.com/aspnet/benchmarks#plain-text-with-http-pipelining). Second, node.js is great at a number of things:

-   JavaScript on the server - good because the UI is a large front end language too allowing for re-use on both sides of the app
-   Fast I/O - asynchronous IO, optimized for throughput and concurrency.
-   Large Community - this helps for the middleware plug in parts and leveraging the ecosystem

However, application needs like database connectivity, message queue, heavy business logic/processing is not what node.js is made for and where .NET and Java comes in to serve these needs.

ASP.NET core brings the best of what node.js offers and what .NET has always been good at (heavy processing) but at lightspeed.

### kestrel static server example

_This is written using the RC2 bits, and the dotnet cli. Install the dotnet-cli & SDK from [https://github.com/dotnet/cli#installers-and-binaries](https://github.com/dotnet/cli#installers-and-binaries) ._

\*\* Startup.cs \*\*

```csharp
       public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json")
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Map the #SpaSettings section to the <see cref=SpaSettings /> class
            services.Configure<SpaSettings>(Configuration.GetSection("SpaSettings"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IOptions<SpaSettings> spaSettings)
        {
            loggerFactory.AddConsole(LogLevel.Debug);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            ConfigureRoutes(app, spaSettings.Value);
        }

        private void ConfigureRoutes(IApplicationBuilder app, SpaSettings spaSettings)
        {
            // If the route contains '.' then assume a file to be served
            // and try to serve using StaticFiles
            // if the route is spa route then let it fall through to the
            // spa index file and have it resolved by the spa application
            app.MapWhen(context => {
                var path = context.Request.Path.Value;
                return !path.Contains(".");
            },
            spa => {
                spa.Use((context, next) =>
                {
                    context.Request.Path = new PathString("/" + spaSettings.DefaultPage);
                    return next();
                });

                spa.UseStaticFiles();
            });

        }
    }
}
```

The **ConfigureRoutes()** method is handing the static routing of looking for the requested path / file.

Just like in node, ASP.NET Core is a pay for play model, meaning that if you want a feature you must add the dependency in your project.json and also add the middleware. In the following snippet, the **index.html** is served by default by using `app.UseDefaultFiles()` and static files are enabled using `app.UseStaticFiles`.

```
app.UseDefaultFiles();
app.UseStaticFiles();
```

These are available from `Microsoft.AspNetCore.StaticFiles`

The filename of the default file is being stored in the **appsettings.json** file which is loaded using the **ConfigurationBuilder.AddJsonFile()**, then added to the services collection and mapped to the class `SpaSettings`, this also makes it available in our IoC container and available throughout the application.

```javascript
{
  "Logging": {
    "IncludeScopes": false,
    "LogLevel": {
      "Default": "Verbose",
      "System": "Information",
      "Microsoft": "Information"
    }
  },
  "SpaSettings":{
      "DefaultPage" : "index.html",
      "ApplicationName" : "My First Angular 2 Application"
  }
}
```

```csharp
 services.Configure<SpaSettings>(Configuration.GetSection("SpaSettings"));
```

After installing the dotnet cli, simply run using the new dotnet commands and browse to the application on [http://localhost:5000](http://localhost:5000)

```bash
dotnet restore
dotnet run
```

The application running.  
![app](/content/images/imported/kestrel-as-a-static-server-for-angular-image-0.png)  
Console Output  
![console](/content/images/imported/kestrel-as-a-static-server-for-angular-image-1.png)

Everything is available on github : [https://github.com/spboyer/ng2-kestrel-appserver](https://github.com/spboyer/ng2-kestrel-appserver) - please help make it better contribute, comment, submit requests for features.
