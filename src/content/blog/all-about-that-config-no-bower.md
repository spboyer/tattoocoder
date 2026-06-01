---
title: "All about that npm no Bower"
description: "One of the many new features of ASP.NET 5, and the &quot;new&quot; Microsoft as some would call it, is the implementation or integration of the open tooling and other package managers in the OSS world. Node, grunt, gulp and Bower are terms not unbeknownst to web developers"
pubDate: "2015-11-30T20:35:50.000Z"
updatedDate: "2015-11-30T20:35:50.000Z"
tags:
  - "aspnet5"
  - "npm"
  - "bower"
  - "config"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/all-about-that-config-no-bower/"
---

One of the many new features of ASP.NET 5, and the "new" Microsoft as some would call it, is the implementation or integration of the open tooling and other package managers in the OSS world. Node, grunt, gulp and Bower are terms not unbeknownst to web developers using other platforms.

However, with all of this comes more setup or management of tooling or "what to use when" etc, and some of the feedback from the community within ASP.NET has been around this very topic.

### Converting Web Application to use npm

Here is a quick conversion of the basic web application from using Bower to using npm.

-   delete .bowerrc

Since we are not using Bower, there is no need for the file. The purpose of the file, FYI, is to set the installation location of the libraries downloaded and in this case it was set to `wwwroot/lib`.

-   npm install the items in bower.json

```
npm install bootstrap jquery jquery-validation --save
```

This adds **bootstrap**, **jquery** and **jquery-validation** to the `package.json` file in the dependencies node.

```
,
  "dependencies": {
    "bootstrap": "^3.3.6",
    "jquery": "^2.1.4",
    "jquery-validation": "^1.14.0"
  }
```

The last JavaScript resource used, is **jquery-validation-unobtrusive** from the ASP.NET team, but this is not currently available in the npm registry, however there is a [pending PR](https://github.com/aspnet/jquery-validation-unobtrusive/pull/16) to get this resolved.

In order to get it added, simply npm install with the url of the git repository.

```
npm install https://github.com/aspnet/jquery-validation-unobtrusive --save
```

There are some changes need for the `gulpfile.js` setup and tasks. First, setup the configuration for the sources and destinations of the resources.

```language:javascript
var library = {
  base: "node_modules",
  destination: "lib",
  source: [
    // glob pattern to get the dirname and match only js and min.js file wanted
    path.dirname(require.resolve('ASP.NET/jquery.validate.unobtrusive.js')) + '/*unobtrusive**.js',
    // alternative of declaring each file
    require.resolve('bootstrap/dist/js/bootstrap.js'),
    require.resolve('bootstrap/dist/js/bootstrap.min.js'),
    require.resolve('bootstrap/dist/css/bootstrap.css'),
    // glob pattern to get all files within the directory
    path.dirname(require.resolve('bootstrap/dist/fonts/glyphicons-halflings-regular.woff')) + '/**',
    // declare each file
    require.resolve('jquery/dist/jquery.js'),
    require.resolve('jquery/dist/jquery.min.js'),
    // only one file is distributed
    require.resolve('jquery-validation/dist/jquery.validate.js')
  ]
}
```

Next, we need to add the copy task to get the resources moved to `\lib` folder.

```
gulp.task("lib", function () {
  return gulp.src(library.source, { base: library.base })
    .pipe(gulp.dest(paths.webroot + library.destination));
});
```

Add a `clean:lib` task as well to follow the pattern for resetting the `\lib` folder

```
gulp.task("clean:lib", function (cb) {
  rimraf(library.destination, cb);
});
```

Finally, to put it all together. Add the `clean:lib` task to the `clean` task.

```
gulp.task("clean", ["clean:js", "clean:css", "clean:lib"]);
```

Then two additional tasks `build` and `default` will round out the gulp file.

```
gulp.task("build", ["clean", "min", "lib"]);

gulp.task("default", ["build"]);
```

There are no other changes needed to the project to convert from Bower to npm. By making some minor changes to the gulp file to handle copying the files; it is a very minimal change and now there is a one less repository & config file. If you are using Visual Studio 2015; a pre-build binding to the `build` gulp task would be recommended as well.

Code before and after available on github: [http://github.com/spboyer/bowertonpm](https://github.com/spboyer/bowertonpm)

Comment, share, and enjoy!
