---
layout: page
title:  "Vue"
---

Corber requires Vue projects to be made with `vue-cli`, which it automatically detects and runs with minimal configuration.

First, install `corber-webpack-plugin`:

```bash
  npm install corber-webpack-plugin --save-dev
```

Then you'll need to add `corber-webpack-plugin` to your `vue.conf.js` file to enable live reloading. Below is a minimal `vue.conf.js` that you can use as a guide or to get the file started with:

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
