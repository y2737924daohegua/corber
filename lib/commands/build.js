const Command          = require('./-command');
const Hook             = require('../tasks/run-hook');
const LintIndex        = require('../tasks/lint-index');
const AddCordovaJS     = require('../tasks/add-cordova-js');
const logger           = require('../utils/logger');
const requireTarget    = require('../utils/require-target');
const requireFramework = require('../utils/require-framework');
const path             = require('path');

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

    let lint = new LintIndex({
      source: 'www/index.html',
      project: this.project
    });

    let addCordovaJS = new AddCordovaJS({
      source: path.join(options.cordovaOutputPath, 'index.html')
    });

    let framework = requireFramework(this.project);
    let cordovaTarget = requireTarget(this.project, options);

    logger.info('corber: Building app');

    return hook.run('beforeBuild', options)
      .then(() => framework.validateBuild(options))
      .then(() => cordovaTarget.validateBuild(options.skipCordovaBuild))
      .then(() => {
        if (options.skipFrameworkBuild !== true) {
          return framework.build(options).then(() => addCordovaJS.run());
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
      })
      .catch(function(e) {
        logger.error(e);
      });
  }
});
