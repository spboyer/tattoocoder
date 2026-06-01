---
title: "Monitoring issues on Stack Overflow with serverless, CosmosDB and Teams"
description: "One of the responsibilities we have as Cloud Developer Advocates is having an understanding of the struggles of developers using the cloud in their daily tasks. One way to do that is to spend time looking over the latest questions on Stack Overflow with a little project called StackoverAzure. Instead"
pubDate: "2018-01-24T20:31:34.000Z"
updatedDate: "2018-01-26T13:48:26.000Z"
heroImage: "/content/images/imported/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams-cover.png"
tags:
  - "azure-functions"
  - "azure"
  - "dotnet"
  - "serverless"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams/"
---

One of the responsibilities we have as Cloud Developer Advocates is having an understanding of the struggles of developers using the cloud in their daily tasks. One way to do that is to spend time looking over the latest questions on Stack Overflow with a little project called **StackoverAzure**.

Instead of having yet another browser tab was to use serverless functions to monitor certain tags and send cards to our Teams room with the pertinent info for anyone on our team to quickly see the most recent unanswered questions.

![stackoverazure-card](/content/images/imported/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams-image-0.png)

### Concept

Watch Stack Overflow for questions with the following parameters:

-   Have NOT been answered. (no answer accepted)
-   Tagged with `azure`

Every 30 minutes, the process would grab the last fifty questions that met these requirements and add them to our CosmosDB instance if they did not already exist. If a new question was added, a new card would be sent to our Microsoft Teams room with the information for anyone on our team to take action.

### Solution

![stackoverazure](/content/images/imported/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams-image-1.png)

##### Getting the questions

The first task was to "poll" for new questions. For this, I used an [Azure Timer Function](http://cda.ms/6w) set to request every 30 minutes.

```csharp
[FunctionName("Questions")]
[StorageAccount("AzureWebJobsStorage")]
public async static void Run([TimerTrigger("* */30 * * * *")]TimerInfo myTimer, [Queue("questions")] IAsyncCollector<StackCard> questionsOutput, TraceWriter log)
{
    var questions = await GetQuestions(log);
    foreach (var question in questions.Data.Items)
    {
       var card = CreateCard(question);
       await questionsOutput.AddAsync(card);
    }
}
```

The timer is configured using the annotation `[TimerTrigger("* */30 * * * *")]`, the timer is set to 30 minutes using a [CRON expression](https://en.wikipedia.org/wiki/Cron#CRON_expression). A find that [https://crontab.guru](https://crontab.guru) is a cool site for testing your settings.

The **GetQuestions** method uses a NuGet package called [StacMan](https://github.com/StackExchange/StacMan) a .NET Client for Stack Exchange.

> Util.GetSetting is a helper function to retrieve values from Environment variables, the long form is `Environment.GetEnvironmentVariable(key, EnvironmentVariableTarget.Process);`

```csharp
private static async Task<StacManResponse<Question>> GetQuestions(TraceWriter log)
{
    var stackexchangekey = Util.GetSetting("StackExchangeKey");

    log.Info($"StackOverAzure function executed at: {DateTime.Now}");

    var client = new StacManClient(key: stackexchangekey, version: "2.1");
    var response = await client.Questions.GetAll("stackoverflow",
    tagged: Util.GetSetting("tags"),
    page: 1,
    pagesize: 50,
    sort: StackExchange.StacMan.Questions.AllSort.Creation,
    order: Order.Desc);

    return response;
}
```

Our `stackexchangekey` is the app key received when you [register your application](https://stackapps.com/apps/oauth/register) through the [StackExchange API](http://api.stackexchange.com). The `tags` value as mentioned before is simply set to **azure** but could be set to multiple values.

For each of the items received, the Teams card was created and then put into an Azure Storage Queue called `questions`.

To format the card to be sent to the queue, the docs had an awesome [Actionable Card Reference](http://cda.ms/6y) and a very cool playground for working out the design.

![card playground](/content/images/imported/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams-image-2.png)

##### Processing the items on the queue

For each item on the queue, there were a couple of operations that needed to happen.

1.  Have we looked at this question?
2.  Store the info if we didn't have it.

For this operation, a second Azure Function was used but a different type; a [Queue Storage](https://tattoocoder.com/monitoring-issues-on-stackoverflow-with-serverless-cosmosdb-and-teams/cda.ms/6z) whenever a new item is put onto a queue the function responds to that event and takes action on that item.

Once the item is created on the queue, the function will fire and the **question** is ready for us to work on and see if it is in our database. If you have ever done and SQL work in your development career, this is standard/redundant SQL code right?

```
--> SELECT blah WHERE blah

    --> IF results = 0

      --> INSERT blah
```

Ugh! I think that this is one of the reasons I stopped doing DB work. BUT, what if I told you that there was one line in the code that did ALL OF THAT! Thanks to bindings from CosmosDB and Azure Functions that is in fact true. Check this out!

```csharp
[FunctionName("ProcessQuestions")]
[Singleton]
public static async Task RunQueue(
[QueueTrigger("questions", Connection = "AzureWebJobsStorage")]StackCard question, 
[DocumentDB("questionDatabase", "questions", ConnectionStringSetting = "stackoverazure_documentdb", Id = "{Id}", CreateIfNotExists = true)] dynamic inDocument, 
[DocumentDB("questionDatabase", "questions", ConnectionStringSetting = "stackoverazure_documentdb")] IAsyncCollector<dynamic> outDocuments ,
            TraceWriter log)
{
    if (question != null)
    {
        if (inDocument == null)
        {
            await outDocuments.AddAsync(question);
            await SendToTeams(question);
        }
    }
}
```

That does all of the work! Let's break this down.

**questions** is the queue that the function will watch and what variable the item will initiate when a new one is created.

```csharp
[QueueTrigger("questions", Connection = "AzureWebJobsStorage")]StackCard question, 
```

**questionDatabase** is the CosmosDB instance and **questions** is the collection where the function will query to see if the **question** with the **Id** exists. If it does not exists, then a new object gets created.

```csharp
[DocumentDB("questionDatabase", "questions", ConnectionStringSetting = "stackoverazure_documentdb", Id = "{Id}", CreateIfNotExists = true)] dynamic inDocument, 
```

This line defines the **outDocuments** parameter so if the **inDocument** is new and needs to be saved, when `.AddAsync` is called; the new document is saved to the CosmosDB collection.

```csharp
[DocumentDB("questionDatabase", "questions", ConnectionStringSetting = "stackoverazure_documentdb")] IAsyncCollector<dynamic> outDocuments ,
```

Now that it's decided to keep or throw away the question, now send it over to Teams. Simple task to serialize the json from the queue item, use the HttpClient class to call our Teams webhook. See the docs on [Office 365 Connectors for Microsoft Teams](http://cda.ms/6B).

```csharp
private static async Task<string> SendToTeams(StackCard question)
{
    var webhook = Util.GetSetting("TeamWebhookUri");
    string jsonCard = JsonConvert.SerializeObject(question.Card, Formatting.Indented);

    using (var client = new HttpClient())
    {
        var request = new HttpRequestMessage(HttpMethod.Post, webhook);

        request.Content = new StringContent(jsonCard, Encoding.UTF8, "application/json");

        var result = await client.SendAsync(request);

        return await result.Content.ReadAsStringAsync();
    }
}
```

And that's it, a super simple set of serverless functions to help us monitor Azure developer questions on Stack Overflow. Checkout the code on [GitHub](https://github.com/spboyer/stackoverazure).
