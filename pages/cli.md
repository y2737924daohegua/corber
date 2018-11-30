---
layout: page
title:  "CLI Reference"
---

**Available Commands**

* [corber init](#corber-init)
* [corber open](#corber-open)
* [corber build](#corber-build)
* [corber lint-index](#corber-lint-index)
* [corber plaform](#corber-platform)
* [corber plugin](#corber-plugin)
* [corber prepare](#corber-prepare)
* [corber proxy](#corber-proxy)
* [corber serve](#corber-serve)
* [corber start](#corber-start)

## Defaults

Override default CLI flags in `.ember-cli`, which lives in your project root. For example, to change the default platform from ios to android:

```
#.ember-cli
platform: 'android',
reloadUrl: 'http://mycomputer:4200'
```

## `corber init`

Identifies your project type, create a new folder at `corber` including Corber configuration, and initializes a Cordova project at `corber/cordova`.

|             | type / desc                       |
|------------ | ----------------------------------|
| name        | String (defaults to com.embercordova.{{yourEmberAppName}}) |
| cordovaid   | String (defaults to your app name) |
| templatePath| String path to cordova template |

### Examples
+ `corber init new-android-project --name=AppName --cordovaid=com.isleofcode.app --templatePath=../template`

### cordovaid flag

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

## `corber open`

Opens the last built project from `corber build` in the native IDE.

| Options  | default |
|-----|-----| ----- |
| platform | ios |
| application | Xcode for iOS, Android Studio for Android |

### Examples
+ `corber open`
+ `corber open --platform=android --application=eclipse`

***

## `corber build`

Runs a Corber build by building your JavaScript application, copying assets to the Cordova web directory, and building the Cordova application. To learn more, [read here](/pages/workflow/building).

| Options     | default   | desc |
|------------ |---------- | ---- |
| environment | development| ember env |
| platform    | ios | target cordova platform |
| release     | debug | |
| cordova-output-path | corber/cordova/www | |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

The build command also takes all of the non gradle-specific cordova build opts (e.g. provisioningProfile, codeSignIdentity).

### Examples
+ `corber build`
+ `corber build --environment=production --platform=ios`
+ `corber build --environment=production --platform=ios --release`

***

## `corber lint-index`

Validates there are no leading `/` paths in your generated app. While Corber will validate your framework config pre build, sometimes items such as hardcoded CDN urls will slip through.

lint-index is automatically run on builds at WARN level.

#### Examples
+ `corber lint-index`

***

## `corber platform`

Add or remove cordova platforms.

| Options | default | desc |
|---------|---------| ---- |
| save    | true | store plugin info in `config.xml`. See [committing & cloning](/pages/workflow/committing) |
| uiwebview | false | initialize ios with UIWebView vs WKWebView |
| crosswalk | false | initialize android with Crosswalk vs Android WebView |

### Examples
+ `corber platform add ios`
+ `corber platform remove ios`
+ `corber platform add android --crosswalk`

### Aliases
+ add/a
+ remove/rm/r

***

## `corber plugin`

Add or remove cordova plugins.

| Options  | default | desc |
|---------|---------| ---- |
| save    | true | store plugin info in `config.xml`. See [committing & cloning](/pages/workflow/committing) |

### Examples
+ `corber plugin add cordova-plugin-name`
+ `corber plugin rm cordova-plugin-name`

### Aliases
+ add/a
+ remove/rm/r

***

## `corber prepare`

Installs all plugins and platforms in config.xml. Similar to `npm install`, but for your Cordova context.

### Examples
+ `corber prepare`

***

## `corber proxy`

Passes commands straight to cordova, without interference.

Because this proxies to cordova-cli, you will need cordova-cli installed (this is not required for usage anywhere else). Our hope is you won't need this command very much. If you do, consider opening an issue to let us know.

When running a proxy command, file paths are relative to your **corber/cordova** directory.

For example, running `corber proxy plugin add ../local-plugin-path` from your project root will likely fail, while `corber proxy plugin add ../../../local-plugin-path` would succeed.
(hint: try using `corber plugin add ../local-plugin-path` instead)

### Examples
+ `corber proxy info`
+ `corber proxy run ios --nobuild`

***

## `corber serve`

Live reload. To learn more, [read here](/pages/workflow/livereload).

You may want to look at the start command, which is newer and provides a
more integrated experience for emulator usage.

| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | cordova platform |
| reloadUrl | auto detected ip | network ip of your machine |
| cordova-output-path| corber/cordova/www | |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

### Examples
+ `corber serve`
+ `corber serve --platform=android --reloadUrl=192.168.1.1`
+ `corber serve --platform=browser --env "development"`


## `corber start` (beta)

The start command supports iOS and Android. It boots an emulator,
installs / launches an application to the emulator and starts your
frameworks development server for livereload.

To learn more, [read here](/pages/workflow/livereload)


| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | cordova platform |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

### Examples
+ `corber start`
+ `corber start --platform=android`

***

## `corber make-icons`

Automatically generate platform icons from a single svg. For more information, see [icon & splash generation](/pages/generate_icon_splash).

| Options    | default | desc |
|---------  |---------| ----- |
| source  | corber/icon.svg | splash svg |
| platform | all | platform to build assets for |

#### Examples
+ `corber make-icons`

***

## `corber make-splashes`

Automatically generate platform splashscreens from a single svg. For more information, see [icon & splash generation](/pages/generate_icon_splash).

| Options    | default | desc |
|---------  |---------| ----- |
| source  | corber/splash.svg | splash svg |
| platform | all | platform to build assets for |


### Examples
+ `corber make-splashes`
