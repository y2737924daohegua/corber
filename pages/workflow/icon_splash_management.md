---
layout: page
title:  "Generate Icons & Splashscreens"
---

The `corber make-icons` and `ember cdv:make-splashes` commands generate all required icons and splashes for your added platforms from a single SVG. This is powered by a separate library called [splicon](https://github.com/isleofcode/splicon).

By default, corber detects which platforms (e.g. ios) you have installed and only generates assets for those platforms.
Platform & icon source are configurable as documented [in the cli](/pages/cli).

## Icon Generation

Place an icon.svg file at corber/icon.svg and run `corber make-icons`. By default, icons for added platforms will be resized and injected.

To specify a platform, use the `--platform` option:

```
corber make-icons --platform ios
```

The source SVG should be a square of any size.

## Splash Generation

Place a splash.svg file at corber/splash.svg and run `corber make-splashes`. By default, splashes for added platforms will be resized and injected.

o specify a platform, use the `--platform` option:

```
corber make-splashes --platform ios
```

Unlike icons, the variance of splash file is larger. You likely want to download the following [splash SVG template](/examples/safe-splash-template.svg). The source SVG should have a background filling the entire area, and icons / text should be kept to the 'safe area' box.

### Splash Screen Best Practices

1: Configure your config.xml to set AutoHideSplashScreen to false.
This means that once booted, Cordova will not automatically hide your splash screen.

Placed in corber/cordova/config.xml

```xml
<widget>
  ...
  <preference name="AutoHideSplashScreen" value="false"/>
</widget>
```

2: Manually hide the splash screen after your JS App has booted. Ember users can leverage the [corber-splash](https://github.com/isleofcode/ember-cordova-splash) service to hide the splashscreen in the afterModel hook.

```js
// app/routes/application.js
import Ember from 'ember';

const {
  Route,
  inject: { service }
} = Ember;

export default Route.extend({
  splashscreenService: service('ember-cordova/splash'),

  afterModel() {
    this.get('splashScreenService').hide();
  }
  // ...
});
```
