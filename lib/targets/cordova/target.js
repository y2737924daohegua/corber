const CoreObject       = require('core-object');
const path             = require('path');
const RSVP             = require('rsvp');
const Promise          = RSVP.Promise;
const Build            = require('./tasks/build');
const runValidators    = require('../../utils/run-validators');
const ValidatePlugin   = require('./validators/plugin');
const AllowNavigation  = require('./validators/allow-navigation');
const fsUtils          = require('../../utils/fs-utils');
const getPackage       = require('../../utils/get-package');
const cordovaPath      = require('./utils/get-path');

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

  getInstalledPlatforms() {
    let packagePath = path.join(cordovaPath(this.project), 'package.json');
    if (fsUtils.existsSync(packagePath)) {
      let packageJSON = getPackage(packagePath);
      return Promise.resolve(packageJSON.cordova.platforms);
    } else {
      //TODO - prepare has not yet been run
      return Promise.reject(
        'No platforms found. If this is a new project run corber prepare'
      );
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
