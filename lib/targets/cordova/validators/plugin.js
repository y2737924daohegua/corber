const Task             = require('../../../tasks/-task');
const CordovaValidator = require('../utils/cordova-validator');

module.exports = Task.extend({
  pluginName: undefined,
  project: undefined,
  platform: undefined,

  createValidator() {
    return new CordovaValidator({
      project: this.project,
      platform: this.platform,
      desiredKeyName: this.pluginName,
      type: 'plugin',
      dir: 'plugins/',
      jsonPath: 'plugins/fetch.json'
    });
  },

  run() {
    let validator = this.createValidator();

    return validator.validateCordovaConfig()
      .then(validator.validateCordovaJSON.bind(validator))
      .then(validator.validatePluginJSON.bind(validator))
      .then(validator.validateDirExists.bind(validator));
  }
});
