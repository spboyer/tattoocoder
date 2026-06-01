---
title: "Kompose - Docker-Compose to Kubernetes with ease!"
description: "I like to use Docker compose files for a couple of reasons. First, I have spent more time that I have in my vacation balance to understand the format. Second, they are great for local development even when I only have a single container, obfuscating the environment variables into a"
pubDate: "2017-12-08T17:57:06.000Z"
updatedDate: "2017-12-08T17:57:06.000Z"
tags:
  - "kubernetes"
  - "docker"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/kompose-docker-compose-to-kubernetes-with-ease/"
---

I like to use Docker compose files for a couple of reasons. First, I have spent more time that I have in my vacation balance to understand the format. Second, they are great for local development even when I only have a single container, obfuscating the environment variables into a separate file and so on.

Since moving to more and more Kubernetes development, and getting in tune with the file spec for deployments; converting the compose files by hand have been painful at times especially with the complicated ones where there are a ton of containers, networking and environment variables.

### Kompose to the rescue!

Through a quick search and reading the docs at [kubernetes.io](http://kubernetes.io), I came across [kompose](https://github.com/kubernetes/kompose).

> kompose is a tool to help users who are familiar with docker-compose move to Kubernetes. [kompose](https://github.com/kubernetes/kompose) takes a Docker Compose file and translates it into Kubernetes resources.

Take the following docker-compose file as an example which defines a web application container and redis container:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
     - "5000:5000"
  redis:
    image: "redis:alpine"
```

Using the `kompose convert`, the following files are created.

```bash
INFO Kubernetes file "redis-service.yaml" created
INFO Kubernetes file "web-service.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
```

A deployment and service file is created for each container defined in the docker-compose.yml file.

Use the `--out|-o` option to output a single file, for example:

`kompose convert -f docker-compose-simple.yml -o simple.yml`

The output for the kubernetes format result in:

Kompose is a great tool, I use Docker compose for local development and spinning up the environments, and when I am ready to push to the K8s cluster the deployment files can be converted and then `kubectl create -f simple.yml` to publish.
