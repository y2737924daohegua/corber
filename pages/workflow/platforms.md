---
layout: page
title:  "Platforms"
---

A Corber project can target one or more _platforms_, such as iOS or Android.

Each time you run `corber build`, your JavaScript app will be packaged in the appropriate shell for each platform (e.g. Xcode for iOS) in a subfolder of `corber/platforms`.

When you run `corber init`, you will be prompted to add a platform.

#### Adding additional platforms

Platforms can be added using the `corber platform add` command of the CLI.

For example:

```cli
corber platform add ios
corber platform add android
```

The available platforms are:

- iOS
- Android
- Blackberry
- Windows
