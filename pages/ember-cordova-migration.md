---
layout: page
title:  "Migrating from ember-cordova"
---

1: `yarn global add corber`;
2: `corber init` - there is no need to pick a platform;
2: Copy ember-cordova/cordova/config.xml to corber/cordova/config.xml and ember-cordova/cordova/package.json to corber/cordova/package.json, and delete your ember-cordova/ directory;
3: Uninstall ember-cordova from your project, and ensure it is removed from node_modules and package.json;
4: From your Ember project root, run `corber prepare`. This will install any plugins and platforms you were using prior;
5: If you have set up icons or splash screens, those will need to be copied over. You can also run `corber make-icons` and `corber make-splashes` instead.
