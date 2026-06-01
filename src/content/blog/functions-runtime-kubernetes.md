---
title: "Running the Azure Functions runtime in containers on Kubernetes and more"
description: "The Azure Functions team has been doing some great work lately and as a part of that work the runtime for the runtime of the serverless function was ported to .NET Core 2.0 in late September. This set the stage really for cross-platform development and running of Azure Functions"
pubDate: "2017-12-05T20:55:32.000Z"
updatedDate: "2017-12-10T17:28:06.000Z"
tags:
  - "azure"
  - "kubernetes"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/functions-runtime-kubernetes/"
---

The Azure Functions team has been doing some great work lately and as a part of that work the runtime for [the runtime of the serverless function was ported to .NET Core 2.0 in late September](https://blogs.msdn.microsoft.com/appserviceteam/2017/09/25/develop-azure-functions-on-any-platform/).

This set the stage really for cross-platform development and running of Azure Functions and in November; [Azure Functions on Linux was announced for Preview](https://blogs.msdn.microsoft.com/appserviceteam/2017/11/15/functions-on-linux-preview/).

What does it all mean? There is a serverless framework for Azure that we can run in a container on Linux (and maybe a Raspberry PI??) and deploy to Kubernetes on the managed host in Azure...[AKS (Azure Kubernetes Service)](https://docs.microsoft.com/en-us/azure/aks/).

### Requirements

-   [Docker](http://docker.com)
-   [.NET Core 2.0](http://dot.net)
-   The latest [azure-functions-core-tools](https://github.com/azure/azure-functions-cli) `npm install -g azure-functions-core-tools@core`

The sample code for the app is available on github: [https://github.com/spboyer/az-funky-linux](https://github.com/spboyer/az-funky-linux)

### Create the app

Create the directory for the app and `cd` into it, then use the functions cli to initialize the project with the base Docker file.

```bash
func init --docker
```

Add a new HttpTrigger function, called "echo", using JavaScript as the language.

```bash
func new -n echo -t HttpTrigger -l JavaScript
```

Replace the code in **/echo/index.js** with the following:

```javascript
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const os = require("os");
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Hello from " + os.hostname() + " [" + os.platform() + ", " + os.arch() + "]"
    }
    context.done();
};
```

Open the function.json and update the `authLevel` value to **anonymous** instead of **function**.

```javascript
{
   "authLevel": "anonymous",
   "type": "httpTrigger",
   "direction": "in",
   "name": "req"
},
```

Run the application locally using the cli.

```bash
func start
```

Browse to [http://localhost:7071/api/echo](http://localhost:7071/api/echo)

## Putting it in a container

The Dockerfile was added to the project initially and is very basic, using a base image _microsoft/azure-functions-runtime:v2.0.0-beta1_, establishing the home directory and copying the code there.

```docker
FROM microsoft/azure-functions-runtime:v2.0.0-beta1
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
COPY . /home/site/wwwroot
```

Create the image for the project

```bash
docker build -t funkylinux .
```

Run the image and map port 80 to a local port.

```bash
docker run -p 3001:80 funkylinux
```

Browse to the same endpoints on the new url - [http://localhost:3001/api/echo](http://localhost:3001/api/echo)

## Publishing our app

Having a container image gives you many options for deployments:

#### Azure Kubernetes Service ([more](https://docs.microsoft.com/en-us/azure/aks/))

```bash
# Create the cluster
az aks create -g aks-funky -n funkylinux --node-count 1 --generate-ssh-keys

# Get the credentials for kubectl
az aks get-credentials -g myResourceGroup -n funkylinux

# Run the application on the cluster
kubectl run funkylinux --image=spboyer/funkylinux --port=80

# Expose the deployment to the internet
kubectl expose deployment funkylinux --port=80 --type=LoadBalancer

# Watch the services to see the public IP allocate
kubectl get svc -w
```

```bash
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
funkylinux   LoadBalancer   10.0.148.126   52.168.66.109   80:30448/TCP   4h
kubernetes   ClusterIP      10.0.0.1       <none>          443/TCP        4h
```

Scale the app manually

```bash
kubectl  scale --replicas=5 deployment/funkylinux
```

or use the Kubernetes auto scaling

```bash
kubectl autoscale deployment funkylinux --cpu-percent=75 --min=1 --max=10
```

#### Azure App Service on Linux ([more](https://docs.microsoft.com/en-us/azure/app-service/app-service-cli-samples))

```bash
# Create a Web App
az webapp create --name funkylinux --plan AppServiceLinuxDockerPlan -g myResourceGroup

# Configure Web App with our image
az webapp config container set --docker-custom-image-name spboyer/az-funky --name funkylinux -g myResourceGroup
```

#### Azure Container Instances ([more](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart))

```bash
az container create --name mycontainer --image funkylinux -g myResourceGroup --ip-address public --ports 80
```

## Summary

This is an opportunity to run the functions runtime where you want and still have the hooks into the Azure products like CosmosDB, Queues, TableStorage and external webhooks like Github is pretty awesome.

Let me know your thoughts.
