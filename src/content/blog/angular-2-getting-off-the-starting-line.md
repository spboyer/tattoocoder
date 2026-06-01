---
title: "Angular 2 : Getting off the Starting Line"
description: "The Angular team created a quickstart repo over at https://github.com/angular/quickstart which is a great starter project template for basically a &quot;Hello World&quot; application. It provides: lite-server, which is a demo or local/development only server basic tests using karma typescript dependencies (tsconfig, typings) Getting"
pubDate: "2016-04-25T18:35:13.000Z"
updatedDate: "2016-04-30T15:49:51.000Z"
heroImage: "/content/images/imported/angular-2-getting-off-the-starting-line-cover.png"
tags:
  - "angular2"
  - "angular"
  - "gulp"
  - "express"
  - "nodejs"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular-2-getting-off-the-starting-line/"
---

![ng2-startingline](/content/images/imported/angular-2-getting-off-the-starting-line-image-0.png)

The Angular team created a quickstart repo over at [https://github.com/angular/quickstart](https://github.com/angular/quickstart) which is a great starter project template for basically a "Hello World" application.

It provides:

-   [lite-server](https://github.com/johnpapa/lite-server), which is a **demo** or **local/development only** server
-   basic tests using karma
-   typescript dependencies (tsconfig, typings)

Getting started is included in the README, but it's simple

```
# clone the repo
git clone https://github.com/angular/quickstart <your app name>

# change directory to your app name
cd <your app name>

# delete the .git file to remove the binding from the angular repo
rm -rf .git
```

Now the code is set for you to create your own repo, `git init`, `commit` etc.

# Running the quickstart

First make sure all of the npm packages are good.

```
npm install
```

then The npm start command first compiles the application, then simultaneously re-compiles and runs the lite-server. Both the compiler and the server watch for file changes. To stop manually, use `Ctrl-C`.

This gets you to the _starting line_. But what the quickstart doesn't have is a build process or a production server that handles, deep linking or static file serving. That's where [ng2-startingline](https://github.com/spboyer/ng2-startingline) comes in. Let's add the needed pieces.

# Express.js as the server

node.js, with Express performs very well, scales and would be hard to argue its uptake in the tech world for use in this case.

There are a couple of things we need to accomplish with the node/express server.

-   if the request has a '.', assume it's a file and try to serve it
-   if the request has an 'accept' header of html, xml, or json serve it.
-   otherwise assume its a route in the SPA and send it along to Angular.

Here's the simple server code:

package.json

```
{
    "name": "ng2-startingline",
    "version": "1.0.0",
    "dependencies": {
        "express": "4.13.4"
    }
}
```

index.js

```javascript
var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || 3000));

app.use(express.static(staticRoot));

app.use(function(req, res, next){

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }

    fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
```

Add these 2 files, `package.json`, `index.json` in a folder called **server** in the root of your project.

# Adding the build process

Next, a build process using gulp will be added to the project. The purpose here is to:

-   create a **/build** folder for the destination of our _production_ code
-   select and move the specific application javascript dependencies from node\_modules to a **/lib** folder withing **/build**
-   move the application files, `index.html` and compiled `*.js` files to the **/build** folder
-   include the server

Add the gulp **devDependencies** to the `package.json` file in the root of the project.

```
,
    "gulp" : "3.9.1",
    "gulp-sourcemaps": "2.0.0-alpha",
    "del" : "2.2.0"
```

and `npm install`. Next, add a the `gulpfile.js` in the root of the project.

gulpfile.js

```javascript
"use strict";
var gulp = require("gulp");
var del = require("del");
var sourcemaps = require('gulp-sourcemaps');

/**
 * Remove build directory.
 */
gulp.task('clean', function (cb) {
    return del(["build"], cb);
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ["server", "app", "assets"], function () {
    console.log("Building resources...");
});
/* copy the app core files to the build folder */
gulp.task("app", ['index'], function(){
    return gulp.src(["app/**", "!app/**/*.ts"])
        .pipe(gulp.dest("build/app"));
});
/* get the index file to the root of the build */
gulp.task("index", function(){
    return gulp.src(["index.html"])
        .pipe(gulp.dest("build"));
});
/* copy node server to build folder */
gulp.task("server", function () {
    return gulp.src(["index.js", "package.json"], { cwd: "server/**" })
        .pipe(gulp.dest("build"));
});
/* styles and other assets */
gulp.task("assets", function(){
    return gulp.src(["styles.css"])
        .pipe(gulp.dest("build"));
});
/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", function () {
    return gulp.src([
        'es6-shim/es6-shim.min.js',
        'systemjs/dist/system-polyfills.js',
        'angular2/bundles/angular2-polyfills.js',
        'angular2/es6/dev/src/testing/shims_for_IE.js',
        'systemjs/dist/system.src.js',
        'rxjs/bundles/Rx.js',
        'angular2/bundles/angular2.dev.js',
        'angular2/bundles/router.dev.js'
    ], { cwd: "node_modules/**" }) /* Glob required here. */
        .pipe(gulp.dest("build/node_modules"));
});
/**
 * Build the project.
 */
gulp.task("default", ['resources', 'libs'], function () {
    console.log("Building the project ...");
});

```

You can run any of the gulp tasks individually

-   `gulp clean` - deletes the **/build** folder
-   `gulp server` - copies the server to the **/build** folder
-   etc

or run all them by just typing `gulp` at the command or terminal. \*Note that the gulp-cli is required, install this using `npm install gulp-cli -g`

## Adding npm scripts

There are already a number of npm scripts in the project allowing you to do a number of tasks:

-   npm start - runs the compiler and a server at the same time, both in "watch mode".
-   npm run tsc - runs the TypeScript compiler once.
-   npm run tsc:w - runs the TypeScript compiler in watch mode; the process keeps running, awaiting changes to TypeScript files and re-compiling when it sees them.

...and others noted on the home [repo page](https://github.com/angular/quickstart)

Open up package.json in the root and add the following:

```
"build": "tsc && gulp",
    "prod": "npm run build && cd build && npm i && node index.js"
```

-   **build** - `npm run build` : runs the typescript compiler to transpile the application code to javascript, and then the gulp default task is run to create the **/build** folder.
-   **prod** - `npm run prod` : runs the `build` command above but also installs the express server and runs the production application from the **/build** folder on port 3000. This allows you to then open a browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application as if it was running on a live server.

# Summary

By using the ng2-startingline repo, you now have a development and build process ready to go.

## Getting Started

```
# clone the repo
git clone https://github.com/spboyer/ng2-startingline <your app name>

# change directory to your app name
cd <your app name>

# delete the .git file to remove the binding from the angular repo
rm -rf .git 
```

## Development

```
npm install 
npm start
```

## Build for Production

```
# test locally
npm run prod
# browse to http://localhost:3000
```

Deploy the **/build** folder to [Azure websites](https://azure.microsoft.com/en-us/documentation/articles/web-sites-deploy/) via [Dropbox](https://azure.microsoft.com/en-us/blog/new-deploy-to-windows-azure-web-sites-from-dropbox/), OneDrive or Github.

Try it out! Let me know what you think.
