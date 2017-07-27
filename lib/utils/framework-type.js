const path          = require('path');
const get           = require('lodash').get;
const logger        = require('../utils/logger');

module.exports = {
  getPackage(root) {
    return require(path.join(root, 'package.json'));
  },

  get(root) {
    let packageJSON = this.getPackage(root);
    let devDeps = packageJSON.devDependencies;
    let deps = packageJSON.dependencies;

    if (get(devDeps, '@glimmer/application')) {
      return 'glimmer';
    } else if (get(devDeps, 'ember-resolver') || get(devDeps, 'ember-source')) {
      return 'ember';
    } else if (get(deps, 'vue')) {
      return 'vue';
    }
  }
};
