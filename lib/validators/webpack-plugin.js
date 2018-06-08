const Task             = require('../tasks/-task');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const find             = require('lodash').find;

module.exports = Task.extend({
  framework: undefined,
  configPath: undefined,

  relativeConfigPath(framework) {
    if (framework === 'vue') {
      return 'vue.config.js';
    } else {
      return 'config/webpack.config.dev.js';
    }
  },

  getConfig() {
    return require(this.configPath);
  },

  warnMsg() {
    let relativeConfigPath = this.relativeConfigPath(this.framework);

    return logger.warn(chalk.yellow(`
      Could not find corber-webpack-plugin in ${relativeConfigPath}.
      This means the cordova.js & plugins will not be available in livereload.

      Ensure corber-webpack-plugin has been installed with:
        yarn add corber-webpack-plugin --dev
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

    let config = this.getConfig();

    if (this.framework === 'vue') {
      if (config.configureWebpack === undefined ||
        !(config.configureWebpack.plugins instanceof Array) ||
        !this.includesWebpack(config.configureWebpack.plugins))  {

        this.warnMsg();
      }
    } else {
      if (!(config.plugins instanceof Array) ||
        !this.includesWebpack(config.plugins))  {

        this.warnMsg();
      }
    }

    return Promise.resolve();
  }
});
