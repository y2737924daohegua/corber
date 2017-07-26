const Task             = require('../../../tasks/-task');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');

const MUST_SPECIFY_HASH =
  chalk.red('* config/environment.js: Cordova applications require:') +
  chalk.grey('\n`ENV.locationType = \'hash\'; \n');

module.exports = Task.extend({
  config: undefined,

  run() {
    let config = this.config;
    let locationType    = config.locationType;
    let isHashLocation  = locationType === 'hash';

    if (!isHashLocation) {
      return Promise.reject(MUST_SPECIFY_HASH);
    }

    return Promise.resolve();
  }
});
