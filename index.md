---
layout: page
title: "corber"
---

corber CLI improves the hybrid app build experience with JS Frameworks - currently Ember, Vue & Glimmer and Cordova.

It merges your build pipelines for build & livereload, and adds utility functions for icons, plugins, etc. Where needed it can [proxy](/pages/cli#proxy) to the Cordova CLI.

Ember users also have access to a series of plugin bindings exposed as Services.

##### Quickstart

```bash
#Create a mobile project - run from your existing Ember/Glimmer/Vue app
ec init
ec platform add ios

#runs your JS builder and creates a mobile application
ec build
```

##### You may also want to

```bash
#Set up on-device hot reload for development
ec s

#Build Icon & Splash Screens
ec make:splashes
ec make:icons
```

**Next**:

- [Installation / Quickstart](pages/installation)
- [Hybrid/Ember best practices from EmberConf 2016](https://www.youtube.com/embed/Ry639hvWKbM)
