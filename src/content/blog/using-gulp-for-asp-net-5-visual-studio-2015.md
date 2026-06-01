---
title: "Using Gulp for ASP.NET 5 & Visual Studio 2015"
description: "The default &quot;ASP.NET 5 Preview Starter Web&quot; template has everything you need out of the gate to get started on your next ASP.NET 5 project. On top of the responsive design, which has a new carousel control, it is also touch ready using hammer.js and"
pubDate: "2015-03-10T02:02:41.000Z"
updatedDate: "2015-03-10T02:02:41.000Z"
tags:
  - "aspnet"
  - "aspnet5"
  - "gulp"
  - "grunt"
  - "vs2015"
  - "wiredep"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/using-gulp-for-asp-net-5-visual-studio-2015/"
---

The default "ASP.NET 5 Preview Starter Web" template has everything you need out of the gate to get started on your next ASP.NET 5 project. On top of the responsive design, which has a new carousel control, it is also touch ready using hammer.js and is using grunt as the task runner.

Another popular task runner is gulp.js, and in the next release there will be a default template provided. However, in the meantime as a part of the yeoman generator project I wanted to not only provide an equivalent for the grunt template, but also one that could be built upon.

### gruntfile.js

First let's take a quick look at the grunt file

```language-javascript
module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks("grunt-bower-task");
};

```

the purpose of these tasks is to simply install the bower resources set in the **bower.json** file, then copy these resources to the **www/lib** folder.

The task runner here is dependant on two npm packages; grunt and grunt-bower-task respectively. These are defined in **package.json**

```language-javascript
{
    "version": "0.0.0",
    "name": "MyApplicationName",
    "devDependencies": {
        "grunt": "0.4.5",
        "grunt-bower-task": "0.4.0"
    }
}
```

#### Running the tasks

You have two options for running the tasks.

-   Visual Studio 2015 Task Runner Explorer  
    ![task runner explorer](/content/images/imported/using-gulp-for-asp-net-5-visual-studio-2015-image-0.png)
-   Command Line `$ MyApplicationName > grunt`

### gulpfile.js

In order to accomplish the same functionality as the grunt task, you'll need to add the two npm packages for gulp to the **package.json** file and remove the gulp ones. We'll also add another for cleaning the destination folder.

-   gulp
-   gulp-bower
-   del

```language-javascript

{
    "version": "0.0.0",
    "name": "MyApplicationName",
    "devDependencies": {
        "del": "^1.1.1",
        "gulp": "^3.8.10",
        "gulp-bower": "0.0.10"
    }
}

```

Next, add a new JavaScript file name **gulpfile.js**. Now by contrast to grunt, gulp is more suited for coding versus configuration ( _json_ ).

First, add the dependencies.

```language-javascript
var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
```

Next, we'll add a variable to load the **project.json** file so we can get the **webroot** location, then set a variable to use for the **lib** location.

```language-javascript
var project = require('./project.json');
var lib = project.webroot + '/lib';
```

The first task added to the file is the **clean** task that takes the **lib** folder and deletes the content.

```language-javascript
gulp.task('clean', function (done) {
    del(lib, done);
});
```

Next, add the task for running **bower install** to install all of the components to the defaul folder _bower\_components_. This task, also will call the **clean** task first.

```language-javascript
gulp.task('bower:install', ['clean'], function () {
    return bower({
        directory: lib
    });
});
```

Finally, setup the **default** gulp task. This is the task that is called if you use the CLI (Command Line Interface) and execute `$ gulp`.

```language-javascript
gulp.task('default', ['bower:install'], function () {
    return;
});
```

The complete file should look like the following:

```language-javascript
var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
var project = require('./project.json');
var lib = project.webroot + '/lib';

gulp.task('default', ['bower:install'], function () {
    return;
});

gulp.task('bower:install', ['clean'], function () {
    return bower({
        directory: lib
    });
});

gulp.task('clean', function (done) {
    del(lib, done);
});
```

Again, the same options for running the tasks as before. However, there are a few items I noticed when using the CLI. First, there are commented lines in the **project.json** which are not supported by the JSON specification and the CLI will throw and error so remove these.

Secondly, I also noticed that the gulp tasks were not showing in the Task Runner Explorer and the errors were not very descriptive. However, it did get resolved by removing the comments and I aslo installed the **gulp-cli** package.

From the command line

```
> npm install -g gulp-cli
```

_As a note Visual Studio installs all of the packages locally to the project, if you are using gulp or grunt install them globally so the cli tools are available._

Additional bower resources can be added such as Angular.js and when the default task is run either from the CLI or the Task Runner Explorer; the files will be downloaded from the bower repository and then also placed in the **www/lib** folder were you can reference in your \*.cshtml files.

It is important to point out that it doesn't matter which way you decide to run the tasks, as the Task Runner Explorer is simply a GUI that calls the CLI. Some developers prefer one over the other, and now that ASP.NET 5 is cross platform there may be developers using other non Visual Studio IDE and now the capability is not lost on those developers.

### Notes

The next release of the yeoman generators, [generator-aspnet](https://github.com/OmniSharp/generator-aspnet) will contain and option to generate the **web** template with a gulp task runner instead of the default gulp.

`$ yo aspnet --gulp`

I would also encourage the use of the **wiredep** package with gulp. This package injects the bower packages into your _.html_ files by decorating them with a simple comment. Here is an example of that task.

```language-javascript
gulp.task('wiredep', function() {

    var wiredep = require('wiredep').stream;
    var options = {
            bowerJson: './bower.json',
            directory: './wwwroot/lib,
            ignorePath: 'wwwroot',
            client: 'Views/Shared/_Layout.cshtml'
        };

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(gulp.dest(client));
});
```

The only additional npm package needed is **wiredep**, be sure to add this to the package.json. The other file to change is the **Views/Shared/\_Layout.cshtml**

```language-html
    <!-- bower:css -->
    <link rel="stylesheet" href="/lib/bootstrap-touch-carousel.css">
    <link rel="stylesheet" href="/lib/bootstrap.css">
    <!-- endbower -->
    
    <!-- bower:js -->
    <script src="/wwwroot/lib/bootstrap-touch-carousel.js"></script>
    <script src="/wwwroot/lib/bootstrap.js"></script>
    <script src="/wwwroot/lib/hammer.js"></script>
    <script src="/wwwroot/lib/jquery.js"></script>
    <script src="/wwwroot/lib/jquery.validate.unobtrusive.js"></script>
    <script src="/lib/jquery.validate.unobtrusive.min.js"></script>
    <!-- endbower -->

```

Look forward to your feedback! Let me know you thoughts.
