---
layout: page
title:  "React / Webpack"
---

[React](https://reactjs.org/) support has been tested with apps from [Create React App](https://github.com/facebookincubator/create-react-app), but these steps should apply to any [webpack](https://webpack.js.org/) application.

The following changes to your React application are required:

- In `package.json`, the `homepage` property must be defined and not have a leading slash.

### Add Livereload Plugin to Webpack Config

Add the following to the `config/webpack.config.dev.js` plugins array:

```javascript
  const CorberWebpackPlugin = require('corber-webpack-plugin');

  plugins: [
    ...(existing content)
    new CorberWebpackPlugin()
  ]
```
