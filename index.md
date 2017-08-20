---
layout: page
title: "corber"
---

corber CLI improves the hybrid app build experience with JS Frameworks - currently for Ember, Vue & Glimmer apps using Cordova. It can be used with existing or new JS applications.

corber merges the JS/Hybrid build builders for hybrid builds exposed as a single command (e.g. `corber build`) without affecting existing web builders.
Included in the CLI footprint are build and on-device livereload for development and utility functions for icons, plugins, etc. Where needed it can [proxy](/pages/cli#proxy) to the Cordova CLI.

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
