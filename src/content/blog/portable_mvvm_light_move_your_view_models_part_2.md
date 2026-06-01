---
title: "Portable MVVM Light - Move Your View Models : Part 2"
description: "In the first part I covered how to get the initial project setup and share the ViewModels and ViewModelLocator between a Windows Phone 8 project and a Windows Store Application. In this post, I'll add a DataService and a Model class that will be used to get the most recent"
pubDate: "2013-01-28T20:25:00.000Z"
updatedDate: "2013-05-06T15:19:33.000Z"
tags:
  - "windows__phone"
  - "mvvmlight"
  - "code_project"
  - "windows__store__apps"
  - "async/_await"
  - "portable__class__library"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/portable_mvvm_light_move_your_view_models_part_2/"
---

In the [first part](http://blog.tattoocoder.com/2013/01/portable-mvvm-light-move-your-view.html) I covered how to get the initial project setup and share the ViewModels and ViewModelLocator between a Windows Phone 8 project and a Windows Store Application.  In this post, I'll add a DataService and a Model class that will be used to get the most recent posts from the Windows Phone Blog and display the results.

### Adding DataService and Async to Portable Class Library

The purpose of the DataService in the context of this project is to retrieve the RSS feed from the Windows Phone Blog ([http://blogs.windows.com/windows\_phone/b/wpdev/rss.aspx](http://blogs.windows.com/windows_phone/b/wpdev/rss.aspx)) using the async methods available in the 4.5 Framework, return a collection of our Headline class object for the UI to handle and display.

#### Headline Class Model

The Headline class is the object that will be loaded and a collection of these will be built and returned from the data service method.  Create a new folder in the Mvvm.PCL project called "Model" and add a new file called Headline.cs.

>     public class Headline  
>     {  
>         public string Title { get; set; }  
>         public string Description { get; set; }  
>         public string Url { get; set; }  
>         public DateTime Published { get; set; }  
>     }

#### IDataService

In good practice, create an interface for the DataService class.  This would allow for taking advantage of dependency injection if you chose to do so. Add a new interface file to the model folder called IDataService.cs.  Here is the interface:

> namespace Mvvm.PCL.Model  
> {  
> public interface IDataService  
> {  
> void GetHeadlines(Action<List<Headline>, Exception> callback);  
> }  
> }  
> The interface defines a single method that accepts a delegate with a collections or List<T> of Headline and an Exception parameter.

#### DataService

Next, in the same folder, add the DataService.cs file and implement the interface.

>     public class DataService : IDataService  
>     {  
>         public void GetHeadlines(Action<List<Headline>, Exception> callback)  
>         {  
>             throw new NotImplementedException();  
>         }  
>     }

#### HttpWebRequest

Most simple requests for data are done with the [WebClient](http://msdn.microsoft.com/en-us/library/system.net.webclient\(v=vs.110\).aspx) class, however this class is not available in Portable Class libraries and is really only an abstraction of what must be used and that is the HttpWebRequest.

Add a new method to the class called MakeAsyncRequest accepting a url (string) as a parameter and set the method to return a Task<string>. Within the method I'll use the Task.Factory.FromAsync method to call the url asynchronously returning the Task<WebRequest> then use a continuation to read the WebResponse.

>         private static Task<string> MakeAsyncRequest(string url)  
>         {  
>             HttpWebRequest request = WebRequest.CreateHttp(url);  
>             request.Method = "GET";
> 
>             Task<WebResponse> task = Task.Factory.FromAsync(  
>                 request.BeginGetResponse,  
>                 (asyncResult) => request.EndGetResponse(asyncResult),  
>                 (object)null);
> 
>             return task.ContinueWith(t => ReadStreamFromResponse(t.Result));  
>         }  
>         private static string ReadStreamFromResponse(WebResponse response)  
>         {  
>             using (Stream responseStream = response.GetResponseStream())  
>             using (StreamReader sr = new StreamReader(responseStream))  
>             {  
>                 string strContent = sr.ReadToEnd();  
>                 return strContent;  
>             }  
>         }  
> The GetHeadlines method can now be completed. First add the static url.

>  private readonly string uri = "[http://blogs.windows.com/windows\_phone/b/wpdev/rss.aspx](http://blogs.windows.com/windows_phone/b/wpdev/rss.aspx)";

Then declare a variable to hold the results of the MakeAsyncRequest method and set the call with the await keyword so the UI thread is not blocked.

> var t = \*\*await \*\*MakeAsyncRequest(uri);  
> You will also have to mark the method as async or the compiler will give you an error telling you to do so.

> public \*\*async \*\*void GetHeadlines(Action<List<Headline>, Exception> callback)  
> {  
> ...  
> }  
> The results returned are a string type and there are a couple of options to get it into a nice format to work with.  Your first option might be to use the Silverlight [SyndicationFeed](http://msdn.microsoft.com/en-us/library/system.servicemodel.syndication.syndicationfeed\(v=vs.110\).aspx) class which is in the System.ServiceModel.Syndication namespace. However, it is not inherently available in the portable classes and you'll need to go searching for it on your dev machine. \*\*Hint \*\*(_C:\\Program Files (x86)\\Microsoft SDKs\\Silverlight\\v4.0\\Libraries\\Client\\System.ServiceModel.Syndication.dll_).

I'm choosing to use LINQ and doing Linq to XML here to get what I need out of the results string and inflate my classes and return it.

Here is the completed method.

>         public async void GetHeadlines(Action<List<Headline>, Exception> callback)  
>         {  
>             // locally scoped exception var  
>             Exception err = null;  
>             List<Headline> results = null;  
>             try  
>             {  
>                 var t = await MakeAsyncRequest(uri);  
>                 StringReader stringReader = new StringReader(t);  
>                 using (var xmlReader = System.Xml.XmlReader.Create(stringReader))  
>                 {  
>                     var doc = System.Xml.Linq.XDocument.Load(xmlReader);  
>                     results = (from e in doc.Element("rss").Element("channel").Elements("item")  
>                                select  
>                                    new Headline()  
>                                    {  
>                                        Title = e.Element("title").Value,  
>                                        Description = e.Element("description").Value,  
>                                        Published = Convert.ToDateTime(e.Element("pubDate").Value),  
>                                        Url = e.Element("link").Value  
>                                    }).ToList();  
>                 }  
>             }  
>             catch (Exception ex)  
>             {  
>                 // should do some other  
>                 // logging here. for now pass off  
>                 // exception to callback on UI  
>                 err = ex;  
>             }  
>             callback(results, err);  
>         }

That covers all of the code needed in the Portable Class(es) for getting the data, just need to edit the MainViewModel class constructor to create the DataService class, implement the new method and create a Headlines property.

MainViewModel  
Add a new property for the headlines to be bound to by the UI.

>         private List<Model.Headline> \_headlines;  
>         public List<Model.Headline> Headlines  
>         {  
>             get { return \_headlines; }  
>             set  
>             {  
>                 \_headlines = value;  
>                 RaisePropertyChanged(() => Headlines);  
>             }  
>         }  
> In the constructor, create an instance of the DataService and execute the method.  I did mention earlier that there is an IDataService for DI, but for this example an concrete DataService class is created.

>         public MainViewModel()  
>         {  
>             /// create a new dataservice class  
>             var service = new DataService();  
>          
>             /// call getHeadlines passing headlines and exception delegate vars  
>             service.GetHeadlines((headlines, err) => {  
>                 if (err != null)  
>                 {  
>                     /// if there is an error should create a property and bind to it for better practices  
>                     System.Diagnostics.Debug.WriteLine(err.ToString());  
>                 }  
>                 else  
>                 {  
>                     /// set the property  
>                     this.Headlines = headlines;  
>                 }  
>             });  
>         }

### Adding the UI Elements

#### Windows Phone

Open the MainPage.xaml page and wrap the previous TextBlock from part 1 in a StackPanel then add a ListBox.  Set the ItemsSource property of the ListBox to {Binding Headlines, Mode=TwoWay}, then add a simple template with a TextBlock to show the title of the story.

>         <Grid x:Name="ContentPanel" Grid.Row="1" Margin="12,0,12,0">  
>             <StackPanel>  
>             <TextBlock Text="{Binding Hello, Mode=TwoWay}" Foreground="White" FontSize="18" />  
>             <ListBox ItemsSource="{Binding Headlines, Mode=TwoWay}">  
>                     <ListBox.ItemTemplate>  
>                         <DataTemplate>  
>                             <ListBoxItem>  
>                                 <TextBlock Text="{Binding Title}" />  
>                             </ListBoxItem>  
>                         </DataTemplate>  
>                     </ListBox.ItemTemplate>  
>                        
>             </ListBox>  
>             </StackPanel>  
>         </Grid>

#### Windows Store

The store app is just as easy.  In MainPage.xaml, add a GridView controls, set the ItemsSource to {Binding Headlines, Mode=TwoWay}, but in this case I'll define an ItemTemplate outside of the control called PCLItemTemplate and display the Title and the Description.

>         <GridView ItemsSource="{Binding Headlines, Mode=TwoWay}" Grid.Row="1" ItemTemplate="{StaticResource PCLItemTemplate}" />     

>     <Page.Resources>  
>         <DataTemplate x:Key="PCLItemTemplate">  
>             <StackPanel Orientation="Vertical" Width="500" Height="250">  
>                 <TextBlock Foreground="White" Text="{Binding Title}" FontSize="18" HorizontalAlignment="Center" Margin="20,10,20,0" TextTrimming="WordEllipsis"/>  
>                 <TextBlock Foreground="White" Text="{Binding Description}" Style="{StaticResource ItemTextStyle}" HorizontalAlignment="Center" Margin="20,10" TextTrimming="WordEllipsis"/>  
>             </StackPanel>  
>         </DataTemplate>  
>     </Page.Resources>

### Summary

[![](https://1.bp.blogspot.com/-9yQ5miGqCYE/UQbdx9-_i9I/AAAAAAAAAdc/Vzy7H6Ki8SE/s200/portable2_wp.PNG)](https://1.bp.blogspot.com/-9yQ5miGqCYE/UQbdx9-_i9I/AAAAAAAAAdc/Vzy7H6Ki8SE/s1600/portable2_wp.PNG) Running either apps presents the data in a different context and there is complete control as to the presentation and design choices based on the platform.  If you are looking to create Windows Store apps and/or Windows Phone applications  Portable Class Libraries is a great way to leverage code within your multiple platform target solution.  MvvmLight is a choice of mine and many others and fits very well too thanks to others in the community.

Full source code available here: [http://sdrv.ms/WpBGqS](http://sdrv.ms/WpBGqS)
