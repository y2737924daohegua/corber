const CoreObject     = require('core-object');
const Promise        = require('rsvp').Promise;
const BuildTask      = require('../tasks/ember-build');

const logger         = require('../utils/logger');
const runValidators  = require('../utils/run-validators');
const projectType    = require('../utils/get-project-type');

var ValidateLocationType    = require('../tasks/validate/location-type');
var ValidatePlatformTask    = require('../tasks/validate/platform');
var ValidateAllowNavigation = require('../tasks/validate/allow-navigation');
var ValidateRootUrl         = require('../tasks/validate/root-url');

module.exports = CoreObject.extend({
  buildCommand: undefined,
  buildPath: '/dist',

  validate(project, options) {
    var validations = [];
    var projectConfig = project.config(options.environment);
    var isGlimmer = projectType.isGlimmer(this.project.root);

    if (isGlimmer === false) {
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
    var emberBuild = new BuildTask({
      project: project,
      environment: options.environment,
      outputPath: options.cordovaOutputPath
    });

    return emberBuild.run();
  }
});
