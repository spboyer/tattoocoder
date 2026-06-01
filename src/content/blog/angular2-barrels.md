---
title: "Angular 2 : Organization Using {barrels}"
description: "The import statements in Angular 2 can get pretty cumbersome if you're using a lot of services, models, directives etc in any specific component. Looking at the basic &quot;QuickStart&quot;, the app.component.ts doesn't seem very obtuse. import {Component} from 'angular2/core'; @Component({ selector: 'my-app', template: '&lt;"
pubDate: "2016-05-04T02:00:03.000Z"
updatedDate: "2016-11-21T19:15:13.000Z"
heroImage: "/content/images/imported/angular2-barrels-cover.png"
tags:
  - "angular2"
  - "materialdesign"
  - "typescript"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/angular2-barrels/"
---

![a2barrels](https://www.shayneboyer.com/content/images/2016/05/a2barrels.png)

The import statements in Angular 2 can get pretty cumbersome if you're using a lot of services, models, directives etc in any specific component.

Looking at the basic "QuickStart", the **app.component.ts** doesn't seem very obtuse.

```javascript
import {Component} from 'angular2/core';

@Component({
    selector: 'my-app',
    template: '<h1>Quickstart</h1>'
})
export class AppComponent { }
```

However, looking at the Tour of Heroes example:

```javascript
import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { HeroService } from './hero.service';
import { DashboardComponent } from './dashboard.component';
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['Dashboard']">Dashboard</a>
      <a [routerLink]="['Heroes']">Heroes</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    HeroService
  ]
})
.
.
.
```

You can see how as additional parts of the application are adding to the _import_ area, especially if a _clean / readable code_ approach is taken.

In a recent project, adding the Material Design 2 components caused what I call "import noise" so I used **barrel** to organize and reduce the impact.

> **import noise** - this is an issue seen in languages where there are dependencies that need to be "imported", "required", or "included" and the first (1 - n) lines are non functional code.

# Barrels

In the [Angular 2 docs](https://angular.io/docs/ts/latest/glossary.html#!#barrel), a barrel is defined as:

"_A barrel is a way to rollup exports from several modules into a single convenience module. The barrel itself is a module file that re-exports selected exports of other modules._"

## Material Design Example

Adding all of the components of material design takes the quickstart **app.component.ts** to this:

```javascript
import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdCheckbox} from '@angular2-material/checkbox';
import {MdRadioButton} from '@angular2-material/radio';
import {MdRadioDispatcher} from '@angular2-material/radio/radio_dispatcher';
import {MdSpinner} from '@angular2-material/progress-circle';
import {MdProgressBar} from '@angular2-material/progress-bar';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

@Component({
  moduleId: __moduleName,
  selector: 'my-app',
  providers: [ROUTER_PROVIDERS, MdRadioDispatcher, MdRadioButton],
  templateUrl: 'devsticky.component.html',
  styleUrls: ['devsticky.component.css'],
  directives: [ROUTER_DIRECTIVES, 
    MD_SIDENAV_DIRECTIVES,
    MD_CARD_DIRECTIVES,
    MdToolbar,
    MdButton,
    MdCheckbox,
    MdRadioButton,
    MdSpinner,
    MD_INPUT_DIRECTIVES,
    MD_LIST_DIRECTIVES,
    MdProgressBar],
  pipes: []
})
@RouteConfig([
])
```

That's 12 lines of just _import noise_. Quick fix is to create another file, in this case it'll live in a folder called **/material-design** named **index.ts**

Simply take all of the related modules and move the import statements from the **app.component.ts** file and mark them as "_export \* from_"

```javascript
export * from '@angular2-material/toolbar';
export * from '@angular2-material/button';
export * from '@angular2-material/checkbox';
export * from '@angular2-material/sidenav';
export * from '@angular2-material/radio';
export * from '@angular2-material/progress-circle';
export * from '@angular2-material/progress-bar';
export * from '@angular2-material/input';
export * from '@angular2-material/list';
export * from '@angular2-material/card';
export * from '@angular2-material/radio/radio_dispatcher';
```

This is an import/export of the module. Now go back to the **app.component.ts** file and just add

```javascript
import {MdButton, MdCheckbox, MdRadioButton, MdRadioDispatcher, MdToolbar, MdSpinner, MdProgressBar, MD_CARD_DIRECTIVES, MD_INPUT_DIRECTIVES, MD_LIST_DIRECTIVES, MD_SIDENAV_DIRECTIVES} from './material-design';
```

This takes the 12 lines to one _really long_ line; which could be reduced further.

```javascript
import * as md from './material-design';
```

That's pretty reduced! The `* as md` imports all of the modules and aliases as `md`. Depending on your editor, errors/warnings may show in the `directives:` portion of the component because it cannot find `MD_SIDENAV_DIRECTIVES` for instance.

Fix is to add the alias -> `md.MD_SIDENAV_DIRECTIVES` to this and any of the material design dependencies being used.

Using barrels will help make your code readable and maintainable. The Angular 2 source heavily uses these, browse through the code and you'll see this in places like `@angular/core`.

Enjoy.
