const Task             = require('../tasks/-task');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');
const find             = require('lodash').find;

module.exports = Task.extend({
  root: undefined,
  framework: undefined,
  config: undefined,
  configPath: undefined,

  warnMsg() {
    return logger.warn(chalk.yellow(`
      Could not find corber-webpack-plugin in ${this.configPath}.
      This means the cordova.js & plugins will not be available in livereload.

      Ensure corber-webpack-plugin has been installed with:
        yarn add corber-webpack-plugin --dev
      or
        npm install corber-webpack-plugin --save-dev
      and the ${this.configPath} configureWebpack.plugins array contains
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

    if (this.config === null) {
      this.warnMsg();
      return Promise.reject();
    }

    switch (this.configPath) {
      case 'vue.config.js':
        if (this.config.configureWebpack === undefined ||
          !(this.config.configureWebpack.plugins instanceof Array) ||
          !this.includesWebpack(this.config.configureWebpack.plugins))  {

          this.warnMsg();
        }

        break;
      default:
        if (!(this.config.plugins instanceof Array) ||
          !this.includesWebpack(this.config.plugins))  {

          this.warnMsg();
        }
    }

    return Promise.resolve();
  }
});
