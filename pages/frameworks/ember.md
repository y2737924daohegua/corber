---
layout: page
title:  "Ember"
---

Corber will detect Ember projects and run accordingly.

The following changes to your Ember application are required:

- In `config/environment.js`, set `locationType` to `hash`.
- In `config/environment.js`, ensure {% raw %}`{{rootURL}}` or `{{baseURL}}`{% endraw %} does not have a leading slash.

The CLI will warn you if anything is missing.

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