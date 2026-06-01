---
title: "Azure Mobile Services & Portable Class Libraries - Part 1 Authentication"
description: "Azure Mobile Services is undoubtedly one of the best platforms to emerge from the Azure group over the last year. If you are a mobile developer and not taking advantage of it; I encourage you to do so. There are many video and blog posts available to get you started"
pubDate: "2013-08-05T19:06:00.000Z"
updatedDate: "2013-08-05T19:06:34.000Z"
tags:
  - "windows__phone"
  - "mvvmlight"
  - "windows__store__apps"
  - "winrt"
  - "azure_mobile"
  - "windows_8"
  - "azure"
  - "wpdev"
  - "authentication"
  - "windows__phone_7"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/azure_mobile_services_portable_class_libraries_part_1_authentication/"
---

Azure Mobile Services is undoubtedly one of the best platforms to emerge from the Azure group over the last year. If you are a mobile developer and not taking advantage of it; I encourage you to do so.  There are many video and blog posts available to get you started at [http://www.windowsazure.com/en-us/develop/mobile/](http://www.windowsazure.com/en-us/develop/mobile/) .

[![](https://4.bp.blogspot.com/-wFQhPER5p58/Uf_QUnXT7LI/AAAAAAAAAh4/mPUDF-7LMco/s320/AzureNuget.PNG)](https://4.bp.blogspot.com/-wFQhPER5p58/Uf_QUnXT7LI/AAAAAAAAAh4/mPUDF-7LMco/s1600/AzureNuget.PNG)One of the features you may not be aware of is Azure Mobile Services is a Portable Class Library (PCL) available through nuget. If you are not familiar with PCL's see my "[Move Your ViewModels](http://blog.tattoocoder.com/2013/01/portable-mvvm-light-move-your-view.html)" series.

There is a caveat however when using Azure Mobile Services in your PCL; although all of the data calls to the services are available, using the [Identity](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-wp8/) feature is not and must be implemented in a platform specific way.

The Identity feature allows your application to leverage the user's Microsoft, Google, Facebook or Twitter account to login to the application and abstract the overhead of OAuth or provider specific authentication models into a single call.

> var user = MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);

### The Challenge - Maximize Code Reuse

There is no secret that Model-View-View-Model (MVVM) is a preferred pattern for xaml developers, but it is also know that sometimes breaking patterns is needed either due to time constraints or other restrictions.

In the effort to maintain the MVVM pattern in this scenario a platform abstraction is needed to accomplish to goal of reusing as much code as possible.  [Matt Hidinger](https://www.twitter.com/matthidinger) did a [great talk at BUILD 2013](http://www.matthidinger.com/archive/2013/07/02/video-and-code-from-my-build-talk-on-sharing-code.aspx) this year on this topic, give a watch on his [blog](http://www.matthidinger.com/archive/2013/07/02/video-and-code-from-my-build-talk-on-sharing-code.aspx).

### Scenario - Setting up your solution

I won't walk through setting up a Mobile Service on Azure, [see this post for instructions](http://www.windowsazure.com/en-us/develop/mobile/), so let's assume we have a Windows Phone & Windows Store application where we'd like to share code in a Portable Class Library and allow the user to login with their Twitter account. The project solution should contain 3 projects:

[![](https://1.bp.blogspot.com/-Jazrb31Bp-o/Uf_dd2K-F0I/AAAAAAAAAiI/yux5KOb6WX8/s320/Solution.PNG)](https://1.bp.blogspot.com/-Jazrb31Bp-o/Uf_dd2K-F0I/AAAAAAAAAiI/yux5KOb6WX8/s1600/Solution.PNG)\* PortableAzure.Win8 - Windows 8 Blank  Application

-   PortableAzure.Phone8 - Windows Phone 8 Application
    
-   PortableAzure.Core - Portable Class Library Project  
    I have added the following nuget packages to the projects
    
-   Microsoft.Net.Http
    
-   Portable.MvvmLightLibs
    
-   WindowsAzure.MobileServices  
    There is some plumbing related to the MVVM structure that is needed as well.  Get the "before" code here [http://sdrv.ms/14ufYYZ](http://sdrv.ms/14ufYYZ) , your solution explorer should look like the image here ->.
    

### Adding Azure 

_Assumption(s) - you have created a Azure Mobile Service._

First, you will want to add a new class to the \*\*Services \*\*folder in the **PortableAzure.Core** project and call it AzureMobileServices. I have also added an empty interface out of habit and to use for IoC (Inversion of Control).

> namespace PortableAzure.Core.Services  
> {  
>     public class AzureMobileServices : IAzureMobileServices  
>     {  
>         public MobileServiceClient MobileService = new MobileServiceClient(  
>             "[https://portableazure.azure-mobile.net/](https://portableazure.azure-mobile.net/)",  
>             "\[your app key\]"  
>         );  
>         public AzureMobileServices()  
>         {  
>         }  
>     }  
>     public interface IAzureMobileServices  
>     {  
>     }  
> }  
> The app key and url comes from the Azure portal when you complete the setup; you will want to choose "Connect to an Existing Project". Either Windows Phone or Windows 8 is an acceptable choice.

Next step is to [setup the Twitter authentication](http://www.windowsazure.com/en-us/develop/mobile/how-to-guides/register-for-twitter-authentication/), or other provider of your choosing.  ([reference](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-users-wp8/))

Now that that is complete, we'll add the necessary platform specific code to the Windows Phone & Windows 8 platforms to prompt the user to login using their Twitter account.

### Windows Phone

Open the App.xaml.cs and create a new property for the AzureMobileService class from the Core project.

>     public partial class App : Application  
>     {  
>         /// <summary>  
>         /// Provides easy access to the root frame of the Phone Application.  
>         /// </summary>  
>         /// <returns>The root frame of the Phone Application.</returns>  
>         public static PhoneApplicationFrame RootFrame { get; private set; } >        \*\* public AzureMobileServices Azure { get; private set; } \*\*>         /// <summary>  
>         /// Constructor for the Application object.  
>         /// </summary>  
>         public App()  
> Then in the App constructor create the new instance of the AzureMobileService class.

> Azure = new AzureMobileServices(); In order to prompt the user, open the MainPage.xaml.cs file and add the following code to the PhoneApplicationPage\_Loaded event.

>  private async void PhoneApplicationPage\_Loaded(object sender, RoutedEventArgs e)  
>         {  
>             MobileServiceUser user = null;  
>             while (user == null)  
>             {  
>                 string message;  
>                 try  
>                 {  
>                     user = await((App)Application.Current).Azure.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);  
>                     message = string.Format("You are now logged in - {0}", user.UserId);  
>                 }  
>                 catch (InvalidOperationException)  
>                 {  
>                     message = "You must log in. Login Required";  
>                 }  
>                 MessageBox.Show(message);  
>             }  
>         }

### Windows 8

The implementation is essentially the same for Windows 8 with the exception of how to show a message box.

> private async void Page\_Loaded(object sender, RoutedEventArgs e)  
>         {  
>             MobileServiceUser user = null;  
>             while (user == null)  
>             {  
>                 string message;  
>                 try  
>                 {  
>                     user = await((App)Application.Current).Azure.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);  
>                     message = string.Format("You are now logged in - {0}", user.UserId);  
>                 }  
>                 catch (InvalidOperationException)  
>                 {  
>                     message = "You must log in. Login Required";  
>                 }  
>                 **var dialog = new MessageDialog(message);  
>                 dialog.Commands.Add(new UICommand("OK"));  
>                 await dialog.ShowAsync();**  
>             }  
>         }

### The Good & Bad - so far

To this point everything is working great and we have now effectively added the authentication to each platform using the Identity features in Azure Mobile Services. But other than the url and the key of the Azure Mobile Service; there isn't a lot of code reuse in this scenario.

This is a necessity when there are platform specific implementations of a feature.  In this case, the UI needs to present differently and cannot re-use the xaml or controls that are a part of the login utility for the specified provider.

The bad part of this is it breaks the MVVM pattern to a degree by putting some of the logic in the code behind.

In the next installment, I'll show how to add an abstraction layer and use the MVVM Light Event Bus to push some of this code back to our view models.

Here is the completed [code for Part 1](http://sdrv.ms/14upB9R).
