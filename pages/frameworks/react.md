---
layout: page
title:  "React Mobile Apps"
---

[React](https://reactjs.org/) support has been tested with apps from [Create React App](https://github.com/facebookincubator/create-react-app), but these steps should apply to any [webpack](https://webpack.js.org/) application.

**Note**: In order for Cordova and Cordova plugins to be accessible during `corber start` and `corber serve`, corber-webpack-plugin must be added to the Webpack development config which requires the Create React App to be ejected.

1. Open `package.json`.
2. Update `homepage` to remove its leading slash, if it has one. (Set it to an empty string if has not yet set.)
3. Run `npm run eject`. (See note above.)
4. Open `config/webpack.config.dev.js`.
5. Require `corber-webpack-plugin` and assign it as `CorberWebpackPlugin`.
6. Add `new CorberWebpackPlugin()` to the plugins array.

```diff
+const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
  ...

  plugins: [
+    new CorberWebpackPlugin(),
    ...
  ]

  ...
}
```

**Next**:
- [Development Workflow](/pages/workflow/development-workflow)
