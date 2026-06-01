---
title: "Azure functions - Just the CLI, hold the GUI, add some git"
description: "When sitting down to get started on a project, the start and stops of setting this and that up can be a non-starter. Sometimes, ok almost always, I just want check in code and have the build and deploy just happen. I'm a very big fan of CLI tooling. If"
pubDate: "2017-03-28T23:40:27.000Z"
updatedDate: "2017-04-11T13:04:15.000Z"
heroImage: "/content/images/imported/azure-functions-just-the-cli-hold-the-gui-add-some-git-cover.png"
tags:
  - "azure"
  - "azure-functions"
  - "azure-cli"
  - "azuredev"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/azure-functions-just-the-cli-hold-the-gui-add-some-git/"
---

When sitting down to get started on a project, the start and stops of setting this and that up can be a non-starter. Sometimes, ok almost always, I just want check in code and have the build and deploy just happen.

I'm a very big fan of CLI tooling. If I can fire up a bash prompt and get started, you've won me over. The .NET Core team continues to improve the command line tooling experience for all platforms with `dotnet new` and if you're pushing your apps to the cloud; the Azure 2.0 CLI is on point for getting stuff done.

> **Azure CLI** - _The Azure CLI 2.0 is Azure's new command line experience for managing Azure resources. It runs on Windows, macOS and Linux. [Get the installer for your OS here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)._

Using the portal is good way to get a visual understanding of the architecture or composure of Azure and setting up your first serverless function.

See - [Create your first Azure Function - docs.microsoft.com](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)

For repetitive instances, you may want to use ARM template deployments to speed up these infrastructure deployments to get started on your future serverless projects.

## ARM template

The following ARM template defines an infrastructure for a Storage Account, Hosting Plan, and Azure Function setup with Continuous Integration tied to a GitHub repo. These are the minimum components for a CI/CD based serverless function in Azure.

_The hosting plan in the template is set to be the "[Consumption Plan](https://azure.microsoft.com/en-us/pricing/details/functions/)" by default._

**azuredeploy.json**

Using the Azure CLI we can use this template to create a deployment and parameters in the way of a file or command line arguments to create the infrastructure ready for development.

### Log in

```bash
az login
```

### Create Resource Group

A Resource Group is a logical grouping of resources in Azure. Best practice is to create/name this resource in a manner that is related to your application. This also allows for ease of locating resources and cleaning up (if you're testing a lot).

The command requires a name and location.

```bash
az group create --name "spboyerappgroup" --location "East US"
```

### Parameters

The ARM template (azuredeploy.json see above lines 4-40) defines the following parameters:

-   appName
-   location
-   storageAccountName
-   storageAccountType
-   repoURL
-   branch

Create a new file called **parameters.json** with the contents.

```javascript
 {
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "appName": {
          "value": "spboyerappname"
      },
      "storageAccountName": {
          "value": "spboyerstorage"
      },
      "storageAccountType": {
          "value": "Standard_LRS"
      },
      "repoURL": {
          "value": "https://github.com/spboyer/azdev-superhero-api"
      },
      "branch": {
          "value": "master"
      },
      "location": {
          "value": "East US"
      }
   }
 }
```

_One important note is **storageAccountName** is limited to 3-24 characters, letters and numbers only_.

## Deploying the template

Use the CLI to deploy the template using a combination of the following options.

-   inline parameters `--parameters {}`
-   local parameters file `--parameters @<filename>`, the `@` is required notating the parameters are a file.
-   external template `--template-uri <uri>`
-   local template `--template-file <filename>`

### Deployment using file

```bash
az group deployment create --name MyDeployment --resource-group MyResourceGroup --template-file azuredeploy.json --parameters @parameters.json
```

### Deployment using remote template and local parameters file

```bash
az group deployment create --name MyDeployment --resource-group MyResourceGroup --template-uri https://raw.githubusercontent.com/spboyer/azdev-functions-deployment/master/azuredeploy.json --parameters @parameters.json
```

### Deployment using command-line parameters

```bash
az group deployment create --name MyDeployment --resource-group spboyergroup --template-file azuredeploy.json \
     --parameters '{"appName":{"value":"spboyerappname"},"storageAccountName":{"value":"spboyerstorage"},"storageAccountType":{"value":"Standard_LRS"},"repoURL":{"value":"https://github.com/spboyer/azdev-superhero-api"},"branch":{"value":"master"},"location":{"value":"East US"}}'
```

## Resources

-   GitHub Project - [https://github.com/spboyer/azdev-functions-deployment](https://github.com/spboyer/azdev-functions-deployment)
-   [Free Azure Account](https://azure.microsoft.com/free/)
-   [Try Azure Functions Playground](https://azure.microsoft.com/try/app-service/functions/) - no sign up
