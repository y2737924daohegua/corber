const Task             = require('../tasks/-task');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const pick             = require('lodash').pick;
const values           = require('lodash').values;
const logger           = require('../utils/logger');

module.exports = Task.extend({
  framework: undefined,
  config: undefined,
  rootProps: [],
  path: undefined,
  force: false,
  env: undefined,

  /* eslint-disable max-len */
  errorMsg() {
    return chalk.red(`* ${this.path} ${this.env}: ${this.rootProps} has a leading slash. \n`) +
      chalk.grey(
        'This will not work in cordova, and needs to be removed. \n' +
        'You can pass the --force flag to ignore if otherwise handled. \n' +
        'See http://corber.io/pages/frameworks/index for more info.'
      )
  },

  propertyMissingErrorMsg() {
    let msg = `Could not find ${this.rootProps} in config at ${this.path} \n`;
    msg += 'Please ensure the property does not have a leading slash. ';
    msg += 'For more information, consult framework docs on corber.io or ';
    msg += 'http://corber.io/pages/frameworks/' + this.framework;
    return msg;
  },
  /* eslint-enable max-len */

  validRootValues(values) {
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value && value[0] === '/') { return false; }
    }

    return true;
  },

  run() {
    if (this.config === null) {
      return Promise.reject(this.propertyMissingErrorMsg());
    }

    let rootValues = values(pick(this.config, this.rootProps));

    if (this.force === false && rootValues.length === 0) {
      logger.warn(this.propertyMissingErrorMsg());
      return Promise.resolve();
    } else {
      let validRoot = this.validRootValues(rootValues);
      if (validRoot === false && this.force === true) {
        let msg = this.errorMsg() + 'Detected the --force flag so continuing';
        logger.warn(msg);
        return Promise.resolve();
      } else if (validRoot === false) {
        return Promise.reject(this.errorMsg());
      } else {
        return Promise.resolve();
      }
    }
  }
});
