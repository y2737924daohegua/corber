---
layout: page
title:  "React / Webpack"
---

[React](https://reactjs.org/) support has been tested with apps from [Create React App](https://github.com/facebookincubator/create-react-app), but these steps should apply to any [webpack](https://webpack.js.org/) application.

The following changes to your React application are required:

- In `package.json`, the `homepage` property must be defined and not have a leading slash.
- If you want to use live reload (you probably do), you will have to run `yarn run eject`. Corber requires access to your webpack config.
- If you want to enable `cordova.js` and plugins in live reload, you will need to run:

```bash
  yarn add corber-webpack-plugin --dev
```

and then add the following to the `config/webpack.config.dev.js` plugins array:

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
