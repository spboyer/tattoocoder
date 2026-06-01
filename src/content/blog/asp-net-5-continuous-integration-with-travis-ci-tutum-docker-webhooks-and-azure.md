---
title: "ASP.NET 5 : Continuous Integration with Travis-CI, Tutum, Docker, Webhooks and Azure"
description: "Getting a &quot;code to deployment&quot; workflow is a story many organizations want to have nailed down when looking into new technology stacks and architectures such as ASP.NET 5 and the container story like Docker. I hear from business leaders comments like; &quot;...that's great, but how do"
pubDate: "2015-11-02T23:24:07.000Z"
updatedDate: "2015-11-02T23:24:07.000Z"
tags:
  - "docker"
  - "aspnet5"
  - "tutum"
  - "webhooks"
  - "cicd"
  - "azure"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure/"
---

![CI image](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-0.png)

Getting a "code to deployment" workflow is a story many organizations want to have nailed down when looking into new technology stacks and architectures such as ASP.NET 5 and the container story like Docker.

I hear from business leaders comments like; "...that's great, but how do we deploy this, scale it. What does the development pipeline look like?"

Great questions.

For my own projects I wanted to be able to "just write code" and have the rest of the process handled. Not have to worry about how does it get built, deployed, scaled etc. Here is a working sample technology stack using all the cool kids on the block and some old players too.

### Setting It All Up

The initial setup is not hard, but there are some moving parts.

