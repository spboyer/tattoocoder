---
title: "Using Azure DevOps Pipelines and NuKeeper to Automate NuGet Package updates"
description: "Keeping your code update to with the latest references can at times be a challenge with the rate of speed third-party dependencies can revise. However, with security patches and bug fixes constantly plaguing us it is a necessary exercise. I have been using dotnet-outdated to quickly run checks on my"
pubDate: "2018-10-16T18:53:07.000Z"
updatedDate: "2018-10-16T19:07:03.000Z"
heroImage: "/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-cover.png"
tags:
  - "azure"
  - "devops"
  - "nuget"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates/"
---

Keeping your code update to with the latest references can at times be a challenge with the rate of speed third-party dependencies can revise. However, with security patches and bug fixes constantly plaguing us it is a necessary exercise.

I have been using [dotnet-outdated](https://tattoocoder.com/using-global-tool-dotnet-outdated-to-check-for-the-latest-nuget-package-updates/) to quickly run checks on my projects and it has even been a huge help when getting some non-descript error messages in my code realizing I was missing a recent update.

Looking at a way to extend this functionality or automate it, I came across [Nukeeper](https://github.com/NuKeeperDotNet/NuKeeper) and a write up from [Scott Hanselman](https://www.hanselman.com/blog/NuKeeperForAutomatedNuGetPackageReferenceUpdatesOnBuildServers.aspx) that mentioned that this one had a [Repository Feature](https://github.com/NuKeeperDotNet/NuKeeper/wiki/Getting-Started#repository-command) where running the command `nukeeper repo <myrepo>` would do the similar functions as dotnet outdated, BUT would also send a PR to the project!

This got me thinking, what if I could use NuKeeper and [Azure Devops](https://azure.microsoft.com/en-us/services/devops/pipelines/) to watch my repo? I already have a pipeline building and deploying the project when commits are being made to a branch; we could set up an additional pipeline to do this process and when PRs are sent build the project for validation as well.

![workflow](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-0.png)

### Setting up NuKeeper in Azure DevOps

The first step is to make sure that you have a [GitHub personal access token or PAT](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/). This is needed for executing the [`repo` command](https://github.com/NuKeeperDotNet/NuKeeper/wiki/Getting-Started#repository-command) of NuKeeper.

I set my PAT as a variable **"Nukeepeer\_\_github\_\_token"** for the pipeline.

![personal access token](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-1.png)

Moving over to the pipeline, the first task here is to install the .NET Core SDK that I want to target. In this case 2.1.403.

![](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-2.png)

The next task uses the `dotnet` command to install the NuKeeper global tool, for local dev; `dotnet tool install -g NuKeeper`.

![](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-3.png)

There are two additional steps here to set the git user and name. These steps are needed only due to personal access token being used does not have a publically exposed email address. Typically you'd have this configured on your local machine in your `.gitconfig`.

Now that the SDK and global tool are set, the final task in the pipeline is the command to check our repo. Here the `repo` command is configured to use the PAT variable `$(NuKeeper_github_token)` and we are passing additional options for getting updates for 3 weeks or older minor changes.

`nukeeper repo "https://github.com/spboyer/runracereview" $(NuKeeper_github_token) --age=3w --change=minor`

![](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-4.png)

Here is the [Azure DevOps Pipeline in YAML](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=vsts&tabs=schema).

```yaml
queue:
  name: Hosted Linux Preview
variables:
  NuKeeper_github_token: 'your_github_personal_access_token'
steps:
- task: DotNetCoreInstaller@0
  displayName: 'Install .NET Core SDK'
  inputs:
    version: 2.1.403

- task: DotNetCoreCLI@2
  displayName: 'dotnet global tool install'
  inputs:
    command: custom

    custom: 'tool '

    arguments: 'install -g NuKeeper'

- script: 'git config --global user.email %git_email%' 
  displayName: 'Set git email address'

- script: 'git config --global user.name %git_username%' 
  displayName: 'Set git user name'

- script: 'nukeeper repo "https://github.com/spboyer/runracereview" $(NuKeeper_github_token) --age=3w --change=minor' 
  displayName: 'Run Race Review Project'

```

### Scheduling Checks

Under the **Triggers** tab we can set a schedule as to when to run the pipeline. Every Saturday at 3 AM, it will run the checks and perform the Pull Requests to notify our other pipeline that there are needed updates to run tests, build and deployments against.

![schedules](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-5.png)

The most recent run revealed that there were needed updates -

```console
2018-10-15T18:05:51.1414374Z Found 2 packages in use, 2 distinct, in 1 projects.
2018-10-15T18:05:51.1414982Z Bogus, MongoDB.Driver
2018-10-15T18:05:52.1161425Z Found 1 possible updates
2018-10-15T18:05:52.1162171Z Bogus from 23.0.3 to 24.3.0 in runracereview/runracereview.csproj
2018-10-15T18:05:52.1162436Z 
2018-10-15T18:05:52.1182228Z Found 1 package update
2018-10-15T18:05:52.1208829Z Bogus to 24.3.0 from 23.0.3 in 1 place since 13 days ago.
2018-10-15T18:05:52.2247646Z Selection of package updates: 1 candidates
2018-10-15T18:05:52.2248371Z Selected package update of Bogus to 24.3.0
2018-10-15T18:05:52.2334021Z Updating'Bogus' from 23.0.3 to 24.3.0 in 1 projects
2018-10-15T18:06:03.1689000Z Making PR onto 'https://api.github.com/ spboyer/runracereview from nukeeper-update-Bogus-to-24.3.0
2018-10-15T18:06:03.9890259Z Adding label(s) 'nukeeper' to issue 'https://api.github.com/ spboyer/runracereview 5'
2018-10-15T18:06:04.2032755Z Done 1 updates
```

Sending the PR over.

![Pull Request](/content/images/imported/using-azuredevops-pipelines-and-nukeeper-to-automate-nuget-package-updates-image-6.png)

The whole process now being automated using [Azure DevOps](https://azure.microsoft.com/en-us/services/devops/pipelines/) and a [.NET Core global tool](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools). That's pretty slick. How are you keeping your apps up to date?
