const Task             = require('../../../tasks/-task');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const logger           = require('../../../utils/logger');
const getCordovaConfig = require('../utils/get-config');

const UNSAFE_PRODUCTION_VALUE =
  chalk.yellow('Your corber/cordova/config.xml file has set the ' +
    'following flag:\n') +
  chalk.grey('\t<allow-navigation href="${allowNavigation}" />\n') +
  chalk.yellow('This is necessary for device live-reload to work, ' +
    'but is unsafe and should not be used in production.');

const LIVE_RELOAD_CONFIG_NEEDED =
  chalk.red('* corber/cordova/config.xml needs: \n') +
  chalk.grey('<allow-navigation href="*" />\n') +
  chalk.grey('This is unsafe and should not be used in production, ' +
    'but is necessary for device live-reload to work.');

/*
 * allow-navigation is considered unsafe when:
 *
 * there is a allow-href that consists of '*'
 * or one that contains a http or https url
 *
 * pending a users setup, one of these will be present for liveReload
 *
 */

//this is wrong because user may have multiple allow-hrefs
function livereloadProp(json, field, prop) {
  if (json && json[field]) {

    let keysLength = json[field].length;
    while (keysLength--) {
      let value = json[field][keysLength].$[prop];
      if (value && this.validateNavigationProp(value) !== undefined) {
        return value
      }
    }
  }
  return undefined;
}

function validateNavigationProp(prop) {
  if (prop &&
       (prop.indexOf('*') === 0 ||
        prop.indexOf('http') > -1 ||
        prop.indexOf('https') > -1)
      ) {

    return prop;
  }
}

module.exports = Task.extend({
  project: undefined,
  platform: undefined,
  rejectIfUndefined: false,

  livereloadProp: livereloadProp,
  validateNavigationProp: validateNavigationProp,

  run() {
    if (this.platform === 'browser') {
      return Promise.resolve();
    }

    return getCordovaConfig(this.project)
      .then((config) => {
        let livereloadProp = this.livereloadProp(
          config.widget,
          'allow-navigation',
          'href'
        );

        if (livereloadProp !== undefined) {
          let msg = UNSAFE_PRODUCTION_VALUE.replace(
            '${allowNavigation}',
            livereloadProp
          );
          logger.warn(msg);
        }

        if (this.rejectIfUndefined && livereloadProp === undefined) {
          return Promise.reject(LIVE_RELOAD_CONFIG_NEEDED);
        }
      });
  }
});
