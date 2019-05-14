const Framework        = require('../framework');
const Build            = require('../../tasks/bash-build');
const Serve            = require('../../tasks/bash-serve');
const runValidators    = require('../../utils/run-validators');
const getPackage       = require('../../utils/get-package');
const path             = require('path');
const fsUtils          = require('../../utils/fs-utils');
const InstallPackage   = require('../../tasks/install-package');

const ValidatePublicPath     = require('../../validators/root-url');
const ValidatePackage        = require('../../validators/livereload-package');


module.exports = Framework.extend({
  name: 'vue',
  buildCommand: 'npm run build',
  serveCommand: 'npm run serve',
  buildPath: './dist',
  port: 8080,
  root: undefined,
  config: undefined,

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

  _buildValidators(env, options) {
    let configPath = this._getConfigPath();
    let config = this._getConfig(path.join(this.root, configPath));

    let publicPath = new ValidatePublicPath({
      framework: 'vue',
      config: config,
      rootProps: ['publicPath'],
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
      new ValidatePackage({
        root: this.root,
        packageName: 'vue-cli-plugin-corber'
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
    let installPackage = new InstallPackage({
      rootPath: this.root
    });

    return installPackage.run('vue-cli-plugin-corber');
  }
});
