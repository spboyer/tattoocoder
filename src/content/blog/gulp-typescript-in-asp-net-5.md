---
title: "Gulp Your TypeScript in ASP.NET 5"
description: "CodeProject If you have done any typescript development in Visual Studio in previous versions, you more than like are using the Web Essentials add in to perform the compilation to Javascript. Another option is to add a gulp task now that we"
pubDate: "2014-12-30T22:18:09.000Z"
updatedDate: "2015-01-07T18:21:02.000Z"
tags:
  - "aspnet5"
  - "gulp"
  - "typescript"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/gulp-typescript-in-asp-net-5/"
---

[CodeProject](http://www.codeproject.com)

![gulp image](/content/images/imported/gulp-typescript-in-asp-net-5-markdown-0.png)

If you have done any typescript development in Visual Studio in previous versions, you more than like are using the [Web Essentials](http://vswebessentials.com/) add in to perform the compilation to Javascript. Another option is to add a gulp task now that we have gulp and grunt support within Visual Studio. The other value add is if you are a non Visual Studio user this solution works just the same.

### Project Creation

In Visual Studio 2015, File > New Project > ASP.NET Web Application > ASP.NET 5 Empty  
![File New Project](/content/images/imported/gulp-typescript-in-asp-net-5-image-0.png)

or using the [ASP.NET Yeoman Generator](http://www.tattoocoder.com/asp-net-vnext-project-creation-using-yeoman)

```
$ yo aspnet 

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |      Welcome to the      |
   `---------´   |   marvellous ASP.NET 5   |
    ( _´U`_ )    |        generator!        |
    /___A___\    '--------------------------'
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What type of application do you want to create? MVC Application
? What's the name of your ASP.NET application? (MvcApplication) GulpTypeScript
```

### Adding Gulp

Add a package.json file.

![Add New Item - JSON File](/content/images/imported/gulp-typescript-in-asp-net-5-image-1.png)

or using the [ASP.NET Yeoman Generator](http://www.tattoocoder.com/asp-net-vnext-project-creation-using-yeoman)

```
$ yo aspnet:PackageJSON
```

Within `package.json` you will need to add the dependencies to support gulp.

-   **gulp**: Core gulp.js package
-   **gulp-tsc**: TypeScript compliler for gulp
-   **gulp-shell**: command line interface, can execute other processes etc.
-   **run-sequence**: run a series of tasks

```language-javascript
{
    "version": "0.0.1",
    "name": "GulpTypeScript",
    "devDependencies": {
    	"gulp": "^3.8.5", 
    	"gulp-tsc": "^0.9.1", 
    	"gulp-shell": "^0.2.5",
    	"run-sequence":"^0.3.6"
    }
}
```

Unlike nuget (project.json > dependencies node), the npm packages are not automatically restored/downloaded once the `package.json` is saved. You can either expand the "Dependencies" node in the Solution Explorer and click "Restore Packages" or from a command line type `npm install`.

![Restore Packages](/content/images/imported/gulp-typescript-in-asp-net-5-image-2.png)

after `npm install` completes...

![packages restored](/content/images/imported/gulp-typescript-in-asp-net-5-image-3.png)

#### Adding the gulpfile.js

Using Visual Studio, Add New Item > JavaScript File > "gulpfile.js" or again using the aspnet Yeoman generator:

```
$ yo aspnet:JScript gruntfile
```

#### Adding the tasks

In this example, we'll put in a few simple tasks

-   build
-   clean
-   default
-   rebuild

the most important item being the **build** task as this is where the TypeScript compilation happens.

First declare the vars and dependencies...

```language-javascript
    var gulp = require('gulp'),
        tsc = require('gulp-tsc'),
        shell = require('gulp-shell'),
        seq = require('run-sequence'),
        del = require('del');
```

Next, set the source (src) and destination (dest) paths for your scripts...

```language-javascript
   var paths = {
        ts: {
            src: [
                'scripts/ts/*.ts'
            ],
            dest : 'scripts'
        }
    }
```

Here, set the "default" task to be run

```language-javascript
   // Default
    gulp.task('default', ['build']);
```

A clean task is defined to delete any javascript files that were compiled to the destination location.

```language-javascript
  // Clean
    gulp.task('clean', function (cb) {
        del(paths.ts.dest + '/*.js', cb);
    })
```

Next, a **rebuild** task is defined to execute the **clean** then **build** sequetiallly. You can use `gulp.start('clean', 'build')` but there is no guarantee what order the tasks will execute or complete in. So in that case the **run-sequence** npm package is used here.

```language-javascript
    // ReBuild - Clean & Build
    gulp.task('rebuild', function (cb) {
        seq('clean', 'build', cb);
    });
```

Finally, the build task. Here the TypeScript compiler is leveraged using the `gulp-tsc` npm package passing in the arguments from the source location and producing the compiled JavaScript to the destination.

```language-javascript
    // Build
    gulp.task('build', function () {
        return gulp
            .src(paths.ts.src)
            .pipe(tsc({
                module: "CommonJS",
                sourcemap: true,
                emitError: false
            }))
            .pipe(gulp.dest(paths.ts.dest));
    });
         
```

For demo purposes, just grabbed the "Simple Inheritance" example from [TypeScriptLang.org](http://www.typescriptlang.org/Playground) and created "animal.ts" in the **/scripts/ts** folder.

```language-javascript
class Animal {
    constructor(public name: string) { }
    move(meters: number) {
        alert(this.name + " moved " + meters + "m.");
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move() {
        alert("Slithering...");
        super.move(5);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move() {
        alert("Galloping...");
        super.move(45);
    }
}

var sam = new Snake("Sammy the Python");
var tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);

```

Now in order to produce the JavaScript, there are a few options as mentioned before.

-   Use [Web Essentials](http://vswebessentials.com)
-   Open the command line, now that we have defined the gulp tasks, and type `gulp [task name]`
-   Task Runner Explorer

#### Command Line

Pretty simple here, as mdentioned above, open your console in your working directoy

```
$ gulp build
```

Output will be similar to (Windows)

```
C:\Github\GulpTypeScript\src\GulpTypeScript>gulp build
[16:58:08] Using gulpfile C:\Github\GulpTypeScript\src\GulpTypeScript\gulpfile.js
[16:58:08] Starting 'build'...
[16:58:08] Compiling TypeScript files using tsc version null
[16:58:09] Finished 'build' after 1.01 s
```

on OSX

```
$ gulp build
[17:00:43] Using gulpfile ~/GulpTypeScript/gulpfile.js
[17:00:43] Starting 'build'...
[17:00:43] Compiling TypeScript files using tsc version null
[17:00:43] Finished 'build' after 848 ms
```

The output goes right to **/scripts** as expected.  
![output js](/content/images/imported/gulp-typescript-in-asp-net-5-image-4.png)

#### Bonus Task

_Edit 01.05.2015_ - Someone asked me was there a way to watch for file changes to recompile. Here is the task to add using the `.watch()` functionality of grunt.

```language-javascript
    gulp.task('watch', function () {
        gulp.watch(paths.ts.src, ['build']);
    });
```

This task watches for file changes in the `src` directory, then executes the `build` task. You could optionally put in multiple tasks or call any existing task.

#### Task Runner Explorer

In Visual Studio 2015, there is now Task Runner Explorer which gives you a visual look into your tasks. This supports grunt and gulp. Here is a shot of the window after running the **build** task.

![Task Runner Explorer](/content/images/imported/gulp-typescript-in-asp-net-5-image-5.png)

## Note

On Windows you may encounter a strange error when executing the tasks. This is an issue when you have multiple versions of TypeScript installed.

The error: **Failed to compile TypeScript: Error: Command failed: Cannot initialize ActiveScript**  
![](/content/images/imported/gulp-typescript-in-asp-net-5-image-6.png)

There is an easy fix, just go to to C:\\Program Files(x86)\\Microsoft SDKs\\TypeScript  
and remove the previous versions.  
![](/content/images/imported/gulp-typescript-in-asp-net-5-image-7.png)

### Summary

There is a lot more you can add to the grunt file as you may or may not know, there are minification, image optimization and a ton more. I like the way of gulp as it allows for the non VS and Visual Studio developers to put together the code in the same manner. Not to toss out Web Essentials, cause that is an awesome add-in and there would be many of features not in VS without it.
