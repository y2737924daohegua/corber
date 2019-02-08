---
layout: page
title:  "Development Workflow"
---


This section describes the typical way to use Corber while locally developing applications, using the `start` and `serve` commands. These commands enable conveniences such as the hot reloading of assets on emulators/devices - avoiding the need to recompile your app after every code change. 

Similar to your JavaScript Framework's serve, the `start` and `serve` commands are targeted to your development environment only. Builds shared with others for production or beta distribution, e.g. via iTunes Connect, should follow the  [Static / Production build guide](/workflow/building).

#### In this section:

* [Start](#start)
* [Access the JS Console for Debugging](#access-the-javascript-console-for-debugging)
* [Serve](#serve)

#### Start

Whether you are working on iOS or Android, the easiest way to write mobile-targeted apps with corber is using the `start` command. 

`start` runs your application iOS/Android devices/emulators and the browser with hot reload enabled - meaning any code changes you make are automatically reflected on your targeted device. `start` also retains access to native plugins you may be using. 

Mechanically, `start` launches a customized version of your frameworks existing serve/hot reload process while injecting mobile assets, and creates a special mobile container that is directed to your serve instance and installed/booted on your selected device. 

If you've followed the [Installation Steps](/pages/installation) *start* will work out of the box. Your experience will be the following:

* Run `corber start`.
* Corber will list all available emulators and devices - select the one you'd like to be testing with. If you select an emulator it will be started on your behalf.
* Corber will start your customized serve instance, build a special container app pointed to this instance and install/launch the app on your taergeted device.
* Make any code change and you will see it automatically reflected on your device.
* Given corber is running your serve instance, you can still access and test in the browser too: head to your standard devurl, e.g. localhost:4200;

If you are using `corber start` for an iOS device Automatic Signing must be enabled in your project settings.

***

#### Access the Javascript Console for Debugging

Even when running on a device or emulator you can still debug your app with the JS console - so long as it is physically connected to your machine.

Android Builds can be remotely inspected in Chrome ([details](http://geeklearning.io/apache-cordova-and-remote-debugging-on-android/)), and iOS builds in Safari ([details](http://geeklearning.io/apache-cordova-and-remote-debugging-on-ios/)).

***

#### Serve

`serve` is a much more primitive version of start which should only be used in more advanced cases. *serve* will build the special container app described above and launch your customized serve instance, however will go no further. It is up to you to install and launch the build on a device/emulator.

*serve* is best used in cases where you want to deeply customize the redirect experience or want to be testing a build on multiple devices concurrently.

##### Customize the device hot reload url

Hot reload works by redirecting the cordova apps window.location from file://index.html to your locally running serve instance.
Corber will detect and automatically set these values for you.

There are times you may need to run live reload with a specific remote host and port, or to customize a local url because we are not detecting it correctly.
You can do so:

- Via command line arg: `corber serve --reload-url="<url>"`.

Where `<url>` above  refers to a fully qualified URL including protocol, host, and port (if applicable), e.g. http://localhost:4200


**Next**:
- [Static & Production Builds](/pages/workflow/building)
