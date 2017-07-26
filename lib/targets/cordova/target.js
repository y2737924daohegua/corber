const CoreObject       = require('core-object');
const BuildTask        = require('./tasks/build');
const path             = require('path');
const fsUtils          = require('../../utils/fs-utils');
const runValidators    = require('../../utils/run-validators');

const ValidatePlatformTask    = require('./validators/platform');
const ValidatePluginTask      = require('./validators/plugin');
const ValidateAllowNavigation = require('./validators/allow-navigation');

module.exports = CoreObject.extend({
  platform: undefined,
  project: undefined,

  _buildValidators(isServing) {
    let validators = [];

    validators.push(
      new ValidateAllowNavigation({
        project: this.project,
        rejectIfUndefined: isServing
      }).run()
    );

    validators.push(
      new ValidatePlatformTask({
        project: this.project,
        platform: this.platform
      }).run()
    );

    return validators;
  },

  validateBuild() {
    let validators = this._buildValidators(false, this.project, this.platform);

    return runValidators(validators);
  },

  validateServe() {
    let validators = this._buildValidators(true, this.project, this.platform);

    validators.push(
      new ValidatePluginTask({
        project: this.project,
        platform: this.platform,
        pluginName: 'cordova-plugin-whitelist'
      }).run()
    );

    return runValidators(validators);
  },

  build(verbose = false) {
    let cordovaBuild = new BuildTask({
      project: this.project,
      platform: this.platform,
      cordovaOpts: this.cordovaOpts,
      verbose: verbose
    });

    return cordovaBuild.run();
  }
});
