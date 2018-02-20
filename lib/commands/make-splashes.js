const Command          = require('./-command');
const splashTask       = require('splicon/src/splash-task');
const getPlatforms     = require('../targets/cordova/utils/get-platforms');
const logger           = require('../utils/logger');

const includes         = require('lodash').includes;
const pull             = require('lodash').pull;
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'make-splashes',
  aliases: [ 'splashes' ],
  description: 'Generates cordova splash files and updates config',
  works: 'insideProject',

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
    this._super.apply(this, arguments);

    if (includes(options.platform, 'added')) {
      let addedPlatforms = getPlatforms(this.project);

      if (addedPlatforms.length === 0) {
        /* eslint-disable max-len */
        throw new Error('corber: No added platforms to generate icons for');
        /* eslint-enable max-len */
      }

      options.platform = options.platform.concat(addedPlatforms);

      pull(options.platform, 'added');
    }

    /* eslint-disable max-len */
    logger.info('corber: Generating splashes for ' + options.platform.join(', '));
    /* eslint-enable max-len */

    return new Promise((resolve, reject) => {
      splashTask({
        source: options.source,
        platforms: options.platform,
        projectPath: 'corber/cordova'
      }).then(function() {
        logger.success('corber: splashes generated');
        resolve();
      }).catch(function(err) {
        logger.error(err);
        reject(err);
      });
    });
  }
});
