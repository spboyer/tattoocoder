---
title: "Looking at Windows Azure Mobile Services with Fiddler"
description: "CodeProject As usual throughout the day I have MetroTwit open and toast are constantly popping up here and there and I glance over to see what’s what. Then I see. from @WindowsAzure this: And all work stopped for me to check this out. Other than Windows Phone and Windows"
pubDate: "2012-08-31T15:29:00.000Z"
updatedDate: "2012-09-11T01:25:47.000Z"
tags:
  - "windows__phone"
  - "azure"
  - "rest"
  - "fiddler"
  - "mobile__services"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/looking_at_windows_azure_mobile_services_with_fiddler/"
---

[CodeProject](http://www.codeproject.com/script/Articles/BlogFeedList.aspx?amid=2961115)  
As usual throughout the day I have MetroTwit open and toast are constantly popping up here and there and I glance over to see what’s what.  Then I see. from [@WindowsAzure](https://twitter.com/WindowsAzure) this:

And all work stopped for me to check this out.  Other than Windows Phone and Windows 8; I really love the new ASP.NET WebAPI and REST Services capabilities it has made so easy (watch for my next post on that), and seeing this I was thinking – awesome but only for Windows 8???  So…I immediately responded and got a response:  
[![twitter\_conversation](https://lh6.ggpht.com/-R4_IrxpjRIA/UEDKsMNhR-I/AAAAAAAAAQg/T98JNPHYxhQ/twitter_conversation_thumb%25255B1%25255D.png?imgmax=800 "twitter_conversation")](https://lh3.ggpht.com/-xfNOm8C9D4A/UEDKrn_oKxI/AAAAAAAAAQY/YHqJy_oL7YI/s1600-h/twitter_conversation%25255B3%25255D.png)  
Spending the last day or so checking into the walk through for Windows 8, check them out [here](https://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started/). I went through the initial walkthrough for a Windows 8 application, and during this I wanted to see the data that was going back and fourth so I opened my favorite tool Fiddler to see the HTTP calls, which then lead me to see that I could easily use these services for Windows Phone 7 now!  
Here is a quick walk through a how to get setup.

### Getting Started

In order to start using the preview of the Mobile Services in Azure, you need to have a Windows Azure account or you can sign up for a [trial account](http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A73D945CB). After you login, go to your Account Center and select the Preview Features from the top menu.  
[![image](https://lh6.ggpht.com/-m3TLdLwRukE/UEDKs3v2Y7I/AAAAAAAAAQw/uwiC3Pvd2sM/image_thumb%25255B4%25255D.png?imgmax=800 "image")](https://lh5.ggpht.com/-mi6vAyCc9mo/UEDKsYmP7SI/AAAAAAAAAQo/R2pmRjowwew/s1600-h/image%25255B8%25255D.png)  
I have already signed up for the Mobile Services, so you will see a “try it now” button and go ahead click that to get started. Once you get transferred to the, unfortunately still called the “Preview” portal, you’ll notice on the left menu that there is a new \*\*Mobile Services \*\*section.  
[![image](https://lh4.ggpht.com/-pd8zlUYN3PY/UEDKt38IMWI/AAAAAAAAARA/zGl2O-GQBmY/image_thumb%25255B6%25255D.png?imgmax=800 "image")](https://lh3.ggpht.com/-w9S2neZKOU0/UEDKtX8pjnI/AAAAAAAAAQ4/h4jWsXWGzBw/s1600-h/image%25255B12%25255D.png)  
Next on the bottom portion of the management portal you will see the **+**, which you simply click to add the new Mobile Service.  
[![image](https://lh3.ggpht.com/-x1C1w9nZ0bU/UEDKu4wbDXI/AAAAAAAAARQ/bcLhjKyErMc/image_thumb%25255B8%25255D.png?imgmax=800 "image")](https://lh5.ggpht.com/-7LnC0ptxMAE/UEDKunx-M6I/AAAAAAAAARI/O0XwDziUaLI/s1600-h/image%25255B16%25255D.png)  
Choose create and the New Mobile Service dialog is presented; enter the name of your new mobile service, select or create a new SQL Server Database, and finally select the Region for your instance.  There are some other options in the “Configure advanced database settings” but we’ll not do that now for simplicity sake.  
\*\*\* As a note, if you create a new database; remember the credentials.  You will need this information if you choose to add another database to the server later.  
Upon completion of the wizard, the management portal will tell you its creating…, the poof its there. I named mine “testmobileservice”.  
[![image](https://lh5.ggpht.com/-cktK68TGW6k/UEDKvQT7omI/AAAAAAAAARg/joWwTjOqsCg/image_thumb%25255B10%25255D.png?imgmax=800 "image")](https://lh6.ggpht.com/-20zcXdKrGtM/UEDKvLuhrmI/AAAAAAAAARY/0vf4iwZOlQY/s1600-h/image%25255B20%25255D.png)  
if you click on the URL, you’ll be presented with the following page…  
[![testpage](https://lh6.ggpht.com/-IiGw_llVS_4/UEDKwMK15mI/AAAAAAAAARw/FO2GuJZLvNo/testpage_thumb%25255B1%25255D.jpg?imgmax=800 "testpage")](https://lh6.ggpht.com/-OPzv3qWXNnU/UEDKvlKPT0I/AAAAAAAAARo/BM95fWSAKKw/s1600-h/testpage%25255B3%25255D.jpg)  
These are just services, or a service endpoint. The closest thing I can really relate this to is in SQL 2005 we were given the ability to expose certain objects as web service endpoints, it was a neat feature but not widely used and still available to my knowledge. Sorry I digress, let’s get back to the management portal and create a Todo table.  
If you click on the Mobile Service name you see the following screen, and although the initial announcement was for Windows 8 support and the walkthroughs etc. show that, let’s just create a table and I can get to Fiddler and show you how the data looks to and from the REST Service.  
[![image](https://lh3.ggpht.com/-4xaueRFPDSs/UEDKwwgvYeI/AAAAAAAAASA/IT1P5Sl989E/image_thumb%25255B14%25255D.png?imgmax=800 "image")](https://lh4.ggpht.com/-P-u6EVq8aWg/UEDKwpQVtUI/AAAAAAAAAR4/pwcPaJN77bk/s1600-h/image%25255B28%25255D.png)  
Click over the the DATA tab, then the **+** on the bottom the add the table. Name the table **ToDoItem** and click the check to create the new table.  
[![image](https://lh5.ggpht.com/-tpl2yJHopbQ/UEDKxzAtg7I/AAAAAAAAASQ/dQF08u8V6xk/image_thumb%25255B12%25255D.png?imgmax=800 "image")](https://lh6.ggpht.com/-pkn4SKuDTHg/UEDKxRropBI/AAAAAAAAASI/MY391RFPaPY/s1600-h/image%25255B24%25255D.png)  
Pretty simple right?  Just created a new table in a database by simply naming a table…DBA’s are freaking out around the world right now.  
Ok, so go back to the DASHBOARD and find the MANAGE KEYS icon at the bottom, and we are going to add/create a new Application Key for the Mobile Service.   
[![mananagekeyyes](https://lh5.ggpht.com/-RqpfXnxL3FM/UEDNWt8aa3I/AAAAAAAAASw/nvkv2utj2jE/mananagekeyyes_thumb.jpg?imgmax=800 "mananagekeyyes")](https://lh6.ggpht.com/-eenpeEKhU28/UEDNWUmY0QI/AAAAAAAAASo/FwYX1WG19MU/s1600-h/mananagekeyyes%25255B2%25255D.jpg)  
Now there are still some things under the covers here that I am still finding the answers too, but my first guess is this is some iteration/flavor of oAuth. But, go ahead and copy down the Application Key that is generated for you.  At this point, there is only one key and if you regenerate post deployment then your app will break so be careful with that little regenerate button of power.  
[![image](https://lh3.ggpht.com/-RnHO6xgWzhQ/UEDKywa7I_I/AAAAAAAAASg/aeOegeY0vv0/image_thumb%25255B17%25255D.png?imgmax=800 "image")](https://lh5.ggpht.com/-TsIDRKYIssc/UEDKyRNvQWI/AAAAAAAAASY/PlY4wR-GYAs/s1600-h/image%25255B33%25255D.png)  
Click the check mark and you are ready to start.

### Interacting with the Endpoint via REST

Using Fiddler to see your HTTP calls going to and from RESTful endpoint is great, BUT there is also a little tab in there that most developers don’t realize is there.  It’s the **Composer** tab.  You can either originate a call in there OR drag a previous call from the left side to the composer tab and make changes to it and hit the execute button.  Great feature!  
[![image](https://lh5.ggpht.com/-e2q63f_GiIg/UEDTdgDOWRI/AAAAAAAAATI/v8F_YrO6Xus/image_thumb%25255B20%25255D.png?imgmax=800 "image")](https://lh6.ggpht.com/-LuDLr1CCgiY/UEDTazLGqsI/AAAAAAAAATA/jeGGVnX5PnQ/s1600-h/image%25255B38%25255D.png)

### What are my EndPoints?

Interesting how this works…  
The endpoints are formatted as \[https://[your new service address](https://%5Byour%20new%20service%20address/)\]/tables/\[table name\]. So in my case, the RESTful endpoint for the TodoItem table is: [https://testmobileservice.azure-mobile.net/tables/TodoItem](https://testmobileservice.azure-mobile.net/tables/TodoItem "https://testmobileservice.azure-mobile.net/tables/TodoItem"). I have inserted a single record already so we can construct a GET call in Fiddler to see what is returned.  
Do this by again, going to the composer tab and inserting the url for the endpoint in the location box and in the Request Headers you will need to add the following:

> User-Agent: Fiddler  
> Host: testmobileservice.azure-mobile.net  
> Accept: application/json  
> X-ZUMO-APPLICATION: \[YOUR APPLICATION KEY HERE\]The X-ZUMO-APPLICATION header key/value pair is the secret sauce, I am sure that when the official SDK for these services is released for Windows Phone; there will be some better way to put this all together or maybe not, cause let’s be honest REST is EASY!  
> So Click the Execute button and we get a nice JSON result returned  
> \[{"id":1,"ToDoText":"Text1","ToDoId":1}\]But wait, can we get XML too? No, it does not appear so.  Trying to change the Accept header to “**Accept:application/xhtml+xml,application/xml;q=0.9,_/_;q=0.8**” to get xml does not work. Also it is important note that if the Accept header is not sent, JSON is also returned.   
> It is my assumption that, as you can do in ASP.NET Web API, the services are doing something like  
> HttpConfig.Formatters.Remove(HttpConfig.Formatters.XmlFormatter);in order to force JSON, this is a smaller payload and is the more preferred format for REST based services.

### Inserting / ~Updating~ Data

Again remember that these are simply REST based services, so you can just do the same as above and instead of calling with a GET, do it with a\*\* ~PUT~ (405 Method Not Allowed)\*\* or POST and pass a payload of type ToDoItem.  Here is an example of an insert.  
Change the dropdown in the composer tab of Fiddler from a GET to a POST (INSERT) and in the Request Body add the following text:

> {  "ToDoText":"Text1" , "ToDoId":2}Click the execute button and on the left window you should get a Result of 201 and the response sends back the newly created item in JSON.  
> {"ToDoText":"Text1","ToDoId":2,"id":2}  
> **Methods Allowed – GET, POST, DELETE**

### Dynamic Tables

So what’s really behind this?  Is it SQL Server, a flavor of NoSQL running inside SQL? Is this table storage with some magic?  Let’s call a POST method and add some new fields and see what happens here.  
Here is the new JSON payload:

> {   
>     "ToDoText":"Text1" ,     "ToDoId":3,  
>     "ToDoWhen": "12/01/2012",  
>     "ToDoByWho" : "Shayne Boyer"  
> }The highlighted rows here we already had in our table before, but I am passing in some new data fields. And it works, very cool…  
> [![image](https://lh3.ggpht.com/-ZcwtPqARAT0/UEDYCRBJajI/AAAAAAAAATk/HMcmHGIX8xU/image_thumb%25255B23%25255D.png?imgmax=800 "image")](https://lh3.ggpht.com/-BFiC1Z5I6hc/UEDYBw3Pl-I/AAAAAAAAATc/hWu18CNE7yw/s1600-h/image%25255B43%25255D.png)  
> What does a get return now that we have the new fields in one but not in the other?  
> [![image](https://lh5.ggpht.com/-lJluBM1rg-c/UEDYDEo02ZI/AAAAAAAAAT0/xyOld3xetAU/image_thumb%25255B26%25255D.png?imgmax=800 "image")](https://lh6.ggpht.com/-Y9n_eQzlrPs/UEDYCzCWENI/AAAAAAAAATs/wsS3xD3gteU/s1600-h/image%25255B48%25255D.png)  
> I like it! Data Model changes, NoSQL style in Runtime.  You see that we now get the fields in the previous records available to us for an update later and they are automatically set to NULL.  Now one thing to note that there is no ability to remove a field. You would most like have to delete the table from Azure and start clean.   
> So there it is, if you can hit REST with any of you coding skills you can use this.  Doesn’t necessarily have to be Windows 8.  It can be Windows Phone, iOS, Android or Raspberry Pi for that matter.  It can even be a web page.  Look forward to what more is to come from this and Azure in the future!  
> Let me know if you have any questions, please comment.
