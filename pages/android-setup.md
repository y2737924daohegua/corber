---
layout: page
title:  "Android Setup"
---
The most beginner friendly way to achieve Android builds is via Android Studio. For more advanced users SDKs can also be installed with homebrew or manually from the Android Studio Website.

In order for Android builds to work, your system must have the following packages configured:
- JDK 8
- Android Studio + SDK Tools
- Gradle

## Beginner Setup Guide

Following these instructions will make Mac + Windows machines capable of creating Android builds, and emulators available to the `corber start` command.

1. Ensure JDK 8 (Java Development Kit) is installed. JDK 11 is not yet supported ->
  [here](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  
2. Install Android Studio ->
  [here](https://developer.android.com/studio/index.html)
- Click the "Download Android Studio" button displayed at the top
- Install the software
- Launch Android Studio
- Some people have trouble if Android Studio is not opened to a project. If that is the case, select Import Project and open your corber project

3. Ensure gradle is installed
- Opening Android studio to a corber project will prompt you to install gradle. This installation will work fine on Mac/Windows/Linux
- Gradle can also be installed manually:
-- Mac users can run `brew install gradle`
-- Linux users can manually download and unpack from the [gradle website](https://gradle.org/)

4. Ensure your ANDROID_HOME env variable is configured ->
Mac/Linux
```
#~/.bash_profile
export ANDROID_HOME=/Users/foo/Library/Android/sdk
```

Windows
```
#~/yourCorberProjectPath/corber/cordova/platforms/android/local.properties
sdk.dir=C:\\Users\\username\\AppData\\Local\\Android\\Sdk
```

## Setting up emulators for corber start

OPTIONAL For `corber start` to function you must have already configured AVDs (Android Virtual Devices).
By default Android Studio does not come with any pre-installed emulators.

- Use the global search charm (cmd + shift + a) to open the 'AVD Manager' section
- Select ‘Create Virtual Device’ and configure create a device with your desired properties (version, device type, etc)
- Once created, the emulator/AVD will be available to corber when using `corber start`

## Accepting Android Licenses

Sometimes running Android emulators will result in an error explaining licenses have not been accepted. 

*To resolve on Mac/Linux:*

Run the below command and accept the licenses. If `sdkmanager` is not in your global bin it can be found in your ANDROID_HOME path. 
```
sdkmanager —licenses
```

*To resolve on Windows:*
- Open a windows terminal to your SDK path, likely C:\\Users\\username\\AppData\\Local\\Android\\Sdk
- Run `sdkmanager.bat --licenses`
- Accept the licenses


**Next**:
- [Vue Setup](/pages/frameworks/vue)
- [Ember Setup](/pages/frameworks/ember)
- [React Setup](/pages/frameworks/react)

