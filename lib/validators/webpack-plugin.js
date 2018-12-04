const Task             = require('../tasks/-task');
const logger           = require('../utils/logger');
const Promise          = require('rsvp').Promise;
const find             = require('lodash').find;

module.exports = Task.extend({
  root: undefined,
  framework: undefined,
  config: undefined,
  configPath: undefined,

  warnMsg() {
    let message =
      `Could not find corber-webpack-plugin in ${this.configPath}. This means` +
      ' the cordova.js & plugins will not be available in livereload.\n\n' +
      'Ensure corber-webpack-plugin has been installed with:\n' +
      '\tyarn add corber-webpack-plugin --dev\n' +
      'or\n' +
      '\tnpm install corber-webpack-plugin --save-dev\n' +
      `and the ${this.configPath} configureWebpack.plugins array contains ` +
      'new CorberWebpackPlugin().\n\n' +
      `Read More: http://corber.io/pages/frameworks/${this.framework}`;

    logger.warn(message);
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
