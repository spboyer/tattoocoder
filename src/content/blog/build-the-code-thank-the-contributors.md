---
title: "Build the code, thank the contributors!"
description: "The GitHub event announced a great new feature - GitHub Sponsors. GitHub Sponsors is a new way to financially support the developers who build the open source software you use every day. See the full announcement blog post for more information. Recognizing Contributors Recently, Brian Clark introduced me to all-contributors"
pubDate: "2019-05-24T01:53:51.000Z"
updatedDate: "2019-05-24T02:15:51.000Z"
heroImage: "/content/images/imported/build-the-code-thank-the-contributors-cover.png"
tags:
  - "github"
  - "community"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/build-the-code-thank-the-contributors/"
---

The [GitHub event](https://github.blog/2019-05-23-building-an-interconnected-community-together/) announced a great new feature - GitHub Sponsors. [GitHub Sponsors](https://github.com/sponsors) is a new way to financially support the developers who build the open source software you use every day. See the [full announcement blog post](https://tattoocoder.com/build-the-code-thank-the-contributors/\(https://github.blog/2019-05-23-announcing-github-sponsors-a-new-way-to-contribute-to-open-source/\)) for more information.

#### Recognizing Contributors

Recently, [Brian Clark](https://twitter.com/_clarkio) introduced me to **all-contributors** ([https://github.com/all-contributors/all-contributors](https://github.com/all-contributors/all-contributors)) an awesome way to recognize contributors to your project.

![all contributors table image](/content/images/imported/build-the-code-thank-the-contributors-image-0.png)

The [installation](https://allcontributors.org/docs/en/bot/installation) is super easy. Enable the bot on your repository, and you're ready to go.

> Good practice is to have a CONTRIBUTING.md in your repo not only to encourage good practices but to also set expectations and standards.

![add bot to repo image](/content/images/imported/build-the-code-thank-the-contributors-image-1.png)

**Adding contributors**

There are a few ways in which our contributors get added to the table on the README.

First, this is a go forward bot for contributions/commits; therefore they are added as commits happen.

For other ad-hoc acknowledgments, you may comment on a PR or Issue.

![simple add example](/content/images/imported/build-the-code-thank-the-contributors-image-2.png)

The comment may also be a bit more intentional. Per the docs, it uses [basic Natural Language Processing](https://github.com/all-contributors/all-contributors-bot/blob/master/src/tasks/processIssueComment/utils/parse-comment/index.js).

Here, I added [Jen Looper](https://twitter.com/jenlooper) for her design work.

![nlp example](/content/images/imported/build-the-code-thank-the-contributors-image-3.png)

In either case, a PR is opened to add the user/contributor to the **README** and **.all-contributorsrc** files for the attributions.

![PR image](/content/images/imported/build-the-code-thank-the-contributors-image-4.png)

Building community through code is at the heart of GitHub, but being a good human through good manners is the first step to continuing that effort. Say thank you to your contributors. It takes a few moments, they will thank you with more commits.
