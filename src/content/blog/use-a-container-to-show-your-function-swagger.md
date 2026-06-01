---
title: "Use a container to show your function swagger"
description: "One option for enabling the Swagger-UI capabilities is to direct the consumers of the api to http://petstore.swagger.io and have them put the url in the box at the top of the page. That's professional right? :-/ Alternatively, you can add the url of the service to the"
pubDate: "2017-04-17T20:17:14.000Z"
updatedDate: "2017-04-17T20:17:14.000Z"
heroImage: "/content/images/imported/use-a-container-to-show-your-function-swagger-cover.png"
tags:
  - "azure"
  - "azuredev"
  - "azure-functions"
  - "swagger"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/use-a-container-to-show-your-function-swagger/"
---

One option for enabling the Swagger-UI capabilities is to direct the consumers of the api to [http://petstore.swagger.io](https://petstore.swagger.io) and have them put the url in the box at the top of the page. That's professional right? :-/ Alternatively, you can add the url of the service to the end with `?url=` such as `http://petstore.swagger.io?url=https://yoursite.azurewebsites.net/docs/swagger.json`, but again probably not the best option.

Here we can take advantage of Docker here and use the swaggerapi/swagger-ui Docker image and set some ENV variables within an Azure AppService Web Application and accomplish our own SwaggerUI.

## Creating a new AppService (Linux)

Here we will use the Azure CLI to create our App Service instance for the Docker run Swagger UI.

```bash
#Login to Azure
az login

# Create a Resource Group
az group create --name myswaggergroup --location 'West US'

# Create an App Service Plan
az appservice plan create --name myswaggerplan --resource-group myswaggergroup --location 'West US' --is-linux --sku S1

# Create a Web App
az appservice web create --name swaggeruiApp --plan myswaggerplan --resource-group myswaggergroup
```

## Setting the Docker Image and ENV Variables

The following command sets the environment variable for the Docker image to point the UI to the swagger definition for our application instead of the default PetStore API.

```bash
az appservice web config appsettings update -g myswaggergroup -n swaggeruiApp --settings API_URL="http://myappname.azurewebsites.net/docs/swagger.json"
```

## Set the Docker Image

```bash
# Configure Web App with a Custom Docker Container from Docker Hub
az appservice web config container update --docker-custom-image-name 'swaggerapi/swagger-ui' --name 'swaggeruiApp' --resource-group 'swaggeruiApp'
```

_You will need to take the url of the new web application and add it to the allowable addresses in the CORS settings for your Azure Functions._

### Bonus

As an exercise, I took my implementation a little further and did a custom UI for the Swagger UI site. Check out the GitHub repo here [https://github.com/spboyer/azdev-superheroapi-docs](https://github.com/spboyer/azdev-superheroapi-docs).

**A default introduction page**  
![Superhero API Image](/content/images/imported/use-a-container-to-show-your-function-swagger-image-0.png)

**The custom Swagger UI which is functional hitting the Azure Function**  
![Superhero API Image](/content/images/imported/use-a-container-to-show-your-function-swagger-image-1.png)

## Resources

-   [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
-   [Try Azure Functions](https://functions.azure.com/try)
-   [Testing Azure Functions w/ Postman and Swagger](https://tattoocoder.com/testing-azure-functions-with-postman-and-swagger/)
-   [Unmasking your swagger w/ proxies in Azure Functions](https://tattoocoder.com/unmasking-your-swagger-with-proxies-in-azure-functions/)

ms\_meta('shboyer','Use a container to show your function swagger','NA', 'azure,functions,app-service,app-service-web,websites,multiple');
