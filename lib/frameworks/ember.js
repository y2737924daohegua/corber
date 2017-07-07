const Framework      = require('./framework');
const Promise        = require('rsvp').Promise;
const BuildTask      = require('../tasks/ember-build');

const logger         = require('../utils/logger');
const runValidators  = require('../utils/run-validators');

var ValidateLocationType    = require('../tasks/validate/location-type');
var ValidatePlatformTask    = require('../tasks/validate/platform');
var ValidateAllowNavigation = require('../tasks/validate/allow-navigation');
var ValidateRootUrl         = require('../tasks/validate/root-url');

module.exports = Framework.extend({
  buildCommand: undefined,
  buildPath: '/dist',
  root: undefined,

  //TODO - glimmer should also be a framework
  isGlimmer: false,

  validate(project, options) {
    let validations = [];
    let projectConfig = project.config(options.environment);

    if (this.isGlimmer === false) {
      validations.push(
        new ValidateRootUrl({
          config: projectConfig,
          force: options.force
        }).run()
      );

      validations.push(
        new ValidateLocationType({
          config: projectConfig
        }).run()
      );
    }

    validations.push(
      new ValidateAllowNavigation({
        project: project,
        rejectIfUndefined: false
      }).run()
    );

    if (options.skipCordovaBuild !== true) {
      validations.push(
        new ValidatePlatformTask({
          project: project,
          platform: options.platform
        }).run()
      );
    }

    return runValidators(validations);
  },

  build(project, options) {
    let emberBuild = new BuildTask({
      project: project,
      environment: options.environment,
      outputPath: options.cordovaOutputPath
    });

    return emberBuild.run();
  }
});
