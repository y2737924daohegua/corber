const CoreObject       = require('core-object');
const path             = require('path');
const Build            = require('./tasks/build');
const runValidators    = require('../../utils/run-validators');
const ValidatePlugin   = require('./validators/plugin');
const AllowNavigation  = require('./validators/allow-navigation');
const fsUtils          = require('../../utils/fs-utils');
const getPackage       = require('../../utils/get-package');
const cdvPath          = require('./utils/get-path');

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

  installedPlatforms() {
    let packagePath = path.join(cdvPath(this.project), 'package.json');
    if (fsUtils.existsSync(packagePath)) {
      let packageJSON = getPackage(packagePath);
      return packageJSON.cordova.platforms;
    } else {
      return [];
    }
  },

  build() {
    let cordovaBuild = new Build({
      project: this.project,
      platform: this.platform,
      cordovaOpts: this.cordovaOpts
    });

    return cordovaBuild.run();
  }
});
