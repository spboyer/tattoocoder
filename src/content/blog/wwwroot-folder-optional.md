---
title: "ASP.NET 5 - wwwroot folder optional"
description: "Updated - 1.30.2014 After looking at the kpm pack or publishing step of this solution, there is an undesired affect. All of the folders in the root, now that this is the folder we are working in, will be published to the destination folders. Being approot &amp; wwwroot"
pubDate: "2015-01-29T21:09:57.000Z"
updatedDate: "2015-01-30T16:31:50.000Z"
tags:
  - "aspnet"
  - "aspnet5"
  - "gulp"
  - "grunt"
  - "patterns"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/wwwroot-folder-optional/"
---

##### Updated - 1.30.2014

After looking at the kpm pack or publishing step of this solution, there is an undesired affect.

All of the folders in the root, now that this is the folder we are working in, will be published to the destination folders. Being approot & wwwroot (yes this is still created), this includes the bower\_components, nodee\_modules, your API code etc. Although IIS will keep you from browsing to the \*.cs and other extensions for security sake, it is still not a clean solution.

I have updated the [dev branch of the git repository](https://github.com/spboyer/nowwwroot) where wwwroot is put back in, and the gulpfile.js task called `optimize` now will publish the necessary files to this folder on the `prepare` step. `prepare` happens during project start, build, and publish.

* * *

I have been a long time user of Visual Studio in a Windows world; however over the last few years a migration to a full time OSX user and non Visual Studio development has been the path for me and most of my colleagues.

Given the news of cross platform support for ASP.NET and IDE of my choice put a pep in my step, but being bootstrapped to a specific folder structure didn't seem very xplat IDE friendly.

The new structure in ASP.NET 5, by default, includes the wwwroot folder where the static or non compiled code such as html, css, scripts etc will live. Your compiled code will now be packaged in nuget packages (.nupkg) within the /approot folder and each targeted framework will have its own nupkg.

Depending on your project team(s), the tools used the new structure may or may no cause issue with the move that is being made to the community standards such as grunt, gulp, bower, npm etc.

#### A Quick Example

The default File -> New Project -> ASP.NET 5 Empty Project presents the following solution structure in Visual Studio.

![new project structure](/content/images/imported/wwwroot-folder-optional-image-0.png)

The next step is to add the bower.json file for me to get the CSS and JavaScript libraries to work with such as Angular and Bootstrap.

bower.json file

```language-javascript

{
	"name": "NewASP5Project",
	"private": true,
	"dependencies": {
		"angular": "~1.3.11",
		"bootstrap": "~3.3.2"
	},
    "exportsOverride": {
    }
}

```

This creates the dependencies and the bower\_components (hidden) folder in the same directory as your project.

![after bower](/content/images/imported/wwwroot-folder-optional-image-1.png)

Most examples you've probably seen to this point would invlove adding a grunt file which would then **copy** the necessary bower resources to a _**new**_ folder under wwwroot, something like _**/lib**_. Then you reference these \*.css and \*.js resources from the /lib folder in the .html files during development.

There are of course options in the bower.json file within **exportsOverride** to control what exactly gets copied to the destination folder during the grunt task; such as only getting the minified versions etc.

There is a full walkthrough of the example on the ASP.NET site here - [Grunt and Bower in Visual Studio 2015](https://www.asp.net/vnext/overview/aspnet-vnext/grunt-and-bower-in-visual-studio-2015).

#### So What is the Problem?

Here are a few items to point out.

-   There are duplicate copies of the bower resources
-   The example works for grunt, not gulp
-   wwwroot is unecessary

#### Optional?

In short, yes. With a change to project.json you can either remove the _wwroot_ folder OR call it _foo_ if you like and the application will execute normally.

This is done by changing the value of `webroot` from `'wwwroot'` to simply `'.'` or `'foo'` depending on your preference. In this case we are looking to eliminate the folder need and work right from the true root of the project. Look at this example project.json:

```language-javascript
{
  "webroot": ".",
  "version": "1.0.0-*",
  "exclude": [
    "wwwroot",
    "bower_components"
  ],
  "packExclude": [
    "node_modules",
    "bower_components",
    "**.kproj",
    "**.user",
    "**.vspscc"
  ],
  "dependencies": {
    "Microsoft.AspNet.Server.IIS": "1.0.0-beta2",
    "Microsoft.AspNet.Server.WebListener": "1.0.0-beta2",
    "Microsoft.AspNet.StaticFiles": "1.0.0-beta2",
    "Microsoft.AspNet.Diagnostics": "1.0.0-beta2",
    "Microsoft.AspNet.Mvc": "6.0.0-beta2",
    "Kestrel": "1.0.0-beta2",
    "Microsoft.CodeAnalysis.CSharp": "1.0.0.0-beta2"
  },
  "commands": {
    "web": "Microsoft.AspNet.Hosting --server Microsoft.AspNet.Server.WebListener --server.urls http://localhost:5001",
    "kestrel": "Microsoft.AspNet.Hosting --server Kestrel --server.urls http://localhost:5004"
  },
  "frameworks": {
    "aspnet50": {},
    "aspnetcore50": {}
  },
  "scripts": {
    "postrestore": [
      "npm install"
    ],
    "prepare": [
      "gulp prepare"
    ]
  }
}
```

This file sets the webroot to '.', telling the web application that the true root is where we will be executing from. Now when you add bower to the project, the **bower\_components** folder is at the same level as your other resources.

> _In Visual Studio you'll have to "Show All Files", Right Click and "Include in Project". By doing so you can directly reference the resources in the bower\_components folder in your html without having to copy duplicates into another folder. However, note that you only really need to do this if you want the nice intellisense when coding, resources will still resolve._

#### But What about deployment?

Right, you certainly wouldn't deplpoy the bower\_components folder to the server. That's where grunt or gulp helps out and in this example - gulp.

> Check out John Papa's repository - [gulp-patterns](https://github.com/johnpapa/gulp-patterns), and note that there is an upcoming [Pluralsight](http://pluralsight.com/) course associated with this soon!

#### Gulp - inject, wiredep and more.

Instead of typing all of the bower resources into your html, use the gulp plugin called **wiredep**.

In the html page you insert the following comment tags to indicate where to inject the css and javascript.

```language-html
<!-- bower:css -->

<!-- endbower -->

<!-- bower:js -->

<!-- endbower -->
```

Then in your gulpfile.js a task is defined

```language-javascript

var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));

```

when the task is executed, the result is the follwing

```language-html
<!-- bower:css -->
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css" />
<link rel="stylesheet" href="bower_components/toastr/toastr.css" />
<!-- endbower -->

<!-- bower:js -->
<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
<script src="bower_components/angular-resource/angular-resource.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
<script src="bower_components/extras.angular.plus/ngplus-overlay.js"></script>
<script src="bower_components/moment/moment.js"></script>
<script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>
<script src="bower_components/toastr/toastr.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>
<script src="bower_components/html5shiv/dist/html5shiv.js"></script>
<script src="bower_components/respond/dest/respond.src.js"></script>
<!-- endbower -->
```

For your own scripts, or non bower resources; **gulp-inject** gives you the same result by using `<!-- inject:cs -->` and `<!-- inject:js -->` respectively.

#### Great for Static Stuff, What about my ASP.NET?

Here is the folder structure of the application:  
![app structure](/content/images/imported/wwwroot-folder-optional-image-2.png)

-   /app - Angular.js code
-   /server - .NET API code

Application can be run from the Debug dropdown and executes in Helios (IIS) and runs the Angular app on index.html calling the API controllers.

#### What about cross platform development?

In project.json there is a reference to the Kestrel server host for OSX and Linux. You can open the application in Sublime, Brackets, Atom etc. I happen to use Sublime and Brackets.

Using Sublime, and the [OmniSharp](http://omnisharp.net) as well Kulture addins; ASP.NET development experience is a breeze.

Open the project, run `kpm restore` to install all **bower, nuget, and npm** dependencies then run the application using `k kestrel` and browse to **[http://localhost:5004](http://localhost:5004)**

#### Summary

No need to have a wwwroot, a duplicated set of resources. If there is already a set and we have grunt, gulp, npm and bower integration within our ecosystem; let's start using them and reduce the reptative work. Curious how you are working with the new set of tools, give me your thoughts.

#### Source

Source code available here - [https://github.com/spboyer/nowwwroot](https://github.com/spboyer/nowwwroot)
