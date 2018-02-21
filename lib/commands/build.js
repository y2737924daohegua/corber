const Command          = require('./-command');
const Hook             = require('../tasks/run-hook');
const LintIndex        = require('../tasks/lint-index');
const AddCordovaJS     = require('../tasks/add-cordova-js');
const logger           = require('../utils/logger');
const requireTarget    = require('../utils/require-target');
const requireFramework = require('../utils/require-framework');
const path             = require('path');
const Promise          = require('rsvp').Promise;

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
    { name: 'cordova-output-path',                 type: 'Path',  default: 'corber/cordova/www',        aliases: ['op', 'out'] },
    { name: 'release',                             type: Boolean, default: false },
    { name: 'device',                              type: Boolean, default: true },
    { name: 'emulator',                            type: Boolean, default: false },
    { name: 'build-config',                        type: 'Path', aliases: ['buildConfig'] },
    { name: 'force',                               type: Boolean, default: false },
    { name: 'skip-cordova-build',                  type: Boolean, default: false, aliases: ['scb']},
    { name: 'skip-framework-build',                type: Boolean, default: false, aliases: ['sfb'] },
    { name: 'add-cordova-js',                      type: Boolean },
    { name: 'quiet',                               type: Boolean, default: false, aliases: ['q'] },

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

  run(options) {
    this._super.apply(this, arguments);

    //lets for live reload addon service
    this.project.targetIsCordova = true;
    this.project.CORDOVA_PLATFORM = options.platform;

    let hook = new Hook({
      project: this.project
    });

    let indexHtmlPath = path.join(options.cordovaOutputPath, 'index.html');

    let lint = new LintIndex({
      source: indexHtmlPath
    });

    let addCordovaJS = new AddCordovaJS({
      source: indexHtmlPath
    });

    let framework = requireFramework(this.project);
    let cordovaTarget = requireTarget(this.project, options);

    logger.info('corber: Building app');

    return new Promise((resolve, reject) => {
      hook.run('beforeBuild', options)
        .then(() => framework.validateBuild(options))
        .then(() => cordovaTarget.validateBuild(options.skipCordovaBuild))
        .then(() => {
          if (options.skipFrameworkBuild !== true) {
            return framework.build(options);
          }
        })
        .then(() => {
          if (
            options.skipFrameworkBuild !== true ||
            options.addCordovaJs === true
          ) {
            return addCordovaJS.run();
          }
        })
        .then(() => {
          if (options.skipCordovaBuild !== true) {
            return cordovaTarget.build();
          }
        })
        .then(() => hook.run('afterBuild', options))
        .then(() => lint.run())
        .then(function() {
          logger.success('corber project built');
          resolve();
        })
        .catch(function(e) {
          logger.error(e);
          reject(e);
        });
    });
  }
});
