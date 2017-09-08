const chalk            = require('chalk');
const ECError          = require('./corber-error');

module.exports = {
  info(message) {
    console.log(message);
  },

  success(message) {
    console.log(chalk.green(message));
  },

  warn(content) {
    let message = 'WARNING: corber \n';
    message += content;
    console.log(chalk.yellow(message));
  },

  error(content) {
    throw new ECError(content);
  }
};
