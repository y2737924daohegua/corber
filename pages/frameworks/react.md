---
layout: page
title:  "React"
---

React support has been tested with apps from create-react-app, but
these steps should generally apply to any Webpack application.

The following custom changes are required to your React application. The CLI will warn you if anything is missing.

- In `package.json`: the homepage property must be defined and nto have
  a leading slash;

- If you want to use livereload (you probably do), you will have needed
  to run `yarn run eject`. corber requires access to your webpack
config.

- If you want to enable cordova.js & plugins in livereload, you will need to run:

```bash
  yarn install corber-webpack-plugin --save-dev
```

and then add the following to config/webpack.config.dev.js plugins array:

```javascript
  const CorberWebpackPlugin = require('corber-webpack-plugin');

  plugins: [
    ...(existing content)
    new CorberWebpackPlugin()
  ]
```

##### Bug: "Conflict: Multiple assets emit to the same filename static/js/bundle.js"

In config/webpack.config.dev.js modify output.filename to use a
dynamic segment:

e.g. from `filename: 'static/js/bundle.js'` to `filename: 'static/js/[name]-bundle.js'`
