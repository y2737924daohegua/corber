const Task             = require('../tasks/-task');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const pick             = require('lodash').pick;
const values           = require('lodash').values;
const logger           = require('../utils/logger');

/* eslint-disable max-len */
const URL_MSG =
  chalk.red('* config/environment.js: rootURL or baseURL has a leading slash. \n') +
  chalk.grey(
    'This will not work in cordova, and needs to be removed. \n' +
    'You can pass the --force flag to ignore if otherwise handled. \n' +
    'See http://embercordova.com/pages/setup_guide for more info.'
  )
/* eslint-enable max-len */

module.exports = Task.extend({
  config: undefined,
  rootProps: [],
  force: false,

  validRootValues(values) {
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
      if (value && value[0] === '/') { return false; }
    }

    return true;
  },

  run() {
    let rootValues = values(pick(this.config, this.rootProps));
    let validRoot = this.validRootValues(rootValues);

    if (validRoot === false) {
      if (this.force === true) {
        let msg = URL_MSG + 'You have passed the --force flag, so continuing';
        logger.warn(msg);
        return Promise.resolve();
      } else {
        return Promise.reject(URL_MSG);
      }
    } else {
      return Promise.resolve();
    }
  }
});
