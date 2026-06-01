---
title: "Exploring multi-stage Docker builds for Angular apps"
description: "Figuring out the best way to build and deploy any application regardless of the tech stack can be a sprint all in itself. So many questions to answer: What CI/CD pipeline do you use? Can't we just use the CLI? What about right-click-publish? Git Deploy? npm, yarn ? Docker, Kubernetes,"
pubDate: "2017-08-29T15:07:46.000Z"
updatedDate: "2017-08-29T15:16:22.000Z"
heroImage: "/content/images/imported/exploring-multistage-docker-builds-for-angular-apps-cover.png"
tags:
  - "docker"
  - "angular"
  - "azuredev"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/exploring-multistage-docker-builds-for-angular-apps/"
---

Figuring out the best way to build and deploy any application regardless of the tech stack can be a sprint all in itself. So many questions to answer:

-   What CI/CD pipeline do you use?
-   Can't we just use the CLI?
-   What about right-click-publish?
-   Git Deploy?
-   npm, yarn ?
-   Docker, Kubernetes, Swarm, Containers...oh my!?!?!

Yes or "it depends" is always the answer to these questions depending on the development shop you're working in.

Docker, in version 1.17, introduced the concept of multi-stage builds which in short allows you to (in a single docker file) create images and utilize the output from one into the next to produce a final image and reduce the need for build scripts etc. See more in the docs -> [https://docs.docker.com/engine/userguide/eng-image/multistage-build/#use-multi-stage-builds](https://docs.docker.com/engine/userguide/eng-image/multistage-build/#use-multi-stage-builds) .

### How does this apply to Angular?

The prescribed way of, or at least one way, building an Angular app is using the CLI ([http://cli.angular.io](http://cli.angular.io)).

```bash
ng build --prod
```

This command produces the `/dist` folder which contains the packaged app via webpack which can then be deployed to a server. However, there are some essential needs missing. Deep linking is one of them, so we need to add something like expressjs to the mix with some minor configuration to handle a link to something other than root. i.e. [http://mysite/about](http://mysite/about). An alternative would be something like nginx configuration as well, but for simplicity sake, expressjs will do.

Here is a simple "Hello World" Angular application generated using the CLI.

```bash
ng new dockermulti
```

```bash
.
├── README.md
├── e2e
├── karma.conf.js
├── node_modules
├── package.json
├── protractor.conf.js
├── src
   ├── app
   ├── assets
   ├── environments
   ├── favicon.ico
   ├── index.html
   ├── main.ts
   ├── polyfills.ts
   ├── styles.css
   ├── test.ts
   ├── tsconfig.app.json
   ├── tsconfig.spec.json
   └── typings.d.ts
├── tsconfig.json
└── tslint.json
```

I'll add in the `server` folder which contains the expressjs components **package.json, index.js**.

#### Dockerfile

The goal of the Dockerfile is:

-   Use the CLI to produce the output of our application
-   Create the needed components for the express server to serve the app
-   Combine the outputs and create the final image for pushing to our cloud provider

The first step is to either define the CLI image or use one that already exists. In this case, I have a repository on Docker Hub [http://hub.docker.com/r/spboyer/angular-cli](http://hub.docker.com/r/spboyer/angular-cli) which can be used for the base image.

![base cli images](/content/images/imported/exploring-multistage-docker-builds-for-angular-apps-image-0.png)

Notice that there are a few tag options here `latest, 1.3.2, 1.3.2-yarn` depending on the version and package manager needed/wanted for your application. In this example, we will use `1.3.2` (latest).

```bash
#APP ========================================
FROM spboyer/angular-cli:1.3.2 as builder

WORKDIR /app
COPY package.json /app
RUN npm install

COPY . /app

RUN ng build --prod
```

Next, the expressjs server image is defined.

```bash
#SERVER =======================================
FROM node:6-alpine as server
WORKDIR /app
COPY /src/server /app
RUN npm install
```

Last, the final image is defined taking the output from the **builder** and **server** to create a container which can be tagged and pushed to Docker Hub or a private registry like Azure Container Registry.

```bash
#FINAL ========================================
FROM node:6-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=server /app /usr/src/app
COPY --from=builder /app/dist /usr/src/app
ENV PORT 80

CMD [ "node", "index.js" ]
```

#### Build and run the image

Build the Docker image with the command `docker build -t dockermulti .`

To run the application image use `docker run` and map the internal port 80 to a local port.

```bash
docker run -d -p 3001:80 dockermulti
```

Browse to [http://localhost:3001](http://localhost:3001)

_Push your image to Docker Hub using `docker push`_

```bash
docker tag dockermulti <dockerhub_user>/dockermulti

docker login

docker push <dockerhub_user>/dockermulti
```

### Bonus, Push to Azure!

There are 2 quick and easy ways to push a Docker image to Azure. Using [Azure Container Instances](https://docs.microsoft.com/azure/container-instances/) or [App Service on Linux](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-linux-cli).

**Pre-Requisites**

-   Azure subscription - [sign up free here](https://azure.microsoft.com/free).
-   Docker Image on Docker Hub or private registry
-   Azure CLI - [installation instructions](https://docs.microsoft.com/cli/azure/install-azure-cli)

#### Azure Container Instances

First, create a resource group to logically group your items in Azure. Name the group something that is relative to your app and set the location. i.e `eastus` or `westus`. Locations for each service can be found [here](https://azure.microsoft.com/regions/services/).

```bash
az group create --name <resourceGroup> --location eastus
```

Next, create the container instance setting the name of the container, the image to use, resource group (just created) and IP address to **public**

```bash
az container create --name mycontainername --image <dockerhub_username>/dockermulti -g myResourceGroup --ip-address public
```

Running the command `az container list -o table` provides an easy to read output of the status and provisioning state and IP Address. The two columns to pay attention to here are `Provisioning State` and `IP:Ports`.

```bash
Name             ResourceGroup    ProvisioningState    Image                                     IP:ports          
---------------  ---------------  -------------------  ----------------------------------------  ----------------  
dockermulti      dockermulti      Succeeded            spboyer/dockermulti                       13.91.43.101:80   
```

Once the `Provisioning State` is **Succeeded** browse to http://[IP:ports](IP:ports) to see the application.

#### Azure App Service on Linux

Running a container on App Service gives you more control such as auto updating the containers using CI/CD from Docker Hub or Azure Container Registry, Scaling, and Logging.

First create an App Service Plan for Linux.

```bash
az appservice plan create -n <myPlanName> -g <MyResourceGroup> --islinux -l "southcentralus" --sku S1 --number-of-workers 1
```

Create the web application host for the Docker container giving it a name (`-n`), the plan name (`-p` just created), resource group (`-g`) and the docker image (`-i`).

```bash
az webapp create -n <appName> -g <resourceGroup> -p <planName> -i <dockerhub_username>/dockermulti
```

Browse your application, once created, with `az webapp browse -n <appName> -g <resourceGroup>`

Enjoy!
