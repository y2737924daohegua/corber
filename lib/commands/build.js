'use strict';

var Command         = require('./-command');

var HookTask        = require('../tasks/run-hook');
var CordovaTarget   = require('../targets/cordova/target');
var logger          = require('../utils/logger');
var requireFramework = require('../utils/require-framework');

var parseCordovaOpts = require('../targets/cordova/utils/parse-build-flags');

module.exports = Command.extend({
  name: 'build',
  aliases: ['b'],
  description: 'Build the ember application for cordova',
  works: 'insideProject',

  /* eslint-disable max-len */
  availableOptions: [
    { name: 'platform',                            type: String,  default: 'ios' },
    { name: 'verbose',                             type: Boolean, default: false,                       aliases: ['v'] },
    { name: 'environment',                         type: String,  default: 'development',               aliases: ['e', 'env', { 'dev': 'development' }, { 'prod': 'production' }] },
    { name: 'cordova-output-path',                 type: 'Path',  default: 'ember-cordova/cordova/www', aliases: ['op', 'out'] },
    { name: 'release',                             type: Boolean, default: false },
    { name: 'device',                              type: Boolean, default: true },
    { name: 'emulator',                            type: Boolean, default: false },
    { name: 'build-config',                        type: 'Path', aliases: ['buildConfig'] },
    { name: 'force',                               type: Boolean, default: false },
    { name: 'skip-cordova-build',                  type: Boolean, default: false, aliases: ['scb']},
    { name: 'skip-ember-build',                    type: Boolean, default: false, aliases: ['seb']},

    // iOS Signing Options
    { name: 'code-sign-identity',                  type: String },
    { name: 'provisioning-profile',                type: String },
    { name: 'codesign-resource-rules',             type: String },
    { name: 'development-team',                    type: String },
    { name: 'package-type',                        type: String },

    // android Signing Options
    { name: 'keystore',                            type: String },
    { name: 'store-password',                      type: String },
    { name: 'alias',                               type: String },
    { name: 'password',                            type: String },
    { name: 'keystore-type',                       type: String },
    { name: 'gradle-arg',                          type: String },
    { name: 'cdv-build-multiple-apks',             type: Boolean },
    { name: 'cdv-version-code',                    type: String },
    { name: 'cdv-min-sdk-version',                 type: String },
    { name: 'cdv-build-tools-version',             type: String },
    { name: 'cdv-compile-sdk-version',             type: String },
    { name: 'cdv-debug-sigining-properties-file',  type: String },
    { name: 'cdv-release-sigining-properties-file', type: String }

  ],
  /* eslint-enable max-len */

  run: function(options) {
    this._super.apply(this, arguments);

    var project = this.project;
    var platform = options.platform;

    //Vars for live reload addon service
    this.project.targetIsCordova = true;
    this.project.CORDOVA_PLATFORM = platform;

    var hook = new HookTask({
      project: project
    });

    var framework = requireFramework(this.project);

    var cordovaOpts = parseCordovaOpts(platform, options);
    var cordovaTarget = new CordovaTarget({
      platform: options.platform,
      project: this.project,
      cordovaOpts: cordovaOpts
    });

    logger.info('ember-cordova: Building app');

    return framework.validateBuild(project, options)
      .then(cordovaTarget.validateBuild(options.skipCordovaBuild))
      .then(hook.prepare('beforeBuild', options))
      .then(function() {
        if (options.skipEmberBuild !== true) {
          return framework.build(project, options);
        }
      })
      .then(function() {
        if (options.skipCordovaBuild !== true) {
          return cordovaTarget.build();
        }
      })
      .then(hook.prepare('afterBuild', options))
      .then(function() {
        logger.success('ember-cordova project built');
      })
      .catch(function(e) {
        logger.error(e);
      });
  }
});
