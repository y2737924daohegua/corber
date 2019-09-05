const Command            = require('./-command');
const AddonArgsValidator = require('../targets/cordova/validators/addon-args');
const PlatformTask       = require('../targets/cordova/tasks/platform');
const runHook            = require('../tasks/run-hook');
const CorberError        = require('../utils/corber-error');
const logger             = require('../utils/logger');
const camelize           = require('../utils/string').camelize;

const supportedPlatforms = ['ios', 'android'];

module.exports = Command.extend({
  name: 'platform',
  aliases: [ 'pl' ],
  description: 'Add/remove platforms',

  availableOptions: [
    { name: 'save',                 type: Boolean,  default: true },
    { name: 'crosswalk',            type: Boolean,  default: false },
    { name: 'uiwebview',            type: Boolean,  default: false },
    { name: 'link',                 type: String,   default: undefined },
    { name: 'quiet',                type: Boolean,  default: false },
    { name: 'verbose',              type: Boolean,  default: false }
  ],

  run(options, rawArgs) {
    let addonArgsValidator = new AddonArgsValidator({
      rawArgs: rawArgs,
      api: 'platform'
    });

    let platformTask = new PlatformTask({
      project: this.project
    });

    let hookOptions = { root: this.project.root };

    let platform, action;

    return this._super(...arguments)
      .then(() => addonArgsValidator.run())
      .then((validated) => {
        action = validated.action;
        platform = validated.name;

        if (!platform) {
          throw new CorberError('no platform specified');
        }

        if (
          !supportedPlatforms.some(supportedPlatform =>
            platform.startsWith(supportedPlatform)
          )
        ) {
          throw new CorberError(`'${platform}' is not a supported platform`);
        }

        let hookName = camelize(`beforePlatform-${action}`);
        return runHook(hookName, options, hookOptions);
      })
      .then(() => {
        let verb = action === 'add' ? 'adding' : 'removing';
        logger.info(`${verb} platform '${platform}'...`);

        return platformTask.run(action, platform, options);
      })
      .then(() => {
        let hookName = camelize(`afterPlatform-${action}`);
        return runHook(hookName, options, hookOptions);
      })
      .then(() => {
        let verb = action === 'add' ? 'added' : 'removed';
        logger.success(`${verb} platform '${platform}'`);
      })
      .catch((e) => {
        if (e instanceof CorberError) {
          logger.error(e.message);
        } else {
          throw e;
        }
      });
  }
});
