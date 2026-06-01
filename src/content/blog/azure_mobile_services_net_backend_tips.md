---
title: "Azure Mobile Services .NET Backend Tips"
description: "I've been working with Azure Mobile Services since it was released and until recently only the JavaScript backend was available, built using node.js. Although it is very mature with many options, the community was pressuring for a .NET option and now it is available. Modeled much like a standard"
pubDate: "2014-06-02T16:49:00.000Z"
updatedDate: "2015-01-12T16:32:32.000Z"
tags:
  - "azure"
  - "aspnet"
  - "azure mobile services"
  - "mvpbuzz"
  - "mvc"
  - "ef"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/azure_mobile_services_net_backend_tips/"
---

I've been working with Azure Mobile Services since it was released and until recently only the JavaScript backend was available, built using node.js. Although it is very mature with many options, the community was pressuring for a .NET option and now it is available.

Modeled much like a standard Web API / MVC project at first glance, there may be a few things that you like to take advantage of in these types of projects that throw you for a loop when using the new .NET option. These include Dependency Injection, Entity Framework (Migrations and Relationships), and the help page.

### Getting Started

You have two options for getting a project started.

1\. Go to the Azure Portal and create a new Azure Mobile Service and download the project  
([http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started/](http://azure.microsoft.com/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started/))

2\. Start New Project from Visual Studio 2013 SP2 and choose "Web" -> "Windows Azure Mobile Service"

For this example, I went with option #1 and called it "_mytodotips_". Download the solution and be sure to build it to get all of the necessary nuget packages and ensure that your environment is set.

### Entity Framework, Code First, Migrations, and Relationship Challenges

There are a few items here that may leave you scratching your head here, frustrating you, and depending on your temper perhaps throwing things. So, let me see if I can keep your mouse in one piece.

#### Migrations

Do this first! Open Package Manager Console, Tools -> NuGet Package Manager -> Package Manager Console, and type the following command> enable-migrations  
the result will create a new folder in your solution called "Migrations" containing a file named "Configuration.cs", thus enabling code first migrations when your schema changes. In order to complete the change, open the WebApiConfig.cs file in the "App\_Start" folder.

Comment out the _Database.SetInitializer(...);_ line, and you may also comment out or delete the class that is called within the method.  This method drops and recreates the database each time the application is run.

Insert the following code above the _SetInitializer(...);_ line to call the Configurator class just created by "enable-migrations" and explicitly apply the latest migration unless it has already been applied.

```language-csharp
var migrator = new DbMigrator(new Configuration());
migrator.Update();
```

The following namespaces will also need to be added to your imports:

```language-csharp
using System.Data.Entity.Migrations;
using mytodotipsService.Migrations;
```

Open Package Manager Console and run _add-migration init_, in doing so sets the initial migration and establishes the migration table.

Now whenever you add to your models, you can run the same _Add-Migration "migration name"_ in the Package Manager Console and then hit F5 to update the local machine database or publish to Azure and run the service to update the Azure SQL Server database.

#### Relationships

Relationships are pretty easy, however there are a few maintenance items in the \*\*OnModelCreating \*\*method I have found that help me get past some errors when running "update-database" or "add-migration".

Each class in Azure Mobile Services that has a table behind inherits from _EntityData_ which implements \_ITableData. \_When make FK relationships you may receive errors when indexes are being created/altered. I have found by setting the Id field to be the PK on the table that sometimes these can be alleviated.

```language-csharp
modelBuilder.Properties<string>()
	.Where(p => p.Name == "Id")
	.Configure(p => p.IsKey());
```

Another option I also put on all new model classes is the following, this tells the database that the Id field is auto generated and is not required to be set when creating a new class.

```language-csharp
modelBuilder.Entity<entityname>()
	.Property(m => m.Id)
	.HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
```

Now this a simply a personal preference that I'm sure many will disagree with, but I happen to like my tables to be singular.

```language-csharp
modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
```

### Dependency Injection

My favorite DI engine for sometime has been AutoFac, and by accident I discovered its baked into Azure Mobile's .NET back end as well.

Now that I have the Entity Framework Code First context all set the way I like, I can now make sure I don't have to new up in every controller.

In our WebApiConfig.cs class, there is a `ServiceConfig.Initialize(...)` call to kick off the configuration process of the application. It accepts a ConfigBuilder class accepting options for your service, but also has an overload to accept a Func to register your own dependencies which happens to be an autofac container.

Here is how to add the database context, for example, using AutoFac.

```language-csharp
HttpConfiguration config = ServiceConfig.Initialize(
	new ConfigBuilder(options, (configuration, builder) =>  
    {        
    	mytodotipsContext context = new mytodotipsContext();
        builder.RegisterInstance(context).As<mytodotipscontext>().SingleInstance();  }));
```

And now in our ToDoItemController.cs we can add a constructor and alter the Initializer method to the following.

```language-csharp
public class TodoItemController : TableController<todoitem>
{ 
	mytodotipsContext context; 
    public TodoItemController(mytodotipsContext myContext) 
    {  
    	this.context = myContext; 
    } 
    
    protected override void Initialize(HttpControllerContext controllerContext) 
    {  
    	base.Initialize(controllerContext);    
        // mytodotipsContext context = new mytodotipsContext();  
        DomainManager = new EntityDomainManager<todoitem>(context, Request, Services); 			}
}
```

### Help Page

So, you've got Entity Framework setup with relationships, Dependency Injection going with AutoFac and now you are checking out the help page and getting nothing. What happened?

There are a few issues we want to attack here.

-   Where is the data model?
-   I only want to show JSON
-   and a few more as we fix the top 2Data Model MissingThis is a common issue with serializers when there are circular properties.  In this case there is a Profile class that has ToDo items that has a Profile property.  See the Code First Mapping here:

```language-csharp
modelBuilder.Entity<todoitems>().HasRequired(t => t.Profile)                
	.WithMany(p => p.ToDoItems)                
    .HasForeignKey(t => t.ProfileId);
```

What happens here is when the JsonSerializer and XmlSerlizer  starts to walk the property tree; they get in an infinite loop and eventually exhaust the maximum errors and exit. In order to fix this, we will add the following to the WebApiConfig.cs class inside the Register method. _\*note only adding this for JsonFormatters, but can be handled for Xml just as well._

```language-csharp
config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
```

Now we can F5, see the help page and the object model represented in Json but the application/xml and text/xml boxes still show with the error.  As mentioned in our to do list above we only wanted to support Json. To do so, add the following to the configuration now.

```language-csharp
// Remove default XML handler
var matches = config.Formatters     
	.Where(f => f.SupportedMediaTypes         
    .Where(m => m.MediaType.ToString() == "application/xml" ||
    	m.MediaType.ToString() == "text/xml")         
        .Count() > 0)     
        .ToList();

foreach (var match in matches) 
	config.Formatters.Remove(match);
```

And finally, I like to properly case Json.

```language-csharp
config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
```

This single line will make JavaScript devs happy. Instead of seeing the objects like this:

```language-javascript
[    {        "Text": "sample string 1",        "Complete": true,        "Id": "sample string 3",        "__version": "QEBA",        "__createdAt": "2014-06-02T16:40:40.641Z",        "__updatedAt": "2014-06-02T16:40:40.641Z",        "__deleted": true    },
```

they are cased properly like this:

```language-javascript
[    {        "text": "sample string 1",        "complete": true,        "id": "sample string 3",        "__version": "QEBA",        "__createdAt": "2014-06-02T16:40:40.641Z",        "__updatedAt": "2014-06-02T16:40:40.641Z",        "__deleted": true    }
```

There are other features such as Notification Hubs and Scheduled Jobs which are awesome additions to any application. Be sure to check these out when leveraging Azure Mobile Services, regardless of whether you are using .NET or JavaScript as your back end of choice.

Leave a comment if you have a tip or trick you like to use or pass on as well.
