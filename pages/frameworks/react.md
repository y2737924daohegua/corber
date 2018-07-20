---
layout: page
title:  "React / Webpack"
---

[React](https://reactjs.org/) support has been tested with apps from [Create React App](https://github.com/facebookincubator/create-react-app), but these steps should apply to any [webpack](https://webpack.js.org/) application.

The following changes to your React application are required:

- In `package.json`, the `homepage` property must be defined and not have a leading slash.

### Livereload Plugin

In order for `corber start` or `corber serve` to function, the `corber-webpack-plugin` addon must be installed. Once installed you will need to manually add the plugin to your vue configuration file. 

The addon will be automatically installed on init. If the addon is missing, it can be installed with:

```bash
  yarn add corber-webpack-plugin --dev
```

Failure to have the plugin installed and configured properl will mean cordova & cordova plugin objects will not be accessible during livereload. 

### Add Livereload Plugin to Webpack Config

Add the following to the `config/webpack.config.dev.js` plugins array:

```javascript
  const CorberWebpackPlugin = require('corber-webpack-plugin');

  plugins: [
    ...(existing content)
    new CorberWebpackPlugin()
  ]
```

The CLI will warn you if anything is missing.

##### Bug: "Conflict: Multiple assets emit to the same filename `static/js/bundle.js`"

In `config/webpack.config.dev.js`, modify `output.filename` to use a dynamic segment.

E.g. Change `filename: 'static/js/bundle.js'` to `filename: 'static/js/[name]-bundle.js'`
