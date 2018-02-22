const Task             = require('../../../tasks/-task');
const path             = require('path');
const getPackage       = require('../../../utils/get-package');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');

module.exports = Task.extend({
  root: undefined,

  warnMsg() {
    return chalk.red(`
      The homepage property in your package.json is undefined,
      or has a leading slash.

      Cordova applications use file based urls, and this will not work.
      Set the property to '' or './'`
    );
  },

  run() {
    let packagePath = path.join(this.root, 'package.json');
    let packageJSON = getPackage(packagePath);
    let homepage = packageJSON.homepage;

    if (homepage === undefined || homepage && homepage[0] === '/') {
      return Promise.reject(this.warnMsg());
    } else {
      return Promise.resolve();
    }
  }
});
