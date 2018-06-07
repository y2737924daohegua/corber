const Command          = require('./-command');
const SanitizeArgs     = require('../targets/cordova/validators/addon-args');
const PlatformTask     = require('../targets/cordova/tasks/platform');
const Hook             = require('../tasks/run-hook');
const logger           = require('../utils/logger');
const camelize         = require('../utils/string').camelize;
const Promise          = require('rsvp').Promise;

module.exports = Command.extend({
  name: 'platform',
  aliases: [ 'pl' ],
  description: 'Add/remove platforms',

  /* eslint-disable max-len */
  availableOptions: [
    { name: 'save',                 type: Boolean,  default: true },
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

    let hook = new Hook({
      project: this.project
    });

    function beforePlatform(action) {
      return hook.run(camelize(`beforePlatform-${action}`), options);
    }

    function afterPlatform(action) {
      return hook.run(camelize(`afterPlatform-${action}`), options);
    }

    return new Promise((resolve, reject) => {
      cordovaArgValidator.run().then((validated) => (
        beforePlatform(validated.action).then(() => validated)
      )).then((validated) => {
        logger.info(`Preparing to ${validated.action} platform ${rawArgs}`);
        return platform.run(
          validated.action,
          validated.name,
          options
        ).then(() => validated);
      })
      .then(({ action }) => afterPlatform(action))
      .then(resolve).catch(function(err) {
        logger.error(err);
        reject();
      });
    });
  }
});
