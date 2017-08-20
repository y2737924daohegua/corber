---
layout: page
title:  "Installation / Quickstart"
---

#### Requirements
- node 6/7/8 per [Ember Node LTS Support](http://emberjs.com/blog/2016/09/07/ember-node-lts-support.html);
- An existing JS application with one of the supported frameworks;
- A Macintosh machine is required for iOS builds;

#### Installation

```cli
  yarn install -g corber
  npm install -g corber
```

#### Project Setup

From a supported JS projected, run `et init`. For a list of supported projects, see [framework integrations](/pages/frameworks/index).

This will:

- Identify your project type;
- Create a new folder at ember-cordova, including corber configuration;
- Initialize a Cordova project at ember-cordova/cordova;

###### Supported Flags


|             | type / desc                       |
|------------ | ----------------------------------|
| name        | String (defaults to com.embercordova.{{yourEmberAppName}}) |
| cordovaid   | String (defaults to your app name) |
| templatePath| String path to cordova template |

```cli
ec new-android-project --name=AppName --cordovaid=com.isleofcode.app --templatePath=../template
```
**cordovaid flag**

com.embercordova.yourAppName is the default cordovaid, which ultimately represents your iOS and Android project ids. Android projects _require_ reverse domain app ids.

By release, you should update id to com.yourdomain.foo. This is achieved by setting the `id` property on the `widget` node in the `ember-cordova/cordova/config.xml`.

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

- [Framework Setup](/pages/frameworks/index)
