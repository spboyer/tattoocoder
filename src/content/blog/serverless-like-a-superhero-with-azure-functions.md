---
title: "Serverless like a Superhero with Azure Functions"
description: "In my most recent Pluralsight course, I spent some time talking about using Swashbuckle to create documentation for ASP.NET Core WebAPI applications. Swashbuckle is the .NET Core implementation of the OpenAPI Specification aka Swagger, but there are many other open source tools too for other languages. The demo project"
pubDate: "2017-04-17T20:26:03.000Z"
updatedDate: "2017-04-17T20:26:03.000Z"
heroImage: "/content/images/imported/serverless-like-a-superhero-with-azure-functions-cover.jpg"
tags:
  - "azure"
  - "azuredev"
  - "swagger"
  - "docker"
  - "azure-functions"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/serverless-like-a-superhero-with-azure-functions/"
---

In my most [recent Pluralsight course](http://spboyer.me/aspnetcore-swagger), I spent some time talking about using [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to create documentation for ASP.NET Core WebAPI applications. [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) is the .NET Core implementation of the OpenAPI Specification aka [Swagger](https://swagger.io), but there are many other open source tools too for other languages.

The demo project built was a simple "traditional" ASP.NET Core API that generated a "Superhero Name" based on a FirstName and LastName passed to the GET method.

### The old API architecture

The architecture would not surprise anyone who has seen an MVC structure for ASP.NET Web API projects, except the .NET Core portions. Controllers, Views, Startup.cs, etc., published to an Azure AppService running on IIS.

If this were a node.js application, you'd see something like app.js, package.json (with express or restify dependencies) and maybe a few other JavaScript files to support the API application deployed to nginx or Apache.

Nevertheless, a typical server-side API application needing all of the atypical ceremony of code, server, deployment etc.

### Moving to Azure Functions

Looking at converting the .NET Core API to an Azure Function and keeping the functionality of code function, OpenAPI Specification support, GitHub deployment are all checked off in the features. Let's give this a try.

#### Code

The GET method was pretty simplistic, receive a first and last name and return a "Person" object. Not much to convert, all of the logic exists in another class for the Superhero name generation and Person class; so we can include those files with no change.

```csharp
#load "../shared/person.csx"
#load "../shared/heroGenerator.csx"

using System.Net;

public static HttpResponseMessage Run(HttpRequestMessage req, TraceWriter log)
{

    string first = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "first", true) == 0)
        .Value;

    string last = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "last", true) == 0)
        .Value;

    if (first == null || last == null)
    {
        return req.CreateResponse(HttpStatusCode.BadRequest, "First and/or Last name argument is missing.");
    } else {

        Person p = new Person(first, last);

        return req.CreateResponse(HttpStatusCode.OK, p, "application/json");
    }
}
```

The function type is an HttpTrigger which accepts a generic HttpRequest. In this case, we are expecting a `first` and `last` querystring value which then gets passed into the `Person` class to do the work. The `Person` class creates the object and subsequently uses the `HeroGenerator` class to create the SuperHero name and the function returns the object just as we'd expect.

To reference other files add `#load "../shared/person.csx"` to the top of the **.csx** and the code is accessible just as any C# class would be.

#### Serializing the Person class

The `Person` class when returned from the original Web API architecture benefits from the default JsonSerialization so the properties are camelCase when returned but PascalCase when used in the API.

To accomplish the same in the function we can add the `JsonPropertyAttribute` to the properties and include Json.NET via `#r "Newtonsoft.Json"` at the top of the file.

> Newtonsoft.Json is one of the [included assemblies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-csharp#referencing-external-assemblies) in Azure Functions; to use any of the included add the reference using `#r <assembly_name>` and then add the using statment `using Newtonsoft.Json`.

```csharp
#r "Newtonsoft.Json"

#load "heroGenerator.csx"

using Newtonsoft.Json;

public class Person
{
    public Person(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
        _heroName = GetHeroName(firstName, lastName);
    }

    [JsonProperty(PropertyName = "firstName" )]
    public string FirstName { get; set; }

    [JsonProperty(PropertyName = "lastName" )]
    public string LastName { get; set; }

    private string _heroName;

    [JsonProperty(PropertyName= "heroName" )]
    public string HeroName { get { return _heroName;} }
}
```

Adding the `JsonProperty` attribute handles the serialization when the `Person` object is returned to the calling application; the format and casing are as expected.

```javascript
{
  "firstName": "Shayne",
  "lastName": "Boyer",
  "heroName": "Green Knight"
}
```

At this point, the basic functionality of the API has been converted over to an [Azure Function](https://azure.microsoft.com/en-us/services/functions/). We can us curl, Postman, Fiddler or browser to test the endpoint.

The original application exposed the OpenAPI (Swagger) specification and a UI test harness.

### OpenAPI Specification and Swagger UI

See my post [Testing Azure Functions with Postman and Swagger](https://tattoocoder.com/testing-azure-functions-with-postman-and-swagger/) on how to get your swagger.json file setup for your function.

Once the API Specification is defined, you are provided a url for exposing the definition for consumption, but the url format is long, contains a hash or public key and isn't really human readable. To create a "nice" url we can take advantage of the Proxies feature in Azure Functions, by establishing a new endpoint `/docs/swagger.json` that directs the request to the unfriendly url. See my post on [Unmasking your swagger with proxies in Azure Functions](https://tattoocoder.com/unmasking-your-swagger-with-proxies-in-azure-functions/) for more.

> See how you can leverage [Azure Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/) for [consuming the spec](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-custom-hosted-api).

#### Using Docker for what Docker was meant for...

One option for re-enabling the Swagger-UI capabilities was to direct the consumers of the api to [http://petstore.swagger.io](https://petstore.swagger.io) and have them put the url in the box at the top of the page. That's professional right? :-/ Alternatively, you can add the url of the service to the end with `?url=` such as: `http://petstore.swagger.io?url=https://yoursite.azurewebsites.net/docs/swagger.json`, but again probably not the best option.

Luckily we can take advantage of Docker here and use the swaggerapi/swagger-ui Docker image and set some ENV variables within an Azure AppService Web Application and accomplish our own SwaggerUI.

For the full walkthrough on setting the Docker container and AppService see: [Use a container to show your function swagger](https://tattoocoder.com/use-a-container-to-show-your-function-swagger/)

### Wrapping up

Here we've converted an ASP.NET Web API application to an Azure Function and retained to capabilities of Swagger-UI testing. The benefits of the function are the cost model is a pay-per-execution model and auto-scaling on the API.

There are many options for creating services, I love Web API and what it offers but looking into Azure Functions knowing it too can offer these nano-service capabilities with scaling and not lose things like OpenAPI and Swagger UI is a big benefit.

### Resources

-   [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
-   [Try Azure Functions](https://functions.azure.com/try)
-   [Testing Azure Functions w/ Postman and Swagger](https://tattoocoder.com/testing-azure-functions-with-postman-and-swagger/)
-   [Unmasking your swagger w/ proxies in Azure Functions](https://tattoocoder.com/unmasking-your-swagger-with-proxies-in-azure-functions/)
-   Custom Swagger API using Docker on App Service - [https://github.com/spboyer/azdev-superheroapi-docs](https://github.com/spboyer/azdev-superheroapi-docs)

ms\_meta('shboyer','Converting ASP.NET Core Web API to an Azure Function and retaining functionality.','dotnet', 'azure,functions,app-service,app-service-web,websites,multiple');
