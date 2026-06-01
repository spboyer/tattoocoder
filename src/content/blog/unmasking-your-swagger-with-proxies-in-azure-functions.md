---
title: "Unmasking your swagger with proxies in Azure Functions"
description: "In my post Testing Azure Functions with Postman and Swagger I showed how to use the API Specification capabilities in Azure Functions and then take the endpoint url and test the API using Postman. Notice the url that is provided for the API. It isn't human readable, nor something I"
pubDate: "2017-04-17T16:28:05.000Z"
updatedDate: "2017-04-17T16:28:05.000Z"
heroImage: "/content/images/imported/unmasking-your-swagger-with-proxies-in-azure-functions-cover.png"
tags:
  - "azure"
  - "azuredev"
  - "azure-functions"
  - "swagger"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/unmasking-your-swagger-with-proxies-in-azure-functions/"
---

In my post [Testing Azure Functions with Postman and Swagger](https://tattoocoder.com/testing-azure-functions-with-postman-and-swagger/) I showed how to use the API Specification capabilities in Azure Functions and then take the endpoint url and test the API using Postman.

Notice the url that is provided for the API. It isn't human readable, nor something I could rattle off to another developer over the phone or easy re-type.

![api url](/content/images/imported/unmasking-your-swagger-with-proxies-in-azure-functions-image-0.png)

#### Creating a proxy

A feature in Azure Function is [proxies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies). Using this feature we can establish a new proxy for our function to point a "nice" url to the "no-so-friendly" API Definition.

![proxy-swagger](/content/images/imported/unmasking-your-swagger-with-proxies-in-azure-functions-image-1.png)

Now you can share the shorter more reasonable url, even use the test Swagger UI at [http://petstore.swagger.io](https://petstore.swagger.io). _Be sure to add **[http://petstore.swagger.io](https://petstore.swagger.io)** to your CORS settings first._

ms\_meta('shboyer','Unmasking your swagger with proxies in Azure Functions','NA', 'azure,functions,azure-portal');
