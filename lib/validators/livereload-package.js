const Task       = require('../tasks/-task');
const getPackage = require('../utils/get-package');
const logger     = require('../utils/logger');
const path       = require('path');
const RSVP       = require('rsvp');

module.exports = Task.extend({
  root: undefined,
  packageName: undefined,

  run() {
    let packageName = this.packageName;
    if (!packageName) {
      return RSVP.reject('no package name provided');
    }

    let packagePath = path.join(this.root, 'package.json');
    let packageJSON = getPackage(packagePath);
    if (!packageJSON) {
      return RSVP.reject('could not read package.json');
    }

    let {
      dependencies = {},
      devDependencies = {}
    } = packageJSON;

    if (!dependencies[packageName] &&
        !devDependencies[packageName]) {
      let message = this.buildWarningMessage(packageName, packagePath);
      logger.warn(message);
    }

    return RSVP.resolve();
  },

  buildWarningMessage(packageName, packagePath) {
    return `Could not find ${packageName} in ${packagePath}. ` +
      'This means that cordova.js & plugins will not be available in ' +
      'livereload.\n\n' +
      'To fix, run:\n' +
      '\tember install corber-ember-livereload\n\n' +
      'Read more: http://corber.io/pages/frameworks/ember';
  }
});

