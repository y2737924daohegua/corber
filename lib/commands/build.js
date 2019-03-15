const Command          = require('./-command');
const runHook          = require('../tasks/run-hook');
const lintIndex        = require('../tasks/lint-index');
const addCordovaJS     = require('../tasks/add-cordova-js');
const logger           = require('../utils/logger');
const requireTarget    = require('../utils/require-target');
const requireFramework = require('../utils/require-framework');
const resolvePlatform  = require('./utils/resolve-platform');
const path             = require('path');

module.exports = Command.extend({
  name: 'build',
  aliases: ['b'],
  description: 'Build the ember application for cordova',

  /* eslint-disable max-len */
  availableOptions: [
    { name: 'platform',                            type: String },
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
    { name: 'cdv-debug-signing-properties-file',   type: String },
    { name: 'cdv-release-signing-properties-file', type: String }

  ],
  /* eslint-enable max-len */

  run(options = {}) {
    this.project.targetIsCordova = true;

    let framework = requireFramework(this.project);
    let hookOptions = { root: this.project.root };
    let indexHtmlPath = path.join(options.cordovaOutputPath, 'index.html');
    let cordovaTarget;

    logger.info('corber: Building app');

    return this._super(...arguments)
      .then(() => resolvePlatform(this.project, options.platform))
      .then((platform) => {
        options.platform = platform;
        process.env.CORBER_PLATFORM = platform;
        options.platform = platform;

        // use legacy build system for Xcode
        if (options.platform === 'ios') {
          if (!options.buildFlag) {
            options.buildFlag = [];
          } else if (!Array.isArray(options.buildFlag)) {
            options.buildFlag = [options.buildFlag];
          }

          options.buildFlag.push('-UseModernBuildSystem=NO');
        }

        cordovaTarget = requireTarget(this.project, options);
      })
      .then(() => runHook('beforeBuild', options, hookOptions))
      .then(() => framework.validateBuild(options))
      .then(() => cordovaTarget.validateBuild(options.skipCordovaBuild))
      .then(() => {
        if (options.skipFrameworkBuild) {
          return;
        }

        return framework.build(options);
      })
      .then(() => {
        if (options.skipFrameworkBuild && !options.addCordovaJs) {
          return;
        }

        return addCordovaJS(indexHtmlPath);
      })
      .then(() => {
        if (options.skipCordovaBuild) {
          return;
        }

        return cordovaTarget.build();
      })
      .then(() => runHook('afterBuild', options, hookOptions))
      .then(() => lintIndex(indexHtmlPath))
      .then(() => {
        logger.success('corber project built');
      })
      .catch((e) => {
        logger.error(e);
        throw e;
      })
      .finally(() => {
        let validation = cordovaTarget.signingIdentityValidation;
        if (validation && validation.failed) {
          logger.warn('No signing identity has been configured for your'
            + ' xcode project. If you have received an "ARCHIVE FAILED"'
            + ' message with error code 65, you will need to run'
            + ' "corber open ios" and set your development team'
            + ' (for automatic signing), or set your'
            + ` ${validation.buildConfigName} provisioning profile`
            + ' (for manual signing).');
        }
      });
  }
});
