---
layout: page
title:  "Vue.js Mobile Apps"
---

Vue CLI projects should ensure their *publicPath* or *baseUrl* properly in vue.config.js does not have a leading slash. This will be validate for your on every build, start and serve.


##### Vue CLI 3 Projects

In order for the *start* and *serve* commands to maintain access to the mobile shell, `vue-cli-plugin-corber` must be installed to your project. This will happen automatically for you on corber init. 


```javascript
#vue.config.js

module.exports = {
  publicPath: './'
}
```

You may want to only conditionally change the publicPath on corber builds:

```javascript
  module.exports = {
   publicPath: process.env.CORBER? './' : '/'
  }
```

###### Vue CLI 2 Projects

In order for the *start* and *serve* to work, `corber-webpack-plugin` must be installed and manually configured into your project. 

```javascript
#webpack.dev.conf

const CorberWebpackPlugin = require('corber-webpack-plugin');

module.exports = {
    publicPath: './',
    plugins: [new CorberWebpackPlugin()]
  }));
}
```

###### Non-Vue CLI Projects

Non-Vue CLI project should refer to the docs on extending frameworks.


**Next**:
- [Development Workflow](/pages/workflow/development-workflow)
