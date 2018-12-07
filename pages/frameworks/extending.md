---
layout: page
title:  "Extending Framework Support"
---

#### Framework.js

When you run `corber init`, Corber will create a *framework configuration file* located at `corber/config/framework.js`. This file contains the JavaScript framework-specific hooks that Corber will execute in order to validate, build, and serve your app.

These hooks are:

- `validateBuild`
- `build`
- `validateServe`
- `serve`

Corber comes packaged with [base implementations](https://github.com/isleofcode/corber/tree/master/lib/frameworks) for Ember, Vue, and React, but you can write your own to support the framework of your choice.

#### Build pipeline

A typical build command executes the following steps:

1. Run "before" hooks.
2. Run framework `validateBuild` function (e.g. check Ember config).
3. Run target `validateBuild` function (checks Cordova config).
4. Run framework `build`.
5. Copy the assets to the Cordova project.
6. Build the Cordova project.
7. Run "after" validators.
8. Run "after" hooks.

#### Overriding base framework hooks

You can customize one of the base framework implementations (e.g. Ember, React, Vue, etc.) by overriding one or more hooks in `framework.js`. This is a convenient way to implement custom build processes.

When extending hooks, you can:

- Call `this._super()` to run the base function, or
- Choose to not invoke the base function.

For example,

```javascript
// corber/config/framework.js
module.exports = EmberFramework.extend({
  validateBuild() {
    console.log('HELLO');
    this._super();
  }
});
```

#### Creating a custom framework.js for your own framework

So long as `framework.js` implements the four hooks `validateBuild`, `validateServe`, `build`, and `serve`, Corber is compatible with any framework you choose.

#### Hard requirements

For any Corber app to work, your application's `rootURL` must not have a
leading slash.

#### Usage with webpack

Corber should work with any webpack app. Reading the [React
implementation](https://github.com/isleofcode/corber/tree/master/lib/frameworks/react) for an example.

You may also want to use the `corber-webpack-plugin` for live reload.
Read the [react](/pages/frameworks/react) for more details.
