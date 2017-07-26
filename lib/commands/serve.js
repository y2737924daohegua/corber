'use strict';

var Command         = require('./-command');

var HookTask        = require('../tasks/run-hook');
var logger          = require('../utils/logger');
var editXml         = require('../targets/cordova/utils/edit-xml');
var getNetworkIp    = require('../utils/get-network-ip');
var getFramework    = require('../utils/get-framework');
var CordovaTarget   = require('../targets/cordova/target');

var CreateLiveReloadShell   = require('../tasks/create-livereload-shell');

module.exports = Command.extend({
  name: 'serve',
  aliases: [ 's' ],
  description: 'Builds app, then runs liveReload server',
  works: 'insideProject',

  /* eslint-disable max-len */
  availableopts: [
    { name: 'platform',             type: String,  default: 'ios' },
    { name: 'reload-url',           type: String,                          aliases: ['r'] },
    { name: 'verbose',              type: Boolean, default: false,         aliases: ['v'] },
    { name: 'port',                 type: Number,                          aliases: ['p'] },
    { name: 'host',                 type: String,                          aliases: ['H'],     description: 'Listens on all interfaces by default' },
    { name: 'proxy',                type: String,                          aliases: ['pr', 'pxy'] },
    { name: 'insecure-proxy',       type: Boolean, default: false,         aliases: ['inspr'], description: 'Set false to proxy self-signed SSL certificates' },
    { name: 'transparent-proxy',    type: Boolean, default: true,          aliases: ['transp'], description: 'Set to false to omit x-forwarded-* headers when proxying' },
    { name: 'watcher',              type: String,  default: 'events',      aliases: ['w'] },
    { name: 'live-reload',          type: Boolean, default: true,          aliases: ['lr'] },
    { name: 'live-reload-host',     type: String,                          aliases: ['lrh'],   description: 'Defaults to host' },
    { name: 'live-reload-base-url', type: String,                          aliases: ['lrbu'],  description: 'Defaults to baseURL' },
    { name: 'live-reload-port',     type: Number,                          aliases: ['lrp'],   description: '(Defaults to port number within [49152...65535])' },
    { name: 'environment',          type: String,  default: 'development', aliases: ['e', 'env', { 'dev': 'development' }, { 'prod': 'production' }] },
    { name: 'ssl',                  type: Boolean, default: false },
    { name: 'ssl-key',              type: String,  default: 'ssl/server.key' },
    { name: 'ssl-cert',             type: String,  default: 'ssl/server.crt' },
    { name: 'force',                type: Boolean, default: false },
    { name: 'skip-ember-build',     type: Boolean, default: false, aliases: ['seb'] },
    { name: 'skip-cordova-build',   type: Boolean, default: false, aliases: ['scb'] }
  ],
  /* eslint-enable max-len */


  getReloadUrl(port, reloadUrl, framework) {
    if (reloadUrl) { return reloadUrl; }

    if (port === undefined) {
      port = framework.port;
    }

    var networkAddress = getNetworkIp();
    return 'http://' + networkAddress + ':' + port;
  },

  run: function(opts) {
    this._super.apply(this, arguments);

    var platform = opts.platform;
    var framework = getFramework.get(this.project);

    //Vars for live reload addon service
    this.project.targetIsCordova = true;
    this.project.targetIsCordovaLivereload = true;
    this.project.CORDOVA_PLATFORM = platform;

    var cordovaTarget = new CordovaTarget({
      platform: opts.platform,
      project: this.project
    });

    var hook = new HookTask({
      project: this.project
    });

    var setupLivereload = new CreateLiveReloadShell({
      project: this.project
    });

    var reloadUrl = this.getReloadUrl(opts.port, opts.reloadUrl, framework);
    var project = this.project;
    var ui = this.ui;
    var analytics = this.analytics;

    return editXml.addNavigation(project, reloadUrl)
      .then(cordovaTarget.validateServe())
      .then(framework.validateServe(project, opts))
      .then(hook.prepare('beforeBuild', opts))
      .then(setupLivereload.prepare(reloadUrl))
      .then(function() {
        if (opts.skipCordovaBuild !== true) {
          return cordovaTarget.build();
        }
      })
      .then(hook.prepare('afterBuild', opts))
      .then(function() {
        if (opts.skipEmberBuild !== true) {
          return framework.serve(project, opts, ui, analytics);
        }
      })
    .catch(function(e) {
      logger.error(e);
    });
  }
});
