const Task             = require('../../../tasks/-task');
const Promise          = require('rsvp').Promise;
const commandExists    = require('../../../utils/command-exists');

const cordovaInstallText = '\n' +
  'The command `cordova` was not found. This likely ' +
  'means you need to install cordova globally.  Please run the following ' +
  'command to continue.\n\t' +
  'npm install cordova -g \n' +
  'installed by checking that the following command returns the currently ' +
  'installed version:\n\t';

module.exports = Task.extend({
  options: undefined,

  run() {
    if (this.options && this.options.skipCordovaCheck === true) {
      return Promise.resolve();
    }

    let result = commandExists('cordova');

    if (result) {
      return Promise.resolve();
    }

    return Promise.reject(cordovaInstallText);
  }
});
