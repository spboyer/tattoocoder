---
title: "Azure Mobile Services & Portable Class Libraries - Part 2 Authentication Cont'd"
description: "In Part 1 I covered a simple implementation of the Authentication feature and portable class libraries from the Azure Mobile Services SDK. However, as mentioned in the &quot;Good &amp; Bad So Far&quot; section; there is not a whole lot of code reuse other than the Azure endpoint and"
pubDate: "2013-08-24T15:25:00.000Z"
updatedDate: "2013-08-24T15:31:26.000Z"
tags:
  - "windows__phone"
  - "mvvmlight"
  - "winrt"
  - "windows_8"
  - "azure_mobile"
  - "windows__store__apps"
  - "azure"
  - "wpdev"
  - "authentication"
  - "windows__phone_7"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/azure_mobile_services_portable_class_libraries_part_2_authentication_cont_d/"
---

In [Part 1](http://blog.tattoocoder.com/2013/08/azure-mobile-services-portable-class.html) I covered a simple implementation of the Authentication feature and portable class libraries from the Azure Mobile Services SDK.  However, as mentioned in the "Good & Bad So Far" section; there is not a whole lot of code reuse other than the Azure endpoint and secret key.  Let's refactor a bit by adding some interfaces, conditional compile statements and the MVVM Light Event Bus to help the same solution operate cleaner.

The "after" code for part one is [available here.](http://sdrv.ms/14upB9R)

### Building Our Core

PortableAzure.Core is our Portable Class Library that is being shared with the Windows 8 and  Windows Phone project in the attempt to reuse as much code as possible.  However, as mentioned in [Part 1](http://blog.tattoocoder.com/2013/08/azure-mobile-services-portable-class.html) the authentication portion of the Azure Mobile Service SDK is a platform specific implementation due to the UX pieces of that component and how it is presented varies.

#### Platform Adapter (PlatformAdapter.cs)

In the Services folder, add a new class called PlatformAdapter.cs.  This is an abstract class that will be used as the base class for the platform specific implementation.

    public abstract class PlatformAdapter
    {
        public static PlatformAdapter Current { get; set; }
        public abstract IIdentity Identity { get; }
    }

#### Identity (IIdentity.cs)

Add a new Identity interface, IIdentity.cs to be used as the implementation to execute the Authenticate method as well as store the MobileServiceUser upon logging in.

    public interface IIdentity
    {
        void Authenticate();
        MobileServiceUser User { get; set; }
    }

 Messages  
Add a **Messages** folder to the root and a class called LoginMessage.cs to newly created folder.

Using the Event Bus from MVVM Light, a LoginMessage will be sent from the platform specific MainPage.xaml then subsequently handled in the MainViewModel.  The LoginMessage is just an empty class at this point.

    namespace PortableAzure.Core.Messages {
        public class LoginMessage { } 
    }

### Adding Adapters to the Platforms

On each plaftform we need to now inherit from the PlatformAdapter.cs class in the Services namespace from the Core library as well as implement the IIdentity interface thus replacing the code shown in part one with this code.

#### Windows Phone

Add an "Adapters" folder to the root of the project and then a Platform.cs class which inherits from PlatformAdapter.

namespace PortableAzure.Phone8.Adapters
{
    public class Platform : PlatformAdapter
    {
        public IIdentity \_identity = new Identity();

        public override IIdentity Identity
        {
            get
            {
                return \_identity;
            }
        }
    }
}

Next, add the Identity class which is where all of the heavy lifting is done for the login logic.

namespace PortableAzure.Phone8.Adapters
{
    public class Identity : IIdentity
    {
        public async void Authenticate()
        {
            var app = ((App)Application.Current);

            string message = string.Empty;

            while (this.User == null)
            {
                try
                {
                    User = await app.Azure.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);

                    message = string.Format("You are now logged in - {0}", User.UserId);
                }

                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }
            }

            MessageBox.Show(message);
        }

        public MobileServiceUser User { get; set; }
    }
}   
   
   
   

Now that the Windows Phone implementation is complete we need to tell the Service library what is the current class is for the PlaformAdapater.  This is set in the App.xaml.cs class in the App contstructor:

public App()
{
   Azure = new AzureMobileServices();

   PortableAzure.Core.Services.PlatformAdapter.Current = new Platform();

   ...

#### Windows 8

To implement the PlatformAdapter class in the Windows 8 application, you could follow the same steps as documented for the Phone project, but that is duplication and not manageable over time.

So in this case we will use add the existing Identity and Platform classes then add conditional compile statements to the areas of the classes where needed to address the small differences for Windows versus Phone.

Add Existing item by holding the Alt key and dragging the file, or the whole folder from the Phone project to the Windows 8 Project.  Thanks [Matt Hidinger](https://www.twitter.com/matthidinger) for this little trick. You could also just go through the right click -> add existing -> add as link process but now that you know the "Hold Alt + Drag" why??

Here are the completed Platform and Identity classes.  You will need to repeat the setting of the current platform in the App.xaml.cs constructor.

**Platform.cs**  
\*\*  
\*\*

#if NETFX\_CORE

namespace PortableAzure.Win8.Adapters

#endif

#if WINDOWS\_PHONE

namespace PortableAzure.Phone8.Adapters

#endif

{
    public class Platform : PlatformAdapter
    {
        public IIdentity \_identity = new Identity();

        public override IIdentity Identity
        {
            get
            {
                return \_identity;
            }
        }
    }
}

**Identity.cs**

#if NETFX\_CORE

namespace PortableAzure.Win8.Adapters

#endif

#if WINDOWS\_PHONE

namespace PortableAzure.Phone8.Adapters

#endif

{
    public class Identity : IIdentity
    {
        public async void Authenticate()
        {

#if WINDOWS\_PHONE

            var app = ((App)Application.Current);

#endif

#if NETFX\_CORE

            var app = ((PortableAzure.Win8.App)(Windows.UI.Xaml.Application.Current));

#endif

            string message = string.Empty;

            while (this.User == null)
            {
                try
                {
                    User = await app.Azure.MobileService.LoginAsync(MobileServiceAuthenticationProvider.Twitter);

                    message = string.Format("You are now logged in - {0}", User.UserId);

                }

                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }
            }

#if WINDOWS\_PHONE

            MessageBox.Show(message);

#endif

#if NETFX\_CORE

            var messageDialog = new Windows.UI.Popups.MessageDialog(message);

            await messageDialog.ShowAsync();

#endif

        }

        public MobileServiceUser User { get; set; }

    }

}

Note, be sure to use the full namespace OR add more #if at the top for the imports.

#### Cleanup & Consolidation

Now that there is a single place where the application executes the call to Authenticate, through the magic of #if and reusing existing files, time to delete some code.  Nice right?

In Part, each of the front end projects had code in the MainPage.xaml.cs file within the "Loaded" handler to execute the Azure authentication code.  That can be replaced by using the Event Messaging Bus provided by MVVM Light and sending the LoginMessage.

Messenger.Default.Send<LoginMessage>(new LoginMessage());

In the MainViewModel, add the handler in the constructor and the Login subroutine to call the Authenticate method in the Identity interface.

 public MainViewModel()
 {
     Messenger.Default.Register<LoginMessage>(this, m => { Login(); });
  }

 public void Login()
 {
     if (PlatformAdapter.Current.Identity.User == null)
     {
         try
         {
           PlatformAdapter.Current.Identity.Authenticate();
         }
          catch (Exception ex)
         {
             Debug.WriteLine(ex.ToString());
         }
     }
 }

Now when either platform is run, the Login entry point happens in the MainViewModel upon loading of the main page.  Another option, if you wanted to eliminate the messaging, would be to add a login button and have the ICommand call the Login method thus eliminating any code behind in the MainPage.xaml but that depends on your applications needs.

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="float: left; margin-right: 1em; text-align: left;"><tbody><tr><td style="text-align: center;">![](http://3.bp.blogspot.com/-8lzbSolfP6U/UhjMfDdLVcI/AAAAAAAAAi0/LO8wD7Qof60/s200/PortableAzure1.png)</td></tr><tr><td class="tr-caption" style="text-align: center;">Windows Phone</td></tr></tbody></table>

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;">[![](http://2.bp.blogspot.com/-VgxUqIxUVS8/UhjMi94SnBI/AAAAAAAAAi8/tAR6icYJEbs/s320/screenshot_08242013_110509.png)](http://2.bp.blogspot.com/-VgxUqIxUVS8/UhjMi94SnBI/AAAAAAAAAi8/tAR6icYJEbs/s1600/screenshot_08242013_110509.png)</td></tr><tr><td class="tr-caption" style="text-align: center;">Windows 8 / RT</td></tr></tbody></table>

\[\](http://3.bp.blogspot.com/-8lzbSolfP6U/UhjMfDdLVcI/AAAAAAAAAi0/LO8wD7Qof60/s1600/PortableAzure1.png)

### Wrapping Up Authentication

One item to mention, in this example every time the app is run on either platform the user will have to authenticate.  When the MobileServiceUser is successfully authenticated, there are two properties that you can save; MobileServiceAuthenticationToken and UserId respectively.  In a subsequent execution of the app, create a new instance of the MobileServiceUser and set the CurrentUser property of the AzureMobileService.MobileService. For Example:

var user = new MobileServiceUser(mySavedUserId);

user.MobileServiceAuthenticationToken = mySavedMobileServiceAuthenticationToken;

App.MobileService.CurrentUser = user;

Part 1 and Part 2 has shown a simple introduction of how to use portable class libraries with Azure Mobile Services and through the use of a little indirection reuse all the code possible BUT also keep the MVVM implementation and code organization as clean as possible.

Final Code for Part 2 located [here](http://sdrv.ms/1f9CsO3)
