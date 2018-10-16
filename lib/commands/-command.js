const Command      = require('ember-cli/lib/models/command');
const Leek         = require('leek');
const ConfigStore  = require('configstore');
const uuid         = require('uuid');
const _get         = require('lodash').get;
const chalk        = require('chalk');
const logger       = require('../utils/logger');
const getVersions  = require('../utils/get-versions');

module.exports = Command.extend({
  // use `scope` instead of `works` in sub-objects
  works: 'everywhere',
  scope: 'insideProject',

  //h/t ember-cli
  getUUID() {
    let configStore = new ConfigStore('corber');
    let id = configStore.get('uuid');
    if (id === undefined) {
      id = uuid.v4().toString();
      configStore.set('uuid', id);
    }

    return id;
  },

  init(app) {
    this._super.apply(this, arguments);

    process.env.CORBER = true;

    let versions = getVersions(this.project.root);
    this.isWithinProject = (versions.corber.project.required !== undefined);

    let disabled = _get(app, 'settings.disableEcAnalytics', false);
    let version = _get(app, 'project.addonPackages.corber.pkg.version');
    let id = this.getUUID();

    this.analytics = new Leek({
      silent: disabled,
      name: id,
      globalName: 'ember-cordova',
      trackingCode: 'UA-50368464-2',
      version: version
    });
  },

  validateAndRun() {
    if (this.scope === 'outsideProject' && this.isWithinProject) {
      throw `You cannot use the ${chalk.green(this.name)}` +
      ' command inside a corber project.';
    }

    if (this.scope === 'insideProject' && !this.isWithinProject) {
      throw `You cannot use the ${chalk.green(this.name)} command outside` +
      ' of a corber project. Have you run corber init?';
    }

    return this._super.apply(this, arguments);
  },

  run(options) {
    if (options && options.quiet) {
      logger.setLogLevel('error');
      this.ui.setWriteLevel('ERROR');
    }
    if (options && options.verbose) {
      logger.setLogLevel('verbose');
      this.ui.setWriteLevel('DEBUG');
    }

    this.analytics.track({
      message: this.name
    });

    return;
  }
});
