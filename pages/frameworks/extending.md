---
layout: page
title:  "Extending Frameworks"
---

On init, corber will create a framework file at corber/config/framework.js.
You will notice this object extends your selected framework&mdash;the base implementations can be found [here](https://github.com/isleofcode/corber/tree/master/lib/frameworks).

Frameworks refer to the *JavaScript framework only* (e.g. Ember, Vue, React) and always implement the following functions:

- `validateBuild/build`
- `validateServe/serve`

A typical build command looks a little like:

- Run "before" hooks.
- Run framework `validateBuild` function (e.g. check Ember config).
- Run target `validateBuild` function (checks Cordova config).
- Run framework `build`.
- Copy the assets to the Cordova project.
- Build the Cordova project.
- Run "after" validators.
- Run "after" hooks.

#### Override framework functions
Your local framework file can implement and thus override these functions&mdash;e.g. to support a custom build process&mdash;simply. When doing so, you can:

- Call `this._super()` to run the base function.
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
