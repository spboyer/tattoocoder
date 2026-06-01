---
title: "dotnet CLI Tab completions now available in 2.0"
description: "Tab completion on the command line is like having a superpower for some of the CLI tools we have at our fingertips. With so many commands, paramaters and/or options; it's nice to be able to type a few characters and tap the {Tab} key and get some help. I've"
pubDate: "2017-06-09T19:26:45.000Z"
updatedDate: "2017-06-09T19:26:45.000Z"
tags:
  - "dotnet"
  - "dotnet-cli"
  - "aspnetcore"
source: "tattoocoder-ghost"
sourceUrl: "https://tattoocoder.com/dotnet-cli-tab-completions-now-available-in-2-0/"
---

Tab completion on the command line is like having a superpower for some of the CLI tools we have at our fingertips. With so many commands, paramaters and/or options; it's nice to be able to type a few characters and tap the {Tab} key and get some help. I've gotten spoiled even with directory searching by just hitting tab now in zsh and having the list popup and getting the "pick list" to choose the right one.

A long standing issue for the .NET CLI for the command line lovers was this missing feature. Wait no longer, with the 2.0 release you can now enable it with by adding some config to your _.bashrc_, _.zshrc_ or even _Powershell_ configurations.

_These scripts assume that **dotnet v2.0** is on your path._

[See the configuration for Powershell and Bash](https://github.com/dotnet/cli/blob/master/Documentation/general/tab-completion.md#how-to-enable-it)

![tab completion image](/content/images/imported/dotnet-cli-tab-completions-now-available-in-2-0-image-0.gif)

To enable for zsh:

Edit your `.zshrc` file and add the following:

```bash
_dotnet_zsh_complete()
{
  local dotnetPath=$words[1]

  local completions=("$(dotnet complete "$words")")

  reply=( "${(ps:\n:)completions}" )
}

compctl -K _dotnet_zsh_complete dotnet
```

Restart your zsh terminal instance.
