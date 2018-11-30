---
layout: page
title: "Troubleshooting"
---

## Ember Project Troubleshooting

###  `corber-ember-livereload` Not Installed

If the `corber-ember-livereload` package was not installed during `corber init`, it can be installed with:

```
ember install corber-ember-livereload
```

`corber start` or `corber serve` require this package to provide access to Cordova and Cordova plugins with live reload.


## React Project Troubleshooting

###  `corber-webpack-plugin` Not Installed

If the `corber-webpack-plugin` package was not installed during `corber init`, it can be installed with:

```bash
# Yarn
yarn add corber-webpack-plugin --dev

# NPM
npm install corber-webpack-plugin --save-dev
```

`corber start` or `corber serve` require this package to provide access to Cordova and Cordova plugins with live reload. Once installed read [Configuring Project for Corber](http://corber.io/) to configure your framework.

### Multiple Assets Emit to the Same Filename Error

```
Conflict: Multiple assets emit to the same filename `static/js/bundle.js`
```

To handle this issue, in `config/webpack.config.dev.js`, modify `output.filename` to use a dynamic segment.

E.g. Change `filename: 'static/js/bundle.js'` to `filename: 'static/js/[name]-bundle.js'`


## Vue Project Troubleshooting

### `cordova is not defined` Error

If you are getting an issue during serve/starting stating `cordova is not defined`, you need to pass a browserify flag.

`corber start --browserify`
`corber serve --browserify`




