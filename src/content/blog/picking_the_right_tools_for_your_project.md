---
title: "Picking the Right Tools for Your Project"
description: "CodeProjectOver the weekend I was able to release the first of many Windows 8 applications (Download and Rate here) into the store that I have been working on. This first one is just a RSS type application for DZone.com, but it just the first version and the next installment"
pubDate: "2013-01-15T15:49:00.000Z"
updatedDate: "2013-01-28T21:51:08.000Z"
tags:
  - "windows_8"
  - "java_script"
  - "azure"
  - "nodejs"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/picking_the_right_tools_for_your_project/"
---

[CodeProject](http://www.codeproject.com)Over the weekend I was able to release the first of many Windows 8 applications ([Download and Rate here](http://apps.microsoft.com/windows/app/dzone/7a51272f-6174-4f69-9ce8-caaece769d66)) into the store that I have been working on. This first one is just a RSS type application for DZone.com, but it just the first version and the next installment will add more content.  If you have ever planned a good, cross platform application before you may or may not understand that picking the right tools for job are important, and yes even what you're using for the front end language matters sometimes as it did in my case here.

Here is a run down of the application architecture components:

-   Node.js REST API on Azure
    
-   [Express](http://expressjs.com/api.html) : MVC type framework for Node.js for routing, rendering, HTTP Listener
    
-   [Memory-Cache](https://github.com/ptarjan/node-cache) : memory caching on server
    
-   [Cheerio](https://github.com/MatthewMueller/cheerio) : JQuery on the server, lightweight simple HTML parsing
    
-   [Async](https://github.com/caolan/async) : parallel library for Node.js \* Windows 8TypeScript was also used in the Node.js project as well to build out some of the model objects.I wanted my app to present more. More than just the headline and a link off to another web browser as well as offer the ability to re-use what I had done for Windows Phone or other mobile devices.
    

API Architecture Choices - Reuse is Key  
The RSS feeds don't change that much, so I want to create a way to have an API I could reuse for other platforms, but also leverage some caching for high availability, scale out if necessary and also make the development as fast as possible. I chose to go with Node.js on Azure to solve this challenge.**Node.js** ([http://en.wikipedia.org/wiki/Node.js](https://en.wikipedia.org/wiki/Node.js)) - \_Node.js is a packaged compilation of Google's V8 JavaScript engine, the libUV platform abstraction layer, and a core library, which is itself primarily written in JavaScript. \__Node.js was created by Ryan Dahl starting in 2009, and its growth is sponsored by Joyent, his employer._  
\_  
\_Node also has Node Package Manager (npm) which I would or most would say is the equivelant to .NET's nuget package library repository for getting community contributed libraries for accomplishing common tasks such as caching, async and so forth.

I hadn't used node before but I have plenty of JavaScript experience and it was on my list of "want to learn" this year.  I was recently asked why node instead of Web API, other just to say "I used node.js"?  Good question, and a legit one too.  So here is the answer;

Web API is great, I love it and give a talk on "Why you should be using it" at code camps quite often.  However, I found that using C# to parse HTML to not be as flexible and lacked performance in comparison to using Cheerio (JQuery on node.js) when outside of the standard RSS or ATOM formatted feeds. JavaScript is really great at parsing strings.  Secondly, the ability for me to make routes in Express was really easy in comparison to ASP.NET.  For example, in ASP.NET if I wanted to setup a route to handle a controller / action / id route; there are changes needed in the routing configuration as well as potential changes in the controller too.

#### Routing Config

routes.MapHttpRoute(  
    name: "myNewRouteAction",  
    routeTemplate: "api/{controller}/{action}/{id}",  
    defaults: new { id = RouteParameter.Optional }  
);

#### Controller Code

public class ProductsController : ApiController  
{    
     \[HttpGet\]    
     public string Details(int id)  { ... }  
}

Or

public class ProductsController : ApiController  
{    
     public string GetDetails(int id) { ... }  
}

This sets up the API for the action name to be in the url like **_[http://localhost/api/products/details/1](http://localhost/api/products/details/1)_**. By contrast in node the same is accomplished with Express.js by doing the following

app.get('/api/products/details/:id', function(request, response) { ... });

Next, in node I can take advantage of running multiple processes at once for checking for updates while also hosting a REST API for the application.  In another application there are two worker roles in Azure, basically Windows Services, doing this type of work and a single Web role for my Web API.  This allows for me to consolidate the processes into one right now and if the need arises I can break the back end architecture into multiple processes. Flexibility and some simplicity I like here. Here is an example where 3 processes are running at once doing tasks at different intervals all non-blocking.

#### app.js 

var job = function() {  
     console.log("working at 1 second.");  
 };  
var job2 = function() {  
     console.log("working at 3 seconds.");  
};  
setInterval(job, 1000);  
setInterval(job2, 3000);

#### Ouput in Console

Finally, I chose JavaScript/HTML for the UI portions which I'll cover more reasons why later and it's nice to code JavaScript everywhere.

### C#/XAML or HTML5/JavaScript/CSS3 ?

Now I will mention that C# is my first language of choice when diving into any new project and in fact that is what I initially started with, but I found that when getting the contents of the RSS feeds, which were non-standard formatted and in order to consume RSS nicely in C# or VB.NET you have a dependency on the SyndicationFeed assembly which is good and bad. Good if the feed is formatted in the standard RSS or ATOM formats, but bad if the provider has extended it.Once more the article content was also available in nice print formatted HTML, however when using C# in Windows 8 you must embed a browser control and the flow is not fluid in landscape mode.  At least, not the way it should intuitively should appear. However in JavaScript you can take the HTML from the print view and set the innerHTML equal to the result and sprinkle some CSS in there and you are set. No fuss. So HTML5 is the choice here.In making the decision there are some features that I really enjoy about the language and the ability to create Windows applications versus XAML. There is a clear separation of concerns between what is Presentation, Styling, and Logic that I think I had taken for granted in my web development projects.  When using C# and XAML I really structure my project with MVVM pattern using MVVM Light, use some naming convention on my files and folder structures to ensure that just by looking at the project I know what does what where.In a JavaScript Windows 8 project it's clear, just in the tooling and file types.  Now make no mistake you can embed all of the CSS and JavaScript right in the HTML and spaghetti it all up just like anything.  However, the templates and the maturity of the tool set and language almost keeps you from doing so.The HTML5 support in Blend is also great, especially when seeing what CSS styles are applied to what HTML elements, and using the tooling to create a new style from an existing style.  I encourage you to view the video on blendinsider.com .Some other items I'll quickly mention that I like about JavaScript projects in Windows 8CSSmultiple background layers and overall styling much easier than XAMLSupporting snapping, full, landscape etc through media queries I found much more intuitiveJQuery SupportWho doesn't like JQuery when it comes to getting to the DOM?Web Essentials! not that this has anything specific to do with WIndows 8, but if you are doing any HTML, CSS, and/or JavaScript development you MUST get this.  I have been using this for a while and it continues to get better and now has its own dedicated site as [http://vswebessentials.com/I](http://vswebessentials.com/I) will still use C# and XAML as it is my first set of tools, but don't forget the others in the box.  There have been some fantastic tools thrown at the developers and some are very quick to poo poo the idea of a new coding language or application of an existing language in a different way.  Pick what best works towards the success of the project.Here are a few resources for HTML5 and JavaScript Development for Windows 8 [https://www.meetmyapp.in/meetmyapp/windows\_8\_build.aspx](https://www.meetmyapp.in/meetmyapp/windows_8_build.aspx) - Design Templates!!! Ready to go in XAML or HTML/JShttp://31daysofwindows8.com/ - By Clark Sell @csell5 on twitter. [http://dev.windows.comhttp](http://dev.windows.comhttp)://generationapp.com
