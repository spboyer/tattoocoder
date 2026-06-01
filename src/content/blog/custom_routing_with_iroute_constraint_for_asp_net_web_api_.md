---
title: "Custom Routing with IRouteConstraint for ASP.NET Web API"
description: "I will admit that Regex and I do not speak anymore. In fact, even when we did it was never a really nice conversation and sometimes ended in me cursing and/or leaving the room. If you have had this same experience when creating custom routes in ASP.NET MVC"
pubDate: "2013-03-25T19:37:00.000Z"
updatedDate: "2015-01-12T16:41:28.000Z"
tags:
  - "aspnet"
  - "regex"
  - "routing"
  - "mvc"
  - "webapi"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/custom_routing_with_iroute_constraint_for_asp_net_web_api_/"
---

I will admit that Regex and I do not speak anymore.  In fact, even when we did it was never a really nice conversation and sometimes ended in me cursing and/or leaving the room.

If you have had this same experience when creating custom routes in ASP.NET MVC then you know what I'm talking about.

IRouteConstraint  
IRouteConstraint has been around for some time in MVC, but it is also available in Web API too because of course it is based on the same stack for routing.

Undoubtedly, the most difficult part of routes is debugging or getting the Regex right. I recently re-lived this experience when having to create a custom API route for a project something along the lines of

> /api/{controller}/**{model}**/**{road}**/**{id}**  
> where **{model}** must exist in a list of valid string values and **{road}** is a pattern of **_XX9999_** and then obviously the **{id}** must be an integer for the specific record in the list.

So, initially you start putting the Regex together for the id, "_^\\d+$_", and then the road might be something like   "_[\[1\]](#fn1){2}\\d{4}$_".  But how should I handle the in list for the **{model}** param?

Sure we could put together the Regex for that, but debugging all of this is a pain even in the short term.  Also if the constraint itself is something of an edge case where the value must be a filename that exists, or a guid in memory etc; IRouteConstraint is the answer.

IRouteConstraint requires you to implement one method, Match, which returns a boolean. In the method below we are looking for one of the values being passed in the values\[\] parameter to a list used in the constructor.

```language-csharp
public class FromValuesListConstraint : IRouteConstraint
{
    public FromValuesListConstraint(params string[] values)
    {
        this._values = values;
    }

    private readonly string[] _values;

    public bool Match(HttpContextBase httpContext, 
                        Route route, string parameterName, 
                        RouteValueDictionary values, 
                        RouteDirection routeDirection)
    {
        // Get the value called "parameterName" from the            
        // RouteValueDictionary called "value"            
        string value = values[parameterName].ToString();
        // Return true is the list of allowed values contains            
        // this value.            
        return _values.Contains(value, StringComparer.CurrentCultureIgnoreCase);
    }
}

```

In order to use this from the WebApiConfig.cs class, create your route like the following.

```language-csharp
 config.Routes.MapHttpRoute(
        name: "CustomRouteNoDayOrAction",
        routeTemplate: "api/{controller}/{model}/{road}/{id}",
        defaults: null,
        constraints: new
        {
            model = new FromValuesListConstraint("ford", "chevy", "dodge", "toyota"),
            road = @"^[a-zA-Z]{2}\d{4}$",
            id = @"^\d+$"
        });

```

When you run and test your routes, you can now put a break point on the FromValuesListConstraint Match method and debug the routing.

* * *

1.  a-zA-Z [↩︎](#fnref1)
