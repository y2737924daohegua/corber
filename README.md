# Corber [![Build Status](https://travis-ci.org/isleofcode/corber.svg?branch=master)](https://travis-ci.org/isleofcode/corber)

Corber is a CLI that improves the hybrid app build experience for Vue, Ember, Glimmer, and React apps using Cordova.

Corber handles framework and app builds and validations with a single command: `corber build` - without affecting existing web flows. The CLI also includes on-device livereload for development and utility functions for icons, plugins, and more. And when needed, it can proxy to the Cordova CLI.

It is a continuation of the ember-cordova project. ember-cordova users can find details [here](http://blog.isleofcode.com/announcing-corber-ember-cordova-vue), and continue to access the existing [ember addon](https://github.com/isleofcode/ember-cordova) and [documentation](http://ember-cordova.com). For migration instructions, see [Migrating from Ember Cordova](http://corber.io/pages/ember-cordova-migration).

## Installation

```
# Yarn
yarn global add corber

# NPM
npm install -g corber
```

## Initialize Corber
1. Change to your project directory.
2. Run `corber init`.
3. Select iOS and press space to select the platform.

## Configure Your Project for Corber
### Vue CLI 3
1. Open `vue.config.js`. (Create file in project root if it doesn't exist. See [Example Vue Config](http://corber.io/pages/frameworks/vue).)
2. Require `corber-webpack-plugin` and assign it as `CorberWebpackPlugin`.
3. Add `new CorberWebpackPlugin()` to the `configureWebpack.plugins` array.

For Vue CLI 2 or Non-Vue CLI, see [Configure Vue CLI 2 or Non-Vue CLI projects](http://corber.io/pages/frameworks/vue).

### Ember
1. Open `config/environment.js`.
2. Set `locationType` to `hash`.
3. Update `rootURL` or `baseURL` to remove its leading slash, if it has one.

### Extending Frameworks
Corber comes with built-in support for Vue, Ember, and React, but can be extended to work with the framework of your choice. See [Extending Corber to Support Other Frameworks](http://corber.io/pages/frameworks/extending).

## Run App on an Emulator with Live Reload
1. Run `corber start`.
2. Select an emulator.

## Build, Flash, and Run App on Your Device
1. Run `corber build`. (Ignore error code 65 error, signing will be set in step 3.)
2. Run `corber open` to open the Xcode project.
3. *First Time Only*: In Xcode, select the Project Navigator, select your project, and under Signing, set your Team.
4. Connect your iPhone via its USB cable. (Accept the "Trust This Computer?" alert if prompted.)
5. In Xcode, select your connected device in the toolbar.
6. Press the Play button to flash and run the app on your device.

For Android builds see [Android Setup](http://corber.io/pages/android-setup). For full documentation, please visit [corber.io](http://corber.io).

## Contributing

Pull requests are very welcome. You can read our style guides [here](https://github.com/isleofcode/style-guide).

If you are unsure about your contribution idea, please feel free to open an issue for feedback.

Find an issue with our documentation? All docs are hosted on this repo under the `gh-pages` branch.

## Credits

Corber is maintained by [Isle of Code](https://isleofcode.com).
