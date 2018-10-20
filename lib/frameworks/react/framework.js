const Framework        = require('../framework');
const Build            = require('../../tasks/bash-build');
const Serve            = require('../../tasks/bash-serve');
const path             = require('path');
const runValidators    = require('../../utils/run-validators');
const fsUtils          = require('../../utils/fs-utils');
const ValidateHomepage = require('./validators/homepage');
const ValidateWebpack  = require('../../validators/webpack-plugin');
const InstallPackage   = require('../../tasks/install-package');

module.exports = Framework.extend({
  name: 'react',
  buildCommand: 'npm run build',
  serveCommand: 'node scripts/start.js',
  buildPath: './build',
  port: 3000,
  root: undefined,
  config: undefined,

  _getConfig(configPath) {
    if (this.config === undefined) {
      if (fsUtils.existsSync(configPath)) {
        this.config = require(configPath);
      } else {
        this.config = null;
      }
    }

    return this.config;
  },

  _buildValidators() {
    return [
      new ValidateHomepage({root: this.root}).run()
    ];
  },

  validateBuild(options) {
    let validations = this._buildValidators();
    return runValidators(validations);
  },

  build(options) {
    let build = new Build({
      buildCommand: this.buildCommand,
      buildPath: this.buildPath,
      cordovaOutputPath: options.cordovaOutputPath
    });

    return build.run();
  },

  validateServe(options) {
    let validations = this._buildValidators();
    let configPath = path.join('config', 'webpack.config.dev.js');
    let config = this._getConfig(path.join(this.root, configPath));

    validations.push(
      new ValidateWebpack({
        config: config,
        configPath: configPath,
        framework: 'react'
      }).run()
    );

    return runValidators(validations);
  },

  serve(options) {
    let serve = new Serve({
      command: this.serveCommand,
      platform: options.platform
    });
    return serve.run();
  },

  afterInstall() {
    let installPlugin = new InstallPackage({
      rootPath: this.root
    });

    return installPlugin.run('corber-webpack-plugin');
  }
});
