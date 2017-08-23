const CoreObject       = require('core-object');
const Build            = require('./tasks/build');
const runValidators    = require('../../utils/run-validators');
const ValidatePlatform = require('./validators/platform');
const ValidatePlugin   = require('./validators/plugin');
const AllowNavigation  = require('./validators/allow-navigation');

module.exports = CoreObject.extend({
  platform: undefined,
  project: undefined,
  cordovaOpts: {},

  _buildValidators(isServing, skipCordovaBuild = false) {
    let validators = [];

    validators.push(
      new AllowNavigation({
        project: this.project,
        rejectIfUndefined: isServing
      }).run()
    );

    if (skipCordovaBuild === false) {
      validators.push(
        new ValidatePlatform({
          project: this.project,
          platform: this.platform
        }).run()
      );
    }

    return validators;
  },

  validateBuild(skipCordovaBuild) {
    let validators = this._buildValidators(false, skipCordovaBuild);

    return runValidators(validators);
  },

  validateServe() {
    let validators = this._buildValidators(true);

    validators.push(
      new ValidatePlugin({
        project: this.project,
        platform: this.platform,
        pluginName: 'cordova-plugin-whitelist'
      }).run()
    );

    return runValidators(validators);
  },

  build(verbose = false) {
    let cordovaBuild = new Build({
      project: this.project,
      platform: this.platform,
      cordovaOpts: this.cordovaOpts,
      verbose: verbose
    });

    return cordovaBuild.run();
  }
});
