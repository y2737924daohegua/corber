---
layout: page
title:  "Hooks"
---

Use hooks for build-time customization, cleanup or warnings.

To create a hook, create a file at `corber/hooks/<hook_type>.js` where `<hook_type>` is one of the following:

* `beforeBuild` / `afterBuild`: fires on cdv:build and cdv:serve
* `beforePrepare` / `afterPrepare`: fires on cdv:prepare

**A basic hook:**

```js
/* jshint node: true */
"use strict";

module.exports = function() {
  //do something.
};
```

To ensure consistent behaviour, a hook should return either a synchronous function or a Promise:

```js
/* jshint node: true */
"use strict";
import Promise from "ember-cli/lib/ext/promise";

module.exports = function() {
  return new Promise(function (resolve, reject) {
    //do something asynchronous.
  });
};
```

#### Accessing Command-Line Options

Hooks are called with the `options` object generated from the command-line options. The options are named with the camelCase version of the corresponding CLI flag (`--skip-ember-build` becomes `skipEmberBuild`).

```js
module.exports = function(options) {
  if (!options.skipEmberBuild) {
    // do something
  }
};
```

#### Example customization and cleanup
If a project needed to build for web (`ember build`) and Cordova (`ember cdv:build`), we might decide to keep the template variable `rootURL` inside "app/index.html" for the web builds. 

Using the Corber "beforeBuild" hook we could backup the "app/index.html" file, then remove the string `"rootURL"` from it for the current build by creating the file `corber/hooks/beforeBuild.js` and writing something similar to:

```javascript
/* jshint node: true */
"use strict";
const fsUtils = require('corber/lib/utils/fs-utils');

module.exports = function() {
  // backup the index.html file and then remove {{rootURL}} before build.
  return fsUtils.read('app/index.html', {encoding: 'utf8', flag: 'r'})
    .then((contents) => {
      console.log('Backing up app/index.html');
      
      return fsUtils.write('index.html~bak', contents)
        .then(() => {
          console.log('Creating cordova friendly "app/index.html"');
          
          const cordovaIndex = body.split('{{rootURL}}').join('');
          // Return a promise
          return fsUtils.write('app/index.html', cordovaIndex);
        });
    });
};
```

Above we returned a promise so Corber and EmberCLI will wait for our promise to settle before beginning the build. If the promise is rejected the build is prevented from continuing (*plan accordingly for any cleanup required in your hooks when rejecting returned promises or throwing Errors*).

The Corber "afterBuild" hook will run afterwards. This could be used to restore the backed up original version for "app/index.html" by creating a file at `corber/hooks/afterBuild.js`:

```javascript
/* jshint node: true */
"use strict";
const fsUtils = require('corber/lib/utils/fs-utils');

module.exports = function() {
  // restore the index.html file
  return fsUtils.read('index.html~bak', {encoding: 'utf8', flag: 'r'})
    .then((contents) => {
      console.log('Restoring web-friendly "app/index.html"');
    
      // Return promise
      return fsUtils.write('app/index.html', contents);
  });
};
```
