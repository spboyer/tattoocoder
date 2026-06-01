---
title: "ASP.NET Core : Getting Clean with SOAP"
description: "Being able to take the packaging off the new toy and spin up a new project is a lot of fun I must admit. However, when leaving the latest conference, hack-a-thon or turning away from the latest webcast on that shiny penny; real life hits and trying to get this"
pubDate: "2016-05-25T20:00:00.000Z"
updatedDate: "2016-05-26T00:38:15.000Z"
heroImage: "/content/images/imported/asp-net-core-getting-clean-with-soap-cover.png"
tags:
  - "aspnetcore"
  - "soap"
  - "wcf"
  - "webapi"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/asp-net-core-getting-clean-with-soap/"
---

![soap](/content/images/imported/asp-net-core-getting-clean-with-soap-image-0.png)

Being able to take the packaging off the new toy and spin up a new project is a lot of fun I must admit. However, when leaving the latest conference, hack-a-thon or turning away from the latest webcast on that shiny penny; real life hits and trying to get this new thing to work with the old thing sets in.

### WCF

WCF is a framework that many .NET developers came to love and built many of services on to support Silverlight and WPF applications and was the basis for Web API. However, it's primary protocol was SOAP and a message format of XML. There are many other great features, WS-\*, Transactions, Reliable Messages and more; but for most business it was about Service Oriented Architecture **(SOA)**.

Many, not all, of these services were about getting the large datasets out of the systems and pushing them to the desktops; where the power was to parse the data into the business system - forms over data. Internal services, gigabit ethernet, and giant object graphs (in xml mind you) for the Silverlight or Desktop Windows Forms apps to parse away.

Then the web and mobile hit...and that 10mb data packet isn't going to cut it anymore.

