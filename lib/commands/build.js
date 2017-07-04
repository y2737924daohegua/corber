'use strict';

var Command         = require('./-command');

var BashTask        = require('../tasks/bash');
var CdvBuildTask    = require('../tasks/cordova-build');
var HookTask        = require('../tasks/run-hook');
var logger          = require('../utils/logger');

var parseCordovaOpts        = require('../utils/parse-cordova-build-opts');

var Framework               = require('../frameworks/vue');

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

    var framework = new Framework();

    var cordovaOpts = parseCordovaOpts(platform, options);
    var cordovaBuild = new CdvBuildTask({
      project: project,
      platform: platform,
      cordovaOpts: cordovaOpts,
      verbose: options.verbose
    });

    logger.info('ember-cordova: Building app');

    return framework.validate(project, options)
      .then(hook.prepare('beforeBuild', options))
      .then(function() {
        if (options.skipEmberBuild !== true) {
          console.log("A123");
          return framework.build(project, options);
        }
      })
      .then(function() {
        if (options.skipCordovaBuild !== true) {
          console.log("B123");
          return cordovaBuild.run();
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
