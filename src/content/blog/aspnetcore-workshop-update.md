---
title: "Workshop gets an update - JavaScript Services, Docker, Kubernetes and Helm!"
description: "If you've been to a conference around .NET in the last year or so, there's likely been workshop available from the .NET team. Jeff Fritz, Jon Galloway, Maria Naggaga, Damian Edwards and/or Daniel Roth and I have all presented in part some of the ConferencePlanner app. The workshop contains"
pubDate: "2018-02-01T21:15:00.000Z"
updatedDate: "2018-02-01T21:18:03.000Z"
heroImage: "/content/images/imported/aspnetcore-workshop-update-cover.png"
tags:
  - "aspnetcore"
  - "docker"
  - "kubernetes"
  - "angular"
  - "helm"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/aspnetcore-workshop-update/"
---

If you've been to a conference around .NET in the last year or so, there's likely been [workshop](https://github.com/dotnet-presentations/aspnetcore-app-workshop) available from the .NET team. [Jeff Fritz](https://twitter.com/csharpfritz), [Jon Galloway](https://twitter.com/jongalloway), [Maria Naggaga](https://twitter.com/ladynaggaga), [Damian Edwards](https://twitter.com/damianedwards) and/or [Daniel Roth](https://twitter.com/danroth27) and [I](https://twitter.com/spboyer) have all presented in part some of the [ConferencePlanner](https://github.com/dotnet-presentations/aspnetcore-app-workshop) app.

![app diagram](https://camo.githubusercontent.com/637172f94ad7137f1602e154da165fdb30a626a8/68747470733a2f2f7261776769742e636f6d2f6a6f6e67616c6c6f7761792f6173706e6574636f72652d6170702d776f726b73686f702f6d61737465722f646f63732f6172636869746563747572652d6469616772616d2e737667)

The workshop contains building an application from scratch in .NET Core using Razor Pages, Entity Framework, Web API.

I spent some time over the last week updating the workshop to add options for using the updated JavaScriptServices and Deployment options with Docker, Kubernetes, and Helm.

### Adding JavaScript Services

[Adding Angular SPA using JavaScript Services](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/8.%20SPA%20FrontEnd.md)

Some great improvements have been made to the [JavaScript Services for using Angular](http://cda.ms/84) and [React](http://cda.ms/85), integrating each frameworks' CLI directly within the templates for the `dotnet new` commands.

## Deployment Options

Visual Studio offers great support for deploying ASP.NET applications through the **publish** dialog; Azure App Service, Local File System and/or you have the option of Git integration. Container development and deployment options have been added to the workshop as well.

### Docker

[Publish using Docker](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/6.%20Deployment.md#publishing-using-docker)

**Prerequisites**

-   [Docker for Windows](https://www.docker.com/docker-windows) or [Docker for Mac](https://www.docker.com/docker-mac)
-   [Visual Studio Tools for Docker with ASP.NET Core](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/visual-studio-tools-for-docker)

In this option, the application is separated into three parts

-   Frontend : Razor Pages application
-   Backend : Web API
-   SQL Server Container on Linux

### Kubernetes

**Prerequisites**

-   Kubernetes cluster : See [Getting Started with AKS on Azure](http://cda.ms/83)

Publish using Kubernetes deployment file - [workshop.yaml](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/save-points/6-Deployment-docker/ConferencePlanner/kubernetes/workshop.yaml)

In the [/save-points/6-Deployment-docker/ConferencePlanner/kubernetes/](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/save-points/6-Deployment-docker/ConferencePlanner/kubernetes/workshop.yaml) folder is the **workshop.yaml** deployment file which allows for deployment of the ASP.NET application stack (not SPA Frontend) to a Kubernetes cluster.

```bash
kubectl deploy -f workshop.yaml
```

### Helm Chart

**Prerequisites**

-   Kubernetes cluster : See [Getting Started with AKS on Azure](http://cda.ms/83)
-   Helm : [Installing Helm](https://docs.helm.sh/using_helm/#installing-helm)

[Publish using Helm Chart](https://github.com/dotnet-presentations/aspnetcore-app-workshop/blob/master/docs/6.%20Deployment.md#helm-chart) - [helm folder](https://github.com/dotnet-presentations/aspnetcore-app-workshop/tree/master/save-points/6-Deployment-docker/ConferencePlanner/helm)

[Helm](http://helm.sh) is a package manager for Kubernetes and chart is a collection of files that describe a related set of Kubernetes resources. See more on [Helm charts in the docs](https://docs.helm.sh/developing_charts/#charts).

The templates define the resource for the service or deployment and the values.yaml file is used to fill in the template.

**templates/frontend-service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ template "fullname" . }}-{{ .Values.frontend.name }}
  labels:
    app: {{ template "name" . }}
    chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
    release: {{ .Release.Name }}
    heritage: {{ .Release.Service }}
spec:
  ports:
    - port: {{ .Values.frontend.externalPort }}
      targetPort: {{ .Values.frontend.internalPort }}
      protocol: TCP
      name: {{ .Values.frontend.name }}
  selector:
    app: {{ template "name" . }}
    release: {{ .Release.Name }}
status:
  loadBalancer: {}
```

**values.yaml (subset)**

```yaml
frontend:
  replicaCount: 1
  name: frontend
  internalPort: 80
  externalPort: 80
  image: frontend
  tag: latest
  environment: Production
  pullPolicy: IfNotPresent
  restart: Always
```

Running the `install` command for `helm` fills in the templates using the values.yaml file and deploys the application to the Kubernetes cluster configured in your .kubeconfig

```bash
 helm install --debug ./workshop
```

If you want to see the output, use the `--dry-run` option.
