---
layout: page
title:  "Extending Frameworks"
---

On init, corber will create a framework file at corber/config/framework.js.
You will notice this object extends your selected framework - the base implementations can be found [here](https://github.com/isleofcode/corber/tree/master/lib/frameworks).

Frameworks refer to the *JS framework only* (e.g. Ember, Vue, React) and always implement the following functions:

- validateBuild/build;
- validateServe/serve;

A typical build command looks a little like:

- run before hooks;
- run framework validateBuild (e.g. check ember config);
- run target validateBuild (checks cordova config);
- run framework build;
- copy the assets to the cordova project;
- build the cordova project;
- run after validators;
- run after hooks;

#### Override framework functions
Your local framework file can implement and thus override these functions - e.g. to support a custom build process - simply. When doing so, you can:

- Call `this._super()` to run the base function; or
- Choose to not invoke the base function.

e.g.

```javascript
#corber/config/framework.js
module.exports = EmberFramework.extend({
  validateBuild() {
    console.log("HELLO");
    this._super();
  }
});
```

#### Create a custom framework

So long as a framework implements validateBuild/build & validateServe/serve it will function. You can use this to implement a builder for a different JS framework, but still otherwise use the corber pipeline.


#### Hard requirements

For any corber app to work, your applications rootURL must not have a
leading slash.


#### Using with webpack

corber should work with any webpack app. Start with reading the [React
implementation](https://github.com/isleofcode/corber/tree/master/lib/frameworks/react) for an example.

You may also want to use the corber-webpack-plugin for livereload.
Read the [react](/pages/frameworks/react) for more details.
