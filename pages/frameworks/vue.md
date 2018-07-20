---
layout: page
title:  "Vue"
---

Corber automatically detects and runs `vue-cli` projects with minimal configuration, but doesn't currently support non-`vue-cli` projects.

### Livereload Plugin

In order for `corber start` or `corber serve` to function, the `corber-webpack-plugin` addon must be installed. Once installed you will need to manually add the plugin to your vue configuration file.

The addon will be automatically installed on init. If the addon is missing, it can be installed with:

```bash
  yarn add corber-webpack-plugin --dev
```

Failure to have the plugin installed and configured properl will mean cordova & cordova plugin objects will not be accessible during livereload. 

### Add Livereload Plugin to Vue Config

You'll need to add `corber-webpack-plugin` to your `vue.conf.js` file to enable live reloading. Below is a minimal `vue.conf.js` that you can use as a guide or to get the file started with. If your project does not have a vue.conf.js you can simply create an empty one.

```javascript
const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
  baseUrl: './',
  configureWebpack: {
      plugins: [new CorberWebpackPlugin()]
  }
}
```

Now, you can run the [quickstart](/), and the CLI will warn you if your application requires any further configuration.
