---
title: "SimpleIoc and the Messenger Service in MVVM Light"
description: "CodeProject The SimpleIoc addition in the most recent version of MVVMLight is a great add and really simplified the ViewModelLocator across all of the platforms supported in this framework. If you are not familiar with MVVM Light or what you types of project platforms it supports please go to http:"
pubDate: "2012-09-16T16:16:00.000Z"
updatedDate: "2012-09-17T03:02:24.000Z"
tags:
  - "mvvmlight"
  - "mvvm"
  - "windows_8"
  - "io_c"
  - "silverlight"
  - "w_p_f"
  - "windows__phone_7"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/simple_ioc_and_the_messenger_service_in_mvvm_light/"
---

[CodeProject](http://www.codeproject.com/script/Articles/BlogFeedList.aspx?amid=2961115)  
The SimpleIoc addition in the most recent version of MVVMLight is a great add and really simplified the ViewModelLocator across all of the platforms supported in this framework.

If you are not familiar with MVVM Light or what you types of project platforms it supports please go to [http://mvvmlight.codeplex.com](http://mvvmlight.codeplex.com/) or [www.galasoft.ch/mvvm](http://www.galasoft.ch/mvvm) to learn more.

However if you are using the Messenger Service in MVVM Light to perform a set of actions to do the following:

-   User takes an action
-   Application changes views
-   Application send message to display or load data  
    then it is important to note that there are some differences in the way that the ViewModels are loaded in comparison to the previous version of MVVM Light.

Lets look at the ViewModelLocator in the new version:

    public class ViewModelLocator

    {

        static ViewModelLocator()

        {

            ServiceLocator.SetLocatorProvider(() => SimpleIoc.Default);

            if (ViewModelBase.IsInDesignModeStatic)

            {

                SimpleIoc.Default.Register<IDataService, Design.DesignDataService>();

            }

            else

            {

                SimpleIoc.Default.Register<IDataService, DataService>();

            }

            SimpleIoc.Default.Register<MainViewModel>();         

            SimpleIoc.Default.Register<SecondViewModel>();

        }

        /// <summary>

        /// Gets the Main property.

        /// </summary>

        \[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance",

        "CA1822:MarkMembersAsStatic",

        Justification = "This non-static member is needed for data binding purposes.")\]

        public MainViewModel Main

        {

            get

            {

                return ServiceLocator.Current.GetInstance<MainViewModel>();

            }

        }

   }

Notice that in comparison to what you may have seen in the past version, there is a single property to the ViewModel and a simple line in the constructor here to register the ViewModel with the Ioc Container and that is it.

The property for the ViewModel is Lazy, meaning that it is loaded on demand and is a singleton.  You can create multiple instances by passing in a key upon creation, but for this example I'll keep it simple.

Given the scenario above you will get the result of the secondary view not getting the message sent event though you have registered the message with the Message Service and have an action ready to handle it.  BUT the second time through it's fine and operates as it should.  What has happened?

Very simply, the examples you have seen in the past very rarely ever cover situations in the real world nor do they ever go far enough to look at the overloads in the constructor etc.

What has happened here is that the ViewModel \*\*MUST \*\*exist first in order to take action on the message. Moreover, the Messenger Service in MVVM Light does not operate like a Service Bus or Message Queue where the messages stay there until they are read.  It is more similar to Events, a fire and forget model.

In order to alleviate said problem, simple pass in "true" to the Register call in the SimpleIoc to create the instance of the ViewModel immediately and go on with your coding.

  SimpleIoc.Default.Register<SecondViewModel>(true);

The previous version of MVVM Light created all of the ViewModels immediately, although not too much of an issue; there are instances where a user may not go to every view in the application and the idea here is to only load what is needed and keep the View and ViewModels loaded in memory when necessary.

If you have questions please comment and/or contact me on twitter [@spboyer](https://www.twitter.com/spboyer)
