const get              = require('lodash').get;
const path             = require('path');
const getPackage       = require('./get-package');

module.exports = {
  get(root) {
    let packagePath = path.join(root, 'package.json');
    let packageJSON = getPackage(packagePath);
    let devDeps = packageJSON.devDependencies;
    let deps = packageJSON.dependencies;

    if (get(devDeps, '@glimmer/application')) {
      return 'glimmer';
    } else if (get(devDeps, 'ember-resolver') || get(devDeps, 'ember-source')) {
      return 'ember';
    } else if (get(deps, 'vue')) {
      return 'vue';
    } else if (get(deps, 'react')) {
      return 'react';
    } else {
      return 'custom';
    }
  }
};
