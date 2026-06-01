---
title: "Angular 2: Application Settings using the CLI Environment Option"
description: "Application wide settings can be a long conversation when starting a new application. Here are just a few questions when some of my teams started this conversation: Do we use ENV variables? What about manual bootstrap? Configuration files? Should we get them from the server? Using angular-cli &amp; environment.ts"
pubDate: "2017-02-22T13:00:00.000Z"
updatedDate: "2017-02-23T16:40:23.000Z"
heroImage: "/content/images/imported/angular-cli-using-the-environment-option-cover.png"
tags:
  - "angular2"
  - "angular-cli"
  - "angular"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular-cli-using-the-environment-option/"
---

![a2-cli-env](/content/images/imported/angular-cli-using-the-environment-option-image-0.png)  
Application wide settings can be a long conversation when starting a new application. Here are just a few questions when some of my teams started this conversation:

1.  Do we use ENV variables?
2.  What about _manual bootstrap_?
3.  Configuration files?
4.  Should we get them from the server?

### Using angular-cli & environment.ts

The new angular-cli have the concept of different environments like development (**dev**) and production (**prod**). When creating a new application with the cli `ng my-app` and **/environments** folder is a part of the scaffold which contains the environment files.

```
.
├── environment.ts
├── environment.prod.ts
.
.
```

and then within the **/src/app** folder is and `environment.ts` file.

Here are the contents:

```
export const environment = {
  production: false
};
```

As you might imagine, the \*.production.ts file would have `production: true`.

When the application is built (ng build) or served (ng serve), the environment.{env}.ts file from /environments is pulled and replaces the file within /src/app. By default this is dev.

In order to grab the production version, set the environment to production using the following:

```bash
#build
$ ng build --environment=production
#shorthand
$ ng b -prod

#serve
$ ng serve --environment=production
#shorthand
$ ng s -prod
```

### Adding additional environments - ~_not yet supported_~

If there are additional environments your build process needs to support, you can add more files to the **/environments** folder with the name of said environment such as `environment.qa.ts` and then use.

```bash
#build
$ ng build --environment=environment
```

~One drawback here is there is no `-qa` shorthand supported.~

~\*\*\* Although the file is picked up by the CLI, there is a bug that the environments supported are only **prod** or **dev**~

#### Adding a "qa" environment.

Create a new file called **environment.qa.ts** in the **/environment** folder with the following contents:

```javascript
export const environment = {
  production: false,
  envName: 'qa'
};
```

Add the **qa** entry to the **.angular.cli.json** config:

```javascript
  "environments": {
    "dev": "environments/environment.ts",
    "prod": "environments/environment.prod.ts",
    "qa": "environments/environment.qa.ts"
  }
```

Now the new environment is ready to use.

### Putting it together

First, add a new property to each of the environment.{env}.ts files.

```javascript
export const environment = {
  production: false,
  envName: 'dev'
};
```

Then in the `myapp.component.ts` file import settings, and set the binding.

```javascript
import { Component } from '@angular/core';
import { environment } from './environment';

@Component({
  moduleId: module.id,
  selector: 'myapp-app',
  templateUrl: 'myapp.component.html',
  styleUrls: ['myapp.component.css']
})
export class MyappAppComponent {
  title = 'myapp works!';
  environmentName = environment.envName;
}
```

Finally, in the html template add the h2 tag.

```html
<h1>
  {{title}}
</h1>

<h2>
  {{environmentName}}
</h2>
```

Now if you serve the app with each of the `--environment={envName}`, the binding will display accordingly. Note that the short hand `ng s -prod` will not work for custom environments i.e. `ng s -qa`, however you can use `ng s -e qa`

### Notes

Although this is a nice feature there are some things to point out as shortcomings, challenges etc.

-   ~only **production** or **development** are supported~
-   For every property that is added to the `/src/app/environment.ts`, it must be added to the files in `/config/environment.{env}.ts`, this is a disruptive workflow.
-   Using this as a solution only works if you are building your application from source and not once then moving to each environment.
-   ~this may change! There is a current issue on the angular-cli repo addressing this very issue : [https://github.com/angular/angular-cli/issues/933](https://github.com/angular/angular-cli/issues/933)~ **Issue Closed**
-   the `/src/app/environment.ts` is only a _stub_ per se and there to support the typescript compiler and serves no other purpose.

Enjoy, share, comment...
