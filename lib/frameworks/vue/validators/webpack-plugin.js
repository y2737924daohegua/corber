const Task             = require('../../../tasks/-task');
const logger           = require('../../../utils/logger');
const Promise          = require('rsvp').Promise;
const chalk            = require('chalk');

module.exports = Task.extend({
  configPath: undefined,

  warnMsg() {
    return logger.warn(chalk.yellow(`
      Could not find corber-webpack-plugin in build/webpack.dev.conf.
      This means the cordova.js & plugins will not be available in livereload.

      To fix, run:
      npm install corber-webpack-plugin --save-dev

      and then add the following to build/webpack.dev.conf plugins array
      "new CorberWebpackPlugin()"

      more: http://corber.io/pages/frameworks/vue`
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
