---
title: "Angular 2 :  Application Settings using fetch"
description: "In a recent post, the CLI and environment.ts were used to determing the current running environment and what settings to use. However, there were some shortcomings to this approach not only in the fact that only development and production were supported but others mentioned as well. In Angular 1."
pubDate: "2016-05-31T19:33:34.000Z"
updatedDate: "2016-11-21T19:16:00.000Z"
heroImage: "/content/images/imported/angular2-applications-settings-cover.png"
tags:
  - "angular2"
  - "angular-cli"
  - "nodejs"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular2-applications-settings/"
---

![fetch-settings](/content/images/imported/angular2-applications-settings-image-0.png)  
In a [recent post](https://tattoocoder.com/angular-cli-using-the-environment-option/), the CLI and environment.ts were used to determing the current running environment and what settings to use. However, there were some shortcomings to this approach  
not only in the fact that only `development` and `production` were supported but others mentioned as well.

In Angular 1.x using [_manual bootstrap_](https://docs.angularjs.org/guide/bootstrap), where the application would need to do some work prior to _starting up_, was such a need that it has a home in the [docs](https://docs.angularjs.org/guide/bootstrap). However, in Angular 2 this pattern is not established.

I started looking and asking, "What is the manual bootstrap for A2?" Of course, thanks to naming "bootstrap" is awful when paired with almost anything web. Nevertheless, there is a question and answer here to be take into account...

### Question?

I need to get some _data, settings, api url, etc_ before my app starts, what are my options?

### Answer(s)?

If you are building in each environment, you could use `environment.{env}.ts` as shown in this [post](https://tattoocoder.com/angular-cli-using-the-environment-option/) **OR**  
get them from the originating server using the `fetch` api and let the server determine the ENVIRONMENT and return that information as well as any other relevant settings prior to the  
application starting.

Related Posts:

-   [Giving your CLI a Server](https://tattoocoder.com/angular2-giving-your-cli-server/)
-   [Application Settings using the CLI Environment Option](https://tattoocoder.com/angular-cli-using-the-environment-option/)
-   [A Re-Quickstart using the CLI](https://tattoocoder.com/angular2-requickstart-using-cli/)
-   [Continuous Integration to Azure using Codeship and the Angular CLI](https://tattoocoder.com/angular2-azure-codeship-angularcli/)

## The Server

_This portion builds on the [Giving your CLI a Server](https://tattoocoder.com/angular2-giving-your-cli-server/) post_

First, the environment based config or settings files and code need to added. So a `/config` folder is added with the following files.

```bash
config
├── development.js
├── index.js
└── production.js
```

The `index.js` file contains simple code to load the environment specific file based on **NODE\_ENV**. A change could be made to trigger off of any other variable depending on your build process or need to support  
other environments (APP\_ENV for example).

```javascript
var config
  , config_file = './' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') + '.js';

try {
  config = require(config_file);
} catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV
      + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
    process.exit(1);
  } else {
    throw err;
  }
}
module.exports = config;

```

Next, the `production.js` and `development.js` file contain the settings specific to the environments and our needs.

```javascript
exports.app = app = {
  title: 'a2-serversettings',
  port: 80,
  environment: 'production',
  start: 'index.html'
}

exports.api = {
  base_url: 'http://api.webserver.com/'
}
```

A variation to the `development.js` file such as `base_url: 'http://localhost:5001/` would be an example.

Next, implementing the `/settings` endpoint in the `server.js` file which will be used as the GET method by the angular app for retrieving this info.

```javascript
//import the config
config = require('./config');

// GET settings route
app.get('/settings', function (req, res) {
    // create the return object
    var settings = {};

    // set the properties
    settings.title = config.app.title;
    settings.environment = config.app.environment;
    settings.webApiUrl = config.api.base_url;

    // return the settings
    res.send(settings);
});
```

## Adding fetch to the Angular App

the fetch api is not [completely supported](http://caniuse.com/#search=fetch) so we will need to add a polyfill to the application for wider broweser support.

First add the fetch npm package and also install the TypeScript typings for code help.

```
#install the window.fetch polyfill
$ npm install whatwg-fetch --save

#install the typescript typings from defintelytyped
$ tsd install whatwg-fetch --save
```

You'll need toadd the reference to `browser.d.ts`

```
/// <reference path="whatwg-fetch/whatwg-fetch.d.ts" />
```

In order to get the `fetch.js` package moved to the `/vendor` folder when the CLI builds (using `ng build`), modify angular-cli-build.js.

```javascript
module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'whatwg-fetch/fetch.js',
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/**/*.+(js|js.map)',
      'es6-shim/es6-shim.js',
      'reflect-metadata/**/*.+(js|js.map)',
      'rxjs/**/*.+(js|js.map)',
      '@angular/**/*.+(js|js.map)'
    ],
    polyfills: [
      'vendor/whatwg-fetch/fetch.js',
      'vendor/es6-shim/es6-shim.js',
      'vendor/reflect-metadata/Reflect.js',
      'vendor/systemjs/dist/system.src.js',
      'vendor/zone.js/dist/zone.js'
    ]
  });
};
```

Need to add the change to the `vendorNpmFiles` section to get the files copied in the `ng build` process and then add **all** of the polyfills section because the cli uses a _default_ list OR \*_this_ list

## AppSettings

When the application calls the `/settings` endpoint on the node server, the returned json needs to be mapped to class to be used for the application, so in this case add a new file  
called `appSettings.ts` to `/src/app` with the following content. Notice that we are also using an interface for typing which will be used but in the mapping later.

```javscript
export interface ISettings {
    title: string,
    environment: string,
    webApiUrl: string,
}

export class appSettings {
    public static settings: ISettings;
}
```

Next, add the `appSettings.ts` class to the barrel (learn more about [barrels in this post](https://tattoocoder.com/angular2-barrels/)), and now we can move to `main.ts` to put all of the peices together.

```
export * from './environment';
export * from './myapp.component';
export * from './appSettings';
```

## Calling the Settings

Since the `appSettings` class and related interface was added to app barrel, add `appSettings, ISettings` to the import statement.

```
import { MyappAppComponent, environment, appSettings, ISettings } from './app/';
```

Using the `fetch` api, we can call the `/settings` endpoint from the originating url and map the `response.json()` to the interface of `ISettings`  
and then set the `settings` property of the `appSettings` class. Finally using the `environment` property returned from the server `enableProdMode()` is set  
based on what the server returns and `bootstrap()` is called.

```
fetch('/settings', { method: 'get' }).then((response) => {
  response.json().then((settings: ISettings) => {
    appSettings.settings = settings;
    if (appSettings.settings.environment == 'production') {
      enableProdMode();
    };
    bootstrap(MyappAppComponent);

  });
});
```

All of this happens prior to the application being started, anything you need to store within the `appSettings` class can be inflated from the server and now that class is available globally by adding the import statement to your  
component.

```
import {appSettings) from './app/';
```

## Testing Environments

There are npm scripts within the [github code](https://github.com/spboyer/a2-serversettings) that builds and sets the NODE\_ENV for development and production.

```
    "build:nodeserver": "ng build && cp -R nodeserver\/* dist",
    "build:nodeserver-prod": "ng build -prod && cp -R nodeserver\/* dist",
    "serve-build" : "rm -rf dist && npm run build:nodeserver && cd dist && npm i && NODE_ENV=development node server.js",
    "serve-build-prod": "rm -rf dist && npm run build:nodeserver-prod && cd dist && npm i && NODE_ENV=production node server.js"
 
```

run `development` using `npm run serve-build` and browse to [http://localhost:3000](http://localhost:3000) and `production` using `npm run serve-build-prod`

All code for this is available at [https://github.com/spboyer/a2-serversettings](https://github.com/spboyer/a2-serversettings)  
Enjoy, comment, share!
