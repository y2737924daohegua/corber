const Command      = require('ember-cli/lib/models/command');
const Leek         = require('leek');
const ConfigStore  = require('configstore');
const uuid         = require('uuid');
const _get         = require('lodash').get;
const logger       = require('../utils/logger');
const getVersions  = require('../utils/get-versions');
const Promise      = require('rsvp').Promise;

/* eslint-disable max-len */
const cannotUseInsideProjectMessage = (name) => `You cannot use the '${name}' command inside a corber project.`;
const cannotUseOutsideProjectMessage = (name) => `You cannot use the '${name}' command outside of a corber project. Have you run 'corber init'?`;
/* eslint-enable max-len */

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
    this._super(...arguments);

    let versions = getVersions(this.project.root);
    let version = _get(versions, 'corber.project.required', 'unknown');
    this.isWithinProject = version !== 'unknown';

    let disabled = _get(app, 'settings.disableEcAnalytics', false);
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
      logger.error(cannotUseInsideProjectMessage(this.name));
      return Promise.resolve();

    }

    if (this.scope === 'insideProject' && !this.isWithinProject) {
      logger.error(cannotUseOutsideProjectMessage(this.name));
      return Promise.resolve();
    }

    return this._super(...arguments);
  },

  run(options = {}) {
    if (options.quiet) {
      logger.setLogLevel('error');
      this.ui.setWriteLevel('ERROR');
    }
    if (options.verbose) {
      logger.setLogLevel('verbose');
      this.ui.setWriteLevel('DEBUG');
    }

    this.analytics.track({
      message: this.name
    });

    return Promise.resolve();
  }
});
