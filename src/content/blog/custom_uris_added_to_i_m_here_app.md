---
title: "Custom URIs added to I'm Here App"
description: "I took a few moments to add custom URI launchers for my I'm Here app on Windows Phone so it could be used in Rob Irving's Car Dash app. It was a really quick add to the app, however the one are I found to be a pain was testing"
pubDate: "2014-01-14T16:22:00.000Z"
updatedDate: "2014-01-14T16:22:05.000Z"
tags:
  - "windows__phone"
  - "apps"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/custom_uris_added_to_i_m_here_app/"
---

I took a few moments to add custom URI launchers for my [I'm Here](http://www.windowsphone.com/s?appid=f7a8d5e3-86c8-4661-af6f-b8f566837345) app on Windows Phone so it could be used in [Rob Irving's Car Dash](http://www.windowsphone.com/en-us/store/app/car-dash/5c8c34e1-34c4-4e3e-87b5-bbb7d4a8c652) app.  It was a really quick add to the app, however the one are I found to be a pain was testing it.  I actually had to write another phone app to test it. Not that it was a chore, just didn't consider that when I started, I made an assumption I could've just typed i the URI in Internet Explorer or mocked an SMS message like you can in iOS.

If you have a Windows Phone App that offers functionality that other apps can use there is no reason not to offer custom launchers.  It takes about an hour total development time, and the benefit can more than just adding the functionality.

In my case, one I learned how to do it. Two, I get free marketing from another very successful app. Make sure you document your URI on the [Nokia page](http://developer.nokia.com/Community/Wiki/URI_Association_Schemes_List) here to let every other developer know for extra exposure. And finally, made a nice connection in the developer community.  Who knows, maybe the next big thing will happen when Rob and I team up...

If you want to use I'm Here in your app here is the simple launcher URI code to do so.

> // launch the app  
> await Windows.System.Launcher.LaunchUriAsync(new Uri("imhere:"));  
> // launch the app and share location via SMS
> 
> await Windows.System.Launcher.LaunchUriAsync(new Uri("imhere://share/text"));  
> // launch the app and share location via Email
> 
> await Windows.System.Launcher.LaunchUriAsync(new Uri("imhere://share/email"));  
> // launch the app and share location via Social Apps
> 
> await Windows.System.Launcher.LaunchUriAsync(new Uri("imhere://share/social"));
> 
> // launch the app and share location via WhatsApp application  
> await Windows.System.Launcher.LaunchUriAsync(new Uri("imhere://share/whatsapp"));

Be sure to checkout [my apps](http://blog.tattoocoder.com/p/my-apps.html) and the other links below to take advantage of the custom URIs in you own apps.

[Rob Irving on Twitter](https://www.twitter.com/robwirving)  
[Nokia URI Association Schemes List](http://developer.nokia.com/Community/Wiki/URI_Association_Schemes_List)  
[URI associations for Windows Phone - How To](http://developer.nokia.com/Community/Wiki/URI_associations_for_Windows_Phone)  
[Reserved file and URI associations for Windows Phone 8](http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj207065\(v%3Dvs.105\).aspx#BKMK_Reservedprotocolnames)
