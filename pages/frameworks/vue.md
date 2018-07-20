---
layout: page
title:  "Vue"
---

Corber supports live reload and injection of cordova and cordova plugins during live reload but requires some setup.

In order to use `corber start` and `corber serve` with live reload and cordova injection, your Vue config must be updated to add the `corber-webpack-plugin` which has been automatically installed during `corber init`.

##### Add Corber Webpack Plugin to Vue Config

Vue.js projects created with Vue CLI 3 will need to ensure their `vue.config.js` file contains `new CorberWebpackPlugin()` within its plugins array. If `vue.config.js` does not exist, add it to the Vue project's root. Below is a minimal config file to get started:

```javascript
const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
  baseUrl: './',
  configureWebpack: {
    plugins: [new CorberWebpackPlugin()]
  }
}
```

###### Vue CLI 2 Projects

Vue.js projects created with Vue CLI 2 will need to ensure `build/webpack.dev.conf` contains `new CorberWebpackPlugin()` within its plugins array. If `webpack.dev.conf` does not exist, add it to the `build` folder in the Vue project's root. Below is a minimal config file to get started:

```javascript
const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
    baseUrl: './',
    plugins: [new CorberWebpackPlugin()]
  }));
}
```

###### Non-Vue CLI Projects

Corber does not currently support projects not created with Vue CLI.

##### Troubleshooting

If `corber-webpack-plugin` has not been installed, it can be installed with:

```bash
# Yarn
yarn add corber-webpack-plugin --dev

# NPM
npm install corber-webpack-plugin --save-dev
```

