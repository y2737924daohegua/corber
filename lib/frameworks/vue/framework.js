const Framework        = require('../framework');
const Build            = require('../../tasks/bash-build');
const Serve            = require('../../tasks/bash-serve');
const runValidators    = require('../../utils/run-validators');
const path             = require('path');

const ValidatePublicPath     = require('../../validators/root-url');
const ValidateWebpackPlugin  = require('./validators/webpack-plugin');

module.exports = Framework.extend({
  name: 'vue',
  buildCommand: 'npm run build',
  serveCommand: 'node build/dev-server.js',
  buildPath: './dist',
  port: 8080,
  root: undefined,

  _buildValidators(env, options) {
    let config = require(path.join(this.root, 'config', 'index.js'))[env];

    let publicPath = new ValidatePublicPath({
      config: config,
      rootProps: ['assetsPublicPath'],
      path: 'config/index.js',
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

    let configPath = path.join(this.root, 'build', 'webpack.dev.conf');
    validations.push(
      new ValidateWebpackPlugin({
        configPath: configPath
      }).run()
    );

    return runValidators(validations);
  },

  serve(options, serveOpts) {
    let serve = new Serve({
      command: this.serveCommand,
      platform: options.platform
    });
    return serve.run();
  }
});
