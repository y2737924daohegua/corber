---
layout: page
title:  "Building"
---

`corber build` builds your JS Framework app with Cordova assets injected, and then executes a Cordova build. Validators are run to ensure there are no known errors.

```
    corber build --platform=ios --environment=production
```

ios is the default platform.

#### Deploying to a device or emulator

After building, you will need to deploy to a device or emulator for testing. A build includes creating the iOS/Android application, but not bundle the run command.

`corber open` will open your project in Xcode or Android Studio. The IDE can then be used for starting emulators, code signing & app store uploads.

Alternatively, you can deploy to a device or emulator using `corber cdv run`, like so:

```bash
  corber cdv run ios --emulator --nobuild   # Deploy to iOS simulator
  corber cdv run android --device --nobuild  # Deploy to Android device
```

To deploy to an iOS device, you must have Provisioning Profiles set up. Usually, Xcode can set up development profiles for you automatically.

#### Release Builds

By default, corber produces debug builds. You need to add a `--release` flag for Cordova release builds, see the [cli reference](/pages/cli).


```bash
  corber cdv run ios --emulator --nobuild   # Deploy to iOS simulator
  corber cdv run android --device --nobuild  # Deploy to Android device
```

#### Debugging

Android Builds can be remotely inspected in Chrome ([details](http://geeklearning.io/apache-cordova-and-remote-debugging-on-android/)), and iOS builds in Safari ([details](http://geeklearning.io/apache-cordova-and-remote-debugging-on-ios/)).

#### Non-Cordova Builds

Cordova Assets & plugins will only be injected to `corber build/serve` tasks. Your standard builds will remain unaffected, and will have no additional assets injected.
