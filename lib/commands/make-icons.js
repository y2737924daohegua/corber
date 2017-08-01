const Command          = require('./-command');
const iconTask         = require('splicon/dist/icon-task');
const getPlatforms     = require('../targets/cordova/utils/get-platforms');
const logger           = require('../utils/logger');

const includes         = require('lodash').includes;
const pull             = require('lodash').pull;

module.exports = Command.extend({
  name: 'make-icons',
  aliases: [ 'icons' ],
  description: 'Generates cordova icon files and updates config',
  works: 'insideProject',

  availableOptions: [{
    name: 'source',
    type: String,
    default: 'ember-cordova/icon.svg'
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
        throw new Error('ember-cordova: No added platforms to generate icons for');
        /* eslint-enable max-len */
      }

      options.platform = options.platform.concat(addedPlatforms);

      pull(options.platform, 'added');
    }

    /* eslint-disable max-len */
    logger.info('ember-cordova: Generating icons for ' + options.platform.join(', '));
    /* eslint-enable max-len */

    return iconTask({
      source: options.source,
      platforms: options.platform,
      projectPath: 'ember-cordova/cordova'
    }).then(function() {
      logger.success('ember-cordova: icons generated');
    }).catch(function(err) {
      logger.error(err);
    });
  }
});
