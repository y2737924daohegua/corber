const Command          = require('./-command');
const iconTask         = require('splicon/src/icon-task');
const expandPlatforms  = require('./utils/expand-platforms');
const CorberError      = require('../utils/corber-error');
const logger           = require('../utils/logger');
const path             = require('path');

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

  run(options) {
    let platforms;

    return this._super(...arguments)
      .then(() => expandPlatforms(this.project, options.platform))
      .then((expandedPlatforms) => {
        platforms = expandedPlatforms;
      })
      .then(() => {
        let platformsString = platforms.join(', ');
        logger.info(`corber: Generating icons for ${platformsString}`);
      })
      .then(() => {
        return iconTask({
          source: options.source,
          platforms: platforms,
          projectPath: path.join('corber', 'cordova')
        }).catch((e) => {
          throw new CorberError(e);
        });
      })
      .then(() => {
        logger.success('corber: icons generated');
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
