---
title: "Angular 2 : Giving Your CLI a Server"
description: "...be sure to read Angular 2:Re-Quickstart with the CLI Although the CLI includes a number of great features, the deployment of the application is a story or issue that is still under discussion (Production deploy #326). What is the right server, what are the features etc. A simple static"
pubDate: "2016-05-18T03:00:00.000Z"
updatedDate: "2016-11-21T19:14:30.000Z"
heroImage: "/content/images/imported/angular2-giving-your-cli-server-cover.png"
tags:
  - "angular2"
  - "angular-cli"
  - "nodejs"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular2-giving-your-cli-server/"
---

![server-pic](/content/images/imported/angular2-giving-your-cli-server-image-0.png)

_...be sure to read [Angular 2:Re-Quickstart with the CLI](https://tattoocoder.com/angular2-requickstart-using-cli/)_

Although the CLI includes a number of great features, the deployment of the application is a story or issue that is still under discussion ([Production deploy #326](https://github.com/angular/angular-cli/issues/326)).

What is the right server, what are the features etc.

A simple static server for Angular applications should be able to handle a few things:

-   static files - like that pesky fav.ico, images, css, and javascript files
-   deep links - routing to specific portion of our SPA
-   maybe something simple like compression

In this case, node.js using Express fits the bill. Let's see how to add it to the quickstart generated in the previous post.

First, grab the index.js and package.json files from the gist [https://gist.github.com/spboyer/1aa7ac47bf0631a30d9eafd7b1af1186](https://gist.github.com/spboyer/1aa7ac47bf0631a30d9eafd7b1af1186)

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

and create them (server.js, project.json) in a folder in the root of the project called `node-server`.

Next, we will need to add a few npm scripts to the **package.json** for a custom build script.

Add the following commands:

```bash
"build:nodeserver": "ng build && cp nodeserver\/* dist",
"build:nodeserver-prod": "ng build -prod && cp nodeserver\/* dist",
"serve-build" : "npm run build:nodeserver && cd dist && node index.js",
"serve-build-prod": "npm run build:nodeserver-prod && cd dist && node index.js" 
```

The first command runs the normal `ng build` command which builds the application and places the assets into the **/dist** directory followed by a **copy** command to copy the **/node-server** files to the **/dist** folder.

The second command does the same, but passing the `-prod` option tells the CLI to bundle the application assets.

Execute the command using `npm run build:nodeserver` or `npm run build:nodeserver-prod`

Finally the last two commands run the application using the node server from the local machine in either dev or production mode. Browse to [http://localhost:3000](http://localhost:3000) to see the app running from node.js

Execute the command using `npm run serve-build` or `npm run serve-build-prod`

### Bonus: Adding to CI Process

In the [Angular 2 : Continuous Integration to Azure using Codeship and the Angular CLI](https://tattoocoder.com/angular2-azure-codeship-angularcli) post, it showed how to use the CLI and Codeship to push an app to Azure.

In that scenario, the application is being served by IIS; a perfectly and very performant static server. However, the deep link issue is still an issue. With adding the node.js/express server above and adjusting the **"Testing Pipelines"** script from

```bash
#serve the application adding '&' to run command in background
ng serve &

#start end to end tests using protractor
ng e2e

#if all of the tests pass, then build the production assets
ng build -prod
```

to

```bash
#serve the application adding '&' to run command in background
ng serve &

#start end to end tests using protractor
ng e2e

#if all of the tests pass, then build the production assets
npm run build:nodeserver-prod
```

It would include the node server in the **/dist** folder when pushing to Azure. Then, Kudu (Azure's deployment engine), would see the **package.json** file in the **/dist** folder and consequently run `npm install` completing the node application install and thus running a more complete server.

Related Github repo: [http://github.com/spboyer/quickstart-ng-cli](https://github.com/spboyer/quickstart-ng-cli)
