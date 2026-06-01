---
title: "Introducing metaparticle.io - making Kubernetes and Docker idiomatic for developers"
description: "What if you could just add a package to your code? Like npm for node or nuget for .NET, run your app and have it in a container on a Kubernetes cluster? No command line tools like kubectl, helm, docker or whatever we are currently using to create our containerized"
pubDate: "2017-12-08T00:39:59.000Z"
updatedDate: "2017-12-08T00:43:56.000Z"
tags:
  - "kubernetes"
  - "docker"
  - "dotnet"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/introduction-metaparticle-io-making-kubernetes-and-docker-idiomatic-for-developers/"
---

What if you could just add a package to your code? Like npm for node or nuget for .NET, run your app and have it in a container on a Kubernetes cluster?

No command line tools like `kubectl`, `helm`, `docker` or whatever we are currently using to create our containerized apps today. Not these are bad, but it should be easier or native to how we are currently writing our apps.

### Metaparticle.io

Metaparticle ([metaparticale.io](https://metaparticle.io)) is a new tool, in progress, announced at KubeCon from [Brendan Burns](https://twitter.com/brendandburns) and it's goal is to do just that, make it easier for devs to containerized their applications by just writing code.

### JavaScript example

See full tutorial: [https://metaparticle.io/tutorials/javascript/](https://metaparticle.io/tutorials/javascript/)

package.json

```javascript
{
   "engines" : {
      "node" : ">=0.10"
   },
   "preferGlobal" : true,
   "license" : "MIT",
   "name" : "metaparticle-javascript",
   "dependencies" : {
      "@metaparticle/package": "^0.2.0" 
   },
   "version" : "0.0.1",
   "scripts" : {
      "start" : "node ./index.js"
   }
}
```

index.js

```javascript
const http = require('http');
const os = require('os');
const mp = require('@metaparticle/package');

const port = 8080;

const server = http.createServer((request, response) => {
	console.log(request.url);
	response.end(`Hello World: hostname: ${os.hostname()}\n`);
});

mp.containerize(
	{
		ports: [8080],
		repository: 'docker.io/spboyer',
		publish: true,
		public: true
	},
	() => {
		server.listen(port, (err) => {
			if (err) {
				return console.log('server startup error: ', err);
			}
			console.log(`server up on ${port}`);
		});
	}
);
```

The important content here is `mp.containerize` where the ports, Docker Hub repo user and setting it to public. To compare this to a Dockerfile run command, think of `docker build -t docker.io/spboyer/metaparticle-javascript` (image name pulls from name in package.json) and `docker run -p 8080:8080`.

Running the application is the same as you would normally. `npm start`

![metaparticle building image](/content/images/imported/introduction-metaparticle-io-making-kubernetes-and-docker-idiomatic-for-developers-image-0.gif)

The metaparticle package does the "docker work" building the image and launching the application in the container. You can see this by running the Docker commands to see the image and the running container.

`docker images`

```bash
REPOSITORY                        TAG                 IMAGE ID            SIZE
spboyer/metaparticle-javascript   latest              d20394bed137        55.2MB
```

`docker ps -a`

```bash
CONTAINER ID        IMAGE                             COMMAND                  CREATED             STATUS             PORTS                    NAMES
025b0bfe4670        spboyer/metaparticle-javascript   "/bin/sh -c 'npm -..."   5 minutes ago       Up 5 minutes        0.0.0.0:8080->8080/tcp   metaparticle-javascript
```

Ctrl-C stops the running app and container and you can do to inner development loop.

Pushing to production is just as easy if you have a running Kubernetes cluster. Just add the following information to the `mp.containerize` method and run the application and it will push it to the running cluster.

```javascript
mp.containerize(
	{
		ports: [8080],
		replicas: 4,
		runner: 'metaparticle',
		repository: 'docker.io/spboyer',
		publish: true,
		public: true
	},
```

from there you can see the running info using the Kubernetes commands `kubectl get pods` to see the deployment.

### What about .NET?

It's there too! Here is a **Program.cs** from a web application. The 2 nuget packages you want to use here are:

```bash
dotnet add package Metaparticle.Package --version="0.1.2-beta"
dotnet add package Metaparticle.Runtime --version="0.1.0-beta"
```

```cs
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using static Metaparticle.Package.Driver;

namespace web
{
    public class Program
    {
        const int port = 8080;
        [Metaparticle.Runtime.Config(Ports = new int[] {port})]
        [Metaparticle.Package.Config(Repository = "docker.io/spboyer/metaparticle-dotnet",
                                     Publish = true,
                                     Verbose = true)]
        public static void Main(string[] args) => Containerize(args, () =>
       	{
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
				.UseKestrel(options => { options.Listen(IPAddress.Any, port); })
                .Build()
                .Run();
    	});
    }
}
```

Start the containerized app using `dotnet run` and it does the same function as the node app. Downloading the needed Docker base images, publishes a "self contained" Debian runtime image and starts the application in the container.

### Notes

This is still in progress, open source, needs feedback! Go to metaparticle.io and help build this for your community and language!
