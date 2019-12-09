---
layout: page
title:  "CLI Reference"
---

**Init, Development, Building**

* [corber init](#corber-init)
* [corber start](#corber-start)
* [corber build](#corber-build)
* [corber open](#corber-open)
* [corber serve](#corber-serve)

**Plugins and Platforms**

* [corber plugin](#corber-plugin)
* [corber plaform](#corber-platform)
* [corber prepare](#corber-prepare)

**Other Useful Commands**

* [corber proxy](#corber-proxy)
* [corber make-icons](#corber-make-icons)
* [corber make-splashes](#corber-make-splashes)
* [corber lint-index](#corber-make-splashes)

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
***


## `corber start`

The start command supports iOS and Android. It boots an emulator,
installs / launches an application to the emulator and starts your
frameworks development server for livereload.

To learn more, [read here](/pages/development-workflow)


| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | platform |
| skip-cordova-build (alias: scb) | false | only performs framework build |

### Examples
+ `corber start`
+ `corber start --platform=android`

***


## `corber build`

Runs a Corber build by building your JavaScript application, copying assets to the Cordova web directory, and building the Cordova application. To learn more, [read here](/pages/workflow/building).

| Options     | default   | desc |
|------------ |---------- | ---- |
| environment | development| JS Framework env |
| platform    | ios | target platform |
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


## `corber open`

Opens the built iOS project in Xcode. Does not support Android - Android projects will require you to manually open Android Studio.

### Examples
+ `corber open`

***


## `corber serve`

Hot reload. To learn more, [read here](/pages/development-workflow).

You may want to look at the start command, which is newer and provides a
more integrated experience for emulator usage.

| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | cordova platform |
| reload-url | auto detected ip | network ip of your machine |
| cordova-output-path| corber/cordova/www | |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

### Examples
+ `corber serve`
+ `corber serve --platform=android --reload-url=192.168.1.1`
+ `corber serve --platform=browser --env "development"`

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

***


## `corber lint-index`

Validates there are no leading `/` paths in your generated app. While Corber will validate your framework config pre build, sometimes items such as hardcoded CDN urls will slip through.

lint-index is automatically run on builds at WARN level.

#### Examples
+ `corber lint-index`
