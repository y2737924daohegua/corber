---
layout: page
title:  "Vue"
---

Vue support is limited to vue-cli webpack users.

corber will detect vue-cli projects and run accordingly. The following custom changes are required to your Vue application. The CLI will warn you if anything is missing.

- In `config/index.js`, `assetsPublicPath` must not have a leading slash.
- If you want to enable `cordova.js` and plugins in livereload, you will need to run:

```bash
  npm install corber-webpack-plugin --save-dev
```

and then add the following to build/webpack.dev.conf plugins array:

```javascript
module.exports = {
  plugins: [new CorberWebpackPlugin()]
};
```
