---
layout: page
title: "corber"
---

corber CLI improves the hybrid app build experience with JS Frameworks - currently for Ember, Vue, React & Glimmer apps using Cordova. It can be used with existing or new JS applications.

corber handles items such as framework + app build & validations with a single command: corber build - without affecting existing web flows. The CLI also includes on-device livereload for development and utility functions for icons, plugins, etc. Where needed it can [proxy](/pages/cli#proxy) to the Cordova CLI.

Ember users also have access to a series of plugin bindings exposed as Services. corber is a continuation of the ember-cordova project, [read here for details](http://blog.isleofcode.com/announcing-corber-ember-cordova-vue).

##### Quickstart

```bash
yarn global add corber 

#Create a mobile project - run from your existing Ember/Glimmer/Vue app
corber init
corber platform add ios

#runs your JS builder and creates a mobile application
corber build
```

##### You may also want to

```bash
#Set up on-device hot reload for development
corber s

#Build Icon & Splash Screens
corber make-splashes
corber make-icons
```

**Next**:

- [Installation / Quickstart](pages/installation)
- [Hybrid/Ember best practices from EmberConf 2016](https://www.youtube.com/embed/Ry639hvWKbM)