_Test WCF Service available at [http://github.com/spboyer/peopleservice](https://github.com/spboyer/peopleservice) - this is the service referenced within the post._

### Building an Abstraction Layer

It's not an uncommon practice to build API Layers over other services aka **Facade Layer** or **Orchestration Layer**. The point of this architectural pattern in this instant is to take a request from the web or mobile client and _orchestrate_ calls downstream to the business services and return the reduced object graph. A "getting only what you need" pattern.

![abstraction layer](/content/images/imported/asp-net-core-getting-clean-with-soap-image-1.png)

### Using ASP.NET Core

When using .NET 4.x and Web Applications with Visual Studio, consuming WCF Services was simple by using the "Add Service Reference" dialog.

![add service reference](/content/images/imported/asp-net-core-getting-clean-with-soap-image-2.png)

However, in ASP.NET Core creating a WCF client and consuming the service, is a matter of using the svcutil.exe and the packages from [http://github.com/dotnet/wcf](https://github.com/dotnet/wcf)

#### svcutil

[ServiceModel Metadata Utility Tool (Svcutil.exe)](https://msdn.microsoft.com/en-us/library/aa347733\(v=vs.110\).aspx) is a command line utility used to generate service model code from metadata documents and metadata documents from service model code.

It is found by opening your Start Menu and typing "command" then selecting **VS2015 x64 Native Tools Command Prompt**. Right Click and select "Run as Administrator".

_For Mac OSX and Linux users there is no cross platform solution for this **yet**. Use Windows 10 on a VM in Azure, Parallels or "Phone a Friend"_

Startup the WCF service, this one is running locally, and create the service contract using the following command.

```
svcutil  http://localhost/people.svc /o:c:\temp\PeopleService.cs /sc
```

the **/o:** option specifies the location and and name of the service contract file, and the **/sc** option specifies to generate code for service contracts only, no configuration is generated.

```bash
C:\WINDOWS\system32>svcutil  http://localhost/people.svc /o:c:\temp\PeopleServiceContract.cs /sc
Microsoft (R) Service Model Metadata Tool
[Microsoft (R) Windows (R) Communication Foundation, Version 4.6.1055.0]
Copyright (c) Microsoft Corporation.  All rights reserved.

Attempting to download metadata from 'http://localhost/people.svc' using WS-Metadata Exchange or DISCO.
Generating files...
c:\temp\PeopleServiceContract.cs
```

The output created the client proxy class that will be used in the ASP.NET Core Console app we will create next.

### ASP.NET Core Console Application

For a simple application, create a console application. File > New Project > Console Application (.NET Core)

![file new project](/content/images/imported/asp-net-core-getting-clean-with-soap-image-3.png)

Open **project.json** and add the nuget dependencies for \*_dotnet/wcf_

```javascript
  "dependencies": {
    "Microsoft.NETCore.App": {
      "type": "platform",
      "version": "1.0.0-rc2-3002702"
    },
    "System.ServiceModel.Duplex": "4.0.1-rc2-24027",
    "System.ServiceModel.Http": "4.1.0-rc2-24027",
    "System.ServiceModel.NetTcp": "4.1.0-rc2-24027",
    "System.ServiceModel.Primitives": "4.1.0-rc2-24027",
    "System.ServiceModel.Security": "4.0.1-rc2-24027",

    "System.Private.ServiceModel": "4.1.0-rc2-24027"
  },
```

If you are using Visual Studio, the packages will auto restore when hitting Save, or at the command line `dotnet restore`

Next, add the **PersonServiceContract.cs** file generated by the svcutil to the root of the project.

There will be a few errors, this is a bug not resolved perhaps or a not needed item.

```
The type or namespace name 'ExtensionDataObject' does not exist in the namespace 'System.Runtime.Serialization'
```

Add the following class and interface to the project to resolve the error.

```
namespace System.Runtime.Serialization
{
    public class ExtensionDataObject
    {
    }

    internal interface IExtensibleDataObject
    {
    }
}
```

### Calling the WCF Service

Typically our bindings for WCF are configured in XML files when running through the "Add Service Reference" dialog from before. In this case the bindings are built from scratch.

In this case, a BasicHttpBinding is used to call the _people.svc_ endpoint, executing the _GetPeopleData_ method which takes an **int** returning that amount of people.

The binding takes the security types: Transport, None, TransportCredentialOnly, and TransportWithMessageCredential.

```csharp
Binding binding = null;
binding = new BasicHttpBinding(BasicHttpSecurityMode.None);
```

Configure the ChannelFactory to use the binding and pass the endpoint.

```csharp
factory = new ChannelFactory<IGetPeopleService>(binding, new EndpointAddress("http://localhost/people.svc"));
```

Finally, create the WCF client (serviceProxy) and call the method.

```csharp
serviceProxy = factory.CreateChannel();

var result = serviceProxy.GetPeopleData(100);
```

Here is the complete code to call the service and write the count to the console.

```csharp
ChannelFactory<IGetPeopleService> factory = null;
IGetPeopleService serviceProxy = null;
Binding binding = null;

binding = new BasicHttpBinding(BasicHttpSecurityMode.None);
factory = new ChannelFactory<IGetPeopleService>(binding, new EndpointAddress("http://localhost/people.svc"));
serviceProxy = factory.CreateChannel();

var result = serviceProxy.GetPeopleData(100);

Console.Write("People Returned:" + result.Count().ToString());
Console.ReadLine();
```

## Summary

Using ASP.NET Core to orchestrate and "thin out" the data calls to these business services allows us to use the new with the old. The benefit here is the in-house hardened systems don't have to incur change or risk to day to day operations, and on the flip side the mobile and web applications do not pay the price of large datasets slowing down performance and giving a poor experience to the user.

\*\*\* Every binding type is available for .NET Core; Tcp, BasicHttp etc. There has also been an extension for VS 2015 for creating the proxies - [WCF Connected Service VS extension for VS 2015](https://blogs.msdn.microsoft.com/webdev/2016/05/25/announcing-wcf-connected-service-for-net-core-rc2-and-asp-net-core-rc2/) in lieu of using svcutil.
