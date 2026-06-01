---
title: "RadCustomHubTile from Telerik for Windows 8 UI"
description: "Introduction Telerik recently released their Windows 8 UI Controls to RC on September 18th (see post here), and this is probably on the first in a series of posts I will put out showing them off. The first control here is the RadCustomHubTile. I chose this because I am in"
pubDate: "2012-09-26T03:18:00.000Z"
updatedDate: "2012-09-26T03:24:00.000Z"
tags:
  - "mvvmlight"
  - "mvvm"
  - "winrt"
  - "windows_8"
  - "rad_custom_hub_tile"
  - "telerik"
  - "rad_hub_tile"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/rad_custom_hub_tile_from_telerik_for_windows_8_ui/"
---

### Introduction

[Telerik](http://www.telerik.com/) recently released their [Windows 8 UI Controls](http://www.telerik.com/products/windows-metro/overview.aspx) to RC on September 18th ([see post here](http://blogs.telerik.com/blogs/posts/12-09-18/what-s-new-in-telerik-windows-8-ui-controls-release-candidate.aspx?utm_source=spboyer)), and this is probably on the first in a series of posts I will put out showing them off.

The first control here is the RadCustomHubTile.  I chose this because I am in the process of porting my [Find Amber app from Windows Phone](http://spboyer.me/AboutAmberApp) to Windows 8 and I wanted to transition the app without drifting too far from the spirit of the original app. 

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;">[![](http://1.bp.blogspot.com/-OoJxg94Y9sg/UFtzIhwbmQI/AAAAAAAAAU8/_9KJDXTNF2g/s320/promoimage.png)](http://1.bp.blogspot.com/-OoJxg94Y9sg/UFtzIhwbmQI/AAAAAAAAAU8/_9KJDXTNF2g/s1600/promoimage.png)</td></tr><tr><td class="tr-caption" style="text-align: center;">RadControls from Telerik used here for Current List and Search &amp; Stats section</td></tr></tbody></table>

You can see from the screen shot that I had already used the \[RadControls for Windows Phone\](http://www.telerik.com/products/windows-phone.aspx), so now I can bring some of the design through.

The controls do support both HTML and XAML design, if the current version of the controls do not include either or; I assure you the version you seek is in development and on its way.

### Getting Started

The RadCustomHubTile allows \*\*any \*\*user-defined content rather than predefined parts that you may find in a RadHubTile or RadSlideTile, and as in most if not all of the Telerik controls; MVVM as well as code based binding is supported.

Prior to trying this example, please [download the controls from Telerik](http://www.telerik.com/download-trial-file.aspx?pid=981) and note that I am using MVVM Light as the MVVM Framework.  You can see how to install MVVM Light via nuget by opening the Package Manager console and running "Install-Package mvvmlight".  If you have any trouble with that please see [http://mvvmlight.codeplex.com](http://mvvmlight.codeplex.com/) or contact me via [twitter (@spboyer)](https://twitter.com/spboyer) OR see my blog post on [how to get started with Windows 8 and MVVM Light](http://blog.tattoocoder.com/2012/08/getting-started-w-windows-8-mvvm-light.html).

In the following example you will see:

-   MVVM Binding
-   Content locally bound
-   Content bound from an internet URI
-   Complex front and back content for the tileThis is a moderately simply example.  I started with a Blank Solution in Visual Studio 2012 and called it RadCustomHubTile (in retrospect probably should have stuck with App1).

Install the MVVM Light Framework via nuget (see above), you will have to make a change to the App.xaml file.  When installing this, it adds the reference to the namespace in the old way

**\_  xmlns:vm="clr-namespace:RadHubTile.ViewModel" \_**

* * *

you need to change this to:

**\_ xmlns:vm="using:RadHubTile.ViewModel" \_**

 A little house keeping to make it look nice. Yes I care what it looks like even for this. Go ahead and add the following below the <Grid> tag to add the header to the initial page.  You can change the title if you like and run (F5).

<Grid.RowDefinitions>
 <RowDefinition Height="140"/>
 <RowDefinition Height="\*"/>
</Grid.RowDefinitions>

<Grid>
 <Grid.ColumnDefinitions>
  <ColumnDefinition Width="Auto"/>
  <ColumnDefinition Width="\*"/>
 </Grid.ColumnDefinitions>
 <Button x:Name="backButton"  Style="{StaticResource BackButtonStyle}"/>
 <TextBlock x:Name="pageTitle" Text="Rad Custom Hub Tile" Grid.Column="1" IsHitTestVisible="false" Style="{StaticResource PageHeaderTextStyle}" Foreground="#FFADD808"/>
</Grid>

<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody><tr><td style="text-align: center;">[![](http://3.bp.blogspot.com/-wNthFGNkBGg/UGJrumR5TRI/AAAAAAAAAVc/6ZFQ4gAtxoM/s400/Title_xaml.png)](http://3.bp.blogspot.com/-wNthFGNkBGg/UGJrumR5TRI/AAAAAAAAAVc/6ZFQ4gAtxoM/s1600/Title_xaml.png)</td></tr><tr><td class="tr-caption" style="text-align: center;">Title and Back button</td></tr></tbody></table>

Next, lets add the RadCustomHubTile Control, and the best way to do this is to simply drag it from the toolbox right into the spot within the XAML. This is something you could not do in Windows Phone which is a big step in my opinion.

It will add the namespace and the references to the project.

To clean it up a little and make sure that you are using within the design guidelines, wrap the RadHubControl with a Grid with the following settings.

<Grid Grid.Row="1" Margin="115,0,0,0">

  <Primitives:RadCustomHubTile />

</Grid>

If you are wondering why my RadCustomHubTile is prefixed, it is because I have changed or altered the declaration at the top of the page to be the following (this matches my Phone app stuff).

> xmlns:Primitives="using:Telerik.UI.Xaml.Controls.Primitives" 

### Setting Front and Back Content

The content for the front and back are defined by setting the content within the <radcustomhubtile.frontcontent> and <radcustomhubtile.backcontent> respectively.  Pretty simple, so here is an example:</radcustomhubtile.backcontent></radcustomhubtile.frontcontent>

<Primitives:RadCustomHubTile Height="300" Width="300">  
<Primitives:RadCustomHubTile.FrontContent>  
<Grid>  
<Image x:Name="imgBlogger"  
Source="{Binding Photo, Mode=TwoWay}"  
Height="300" Width="300"  
Stretch="UniformToFill" Margin="0"  
HorizontalAlignment="Left"  
VerticalAlignment="Center" />

<Rectangle Height="65" Fill="#99000000" VerticalAlignment="Bottom" />

<StackPanel Orientation="Horizontal">  
<TextBlock  Text="Blogger:"  
Foreground="White" Width="126" Height="43"  
VerticalAlignment="Bottom"  
Margin="10,0,0,14" Style="{StaticResource SubheaderTextStyle}"  
HorizontalAlignment="Left" />

```
&lt;TextBlock  Text="{Binding UserName}" 
    Foreground="White" Height="43" 
    VerticalAlignment="Bottom" Margin="0,0,0,14" 
    Style="{StaticResource SubheaderTextStyle}"/&gt;
```

</StackPanel>  
</Grid>  
</Primitives:RadCustomHubTile.FrontContent>

<Primitives:RadCustomHubTile.BackContent>  
<Grid>  
<Image x:Name="img"  
Source="{Binding Thumbnail, Mode=TwoWay}"  
Height="300" Width="300"  
Stretch="UniformToFill" Margin="0"  
HorizontalAlignment="Left"  
VerticalAlignment="Center" />

<Rectangle Height="65" Fill="#99000000" VerticalAlignment="Bottom" />

<TextBlock  Text="{Binding Title, Mode=TwoWay}"  
Foreground="White" Width="270" Height="30"  
VerticalAlignment="Bottom"  
Margin="0,0,0,30" Style="{StaticResource BasicTextStyle}" />

<TextBlock  Text="{Binding SubTitle, Mode=TwoWay}"  
Foreground="White" Width="270" Height="30"  
VerticalAlignment="Bottom" Margin="0,0,0,5"  
Style="{StaticResource BasicTextStyle}"/>  
</Grid>  
</Primitives:RadCustomHubTile.BackContent>  
</Primitives:RadCustomHubTile>

Note that you will want to wrap your content with the FrontContent / BackContent tags in Grid, StackPanel etc as the designer will give you the "Content cannot be set more than once error".

Here is the MainViewModel that is bound. Note that the Blogger image (me), is pulled from an internet source uri and the back image is pulled from the project itself. The string properties are bound simply.

using GalaSoft.MvvmLight;
using System;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;

namespace RadHubTile.ViewModel
{
    public class MainViewModel : ViewModelBase
    {
        /// <summary>
        /// Initializes a new instance of the MainViewModel class.
        /// </summary>
        public MainViewModel() { }

        public string Photo
        {
            get { return "http://3.bp.blogspot.com/-yBHsXXtsWWo/UCkc916wnfI/AAAAAAAAAN0/FcKOE2P-gGQ/s1600/profilepic.png"; }
        }

        public string UserName
        {
            get { return "Shayne Boyer"; }
        }

        public ImageSource Thumbnail
        {
            get { return new BitmapImage(new System.Uri(new Uri("ms-appx:"), "/Assets/RadCustomHubTile.png"));}
        }

        public string Title
        {
            get { return "Telerik Windows 8 UI Controls"; }
        }

        public string SubTitle
        {
            get { return "RadCustomHubTile"; }
        }
    }
}

So what does it all look like?

Front

Back

One other item to note is that you can alter the duration of the flip/rotation by setting the UpdateInterval which is a TimeSpan. So setting the value to "0:0:5" would be equal to 5 seconds.  There is also FlowDirection and many other properties to customize the Tile to your liking.  I'd like to see what you can do with it.  Download the controls today and let me know what you working on and if you have any questions.
