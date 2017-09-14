const Framework        = require('../framework');
const Build            = require('../../tasks/bash-build');
const Serve            = require('../../tasks/bash-serve');
const path             = require('path');
const runValidators    = require('../../utils/run-validators');
const ValidateHomepage = require('./validators/homepage');
const ValidateWebpack  = require('../../validators/webpack-plugin');

module.exports = Framework.extend({
  name: 'react',
  buildCommand: 'npm run build',
  serveCommand: 'node scripts/start.js',
  buildPath: './build',
  port: 3000,
  root: undefined,

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

    validations.push(
      new ValidateWebpack({
        configPath: path.join(this.root, 'config', 'webpack.config.dev.js'),
        framework: 'react'
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
