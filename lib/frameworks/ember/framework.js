/* eslint-disable max-len */
const Framework        = require('../framework');
const BuildTask        = require('./tasks/build');
const ServeTask        = require('./tasks/serve');
const RSVP             = require('rsvp');
const logger           = require('../../utils/logger');
const runValidators    = require('../../utils/run-validators');
const PortFinder       = require('portfinder');
const getPort          = RSVP.denodeify(PortFinder.getPort);
const _merge           = require('lodash').merge;

const ValidateLocationType     = require('./validators/location-type');
const ValidateRootUrl          = require('./validators/root-url');
/* eslint-enable max-len */

module.exports = Framework.extend({
  name: 'ember',
  buildCommand: undefined,
  buildPath: '/dist',
  port: 4200,
  root: undefined,

  //TODO - glimmer should also be a framework
  isGlimmer: false,

  _buildValidators(project, options) {
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

    return validations;
  },

  validateBuild(project, options) {
    let validations = this._buildValidators(project, options);
    return runValidators(validations);
  },

  build(project, options) {
    let emberBuild = new BuildTask({
      project: project,
      environment: options.environment,
      outputPath: options.cordovaOutputPath
    });

    return emberBuild.run();
  },

  validateServe(project, options) {
    let validations = this._buildValidators(project, options);
    return runValidators(validations);
  },

  serve(project, options, ui, analytics) {
    //TODO - needs analytics pass
    let serve = new ServeTask({
      project: project,
      analytics: analytics,
      ui: ui
    });

    if (options.port === undefined) { options.port = this.port; }

    return this._autoFindLiveReloadPort(options).then((serveOpts) => {
      let config = project.config(serveOpts.environment);

      _merge(serveOpts, {
        baseURL: config.baseURL || '/',
        rootURL: config.rootURL || '/',
        project: project
      });

      return serve.run(serveOpts);
    });
  },

  //Taken from from ember-cli
  //https://github.com/ember-cli/ember-cli/blob/master/lib/commands/serve.js#L97-L117
  _autoFindLiveReloadPort(commandOptions) {
    return getPort({
      port: commandOptions.liveReloadPort,
      host: commandOptions.liveReloadHost
    }).then((foundPort) => {
      // if live reload port matches express port, try one higher
      if (foundPort === commandOptions.port) {
        commandOptions.liveReloadPort = foundPort + 1;
        return this._autoFindLiveReloadPort(commandOptions);
      }

      // port was already open
      if (foundPort === commandOptions.liveReloadPort) {
        return commandOptions;
      }

      // use found port as live reload port
      commandOptions.liveReloadPort = foundPort;

      return commandOptions;
    });
  }
});
