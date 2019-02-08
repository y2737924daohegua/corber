---
layout: page
title:  "Core Concepts"
---

#### Platform

The platform corber builds are targeted to, e.g. iOS or Android. corber projects can support multiple platforms, however any one build is targeted to a single platform.

#### Framework

The Javascript framework being used with corber, e.g. Ember, Vue, React, Glimmer.

#### Plugin

A cordova or native plugin that provides specialized functionality and/or a proxy to native device API's. Distinct from a JS module in that it is designed to run in a native mobile shell and is often not functional in non mobile builds.

#### Hot Reload

When using the `start` and `serve` commands Corber will automatically hot reload code changes to your targeted device/emulator without the need for re-compiling. A hot reload build is generally linking remotely to your machines serve instance and is for development only. 

#### Static Build

The inverse of a hot reload build, a static build includes all compiled assets inside the application container. Static builds need to be re-compiled after every code change, however can be shared with other users and machines. They are typically used for final testing, beta and production builds. 


