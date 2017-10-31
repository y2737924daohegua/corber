# corber

[![Build Status](https://travis-ci.org/isleofcode/corber.svg?branch=master)](https://travis-ci.org/isleofcode/corber)

corber CLI improves the hybrid app build experience with JS Frameworks - currently for Ember, Vue & Glimmer apps using Cordova. It can be used with existing or new JS applications. 

corber handles items such as framework + app build & validations with a single command: `corber build` - without affecting existing web flows. The CLI also includes on-device livereload for development and utility functions for icons, plugins, etc. Where needed it can proxy to the Cordova CLI.

It is a continuation of the ember-cordova project. ember-cordova users can find detais [here](http://blog.isleofcode.com/announcing-corber-ember-cordova-vue), and continue to access the existing [ember addon](https://github.com/isleofcode/ember-cordova) and [documentation](http://ember-cordova.com).

## Quickstart

```
yarn global add corber

#Create a mobile project - run from your existing Ember/Glimmer/Vue app
corber init
corber platform add ios

#runs your JS builder and creates a mobile application
corber build

##You may also want to 
#Set up on-device hot reload for development
corber s

#Build Icon & Splash Screens
corber make-splashes
corber make-icons
```

For documentation, please visit [corber.io](http://corber.io).

## Contributing

PRs are very welcome. You can read our style guides [here](https://github.com/isleofcode/style-guide).

If you are unsure about your contribution idea, please feel free to
open an Issue for feedback.

## Credits

corber is maintained by [Isle of Code](https://isleofcode.com).
