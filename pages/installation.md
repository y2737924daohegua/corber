---
layout: page
title:  "Installation"
---

#### Requirements
- Node 6+ per [Ember Node LTS Support](http://emberjs.com/blog/2016/09/07/ember-node-lts-support.html).
- An existing JavaScript application with one of the supported frameworks.

corber supports Mac, Windows (Powershell + Bash/WSL) and Linux machines - however only Mac machines can produce iOS builds. 

#### Installation

```cli
# Yarn
yarn global add corber

# NPM
npm install -g corber
```

#### Initialize Corber
After installation, the next step is to add corber to your existing JS project. You'll need to do this once per project you want to run corber in.

1. Change to your project directory.
2. Run `corber init`.
3. Select iOS or Android as your target platform. You can add or remove platforms later with the `platform` command. 

This process will:

- Identify your framework type.
- Create a new folder at `./corber`, which includes Corber configuration.
- Initialize a Cordova project at `corber/cordova`, which is where your platform builds will go.
- Install your targeted platform (iOS or Android).

###### corber init flags


|             | type / desc                       |
|------------ | ----------------------------------|
| name        | String (defaults to com.embercordova.{{yourEmberAppName}}) |
| cordovaid   | String (defaults to your app name) |
| templatePath| String path to cordova template |

```cli
corber init new-android-project --name=AppName --cordovaid=com.isleofcode.app --templatePath=../template
```
**cordovaid flag**

com.embercordova.yourAppName is the default cordovaid, which ultimately represents your iOS and Android project ids. Android projects _require_ reverse domain app ids.

By release, you should update id to com.yourdomain.foo. This is achieved by setting the `id` property on the `widget` node in the `corber/cordova/config.xml`.

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.myappdevcompany.phoneapp" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>phoneApp</name>
    <description>
        A sample Apache Cordova application that responds to the deviceready event.
    </description>
 ...
```

**Next**:

- [iOS Setup](/pages/ios-setup)
- [Android Setup](/pages/android-setup)
