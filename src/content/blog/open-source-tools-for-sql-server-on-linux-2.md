---
title: "Open source tools for SQL Server on Linux"
description: "I am a sucker for a great tool and even better if it's open source. Recently, I wrote up a post on why we should care about containers where I used SQL Server on Linux in a container and loaded some test data for an ASP.NET Core application in"
pubDate: "2018-07-17T19:47:47.000Z"
updatedDate: "2018-07-27T13:26:16.000Z"
heroImage: "/content/images/imported/open-source-tools-for-sql-server-on-linux-2-cover.png"
tags:
  - "linux"
  - "opensource"
  - "sqlserver"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/open-source-tools-for-sql-server-on-linux-2/"
---

I am a sucker for a great tool and even better if it's open source.

Recently, I wrote up a post on [why we should care about containers](https://tattoocoder.com/why-should-we-care-about-containers-for-development/) where I used SQL Server on Linux in a container and loaded some test data for an ASP.NET Core application in lieu of using a full database server.

[SQL Server on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-overview) has a built-in command line tool for connecting and executing commands against the database. However, each time you use it; it requires a login, password etc.

```console
/opt/mssql-tools/bin/sqlcmd -S localhost -d Names -U SA -P $SA_PASSWORD -I -Q "SELECT TOP 5 ID,FullName FROM Names;" 
```

## mssql-cli

Introducing the [mssql-cli](https://github.com/dbcli/mssql-cli), a new interactive and cross-platform CLI tool. This tool brings modern experiences to the command line including syntax highlighting, intellisense, multi-line mode, special commands, and many configuration settings. This is a huge upgrade over the interactive experience in sqlcmd.

![](https://github.com/dbcli/mssql-cli/raw/master/screenshots/mssql-cli-autocomplete.gif)

### Adding to a container

In order to install the **mssql-cli** tool in my SQL Server on Linux container (Ubuntu 16.04), create a Dockerfile and use the instructions in the docs for Ubuntu 16.04.

```Dockerfile
FROM microsoft/mssql-server-linux:latest

# Import the public repository GPG keys
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc |  apt-key add -

# Update the list of products
RUN apt-get update

# install curl
RUN apt-get install curl -y

# Register the Microsoft Ubuntu repository
RUN curl -o /etc/apt/sources.list.d/microsoft.list https://packages.microsoft.com/config/ubuntu/16.04/prod.list

# Update the list of products
RUN apt-get update

# Install mssql-cli
RUN apt-get install mssql-cli
```

Build the and run the image.

```console
# build the image and tag it sql1
docker build -t sql1 .

# run the image, accepting the EULA and setting the user/password for sa.
# also used --name for ease instead of using ID
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=!Passw0rd' -p 1433:1433 --name sql1 -d sql1
```

Exec into the container and start **mssql-cli**

```console
docker exec -it sql1 mssql-cli
```

Upon start, you'll be prompted for the username/password.

![](/content/images/imported/open-source-tools-for-sql-server-on-linux-2-image-1.png)

## SQL Operations Studio

-   [Download & Install](https://docs.microsoft.com/sql/sql-operations-studio/download?view=sql-server-2017&WT.mc_id=opensource-blog-shboyer)
-   [Quickstart: Use SQL Operations Studio (preview) to connect and query Azure SQL database](https://docs.microsoft.com/sql/sql-operations-studio/quickstart-sql-database?view=sql-server-2017&WT.mc_id=opensource-blog-shboyer)

If you prefer a GUI experience, [SQL Operations Studio](https://docs.microsoft.com/sql/sql-operations-studio/what-is?view=sql-server-2017&WT.mc_id=opensource-blog-shboyer) is a new cross-platform and [open source](https://github.com/Microsoft/sqlopsstudio) database management tool that works with SQL Server, Azure SQL DB, and Azure SQL Data Warehouse.

Forked from VS Code, SQL Operations Studio uses many of the great editor features of VS Code while adding modern UI for interacting with SQL Server databases. In addition, there is an extensibility manager similar to VS Code so that DBAs and developers can choose the features they want.

### Connecting to a database

To connect to our docker container, the port 1433 is mapped to **localhost:1433**. Therefore, **localhost** is the server.

![](/content/images/imported/open-source-tools-for-sql-server-on-linux-2-image-2.png)

SQL Ops Studio has a ton of great capabilities beyond just running queries. You can [build awesome server and database management dashboards](https://docs.microsoft.com/sql/sql-operations-studio/insight-widgets?view=sql-server-2017&WT.mc_id=opensource-blog-shboyer) too.

![dashboards](https://docs.microsoft.com/en-us/sql/sql-operations-studio/media/insight-widgets/database-dashboard.png?view=sql-server-2017)

The code is open source, give it a try and provide feedback - [https://github.com/Microsoft/sqlopsstudio](https://github.com/Microsoft/sqlopsstudio)
