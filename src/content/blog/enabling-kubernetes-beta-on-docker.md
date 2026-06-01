---
title: "Enabling Kubernetes Beta on Docker"
description: "Still think this is one of the best things to happen this year! @Docker + #Kubernetes pic.twitter.com/Bgk6fCbruW &mdash; Shayne Boyer (@spboyer) December 19, 2017 A few days ago the beta for Kubernetes was checked off for me and I rushed to the machine to get cracking on the"
pubDate: "2017-12-20T15:15:57.000Z"
updatedDate: "2017-12-20T15:15:57.000Z"
heroImage: "https://pbs.twimg.com/media/DRb2dx0V4AAJ-VL.jpg:large"
tags:
  - "kubernetes"
  - "docker"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/enabling-kubernetes-beta-on-docker/"
---

> Still think this is one of the best things to happen this year! [@Docker](https://twitter.com/Docker?ref_src=twsrc%5Etfw) + [#Kubernetes](https://twitter.com/hashtag/Kubernetes?src=hash&ref_src=twsrc%5Etfw) [pic.twitter.com/Bgk6fCbruW](https://t.co/Bgk6fCbruW)
> 
> — Shayne Boyer (@spboyer) [December 19, 2017](https://twitter.com/spboyer/status/943212287413903360?ref_src=twsrc%5Etfw)

A few days ago the beta for Kubernetes was checked off for me and I rushed to the machine to get cracking on the new stuff.

I've already been using Kubernetes on Azure for a few projects, but being able to run the projects locally is great, especially if I'm traveling or just testing stuff and don't want to push just yet.

After enabling the K8s cluster locally, you need to set your `kubectl` to use the new cluster. I have a number of contexts set for the projects and wasn't sure what the new one set up by Docker.

Get the list of contexts using `kubectl config get-contexts`

```bash
CURRENT   NAME                                 CLUSTER                              AUTHINFO                                   NAMESPACE
          spboyer-ku-spboyer-kube-5ca082mgmt   spboyer-ku-spboyer-kube-5ca082mgmt   spboyer-ku-spboyer-kube-5ca082mgmt-admin
*         aks-spboyer                          aks-spboyer                          clusterUser_aks-spboyer_aks-spboyer
          docker-for-desktop                   docker-for-desktop-cluster           docker-for-desktop
          lilone                               lilone                               clusterUser_aks-functions_lilone
```

Notice that the new one is called **docker-for-desktop**, who knew??

Set the context using `kubectl config use-context docker-for-desktop`, and then `kubectl get nodes`

```
NAME                 STATUS    ROLES     AGE       VERSION
docker-for-desktop   Ready     master    15m       v1.8.2
```

If you want to see all of the containers that run internally to support Kubernetes locally, open preferences and check the **Show system containers** and click **Apply**.

![show internal images](/content/images/imported/enabling-kubernetes-beta-on-docker-image-0.png)

Run `docker ps -a` and there are quite a few running to make all this happen. I'd just un-check this and let the magic happen unless you _need_ to see these all the time.

Here are the images.

```bash
REPOSITORY                                               TAG                 IMAGE ID            CREATED             SIZE
kamoulox/compose-controller                              v0.1.2              6480f70f7ac6        4 weeks ago         37.9MB
gcr.io/google_containers/kube-apiserver-amd64            v1.8.2              6278a1092d08        8 weeks ago         194MB
gcr.io/google_containers/kube-controller-manager-amd64   v1.8.2              5eabb0eae58b        8 weeks ago         129MB
gcr.io/google_containers/kube-scheduler-amd64            v1.8.2              b48970f8473e        8 weeks ago         54.9MB
gcr.io/google_containers/kube-proxy-amd64                v1.8.2              88e2c85d3d02        8 weeks ago         93.1MB
gcr.io/google_containers/k8s-dns-sidecar-amd64           1.14.5              fed89e8b4248        2 months ago        41.8MB
gcr.io/google_containers/k8s-dns-kube-dns-amd64          1.14.5              512cd7425a73        2 months ago        49.4MB
gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64     1.14.5              459944ce8cc4        2 months ago        41.4MB
gcr.io/google_containers/etcd-amd64                      3.0.17              243830dae7dd        9 months ago        169MB
gcr.io/google_containers/pause-amd64                     3.0                 99e59f495ffa        19 months ago       747kB
```

Now that the config is connected locally, all set to run either the `docker` or `kubectl` commands and have Kubernetes be the orchestrator.
