const Task             = require('../../../tasks/-task');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const logger           = require('../../../utils/logger');

const MUST_SPECIFY_HASH =
  chalk.red('* config/environment.js: Cordova applications require:') +
  chalk.grey('\n`ENV.locationType = \'hash\'; \n');

module.exports = Task.extend({
  config: undefined,
  force: false,

  run() {
    let config = this.config;
    let locationType    = config.locationType;
    let isHashLocation  = locationType === 'hash';

    if (!isHashLocation && this.force === false) {
      return Promise.reject(MUST_SPECIFY_HASH);
    } else {
      var msg = MUST_SPECIFY_HASH;
      msg += 'You have passed the --force flag, so continuing';
      logger.warn(msg);
    }

    return Promise.resolve();
  }
});
