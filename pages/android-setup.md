---
layout: page
title:  "Android Setup"
---

The most beginner friendly way to achieve Android builds is via Android Studio. For more advanced users  sdks can also be installed with homebrew or manually from the Android Studio Website.

Following these instructions will make Mac + Windows machines capable of creating Android builds, and emulators available to the `corber start` command.

1. Ensure JDK (Java Development Kit) is installed ->
  [here](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  
  Please note that JDK 11 is not yet supported by Cordova. It is advised you install JDK 8.x

2. Install Android Studio ->
  [here](https://developer.android.com/studio/index.html)
- Click the "Download Android Studio" button displayed at the top
- Install the software
- Launch Android Studio
- Some people have trouble if Android Studio is not opened to a project. If that is the case, select Import Project and open your corber project
- Android Studios has a global search charm which makes finding tabs easy, it is activated with Command + Shift + A.

3. Ensure your path is configured ->
- User Configure >> SDK Manager to Confirm you have an sdk path set.

```
#~/.bash_profile
export PATH=$PATH:/Users/foo/Library/Android/sdk/platform-tools
export PATH=$PATH:/Users/foo/Library/Android/sdk/tools
export ANDROID_HOME=/Users/foo/Library/Android/sdk
```

4. You will also need gradle installed. For Mac users, `brew install homebrew` is sufficient. Gradle can also be installed directly from the [gradle website](https://gradle.org/).

5. Install Gradle -> [here](https://gradle.org/install/)
- For Mac users, `brew install gradle` is sufficient

6. OPTIONAL: Create Android Emulators ->
- For `corber start` to work with Android emulators they need to be created first
- By default Android Studio does not install any emulators
- Android refers to emulators as AVD (Android Virtual Device)
- Use the global search charm to open the 'AVD Manager' section
- Select ‘Create Virtual Device’ and configure create a device with your desired properties (version, device type, etc)
- Once created, the emulator/AVD will be available to corber when using `corber start`
