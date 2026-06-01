---
title: "Do more or less with default values in the Azure CLI"
description: "I've been spending quite a lot of time using Azure over the last many years. In fact, the portal was written in Silverlight. Now the the portal has a great modern UI and complimenting that is a CLI (command line interface) allowing for great automation, grep, awk, jamespath and much"
pubDate: "2017-04-03T21:32:35.000Z"
updatedDate: "2017-04-16T15:25:00.000Z"
heroImage: "/content/images/imported/do-more-or-less-with-default-values-in-the-azure-cli-cover.png"
tags:
  - "azure"
  - "azure-cli"
  - "azuredev"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/do-more-or-less-with-default-values-in-the-azure-cli/"
---

I've been spending quite a lot of time using Azure over the last many years. In fact, the portal was written in Silverlight. Now the the portal has a great modern UI and complimenting that is a [CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli) (command line interface) allowing for great automation, grep, awk, jamespath and much more.

> [Checkout Getting Started with Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli)

When using the CLI to create resources there are occasions, usually when putting together a project or demo, when there are parameters that _should_ be assumed or _defaulted_.

In this scenario, the following resources must be created for the application architecture.

-   Resource Group
-   AppService Plan
-   AppService Web Application
-   DocumentDB

Creating a Resource Group using the CLI is simple using the following command:

```bash
az group create --name vaderappgroup --location "East US"
```

However, each part of the architecture requires `--location` and typing that each time seems a waste of keystrokes.

Beyond creating the group, the other items also require passing the group name hence more unneeded typing.

### Azure CLI Defaults.

Looking at the `az configure -h` information, setting the defaults are key/value pairs.

```bash
$ az configure -h

Command
    az configure: Configure Azure CLI 2.0 Preview or view your configuration. The command is
    interactive, so just type `az configure` and respond to the prompts.

Arguments
    --defaults : Space separated 'name=value' pairs for common arguments defaults, e.g. '--defaults
                 group=myRG web=myweb vm=myvm'. Use '' to clear the defaults, e.g. --defaults vm=''
                 web=''.
```

Let's set the defaults for this scenario.

```bash
az configure --defaults location="East US" group="vaderappgroup" 
```

To check the defaults you have configured, run `az configure` and look at the section `[defaults]`

```defaults
[defaults]
location = East US
group = vaderappgroup
```

When creating any resource using the CLI, if the option is not specified it will use the default if available. To clear any default run `az configure --defaults <key>=''`

### Creating our scenario

Now that the default location and resource group is configured, we can create the application with a little less typing.

**Create the resource group**

_uses `--location "East US"` from defaults_

```bash
az group create -n vaderappgroup
```

**Create the app service plan**

_Uses `--location "East US"` and `--resource-group vaderappgroup` from defaults_

```bash
az appservice plan create -n vaderserviceplan --sku FREE
```

**Create web application**

_Uses `--location "East US"` and `--resource-group vaderappgroup` from defaults_

_`-p|--plan` : App Service Plan is required_

```bash
az appservice web create -n vaderwebapp -p vaderappplan
```

**Creating the DocumentDB**

_Uses `--resource-group vaderappgroup` from defaults_, location for DocumentDB defaults to region of the resource group unless specified using `--locations`. Use `az documentdb create -h` for more information.

Note: If you want to use **MongoDB** add `--kind MongoDB`.

```bash
az documentdb create -vaderappdb
```

### Resources

-   [Getting Started with Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli)
-   [Azure CLI 2.0 Command Reference](https://docs.microsoft.com/en-us/cli/azure/)

Checkout the video below on **Azure Command Line Interface with Jason Shaver**

<iframe width="560" height="315" src="https://www.youtube.com/embed/Yx3lQ9A7uh4" frameborder="0" allowfullscreen=""></iframe>ms\_meta('shboyer','Using default values inside the Azure CLI','azure-cli', 'azure');
