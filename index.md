---
layout: page
title: "Corber"
---

Corber CLI improves the hybrid app build experience with JavaScript frameworks&mdash;currently for Ember, Vue, React & Glimmer apps using Cordova. It can be used with existing or new JavaScript applications.

Corber handles items such as framework + app build & validations with a single command: `corber build`&mdash;without affecting existing web flows. The CLI also includes on-device livereload for development and utility functions for icons, plugins, etc. Where needed, it can [proxy](/pages/cli#proxy) to the Cordova CLI.

Ember users also have access to a series of plugin bindings exposed as services. Corber is a continuation of the ember-cordova project; [read here for details](http://blog.isleofcode.com/announcing-corber-ember-cordova-vue).

##### Getting Started

Install:

```bash
yarn global add corber
# or
npm install -g corber
```

Initialize Corber:

```bash
# Run from your Ember/Vue/React/Glimmer project root
corber init
```

Setup Framework for Corber:

See docs for setting up [Vue](/pages/frameworks/vue), [Ember](/pages/frameworks/ember), and [React/Webpack](/pages/frameworks/react) to use Corber.

##### The Corber CLI

```bash
# Run your JavaScript builder and create a mobile application
corber build

# Boot an emulator with live reload for development
# Cordova plugins are supported /w live reload
corber start

# Set up hot reload for on-device usage
corber serve

# Build icon & splash screens
corber make-splashes
corber make-icons
```

**Next**:

- [Installation/Quickstart](pages/installation)
- [Hybrid/Ember best practices from EmberConf 2016](https://www.youtube.com/embed/Ry639hvWKbM)
