const Task             = require('../tasks/-task');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const find             = require('lodash').find;
const path             = require('path');

module.exports = Task.extend({
  root: undefined,
  framework: undefined,
  configPath: undefined,

  getRelativePath(absolutePath) {
    return absolutePath.replace(`${this.root}${path.sep}`, '');
  },

  getConfig() {
    return require(this.configPath);
  },

  warnMsg() {
    let relativeConfigPath = this.getRelativePath(this.configPath);

    return logger.warn(chalk.yellow(`
      Could not find corber-webpack-plugin in ${relativeConfigPath}.
      This means the cordova.js & plugins will not be available in livereload.

      Ensure corber-webpack-plugin has been installed with:
        yarn add corber-webpack-plugin --dev
      or
        npm install corber-webpack-plugin --save-dev
      and the ${relativeConfigPath} configureWebpack.plugins array contains
        new CorberWebpackPlugin()

      Read More: http://corber.io/pages/frameworks/${this.framework}`
    ));
  },

  includesWebpack(plugins) {
    let webpackPlugin = find(plugins, function(plugin) {
      if (plugin.constructor.name === 'CorberWebpackPlugin') {
        return true;
      }
    });

    return webpackPlugin !== undefined;
  },

  run() {
    process.env.NODE_ENV = 'development';

    let relativeConfigPath = this.getRelativePath(this.configPath)
    let config = this.getConfig();

    switch (relativeConfigPath) {
      case 'vue.config.js':
        if (config.configureWebpack === undefined ||
          !(config.configureWebpack.plugins instanceof Array) ||
          !this.includesWebpack(config.configureWebpack.plugins))  {

          this.warnMsg();
        }

        break;
      default:
        if (!(config.plugins instanceof Array) ||
          !this.includesWebpack(config.plugins))  {

          this.warnMsg();
        }
    }

    return Promise.resolve();
  }
});
