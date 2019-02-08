---
layout: page
title: "Native Plugins"
---

Any Cordova plugin can be used with Corber - as Corber is an abstraction on top of Cordova.

Cordova has a large ecosystem of plugins which provide JavaScript proxies to device APIs and components or simply add functionality, such as the [Phonegap Push Plugin](https://github.com/phonegap/phonegap-plugin-push) and [cordova-plugin-file](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/). A large repository of plugins can be searched on the [cordova plugin repository](https://cordova.apache.org/plugins/).

Plugins can be installed with `corber plugin add $PLUGIN_NAME`. Plugin information will automatically be stored in your project's config.xml and package.json files.

When cloning to a new machine, developers should run `corber prepare`. Similar to running `npm install`, this will install all saved plugins and platforms onto their machine. 

#### Only Use Plugins in the Mobile Container

With rare exeception, Cordova plugins only work in mobile containers - their APIs do not resolve in web environemnts. Often you will want to re-use your JavaScript code for a web-based PWA and a native mobile/corber application. In these situations, one must be careful to not call device APIs unavailable in a web/PWA environment.

As a general rule, we suggest developers abstract any plugin calls to a service - or your framework's equivalent. The service should first check to see if it is running in a Cordova environment before making any calls. As an example

```js
export default Ember.Service.Extend({
  isApp: false,

  init() {
    this._super(..arguments);
    if (window.Cordova) {
      this.set('isApp', true);
    }
  },

  unsafePluginCall() {
    if (this.get('isApp') === false) {
      return Promise.reject();
    } else {
      //make unsafe call
    }
  }
});
```
