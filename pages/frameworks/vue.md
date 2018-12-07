---
layout: page
title:  "Vue Mobile Projects"
---

There is no custom behaviour required for building Vue projects.

If you wish to use livereload - the `serve` and `start` commands - your vue config must be updated to include the `corber-webpack-plugin`. This plugin was installed for you when running `corber init`.

##### Vue CLI 3 Projects

```javascript
#vue.config.js

const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
  baseUrl: './',
  configureWebpack: {
    plugins: [new CorberWebpackPlugin()]
  }
}
```
###### Vue CLI 2 Projects

```javascript
#webpack.dev.conf

const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
    baseUrl: './',
    plugins: [new CorberWebpackPlugin()]
  }));
}
```

###### Non-Vue CLI Projects

Non-Vue CLI project should refer to the docs on extending frameworks.
