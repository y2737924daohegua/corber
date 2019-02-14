const Command          = require('./-command');
const iconTask         = require('splicon/src/icon-task');
const getPlatforms     = require('../targets/cordova/utils/get-platforms');
const CorberError      = require('../utils/corber-error');
const logger           = require('../utils/logger');
const path             = require('path');
const includes         = require('lodash').includes;
const pull             = require('lodash').pull;
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'make-icons',
  aliases: [ 'icons' ],
  description: 'Generates cordova icon files and updates config',

  availableOptions: [{
    name: 'source',
    type: String,
    default: 'corber/icon.svg'
  }, {
    name: 'platform',
    type: Array,
    values: [
      'added',
      'ios',
      'android',
      'windows',
      'blackberry'
    ],
    default: ['added']
  }],

  expandAddedPlatform(options) {
    if (!includes(options.platform, 'added')) {
      return Promise.resolve();
    }

    return getPlatforms({ root: this.project.root }).then((platforms) => {
      if (platforms.length === 0) {
        throw new CorberError('no added platforms to generate icons for');
      }

      options.platform = options.platform.concat(platforms);

      pull(options.platform, 'added');
    });
  },

  run(options = {}) {
    return this._super(...arguments)
      .then(() => {
        let platforms = options.platform.join(', ');
        logger.info(`corber: Generating icons for ${platforms}`);
      })
      .then(() => this.expandAddedPlatform(options))
      .then(() => {
        return iconTask({
          source: options.source,
          platforms: options.platform,
          projectPath: path.join('corber', 'cordova')
        });
      })
      .then(() => {
        logger.success('icons generated');
      })
      .catch((e) => {
        if (e instanceof CorberError) {
          logger.error(e.message);
          return;
        }
        throw e;
      });
  }
});
