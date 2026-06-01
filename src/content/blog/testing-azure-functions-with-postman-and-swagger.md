---
title: "Testing Azure Functions with Postman and Swagger"
description: "A new feature (preview) in Azure Functions is API Definition. This feature allows you to use the OpenAPI specification (aka Swagger) to document the functionality of your functions and/or endpoints. Checkout John Papa &amp; I talk about using Swagger for ASP.NET Core on Pluralsight in Play by Play"
pubDate: "2017-03-31T04:09:29.000Z"
updatedDate: "2017-04-11T13:03:59.000Z"
heroImage: "/content/images/imported/testing-azure-functions-with-postman-and-swagger-cover.png"
tags:
  - "azure"
  - "azure-functions"
  - "swagger"
  - "azuredev"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/testing-azure-functions-with-postman-and-swagger/"
---

A new feature (preview) in Azure Functions is API Definition. This feature allows you to use the OpenAPI specification (aka Swagger) to document the functionality of your functions and/or endpoints.

![](/content/images/imported/testing-azure-functions-with-postman-and-swagger-image-0.png)

> Checkout John Papa & I talk about using Swagger for ASP.NET Core on Pluralsight in [Play by Play - Understanding API Functionality Through Swagger](http://spboyer.me/aspnetcore-swagger)

The [documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-api-definition?WT.mc_id=blog-spboyer) and a walkthrough of [Creating OpenAPI 2.0 (Swagger) Metadata for a Function App (Preview)](https://docs.microsoft.com/en-us/azure/azure-functions/functions-api-definition-getting-started?WT.mc_id=blog-spboyer) are available on [docs.microsoft.com](https://docs.microsoft.com/en-us/azure/azure-functions/functions-api-definition-getting-started?WT.mc_id=blog-spboyer).

### Testing your function

After you have your api defined, copy the endpoint in the **API Definition URL** box to use to import into Postman.

![](/content/images/imported/testing-azure-functions-with-postman-and-swagger-image-1.png)

Open [Postman](https://www.getpostman.com/), click the Import button.

![](/content/images/imported/testing-azure-functions-with-postman-and-swagger-image-2.png)

Select Import from Link and paste your definition endpoint.

![](/content/images/imported/testing-azure-functions-with-postman-and-swagger-image-3.png)

Postman reads the imported definition file and creates an entry in the collections panel.

![](/content/images/imported/testing-azure-functions-with-postman-and-swagger-image-4.png)

In the image above, the `/hero` endpoint with the `summary` "**Get Hero Name**" was created from the Swagger definition snippet:

```javascript
    "paths": {
        "/hero": {
            "get": {
                "summary": "Get Hero Name",
                "description": "Generates a Super Hero name for a person's First and Last Name.\n",
                "parameters": [
                    {
                        "name": "first",
                        "in": "query",
                        "description": "First Name",
                        "required": true,
                        "type": "string",
                        "format": "string"
                    },
                    {
                        "name": "last",
                        "in": "query",
                        "description": "Last Name.",
                        "required": true,
                        "type": "string",
                        "format": "string"
                    }
                ],
```

Postman also auto recognizes when creating a new tab for a test, the METHOD is a GET as noted above in the snippet and the url contains the {first} and {last} query parameters as defined.

I will be exploring more of the API Definition feature in Azure Functions as it continues to evolve. Be sure to submit any feedback on [GitHub for Azure-Functions](https://github.com/Azure/Azure-Functions) because it is open source.

Checkout [John Papa](https://twitter.com/john_papa)'s post on [Configuring Azure Functions: Intellisense via JSON Schemas](https://johnpapa.net/configuring-azure-functions-intellisense-via-json-schemas/).

>  ·  [Azure Docs](https://docs.microsoft.com/azure/)  ·  [Free Azure Account](https://azure.microsoft.com/free/)  ·   
> [Try Azure Functions Playground](https://azure.microsoft.com/try/app-service/functions/)
