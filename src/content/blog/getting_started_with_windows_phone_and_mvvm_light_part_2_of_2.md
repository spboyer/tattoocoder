---
title: "Getting started with Windows Phone and MVVM Light - Part 2 of 2"
description: "CodeProject In Part 1, we covered the following: Creating the application* Connecting the View and the View-Model* Adding an additional View or PagePart 2 we'll see how to add a button on the first page to navigate to the second page which will cover navigation and messaging to complete the"
pubDate: "2012-08-02T19:10:00.000Z"
updatedDate: "2012-09-11T01:24:20.000Z"
tags:
  - "windows__phone"
  - "mvvmlight"
  - "mvvm"
  - "windows__phone_7"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/getting_started_with_windows_phone_and_mvvm_light_part_2_of_2/"
---

[CodeProject](http://www.codeproject.com/script/Articles/BlogFeedList.aspx?amid=2961115)  
In [Part 1](http://bit.ly/OaAdxt), we covered the following:

-   Creating the application\* Connecting the View and the View-Model\* Adding an additional View or PagePart 2 we'll see how to add a button on the first page to navigate to the second page which will cover navigation and messaging to complete the application and although basic, will give a rather decent start to create and publish your first [Rubber Ducky](http://bit.ly/OsQsZD) application.

If you need the code, you can get it [here](http://sdrv.ms/QxCPes).

Let’s start by opening MainPage.xaml.  You should see the following image here:

Add a button by dragging it on to the design surface or adding the following code, it doesn’t matter where, just somewhere within the content grid.

<TextBlock Text="{Binding Welcome}"
			           Style="{StaticResource PhoneTextNormalStyle}"
			           HorizontalAlignment="Center"
			           VerticalAlignment="Center"
			           FontSize="40" />

            <Button Content="Button" 
					Height="72" HorizontalAlignment="Left" 
					Margin="154,354,0,0" Name="button1" 
					VerticalAlignment="Top" Width="160" />

Next, lets add the messaging capabilities which will work hand in hand with the navigation from one page to the next. Start by adding a new folder to the solution called “**Messages**”.

Then add a new class called \*\*NavigateToPageMessage.cs \*\*which contains the following code.

public class NavigateToPageMessage
{
	public NavigateToPageMessage()
	{

	}

	public string PageName { get; set; }
}

Now we have to register the main page of the application to receive the NavigateToPageMessage and do something once it receives it. Open MainPage.xaml and add a new event handler for the Loaded Event. Do this by selecting the **PhoneApplicationPage** in the Document Outline Window, go to the Properties Windows and select the Events Tab and double click the **_Loaded_** event to insert the code.

  [![image](https://lh3.ggpht.com/-p3vDgVEggUo/UBqmOLVg_dI/AAAAAAAAAKU/jqXL5vb9VZ4/image_thumb%25255B1%25255D.png?imgmax=800 "image")](https://lh3.ggpht.com/-i4rq_yd6g1Y/UBqmNhHy0YI/AAAAAAAAAKM/S5bslzGxNRw/s1600-h/image%25255B3%25255D.png)

 Open the MainPage.xaml.cs code and find the newly inserted event handler which should look like the following:

private void PhoneApplicationPage\_Loaded(object sender, System.Windows.RoutedEventArgs e)
{

}

In order to support messaging from MVVM Light, add the messaging namespace (MvvmLight1.Messages;) to the top of the page. Next, we will add the code to subscribe to the **NavigateToPageMessage.**

\*\*  
\*\*

private void PhoneApplicationPage\_Loaded(object sender, System.Windows.RoutedEventArgs e)
{
	Messenger.Default.Register<NavigateToPageMessage>
				(
					this,
					(action) => ReceiveMessage(action)
				);
}

ReceiveMessage is the delegate that will handle the message object, in this case the NavigateToPageMessage type.

private object ReceiveMessage(NavigateToPageMessage action)
{
	var page = string.Format("/Views/{0}View.xaml", action.PageName);

	if (action.PageName == "Main")
	{
		page = "/MainPage.xaml";
	}

	NavigationService.Navigate(
	   new System.Uri(page,
			 System.UriKind.Relative));
	return null;
}

.csharpcode, .csharpcode pre { font-size: small; color: black; font-family: consolas, "Courier New", courier, monospace; background-color: #ffffff; /\*white-space: pre;\*/ } .csharpcode pre { margin: 0em; } .csharpcode .rem { color: #008000; } .csharpcode .kwrd { color: #0000ff; } .csharpcode .str { color: #006080; } .csharpcode .op { color: #0000c0; } .csharpcode .preproc { color: #cc6633; } .csharpcode .asp { background-color: #ffff00; } .csharpcode .html { color: #800000; } .csharpcode .attr { color: #ff0000; } .csharpcode .alt { background-color: #f4f4f4; width: 100%; margin: 0em; } .csharpcode .lnum { color: #606060; } What we have done here is handled the property \*\*PageName\*\* of the action and to the application to navigate to the appropriate page. Pretty simple right?  You’ll notice that I put in a special handler here if the PageName is Main to follow the default structure in the MVVM Light template.  As a note, I typically move the MainPage into the Views folder and make the adjustments to all of the wiring so that all of my views are in the place where I like them.  Next step is to hook up that button we added earlier to send the \*\*NavigateToPageMessage \*\*when its clicked. If you have Blend, this portion is drag and drop, otherwise you’ll have to some cut and paste. Open the project in Blend, then open MainPage.xaml in the designer. Select the Assets Tab and click on the Behaviors in the left panel.  You will see a selection called \*\*EventToCommand; \*\*click and drag this item to either the Button on the design surface OR the button in the Object and Timeline and release.

  [![image](https://lh4.ggpht.com/-aavJ5KeD5Rg/UBrKQhivdNI/AAAAAAAAAKo/10HUg1Lo1aU/image_thumb%25255B4%25255D.png?imgmax=800 "image")](https://lh4.ggpht.com/-S9KFShwvJy8/UBrKQH3ZYnI/AAAAAAAAAKk/l7v8BxOvM2s/s1600-h/image%25255B8%25255D.png)

 Then in the properties tab give the new EventToCommand the name “GoToPage2”, the EventName should already set to _Click_, if it is not change it.

  [![image](https://lh4.ggpht.com/-A1RKfvPXqww/UBrKRa4gpkI/AAAAAAAAAK8/EviA1vLNclI/image_thumb%25255B7%25255D.png?imgmax=800 "image")](https://lh4.ggpht.com/-nMXvBu7YfA4/UBrKQzj-h8I/AAAAAAAAAK0/4LGuar3KiN0/s1600-h/image%25255B13%25255D.png)

 Save your changes, and if you view the xaml now you should see the following code

<Button Content="Button" Height="72" HorizontalAlignment="Left" Margin="154,354,0,0" x:Name="button1" VerticalAlignment="Top" Width="160" >
	<i:Interaction.Triggers>
		<i:EventTrigger EventName="Click">
			<GalaSoft\_MvvmLight\_Command:EventToCommand x:Name="GoToPage2" Command="{Binding GoToSecondPageCommand, Mode=OneWay}"/>
		</i:EventTrigger>
	</i:Interaction.Triggers>
</Button>

Next step, back to Visual Studio to add the last bit of code to the MainViewModel.  Add a new RelayCommand which is in the MvvmLight.Command namespace.

public RelayCommand GoToSecondPageCommand

{  
get;  
private set;  
}  

  
Then in the constructor in the “else” portion you need to instantiate the RelayCommand and add the handler to send the message. Add the following code

GoToSecondPageCommand = new RelayCommand(() =>

```
            {
                MessageBox.Show("Going to Second Page now");
                Messenger.Default.Send&lt;NavigateToPageMessage&gt;(new NavigateToPageMessage() { PageName = "SecondPage" });
            });
```

One last step here is to tell the EventToCommand that we added in Blend that this is the command to execute when the Click event is fired.  we do this by setting the Command property in the xaml to the following:

<Button Content="Button" Height="72" HorizontalAlignment="Left" Margin="154,354,0,0" x:Name="button1" VerticalAlignment="Top" Width="160" >

```
&lt;i:Interaction.Triggers&gt;
	&lt;i:EventTrigger EventName="Click"&gt;
		&lt;GalaSoft_MvvmLight_Command:EventToCommand x:Name="GoToPage2" Command="{Binding GoToSecondPageCommand, Mode=OneWay}"/&gt;
	&lt;/i:EventTrigger&gt;
&lt;/i:Interaction.Triggers&gt;
```

</Button>  

  
Save all and run

      [![GoingTo2ndPage](https://lh3.ggpht.com/-SKAfdpVNNYk/UBrKRwS1KkI/AAAAAAAAALM/D7SFE3bRhPw/GoingTo2ndPage_thumb%25255B2%25255D.png?imgmax=800 "GoingTo2ndPage")](https://lh3.ggpht.com/-2iDa7U0e5rI/UBrKRt2-tLI/AAAAAAAAALE/STSgEkeseVo/s1600-h/GoingTo2ndPage%25255B4%25255D.png)[![2ndPsge](https://lh3.ggpht.com/-4O9k6D-vswE/UBrKTSOz9rI/AAAAAAAAALc/ouQmt8rnogM/2ndPsge_thumb%25255B2%25255D.png?imgmax=800 "2ndPsge")](https://lh6.ggpht.com/-LY6NWNZM4fc/UBrKSeqOlxI/AAAAAAAAALU/uPq1kQeHfn4/s1600-h/2ndPsge%25255B4%25255D.png)

 Click Ok and next page is presented.

 Now go build some apps!

Download Code for Part 2 [here](http://sdrv.ms/Mfnlo7)
