---
title: "How To: Visual Studio 2015 & Angular 2"
description: "There has been a few request I have seen lately on how to get an Angular 2 development environment going using Visual Studio 2015. any one please guide me to video or blog, configuring Visual Studio 2015 for AngularJS 2 development using TypeScript &mdash; Dhananjay Kumar (@debug_mode) April 29,"
pubDate: "2016-05-01T13:25:59.000Z"
updatedDate: "2016-05-01T13:25:59.000Z"
heroImage: "/content/images/imported/how-to-vs2015-angular2-cover.png"
tags:
  - "angular2"
  - "vs2015"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/how-to-vs2015-angular2/"
---

There has been a few request I have seen lately on how to get an Angular 2 development environment going using Visual Studio 2015.

> any one please guide me to video or blog, configuring Visual Studio 2015 for AngularJS 2 development using TypeScript
> 
> — Dhananjay Kumar (@debug\_mode) [April 29, 2016](https://twitter.com/debug_mode/status/726198164500430853)

My recent post "[Angular 2 : Getting off the Starting Line](https://tattoocoder.com/angular-2-getting-off-the-starting-line/)" takes the Angular Team's Quickstart and adds a gulp build process, this is the project I'll use for the walkthrough.

First, clone [https://github.com/spboyer/ng2-startingline](https://github.com/spboyer/ng2-startingline) . You can either do this on the command line or within the Visual Studio 2015 Git add in.

Next, **File** > **Open website** and select the folder you cloned the project to.  
![open-website](/content/images/imported/how-to-vs2015-angular2-image-0.png)

When you open the site, `npm restore` will automatically start to restore the dependencies from **package.json**  
![npm-restore](/content/images/imported/how-to-vs2015-angular2-image-1.png)

In order to run the project, the [previous post](https://tattoocoder.com/angular-2-getting-off-the-starting-line/) states to use `npm start`. Within the VS2015 GUI there is no built in way to do this. Luckily there is an add-in available from the gallery.

Use [NPM Task Runner](https://visualstudiogallery.msdn.microsoft.com/8f2f2cbc-4da5-43ba-9de2-c9d08ade4941) Visual Studio 2015 add-in from [Mads Kristensen](https://twitter.com/mkristensen).

After installing, and restarting Visual Studio.

Open Task Runner Explorer by right-clicking the package.json file and select Task Runner Explorer from the context menu:  
![contextimage](https://github.com/madskristensen/NpmTaskRunner/raw/master/art/open-trx.png)

Now you can see all of the tasks that are declared in **package.json**  
![tskpkg](/content/images/imported/how-to-vs2015-angular2-image-3.png)

To run the application. Select `start` and right click and select "Run". The application will compile, and launch your default browser with Browser Sync attached. This will allow you to make changes to the **/app/\*.ts** code and have it automagically compile and the browser will auto-refresh. With your changes.

![running](/content/images/imported/how-to-vs2015-angular2-image-4.png)

To quit the process close the tab inside of Task Runner Explorer that was launched with the process.

Saving the solution will provide a \***.sln** which you can then re-open the project by simply using that file instead of **File** > **Open** > **Website**. Enjoy!
