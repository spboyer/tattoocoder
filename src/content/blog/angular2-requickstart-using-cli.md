---
title: "Angular 2 : A Re-Quickstart using the CLI"
description: "The Angular team created a quickstart which is a great starter project template and I've covered that in another post which shows adding an express server to that to get you up and running with a more complete quickstart at Angular 2 : Getting Off the Starting Line. Both are great"
pubDate: "2016-05-18T01:00:00.000Z"
updatedDate: "2016-11-21T19:15:31.000Z"
heroImage: "/content/images/imported/angular2-requickstart-using-cli-cover.png"
tags:
  - "angular2"
  - "angular-cli"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular2-requickstart-using-cli/"
---

![header\_image](/content/images/imported/angular2-requickstart-using-cli-image-0.png)  
The Angular team created a [quickstart](https://github.com/angular/quickstart) which is a great starter project template and I've covered that in another [post](https://tattoocoder.com/angular2-requickstart-using-cli/\(http://tattoocoder.com/angular-2-getting-off-the-starting-line/\)) which shows adding an express server to that to get you up and running with a more complete quickstart at [Angular 2 : Getting Off the Starting Line](https://tattoocoder.com/angular-2-getting-off-the-starting-line/). Both are great starters, but **static** templates.

This _Re-Quickstart_\* is using the CLI (command line interface) to create the same application in a fraction of the time.

### angular-cli

The angular-cli is the new command line interface for creating Angular 2 applications. Well, It's much more than that. It creates applications, follows the best practice or approved style guide, sets up the tests, runs the tests and much more. Head over to [cli.angular.io](https://tattoocoder.com/angular2-requickstart-using-cli/cli.angular.io) for more info or visit the \[github repo\]\[[http://github.com/angular/angular-cli](https://github.com/angular/angular-cli)\].

##### Installation

```
npm install -g angular-cli
```

## Creating the application

```bash
ng new quickstart-ng-cli
```

This command will scaffold the application, install the dependencies from npm as well as init the local github repo.

Next, you can build and serve the application locally by running the `serve` command which compiles the resources to to **/dist** and starts a local web server on **[http://localhost:4200](http://localhost:4200)**

```bash
ng serve
```

![quickstart-localhost](/content/images/imported/angular2-requickstart-using-cli-image-1.png)

##### Testing

In the quickstart, there were pre-requisites for webdriver, some _minor_ setup needed for protractor and naming structures.

With the CLI it is all "gift with purchase", all included.

The tests that will be run using protractor, you will want to run the following commands.

```bash
#adding the ampersand runs the command in
#the background
ng serve &
#start protractor
ng e2e
```

You will see the default browser start and run the test and then complete with a success. Hit ctrl+c to shutdown the commands if they don't automatically.

That covers the quickstart from a CLI perspective. One command `ng new <yourappname>` to create and `ng serve` to build and serve it up.

There is a lot of baked in functionality within the CLI such as adding routes, components, directives etc., full documentation is available at [http://github.com/angular/angular-cli/README.md](https://github.com/angular/angular-cli/README.md) or [http://cli.angular.io](http://cli.angular.io) and give the **Learn Clingon** by Mike Brocchi talk a watch below.

<iframe width="854" height="480" src="https://www.youtube.com/embed/wHZe6gGI5RY" frameborder="0" allowfullscreen=""></iframe>

##### Related Posts

-   [Continuous Integration to Azure using Codeship and the Angular CLI](https://tattoocoder.com/angular2-azure-codeship-angularcli)
-   [Angular 2 : Giving Your CLI a Server](https://tattoocoder.com/angular2-giving-your-cli-server)
-   Github repo for these : [https://github.com/spboyer/quickstart-ng-cli](https://github.com/spboyer/quickstart-ng-cli)
