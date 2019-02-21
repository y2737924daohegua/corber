const Command          = require('./-command');
const splashTask       = require('splicon/src/splash-task');
const CorberError      = require('../utils/corber-error');
const expandPlatforms  = require('./utils/expand-platforms');
const logger           = require('../utils/logger');
const path             = require('path');

module.exports = Command.extend({
  name: 'make-splashes',
  aliases: [ 'splashes' ],
  description: 'Generates cordova splash files and updates config',

  availableOptions: [{
    name: 'source',
    type: String,
    default: 'corber/splash.svg'
  }, {
    name: 'platform',
    type: Array,
    values: [
      'added',
      'ios',
      'android'
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
        logger.info(`corber: Generating splashes for ${platformsString}`);
      })
      .then(() => {
        return splashTask({
          source: options.source,
          platforms: platforms,
          projectPath: path.join('corber', 'cordova')
        }).catch((e) => {
          throw new CorberError(e);
        });
      })
      .then(() => {
        logger.success('splashes generated');
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
