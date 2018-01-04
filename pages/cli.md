---
layout: page
title:  "CLI Reference"
---

All commands follow the pattern `corber {command}`. We recommend aliasing a shorthand, e.g. `co {command}`

**Available Commands**

* [corber open](#open)
* [corber build](#build)
* [corber lint-index](#lint-index)
* [corber plaform](#platform)
* [corber plugin](#plugin)
* [corber prepare](#prepare)
* [corber proxy](#proxy)
* [corber serve](#serve)

Override default CLI flags in `.ember-cli` - which lives in your project root. For example, to change the default platform from ios to android:

```
#.ember-cli
platform: 'android',
reloadUrl: 'http://mycomputer:4200'
```

### Command Reference

{: .description}
### Open

Opens the last built project from `corber build` in the native IDE.

| Options  | default |
|-----|-----| ----- |
| platform | ios |
| application | Xcode for iOS, Android Studio for Android |

#### Examples
+ `corber open`
+ `corber open --platform=android --application=eclipse`

****

### Build

Runs a corber build by building your JS application, copying assets to the Cordova web directory, and building the Cordova application. To learn more, [read here](/pages/workflow/building).

| Options     | default   | desc |
|------------ |---------- | ---- |
| environment | development| ember env |
| platform    | ios | target cordova platform |
| release     | debug | |
| cordova-output-path | corber/cordova/www | |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

The build command also takes all of the non gradle-specific cordova build opts (e.g. provisioningProfile, codeSignIdentity).

#### Examples
+ `corber build`
+ `corber build --environment=production --platform=ios`
+ `corber build --environment=production --platform=ios --release`

***

### lint-index

Validates there are no leading `/` paths in your generated app. While corber will validate your framework config pre build, sometimes items such as hardcoded CDN urls will slip through.

lint-index is automatically run on builds at WARN level.

#### Examples
+ `corber lint-index`

***

### Platform

Add or remove cordova platforms.

| Options | default | desc |
|---------|---------| ---- |
| save    | true | store plugin info in `config.xml`. See [committing & cloning](/pages/workflow/committing) |
| uiwebview | false | initialize ios with UIWebView vs WKWebView |
| crosswalk | false | initialize android with Crosswalk vs Android WebView |

#### Examples
+ `corber platform add ios`
+ `corber platform remove ios`
+ `corber platform add android --crosswalk`

#### Aliases
+ add/a
+ remove/rm/r

***

### Plugin

Add or remove cordova plugins.

| Options  | default | desc |
|---------|---------| ---- |
| save    | true | store plugin info in `config.xml`. See [committing & cloning](/pages/workflow/committing) |

#### Examples
+ `corber plugin add cordova-plugin-name`
+ `corber plugin rm cordova-plugin-name`

#### Aliases
+ add/a
+ remove/rm/r

***

### Prepare

Installs all plugins and platforms in config.xml. Similar to `npm install`, but for your Cordova context.

#### Examples
+ `corber prepare`

***

### Proxy

Passes commands straight to cordova, without interference.

Because this proxies to cordova-cli, you will need cordova-cli installed (this is not required for usage anywhere else). Our hope is you won't need this command very much. If you do, consider opening an issue to let us know.

When running a proxy command, file paths are relative to your **corber/cordova** directory.

For example, running `corber proxy plugin add ../local-plugin-path` from your project root will likely fail, while `corber proxy plugin add ../../../local-plugin-path` would succeed.
(hint: try using `corber plugin add ../local-plugin-path` instead)

#### Examples
+ `corber proxy info`
+ `corber proxy run ios --nobuild`

***

### Serve

Live reload. To learn more, [read here](/pages/workflow/livereload). 

| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | cordova platform |
| reloadUrl | auto detected ip | network ip of your machine |
| cordova-output-path| corber/cordova/www | |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

#### Examples
+ `corber serve`
+ `corber serve --platform=android --reloadUrl=192.168.1.1`
+ `corber serve --platform=browser --env "development"`


### Start (beta)

Updated implementation of livereload. For further details see the
[RFC](https://github.com/isleofcode/corber/issues/428).

| Options    | default | desc |
|---------  |---------| ---- |
| platform  | ios | cordova platform |
| skip-framework-build (alias: sfb) | false | only performs cordova build |
| skip-cordova-build (alias: scb) | false | only performs framework build |

#### Examples
+ `corber start`

***

### make-icons

Automatically generate platform icons from a single svg. For more information, see [icon & splash generation](/pages/generate_icon_splash).

| Options    | default | desc |
|---------  |---------| ----- |
| source  | corber/icon.svg | splash svg |
| platform | all | platform to build assets for |

#### Examples
+ `corber make-icons`

***

### make-splashes

Automatically generate platform splashscreens from a single svg. For more information, see [icon & splash generation](/pages/generate_icon_splash).

| Options    | default | desc |
|---------  |---------| ----- |
| source  | corber/splash.svg | splash svg |
| platform | all | platform to build assets for |


#### Examples
+ `corber make-splashes`
