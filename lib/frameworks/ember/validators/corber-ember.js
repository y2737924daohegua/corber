const Task       = require('../../../tasks/-task');
const getPackage = require('../../../utils/get-package');
const logger     = require('../../../utils/logger');
const path       = require('path');
const RSVP       = require('rsvp');
const chalk      = require('chalk');

module.exports = Task.extend({
  root: undefined,

  run() {
    let packagePath = path.join(this.root, 'package.json');
    let packageJSON = getPackage(packagePath);

    if (!packageJSON) {
      return RSVP.reject('could not read package.json');
    }

    let {
      dependencies = {},
      devDependencies = {}
    } = packageJSON;

    if (!dependencies['corber-ember'] && !devDependencies['corber-ember']) {
      let message = this.buildWarningMessage(packagePath);
      logger.warn(message);
    }

    return RSVP.resolve();
  },

  buildWarningMessage(packagePath) {
    return chalk.yellow(`
      Could not find corber-ember in ${packagePath}.
      This means the cordova.js & plugins will not be available in livereload.

      To fix, run:
      ember install corber-ember

      more: http://corber.io/pages/frameworks/ember`
    );
  }
});
