const Command          = require('./-command');
const SanitizeArgs     = require('../targets/cordova/validators/addon-args');
const PlatformTask     = require('../targets/cordova/tasks/platform');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'platform',
  aliases: [ 'pl' ],
  description: 'Add/remove platforms',
  works: 'insideProject',

  /* eslint-disable max-len */
  availableOptions: [
    { name: 'save',                 type: Boolean,  default: true },
    { name: 'default-webview',      type: Boolean,  default: false },
    { name: 'crosswalk',            type: Boolean,  default: false },
    { name: 'uiwebview',            type: Boolean,  default: false },
    { name: 'link',                 type: String,  default: undefined }
  ],

  /* eslint-enable max-len */
  run(options, rawArgs) {
    this._super.apply(this, arguments);

    let cordovaArgValidator = new SanitizeArgs({
      rawArgs: rawArgs,
      api: 'platform'
    });

    let platform = new PlatformTask({
      project: this.project
    });

    return new Promise((resolve, reject) => {
      cordovaArgValidator.run().then((validated) => {
        logger.info(
          'Preparing to ' + validated.action + ' platform ' + rawArgs
        );

        return platform.run(validated.action, validated.name, options);
      }).then(resolve).catch(function(err) {
        logger.error(err);
        reject();
      });
    });
  }
});
