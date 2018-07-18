const Framework        = require('../framework');
const Build            = require('../../tasks/bash-build');
const Serve            = require('../../tasks/bash-serve');
const runValidators    = require('../../utils/run-validators');
const getPackage       = require('../../utils/get-package');
const path             = require('path');

const ValidatePublicPath     = require('../../validators/root-url');
const ValidateWebpackPlugin  = require('../../validators/webpack-plugin');

module.exports = Framework.extend({
  name: 'vue',
  buildCommand: 'npm run build',
  serveCommand: 'npm run serve',
  buildPath: './dist',
  port: 8080,
  root: undefined,

  _getVersion() {
    let packagePath = path.join(this.root, 'package.json');
    let devDependencies = getPackage(packagePath).devDependencies;
    return devDependencies['webpack-dev-server'] !== undefined ? 2 : 3;
  },

  _getConfigPath() {
    switch (this._getVersion()) {
      case 2:
        return 'build/webpack.dev.conf';
      default:
        return 'vue.config.js';
    }
  },

  _buildValidators(env, options) {
    let configPath = this._getConfigPath();
    let config = require(path.join(this.root, configPath));

    let publicPath = new ValidatePublicPath({
      config: config,
      rootProps: ['baseUrl'],
      path: configPath,
      force: options.force,
      env: env
    }).run();

    return [publicPath];
  },

  validateBuild(options) {
    let validations = this._buildValidators('build', options);
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
    let validations = this._buildValidators('dev', options);

    validations.push(
      new ValidateWebpackPlugin({
        root: this.root,
        framework: 'vue',
        configPath: path.join(this.root, this._getConfigPath())
      }).run()
    );

    return runValidators(validations);
  },

  serve(options, serveOpts, platform) {
    let serve = new Serve({
      command: this.serveCommand,
      platform: platform
    });
    return serve.run();
  }
});
