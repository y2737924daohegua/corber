---
layout: page
title:  "Vue"
---

Vue support is limited to [vue-cli](https://github.com/vuejs/vue-cli) Webpack users. Corber will detect vue-cli projects and run accordingly.

The following changes to your Vue application are required:

- In `config/index.js`, `assetsPublicPath` must not have a leading slash.
- If you want to enable `cordova.js` and plugins in live reload, you will need to run:

```bash
  npm install corber-webpack-plugin --save-dev
```

and then add the following to `build/webpack.dev.conf` plugins array:

```javascript
module.exports = {
  plugins: [new CorberWebpackPlugin()]
};
```

The CLI will warn you if anything is missing.
