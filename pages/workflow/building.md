---
layout: page
title:  "Static & Production Builds"
---

`corber build` builds  a static version of your app, which can then be used for testing or distribution to other users, e.g. via iTunes connect or emailing an Android APK.

When writing code, we recommend using the `corber start` flow described in [Development Workflow](/pages/development-workflow).

```
    corber build --platform=ios --environment=production
```

#### Deploying to a Device or Emulator

After building, you will may want to deploy to a device or emulator for a final test. It is typically easiest to deploy using your platform's native IDE - Xcode for iOS and Android Studio for Android.

For your day to day development we recommend using the `start` command.

#### Release Builds

By default, Corber produces debug builds. You need to add a `--release` flag for Cordova release builds, see the [CLI Reference](/pages/cli).


```bash
  corber build --platform=ios --environment=production --release   # Release build for iOS
  corber build --platform=android --environment=production --release   # Release build for Android
```

Typically for production builds you will use the flags described in the [CLI Reference](/pages/cli) to sign the build with your certificates. For a simpler experience, we suggest opening Xcode or Android Studio and signing builds through the IDE.


**Next**:
- [Native Plugins](/pages/workflow/plugins)
