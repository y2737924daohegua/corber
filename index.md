---
layout: page
title: "Corber"
---

Corber is a CLI designed to compile Ember/Vue/React PWA & Mobile applications to native applications. It is largely an extension of Cordova and ember-cordova.

For JS Framework developers, corber provides a unified build pipeline, a hotreloading dev environment that supports devices + emulators and patterns for abstracting config + plugin integrations to native-only builds.

```
yarn global add corber
npm install -g corber
```
See [installation](pages/installation) to complete setup.

##### CLI Overview

```bash
# Livereload while developing on devices + emulators
# Launches a dev environment, your standard devserver is injected with cordova assets + plugins
# Detects installed platforms, emulators and devices 
# Launches your selected device, then installs + boots your development app
# Supports Android Devices/Emulators and iOS Emulators
corber start

# Functions the same as start, but allows you to manuall flash to devices 
corber serve

# Runs your JavaScript builder and creates a mobile application
corber build
corber build --platform=android

# Builds icon & splash screens for all target devices with a single svg
corber make-splashes
corber make-icons

# Support another platform
corber platform add android

#Installs a plugin
corber plugin add cordova-plugin-camera
corber plugin add phonegap-plugin-push
```

**Next**

- [Installation](pages/installation) 
- [Hybrid/Ember best practices from EmberConf 2016](https://www.youtube.com/embed/Ry639hvWKbM)