1.  GitHub - setup up your repository for your project with 2 branches minimally; `master` and `development` for example.
2.  Docker Toolbox - go to [docs.docker.com](http://docs.docker.com/mac/started/) and get your local environment setup by walking through the setup instructions, including establishing a Docker Hub account.
3.  Travis-CI - head over to [travis-ci.com](http://travis-ci.com) and login with your GitHub credentials. Select the repository you created for the project.
4.  [Azure](https://azure.com) - \*\*\* if you do not have an Azure account, there is a [free trial available](https://azure.microsoft.com/en-us/pricing/free-trial/)
5.  [Tutum](https://www.tutum.co/) - Create a new account here by logging in with your Docker Hub account credentials.

Lastly for the development of the application, any IDE or editor is fine; Visual Studio Code is my editor of choice lately. For project creation, the yeoman ASP.NET generator `npm install -g generator-aspnet` is what we'll use to scaffold the Web API project.

### The Developer Story

-   Visual Studio Code
-   GitHub

This is a simple ASP.NET 5 Web API application. The editor of choice is **Visual Studio Code** ([code.visualstudio.com](http://code.visualstudio.com)) on OS X and we'll use the aspnet yeoman generator to create the project. [github.com/omnisharp/generator-aspnet](https://github.com/omnisharp/generator-aspnet).

![yo aspnet](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-1.png)

```
$ cd people-service
$ dnu restore
$ code .
```

\*\*\* Edit your project.json and add the following to your `web` command in order set the entry point url. If you are getting `ERR CONNECTION REFUSED` when running your application under Docker this probably the case.

```language:js
"commands": {
    "web": "Microsoft.AspNet.Server.Kestrel --server.urls http://0.0.0.0:5000"
  },
```

> For more on creating applications with the generator see **[ASP.NET Anywhere w/ Yeoman and Omnisharp](https://msdn.microsoft.com/en-us/magazine/mt573713.aspx)** by [Shayne Boyer](https://twitter.com/spboyer) & [Sayed I. Hashimi](https://twitter.com/sayedihashimi) in MSDN Oct.

This will create the web api application and restore the dependencies from nuget. The `code .` command is a shortcut that launches VSCode in the current folder and can be found on the VSCode site.

Test the site by running the `dnx web` command from terminal and browsing to `http://localhost:5000/api/values`.

At this point the shell of the web api application is complete.

#### Docker

The yeoman generator does include a `Dockerfile` by default with the project when it is created.

```language:yaml
FROM microsoft/aspnet:1.0.0-beta8

COPY project.json /app/
WORKDIR /app
RUN ["dnu", "restore"]
COPY . /app

EXPOSE 5000
ENTRYPOINT ["dnx", "-p", "project.json", "web"]
```

The `Dockerfile` here states that it will use the base `microsoft/aspnet:1.0.0-beta8` image; which is the official image uploaded to Docker Hub by Microsoft. Then it will set `/app` as the working directory, run `dnu restore` (just as you did), and copy our application to the `/app` directory. Then the container will run the `dnx web` command and the application will be running on port 5000 using `EXPOSE 5000`.

Let's make a few changes to this file. First, change the base image to

```
FROM cloudlens/dnx:1.0.0-beta8
```

This image is courtesy of Mark Rendle [@markrendle](https://twitter.com/markrendle), it's a bit smaller but also the same base official image for node.js and Python. I like that I can use the same base regardless of the tech stack.

Next, move the last two lines `...EXPOSE` to before the `COPY` line. This will be more efficient by leveraging the build cache in Docker. Now your `Dockerfile` should look like this.

```language:yaml
FROM cloudlens/dnx:1.0.0-beta8

EXPOSE 5000
ENTRYPOINT ["dnx", "-p", "project.json", "web"]

COPY project.json /app/
WORKDIR /app
RUN ["dnu", "restore"]
COPY . /app
```

Build your Docker image using the following command. Replace the `<username>/<projectname>` with what **your** values are in Docker Hub are. For instance, for me `spboyer/people-service`

```
docker build -t <username>/<projectname> .
```

Next, you can now test your docker image on your local machine using

```
docker run -t -d -p 5000:5000 <username/projectname>
```

browse to `http://0.0.0.0:5000/api/values`

#### Travis-CI

![travis-logo](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-markdown-0.png)

Travis is a continuous integration service used to build and test projects hosted at GitHub. It looks for commits and pull requests made your repository and executes builds/test and more based on the configuration and instruction in the \`.travis.yml\` file.

![travisimg1](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-2.png)

Browse to travis-ci.org and login using your GitHub credentials and select the repository you like to enable. In this case `people-service`.

![people-svc-img](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-3.png)

For Docker integration, your Docker Hub username, password and email will need to be added to the Travis Environment variables. One important note please make sure that the **Display value in build log** is set to false.

![](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-4.png)

Next, add the `.travis.yml` file to the root of the project.

```language:yaml
language: ruby

# whitelist
branches:
  only:
    - master

services:
    #Enable docker service inside travis
    - docker

before_install:
    - docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"

script:
    #build the image
    - docker build --no-cache -t spboyer/people-service .
    #tag the build
    - docker tag spboyer/people-service:latest spboyer/people-service:v1
    #push the image to the repository
    - docker push spboyer/people-service
```

The purpose of Travis is to watch our GitHub repo for commits to the `master` branch, build - test (if we have them), then build the Docker image and push the artifact to Docker Hub. Upon a successful build you will see the following:

Travis-CI:  
![](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-5.png)  
For the complete output of the build [click here](https://travis-ci.org/spboyer/docker-people-service/builds/88693512).

Docker Hub:  
![dockerhubrepo](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-6.png)

A couple of notes here:

-   `whitelist` : only building the `master` branch
-   `services` : enable Docker with `- docker`
-   `before_install` : using the Docker credentials set in the Travis environment variables to log into Docker Hub for pushing our image upon completion
-   `- docker tag` : this command tags the image with the version, each checkin of the code to github, I'd typically up this.
-   `- docker push` : sends `:latest` and `:v*` images to `spboyer/people-service`

### Checkpoint

Here is a good time for a _phew!_ Depending on what you've worked with in the past this is a lot to swallow.

-   yeoman (`yo aspnet`)
-   yaml
-   ASP.NET 5 (dnx, dnu)
-   Travis-CI
-   GitHub

Next getting the deployment of the application/Docker image to Azure via Tutum.

#### Tutum

![tutum-logo](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-markdown-1.png)

Tutum is in a word \*\*awesome\*\*. It supports many cloud providers for deploying your Docker solutions; Azure, AWS among others. It really takes the difficulty away from trying to understand how to create the VMs, services, etc. Even know how to do what I need to in Azure, I'd strongly suggest their platform. Checkout their \*\*how\*\* for more info on \[how they work\](https://www.tutum.co/how/). \*\*\* Note: they have recently joined the Docker team as well.

I will not restate their how to as they have very excellent walk through. Here are the steps however to getting setup

1.  Link your Azure Account [https://support.tutum.co/support/solutions/articles/5000560928-link-your-microsoft-azure-account](https://support.tutum.co/support/solutions/articles/5000560928-link-your-microsoft-azure-account)
2.  Create a Node Cluster - [https://support.tutum.co/support/solutions/articles/5000523221-your-first-node](https://support.tutum.co/support/solutions/articles/5000523221-your-first-node)
3.  Create the Service - [https://support.tutum.co/support/solutions/articles/5000525024-your-first-service](https://support.tutum.co/support/solutions/articles/5000525024-your-first-service)

These are the basic steps needed to get setup and started with Tutum and Azure. Here are some additional details around what I did getting this total solution working.

First, I wanted to makes sure that I could browse to the url without specifying a port. By default, the container port is setup to be `dynamic`.  
![dynamic-port](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-7.png)

You can set this to be port `80` by clicking the `dynamic` and changing it to `80` or whichever port you like. After doing so, you will see the published port on the left of the service details screen display `80>5000/tcp`. This means that port **80** is mapping to port **5000** of the container. Now you can browse to `http://site.io` instead of `http://site.io:33678`

Finally, we want to setup a trigger so that whenever a new version of the Docker image is pushed to Docker Hub tagged with `:latest`; Tutum will have a webhook endpoint for Docker Hub to post a message to. This POST http call will trigger Tutum to pull the `spboyer/people-service:latest` image and redeploy to our Azure infrastructure.

To do this, open the **Triggers** tab inside you service detail.

![triggers](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-8.png)

Fill in the name of the trigger, choose **Redeploy** and click **Add**. A url will be provided. Copy the url and head to the Docker Hub Repository where the image is being hosted.

Select the **Webhooks** link, click Add and paste the url.

![webhooks](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-9.png)

Whenever a new image is pushed to the Docker Hub repo with the `:latest` tag, the Webhook will POST to the url causing redeploy to occur.

An example of the logs (Timeline) from Tutum for a Redeploy  
![redeploy](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-10.png)

#### Azure

![tutum-logo](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-markdown-2.png)

Other than creating the Azure account, and doing the necessary credentials sync there is not much to do in Azure. Tutum, as mentioned, does all of the work.

When the service node is created, you can log in and see the Virtual Machines being created as if you did it yourself.  
![](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-11.png)  
When the containers and images are being deployed, all of the ports are created in the Linux VM for you without you needing to know how to do so etc.  
![](/content/images/imported/asp-net-5-continuous-integration-with-travis-ci-tutum-docker-webhooks-and-azure-image-12.png)  
Give this a try! Comment, share, and reach out to me on twitter [@spboyer](http://twitter/spboyer)
