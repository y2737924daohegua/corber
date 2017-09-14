const Task             = require('../tasks/-task');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');

module.exports = Task.extend({
  configPath: undefined,
  framework: undefined,

  webpackConfigPath() {
    if (this.framework === 'vue') {
      return 'build/webpack.dev.conf';
    } else {
      return 'config/webpack.config.dev.js';
    }
  },

  warnMsg() {
    let webpackConfig = this.webpackConfigPath();

    return logger.warn(chalk.yellow(`
      Could not find corber-webpack-plugin in ${webpackConfig}.
      This means the cordova.js & plugins will not be available in livereload.

      To fix, run:
      yarn add corber-webpack-plugin --save-dev

      and then add the following to ${webpackConfig} plugins array
      "new CorberWebpackPlugin()"

      more: http://corber.io/pages/frameworks/${this.framework}`
    ));
  },

  run() {
    process.env.NODE_ENV = 'development';

    let plugins = require(this.configPath).plugins;
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];
      if (plugin.constructor.name === 'CorberWebpackPlugin') {
        return Promise.resolve();
      }
    }

    this.warnMsg();
    return Promise.resolve();
  }
});
