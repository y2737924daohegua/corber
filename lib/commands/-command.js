const Command      = require('ember-cli/lib/models/command');
const Leek         = require('leek');
const ConfigStore  = require('configstore');
const uuid         = require('uuid');
const _get         = require('lodash').get;
const logger       = require('../utils/logger');

module.exports = Command.extend({
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

  run(options) {
    if (options && options.quiet) {
      logger.setLogLevel('error');
      this.ui.setWriteLevel('ERROR');
    }
    if (options && options.verbose) {
      logger.setLogLevel('verbose');
      this.ui.setWriteLevel('verbose');
    }

    this.analytics.track({
      message: this.name
    });

    return;
  }
});
