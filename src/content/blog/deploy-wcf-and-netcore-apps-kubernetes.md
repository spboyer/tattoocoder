---
title: "Deploying WCF and .NET Core applications to a single Kubernetes cluster"
description: "In my previous post, I showed how to take a WCF service and containerize it using Visual Studio. By doing so, this gives us the opportunity to push our heritage (aka legacy) application to the cloud either in Azure App Service using Web App for Containers, Azure Container Instances (ACI)"
pubDate: "2019-06-20T17:03:02.000Z"
updatedDate: "2019-06-20T17:04:25.000Z"
heroImage: "/content/images/imported/deploy-wcf-and-netcore-apps-kubernetes-cover.png"
tags:
  - "wcf"
  - "docker"
  - "kubernetes"
  - "azure"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/deploy-wcf-and-netcore-apps-kubernetes/"
---

In my [previous post](https://tattoocoder.com/modernizing-wcf-services-with-containers-and-visual-studio/), I showed how to take a WCF service and containerize it using Visual Studio. By doing so, this gives us the opportunity to push our heritage (aka legacy) application to the cloud either in Azure App Service using [Web App for Containers](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-windows-container), A[zure Container Instances (ACI)](https://docs.microsoft.com/en-us/azure/container-instances/?WT.mc_id=none-blog-shboyer), or in the event we need something like an orchestrator Kubernetes is available in [AKS](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli?WT.mc_id=none-blog-shboyer).

Many times we would like to use the new technology with the old. For instance, creating a .NET Core Razor Pages application or .NET Core Web API to consume the WCF application.

However, the new applications will be using Linux containers and everything must be scalable and run in a Kubernetes cluster.

Let's see how we can use AKS with the new Windows Container support to accomplish this!

## Setting up the Windows enabled AKS Cluster

![](https://cloudblogs.microsoft.com/uploads/prod/sites/37/2019/03/Kubernetes-Control-Pane-1024x409.png)

NOTE: [please read related docs](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli), there are some **[Before you begin](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli#before-you-begin)** items that are important to have set up.

-   [Install the aks-preview CLI Extension](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli#install-aks-preview-cli-extension)
-   [Register Windows preview feature](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli#register-windows-preview-feature)

### Create the cluster

A couple of notes here is you must create the cluster using the Azure Network plugin ([Azure CNI](https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking)) as well as a Windows Admin Password for any Windows Server Containers created on the cluster.

```console
GROUP="demo-aks"
CLUSTER_NAME="demo-cluster"

# user and password needed for the Windows nodes if we create a Windows node pool
PASSWORD_WIN="P@ssw0rd1234"
USER_WIN="azureuser"

az group create -l eastus -n $GROUP

#create the aks cluster
az aks create \
    --resource-group $GROUP \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --enable-addons monitoring \
    --kubernetes-version 1.14.0 \
    --generate-ssh-keys \
    --windows-admin-password $PASSWORD_WIN \
    --windows-admin-username $USER_WIN \
    --enable-vmss \
    --network-plugin azure
```

The script creates a single node and master controller, all Linux. From here we can now add the Windows node pool for the WCF Service.

```console
# create the windows node pool
az aks nodepool add \
    --resource-group $GROUP \
    --cluster-name $CLUSTER_NAME \
    --os-type Windows \
    --name npwin \
    --node-count 1 \
    --kubernetes-version 1.14.0
```

After the new Windows node pool is creates, `kubectl get nodes` shows `Ready` for deployments.

```console
NAME                                STATUS   ROLES   AGE    VERSION
aks-nodepool1-48610275-vmss000000   Ready    agent   10m    v1.14.0
aksnpwin000000                      Ready    agent   110s   v1.14.0
```

### Deploy the applications

In order for proper deployment to the Windows node pool, specify a `nodeSelector` in the spec of your chart.

```yaml
spec:
      nodeSelector:
        "beta.kubernetes.io/os": windows
```

Here is a sample of the deployment file for the **PeopleService** WCF example I'll use and have already containerized and pushed to my Azure Container Registry.

> When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. See [Authenticate with Azure Container Registry from Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-aks) documentation on how to enable.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: peoplesvc
  labels:
    app: peoplesvc
spec:
  replicas: 1
  template:
    metadata:
      name: peoplesvc
      labels:
        app: peoplesvc
    spec:
      nodeSelector:
        "beta.kubernetes.io/os": windows
      containers:
      - name: peoplesvc
        image: shayne.azurecr.io/peopleservice:latest
        ports:
          - containerPort: 80
  selector:
    matchLabels:
      app: peoplesvc
---
 apiVersion: v1
 kind: Service
 metadata:
   name: peoplesvc
 spec:
   type: ClusterIP
   externalName: peoplesvc
   ports:
   - protocol: TCP
     port: 80
   selector:
     app: peoplesvc
```

The `Service` type is set to `ClusterIP` here so only an internal IP is allocated. Next, a .NET Core Razor Pages application is deployed in a Linux container to the Linux pool.

Same is true, container pushed to ACR. Following chart is the deployment file for the web application.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: peopleweb
  labels:
    app: peopleweb
spec:
  replicas: 1
  template:
    metadata:
      name: peopleweb
      labels:
        app: peopleweb
    spec:
      nodeSelector:
        "beta.kubernetes.io/os": linux
      containers:
      - name: peopleweb
        image: shayne.azurecr.io/peoplewebapp-core:latest
        env:
        - name: "SERVICE_URL"
          value: "peoplesvc"
        ports:
          - containerPort: 80
  selector:
    matchLabels:
      app: peopleweb
---
apiVersion: v1
kind: Service
metadata:
  name: peopleweb
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
  selector:
    app: peopleweb
```

Notable points.

-   ENV variable : **SERVICE\_URL** used for the application to communicate with the WCF service. Notice that it is a DNS name.
-   Service type: **LoadBalance** allocating a public IP address for external access.

The web app to service calls via DNS is made possible via Azure virtual network enabled by Azure CNI.  
![](https://docs.microsoft.com/en-us/azure/aks/media/concepts-network/advanced-networking-diagram.png)

Deploy the applications, use the following command.

```console
kubectl apply -f people.web.yaml -f people.wcf.yaml
```

Once the deployment is complete, `kubectl get all` shows:

```console
NAME                             READY   STATUS    RESTARTS   AGE
pod/peoplesvc-7b46dfc9c5-gjwsc   1/1     Running   0          1d
pod/peopleweb-5dbfbf5578-8dqs2   1/1     Running   0          1d

NAME                 TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
service/kubernetes   ClusterIP      10.0.0.1      <none>         443/TCP        1d
service/peoplesvc    ClusterIP      10.0.41.1**   <none>         80/TCP         1d
service/peopleweb    LoadBalancer   10.0.81.1**   40.**.52.***   80:31654/TCP   1d

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/peoplesvc   1/1     1            1           1d
deployment.apps/peopleweb   1/1     1            1           1d

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/peoplesvc-7b46dfc9c5   1         1         1       1d
replicaset.apps/peopleweb-5dbfbf5578   1         1         1       1d
replicaset.apps/peopleweb-794f5b5bb8   0         0         0       1d
```

Further details are available in the Kubernetes dashboard via `az aks browse --name <clustername> --group <resource-group>`

![dashboard](/content/images/imported/deploy-wcf-and-netcore-apps-kubernetes-image-2.png)

Browsing to the site `https://ipaddress/People`

![website](/content/images/imported/deploy-wcf-and-netcore-apps-kubernetes-image-3.png)

### Summary

This is a great scenario and solution for anyone looking to use the new technologies while also having an opportunity to move ~legacy~ heritage application to the cloud and orchestration the entire architecture. Scaling, DevOps, containers and more cloud native practices are leveraged in new and old.
