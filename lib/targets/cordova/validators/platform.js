const Task             = require('../../../tasks/-task');
const CordovaValidator = require('../utils/cordova-validator');

module.exports = Task.extend({
  project: undefined,
  platform: undefined,

  createValidator() {
    return new CordovaValidator({
      project: this.project,
      platform: this.platform,
      desiredKeyName  : this.platform,
      type: 'platform',
      dir: 'platforms/',
      jsonPath: 'platforms/platforms.json'
    });
  },

  run() {
    const validator = this.createValidator();

    return validator.validateCordovaConfig()
      .then(validator.validateCordovaJSON.bind(validator))
      .then(validator.validateDirExists.bind(validator));
  }
});
