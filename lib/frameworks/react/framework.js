const Framework        = require('../framework');
const Build            = require('./tasks/build');
const Serve            = require('./tasks/serve');
const path             = require('path');
const runValidators    = require('../../utils/run-validators');
const ValidateHomepage = require('./validators/homepage');
const ValidateWebpack  = require('../vue/validators/webpack-plugin');

module.exports = Framework.extend({
  name: 'react',
  buildCommand: 'npm run build',
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
        configPath: path.join(this.root, 'config', 'webpack.config.dev.js')
      }).run()
    );

    return runValidators(validations);
  },

  serve(options, serveOpts) {
    let serve = new Serve();
    return serve.run(options.platform);
  }
});
