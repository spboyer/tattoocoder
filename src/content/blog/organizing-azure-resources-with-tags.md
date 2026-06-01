---
title: "Organizing Azure resources with Tags"
description: "Creating a number of resources and organizing them in any software solution can get daunting without some sort of method to your madness. In a project, developers might decide to use logical folder structures or naming conventions based on a framework or what just makes sense. Azure Resource Groups is"
pubDate: "2017-08-09T16:14:01.000Z"
updatedDate: "2017-08-09T16:14:01.000Z"
heroImage: "/content/images/imported/organizing-azure-resources-with-tags-cover.png"
tags:
  - "azuredev"
  - "azure"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/organizing-azure-resources-with-tags/"
---

Creating a number of resources and organizing them in any software solution can get daunting without some sort of method to your madness. In a project, developers might decide to use logical folder structures or naming conventions based on a framework or what just makes sense.

Azure Resource Groups is described as the "logical group" for organizing your items where a group contains all related resources for an application. But what if there is a need to categorize or put multiple labels on each of these resources? For instance,

-   When was the resource created?
-   Who created it?
-   Is it a demo, production, test?
-   Who or what department is the application for?

Tags enable this exact functionality. The excerpt [from the docs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags) concerning the limitations apply to tags:

> -   Each resource or resource group can have a maximum of 15 tag name/value pairs. This limitation applies only to tags directly applied to the resource group or resource. A resource group can contain many resources that each have 15 tag name/value pairs.

> -   The tag name is limited to 512 characters, and the tag value is limited to 256 characters. For storage accounts, the tag name is limited to 128 characters, and the tag value is limited to 256 characters.

> -   Tags applied to the resource group are not inherited by the resources in that resource group.

> -   If you need more than 15 tags, use a JSON string for the value.

### Adding Tags

Tags can be added using the Azure Portal or CLI.

#### Portal

Select any resource, and in the "Tags" option add the Key/Value pairs then click the **Save** icon at the top to apply the tags.

![Tags for a single resource](/content/images/imported/organizing-azure-resources-with-tags-image-0.png)

In the image below, the Resource Group has the option of selecting multiple resources and applying the tags to all of the child items.

![Tagging multiple child resources](/content/images/imported/organizing-azure-resources-with-tags-image-1.gif)

[More on the Portal experience in the docs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags#portal).

### Azure CLI

Creating tags for a resource using the CLI can be accomplished when creating the item.

```bash
az group create -n azure-tags-example -l eastus --tags CreateDate=`date +%Y-%m-%d` applicationName=AzureTagsExample
```

or using `update` if it already exists.

```bash
az group update -n azure-tags-example --set tags.demo=true
```

Using the `query` option, getting a list of all of the tags in all of the resource groups.

```bash
az group list --query [].tags
```

There is also a `tags` command in the CLI which will list all of the tags in each subscription with a count of the resources being used for the tag.

```bash
az tag list
```

Showing the details for tag: **applicationName**.

```bash
  {
    "count": {
      "type": "Total",
      "value": 4
    },
    "id": "/subscriptions/5ca082f3-38f2-4bb0-b0a4-c401184ae3a8/tagNames/applicationName",
    "tagName": "applicationName",
    "values": [
      {
        "count": {
          "type": "Total",
          "value": 4
        },
        "id": "/subscriptions/5ca082f3-38f2-4bb0-b0a4-c401184ae3a8/tagNames/applicationName/tagValues/AzureTagsExample",
        "tagValue": "AzureTagsExample"
      }
    ]
  }
```

[More on the CLI Experience in the docs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags#azure-cli).

### Summary

Tags can be a great way to further organize your Azure resources, or re-organizing them once created. Whether using the portal or in command line experience, having the flexibility is awesome. See more in the docs at [https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags).
