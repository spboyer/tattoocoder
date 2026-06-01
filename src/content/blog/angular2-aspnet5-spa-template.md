---
title: "An Angular 2 and ASP.NET 5 SPA Template giving you the best tech now."
description: "Use the fastest SPA framework in Angular 2 with the best server framework ASP.NET 5 on any OS. A SPA template for today using tomorrow's technology."
pubDate: "2015-11-13T18:19:33.000Z"
updatedDate: "2015-11-21T15:06:48.000Z"
tags:
  - "angular2"
  - "aspnet5"
  - "spa"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular2-aspnet5-spa-template/"
---

\*\*\*Updated 11.19.2015 for RC1: [http://github.com/spboyer/cleanshave](https://github.com/spboyer/cleanshave)

Two of the technology stacks that are at the forefront and making a lot of noise are Angular 2 and ASP.NET 5.

Angular 2, for obvious reasons, this is the next rev of Google's SPA framework. And just to highlight a few points, from my perspective, why I'm paying attention.

-   Built with TypeScript
-   Performance gains
-   Browser support (IE 9 even there)
-   Mobile first thought

ASP.NET 5, I have been talking, blogging and contributing to this project over the last 18+ months and I'm very excited of what it is already showing.

-   Rebuilt with Cloud in mind
-   Cross Platform - Linux, OS X, Windows
-   Middleware model - much like node.js
-   Huge speed improvements
-   much more..

At the Microsoft MVP Summit this November; Brad Green from Google presented on Angular 2, status of the framework, collaboration with Microsoft and things to come. Check out his presentation [here](https://channel9.msdn.com/Events/ASPNET-Events/ASPNET-Fall-Sessions/Brad-Green-from-Google).

Next, Steve Sanderson from the ASP.NET team presented the Music Store application in Angular 2 and ASP.NET 5. Below is the full presentation from Channel 9.

<iframe src="https://channel9.msdn.com/Events/ASPNET-Events/ASPNET-Fall-Sessions/ASPNET--Spa/player" width="640" height="360" allowfullscreen="" frameborder="0"></iframe>

### A Basic SPA Template

Based on Steve's talk I put together a basic template to use. The code is available on [GitHub](https://github.com/spboyer/cleanshave) ([http://github.com/spboyer/cleanshave](https://github.com/spboyer/cleanshave)).

#### Getting Setup

Things you will need

-   ASP.NET 5 - [docs.asp.net](https://docs.asp.net) to install the latest version
-   Typescript - [typescriptlang.org](http://typescriptlang.org/#Download) or `npm install typescript -g` from a terminal window
-   Node.js - [nodejs.org](http://nodejs.org) or `brew install node` or for windows `choco install nodejs`

These are the base items, a couple other tools used in the solution are [nodemon](http://nodemon.io) and gulp. Install via terminal `npm install nodemon gulp-cli -g`.

Next,

1.  Fork and clone the site
2.  Run `npm install`
3.  Open a terminal window and execute `npm run tsc`, this starts the TypeScript compiler
4.  Open a second terminal window and execute `npm start`. This command runs the `gulp build` task, then starts [nodemon](http://nodemon.io) for `dnx web`. The `nodemon` process will watch for any changes to the C# code and/or JavaScript files (transpiled from `tsc`) and restart then **kestrel** server.
5.  Open [http://localhost:5000](http://localhost:5000)

#### App Structure

The ASP.NET 5 application is nothing more than a simple web application, same format you could generate from the built in templates in Visual Studio (without Authentication chosen) or using the [Yeoman generators](https://github.com/omnisharp/generator-aspnet).

-   `Views/Home/Index.cshtml` file is the html file containing the host of the Angular application tag.
-   `Views/Shared/_Layout.cshtml` is the shell html file.
-   `Startup.cs` - one piece that is important to call out here in relation to the Angular routing is the following:

```
// 404 routing, or otherwise routing logic
// if route is not found go Home
routes.MapRoute("spa-fallback", "{*anything}", new { controller = "Home", action = "Index" });
```

#### Angular 2 Code

All of the Angular 2 code is withing the `wwwroot` folder, due to the fact that all static content under ASP.NET 5 is to live in the location referenced in the `webroot` property defined in `project.json` file.

![app-root](/content/images/imported/angular2-aspnet5-spa-template-image-0.png)

Because this is a starter template, it is a simple structure. If you want add a new view to the site, it's pretty simple.

Add the folder and view (`my/my.html`)  
![myfolder](/content/images/imported/angular2-aspnet5-spa-template-image-1.png)

```
<div class="container">
	<h1>My Page</h1>
</div>
```

Add the component (`my.ts`)  
![mytsfile](/content/images/imported/angular2-aspnet5-spa-template-image-2.png)

```
import * as ng from 'angular2/angular2';

@ng.Component({
	selector: 'my',
	templateUrl: './app/my/my.html'
})
export class My{

	constructor() {

	}
}
```

Add the new route in `routes.config.ts`  
![routes](http://)

And finally add the link to the `app.html` page in the _navigation_ portions of the template.

```
<li><a [router-link]="[routes.my.as]">My</a></li>
```

![link](/content/images/imported/angular2-aspnet5-spa-template-image-4.png)

If you have the site still running, the `tsc` compiler and `nodemon` will pick up all of these changes and all you have to do is refresh. (as a note make sure that you have the dev tools open in Chrome and cache disabled).

### Opening the code in Visual Studio 2015

To open in VS you need to open using the git connector.

![screen shot 2015-11-21 at 8 46 44 am](https://cloud.githubusercontent.com/assets/7681382/11319010/828bae9a-9036-11e5-8e8e-fa09533e5db6.png)

Then open the `project.json` file. Be sure to have the **ASPNET 5** file/project type selected.

![screen shot 2015-11-21 at 8 47 23 am](https://cloud.githubusercontent.com/assets/7681382/11319012/a6cdbbfe-9036-11e5-9ff9-6f4fc91f90a8.png)

get the latest push of the code, I had to add a `Before Build` step to have the gulp tasks run and build/compile the typescript and angular 2 project portions if you are just going to F5.

#### Summary

Give this a look, comment, share. There is a need for a good SPA template for ASP.NET 5. If there are core features, let's put them in send a PR or submit an [issue](https://github.com/spboyer/cleanshave/issues).

Thanks!
