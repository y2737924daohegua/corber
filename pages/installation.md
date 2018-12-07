---
layout: page
title:  "Installation / Quickstart"
---

See [compatability](/pages/compatibility) to understand corber support on your machine.

#### Requirements
- Node 6/7/8 per [Ember Node LTS Support](http://emberjs.com/blog/2016/09/07/ember-node-lts-support.html).
- An existing JavaScript application with one of the supported frameworks.
- MacOS and Xcode are required for iOS builds.

#### Installation

```cli
# Yarn
yarn global add corber

# NPM
npm install -g corber
```

#### Initialize Corber
1. Change to your project directory.
2. Run `corber init`.
3. Select iOS or Android as your target platform. You can add or remove platforms later with the `platform` command. 

This process will:

- Identify your project type.
- Create a new folder at `corber`, including Corber configuration.
- Initialize a Cordova project at `corber/cordova`.
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

- [Vue Setup](/pages/frameworks/vue)
- [Ember Setup](/pages/frameworks/ember)
- [React Setup](/pages/frameworks/react)
- [Glimmer Setup](/pages/frameworks/glimmer)

