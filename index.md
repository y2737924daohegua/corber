---
layout: page
title: "corber"
---

corber CLI improves the hybrid app build experience with JavaScript frameworks&mdash;currently for Ember, Vue, React & Glimmer apps using Cordova. It can be used with existing or new JavaScript applications.

corber handles items such as framework + app build & validations with a single command: `corber build`&mdash;without affecting existing web flows. The CLI also includes on-device livereload for development and utility functions for icons, plugins, etc. Where needed, it can [proxy](/pages/cli#proxy) to the Cordova CLI.

Ember users also have access to a series of plugin bindings exposed as services. corber is a continuation of the ember-cordova project; [read here for details](http://blog.isleofcode.com/announcing-corber-ember-cordova-vue).

##### Quickstart

```bash
yarn global add corber

# create a mobile project; run from your existing Ember/Vue/React/Glimmer app
corber init
corber platform add ios

# runs your JavaScript builder and creates a mobile application
corber build
```

##### You may also want to

```bash
# set up on-device hot reload for development
corber s

# build icon & splash screens
corber make-splashes
corber make-icons
```

**Next**:

- [Installation/Quickstart](pages/installation)
- [Hybrid/Ember best practices from EmberConf 2016](https://www.youtube.com/embed/Ry639hvWKbM)
