---
title: "TypeScript for Windows 8 Store Apps"
description: "What is TypeScript? See http://www.typescriptlang.org TypeScript was recently released and has become the new hot topic. One of the questions I have asked and heard is can we use this for developing Windows Store Applications with Javascript and have the cool features that have been shown in"
pubDate: "2012-10-09T18:48:00.000Z"
updatedDate: "2012-10-12T15:25:18.000Z"
tags:
  - "winrt"
  - "windows__store__apps"
  - "windows_8"
  - "type_script"
  - "win_j_s"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/type_script_for_windows_8_store_apps/"
---

### What is TypeScript? 

See [http://www.typescriptlang.org](http://www.typescriptlang.org/)

TypeScript was recently released and has become the new hot topic.  One of the questions I have asked and heard is can we use this for developing Windows Store Applications with Javascript and have the cool features that have been shown in the videos and examples.

One of the great features was the split window feature where you can code in TypeScript on the left and upon hitting save, it compiles to Javascript on the left. So I fired up a new Javascript Windows Store project in Visual Studio to give it a shot to see if it all works.  Before we get started make sure that you have the following:

-   Windows 8 & VS2012
-   Download the plugin: [http://go.microsoft.com/fwlink/?LinkID=266563](https://go.microsoft.com/fwlink/?LinkID=266563)
-   VS 2012 Web Essentials: [http://visualstudiogallery.msdn.microsoft.com/07d54d12-7133-4e15-becb-6f451ea3bea6](http://visualstudiogallery.msdn.microsoft.com/07d54d12-7133-4e15-becb-6f451ea3bea6)

### Create a New Project

Start by creating a new project. I just went with the "Blank App" template for purposes of this post, but any of the installed templates are certainly applicable.Click "OK" and you will see that in the Solution Explorer the following structure.  Expand the "js" folder to see the javascript files that are there by default.

### Adding the TypeScript Functionality

There are a couple of files that are needed to making TypeScript and Windows 8 play nicely together, as well as jQuery.  The best way to describe these is that they are wrappers for the WinJS, WinRT and JQuery or helpers.  There is also lib.d.ts which is a noted in the file as "ECMA Script APIs" Click on any of these to see the source.winjs.d.tswinrt.d.tsjquery.d.tslib.d.tsI downloaded all of these and now put them in a folder called tsWin in the project for referencing in my other ts files.In the examples that have been shown online, by simply adding a .ts file to your project and hitting save; Visual Studio will automatically create the .js file and associate it to the TypeScript file and show the compiled javascript in the split window.  However, this is not the case in a Windows Store Application...Yet.But we can still make this all work, here's how.Add a new javascript file to the js folder BUT name it with the extension .ts. I named the file Data.ts.  Next, repeat and name the file Data.js. Your solution explorer should look like this now. Note that I also added the tsWin folder and the mentioned files as well.

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;"><a href="https://2.bp.blogspot.com/-sBsmbG_oEtU/UHRctAAfecI/AAAAAAAAAWo/hxlg24iVHew/s1600/AddNewFiles.PNG"><img src="https://2.bp.blogspot.com/-sBsmbG_oEtU/UHRctAAfecI/AAAAAAAAAWo/hxlg24iVHew/s400/AddNewFiles.PNG" alt=""></a></td></tr><tr><td class="tr-caption" style="text-align: center;"><p></p></td></tr></tbody></table>

Now you can open the data.ts file and get the split window that has been presented and see that the .js file that is compiled on the right. There is another file here that is important as well called win.ts, it adds a wrapper for setImmediate and references the winrt.d.ts and winjs.d.t.s files.  I reference this file in any of the TypeScript that I am using but put it within the js folder.

### A Quick Example

So here is a quick example that will walk through the following concepts:Creating a simple classExtending the class through inheritanceUsing Location ServicesRetrieving a static map from Google Maps APIInserting the image control onto the page.Open the data.ts file.  We will first create the initial Location class and the MyLocation class in TypeScript  and see the output to javascript.TypeScript:///module Data {    class Location {        longitude: any;        latitude: any;        url: string;    }    class MyLocation extends Location {        retrieved: any;    }};Javascript:var \_\_extends = this.\_\_extends || function (d, b) {    function \_\_() { this.constructor = d; }    \_\_.prototype = b.prototype;    d.prototype = new \_\_();}var Data;(function (Data) {    var Location = (function () {        function Location() { }        return Location;    })();       var MyLocation = (function (\_super) {        \_\_extends(MyLocation, \_super);        function MyLocation() {            \_super.apply(this, arguments);        }        return MyLocation;    })(Location);   })(Data || (Data = {}));; ;Screen shot just to visualize what's show in VS 2012Not sure about you, but I wouldn't want to write the inheritance code for Javscript, TypeScript kills it there! Ok, let's move on. Next I will add the function to get the location from the device, populate the myLoc object and then create and insert the image into the body of the page.Note that the TypeScript and Javacript to do this are one and the same, difference here is that we have type safe code.TypeScript:  var locator = new Windows.Devices.Geolocation.Geolocator();  locator.getGeopositionAsync().then(function (pos) {        var myLoc = new MyLocation();      myLoc.latitude = pos.coordinate.latitude;      myLoc.longitude = pos.coordinate.longitude;      myLoc.retrieved = Date.now;      myLoc.url = "[http://maps.googleapis.com/maps/api/staticmap?center=](https://maps.googleapis.com/maps/api/staticmap?center=)"          + myLoc.latitude + "," + myLoc.longitude          + "&zoom=12&size=400x400&sensor=false"; // add a new img tag to the document var img = document.createElement("img"); // set the src and style img.setAttribute("src", myLoc.url); img.setAttribute("style", "height:400px;width:400px;"); // get the paragraph tag we set for the location of the content var p = document.body.getElementsByTagName("p")\[0\]; p.appendChild(img);When you hit save you'll notice that on the status bar at the bottom left of Visual Studio it will read "Compiling TypeScript..." and then the resulting Javascript will refresh/show on the right pane.  It is important to note that if you have the ,js file open you will get the prompt "Such and such file is open would you like to reload".Before you run the application make sure that you enable the Location capabilities in the package manifest file as shown below or you will get a nasty message box letting you know you didn't.Ok, hit F5 and see the results.First you'll get the let me use location services prompt.And then the page is presented with the downloaded map.That's a little get started primer on TypeScript and Windows Store Apps!  Pretty awesome stuff.Tips & Tricks

#### Content / Package Type

Make sure that all of the TypeScript (.ts) files are marked as None so they are not distributed unnecessarily with your application.

#### Debugging

You can put break points in the generated .js files and have access to the immediate window, watch etc.

#### Dependent Files

I like to see the dependent files like I'm used to seeing in other project types (see below).  Since this is not built in to the Windows Store functionality with TypeScript yet, here is how to do it.You need to edit the project file.  The best way to do this is to use the Power Commands for Visual Studio extension, or browse to it and open in notepad or some other text editor.

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;"><a href="https://4.bp.blogspot.com/-SyPYCvo47uI/UHRukrMHldI/AAAAAAAAAX8/lmfi9arHPHQ/s1600/PowerCommands.PNG"><img src="https://4.bp.blogspot.com/-SyPYCvo47uI/UHRukrMHldI/AAAAAAAAAX8/lmfi9arHPHQ/s400/PowerCommands.PNG" alt=""></a></td></tr><tr><td class="tr-caption" style="text-align: center;">PowerCommands for Visual Studio</td></tr></tbody></table>

For this solution locate the data.ts reference in the file and change it to the following:          data.ts        Save the file and reload the project and you can now see that the .js file will be shown below the .ts file.ConclusionI have had some real fun getting into this and trying it out with the Store apps.  Coming from a C# / XAML life for the last many years, it will be interesting for me to back to some scripting.  I like the option and I see some really cool opportunities with TypeScript.DOWNLOAD THE CODE FOR THE EXAMPLE
