const Command          = require('./-command');
const iconTask         = require('splicon/src/icon-task');
const getPlatforms     = require('../targets/cordova/utils/get-platforms');
const logger           = require('../utils/logger');

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
    logger.info('corber: Generating icons for ' + options.platform.join(', '));
    /* eslint-enable max-len */

    return new Promise((resolve, reject) => {
      iconTask({
        source: options.source,
        platforms: options.platform,
        projectPath: 'corber/cordova'
      }).then(function() {
        logger.success('corber: icons generated');
        resolve();
      }).catch(function(err) {
        logger.error(err);
        reject(err);
      });
    });
  }
});
