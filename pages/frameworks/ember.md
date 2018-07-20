---
layout: page
title:  "Ember"
---

Corber will detect Ember projects and run accordingly.

The following changes to your Ember application are required:

- In `config/environment.js`, set `locationType` to `hash`.
- In `config/environment.js`, ensure {% raw %}`{{rootURL}}` or `{{baseURL}}`{% endraw %} does not have a leading slash.

The CLI will warn you if anything is missing.

### Livereload Addon

In order for `corber start` or `corber serve` to function, the `corber-ember-livereload` addon must be installed. No further configuration is required.

The addon will be automatically installed on init. If the addon is missing, it can be installed with `ember install corber-ember-livereload`.

Failure to have the plugin installed and configured properl will mean cordova & cordova plugin objects will not be accessible during livereload. 

### Configuring browser targets

In `ember-cli` 2.13 and later, projects have a `config/targets.js` configuration file that optimized Babel transpilation for the specified target browsers. For corber builds, it is advantageous to target the single (mobile) browser that supports the webview used in the native build.

The example below extends the default behaviour provided by a new Ember app.

```javascript
'use strict';

let browsers;

if (process.env.CORBER) {
  browsers = [`last 1 ${process.env.CORBER_PLATFORM} versions`];
} else {
  // out-of-the-box ember-cli behaviour
  browsers = [
    'last 1 Chrome versions',
    'last 1 Firefox versions',
    'last 1 Safari versions'
  ];

  const isCI = !!process.env.CI;
  const isProduction = process.env.EMBER_ENV === 'production';

  if (isCI || isProduction) {
    browsers.push('ie 11');
  }
}

module.exports = {
  browsers
};
```
