const chalk            = require('chalk');
const ECError          = require('./corber-error');

// supported log level must be sorted by verbosity
const SUPPORTED_LOG_LEVELS = ['verbose', 'info', 'success', 'warn', 'error'];

module.exports = {
  logLevel: 'info',

  info(message) {
    if (!this.shouldLog('info')) {
      return;
    }
    console.log(message);
  },

  success(message) {
    if (!this.shouldLog('success')) {
      return;
    }
    console.log(chalk.green(message));
  },

  warn(content) {
    if (!this.shouldLog('warn')) {
      return;
    }
    let message = 'WARNING: corber \n';
    message += content;
    console.log(chalk.yellow(message));
  },

  error(content) {
    throw new ECError(content);
  },

  getLogLevel() {
    return this.logLevel;
  },

  setLogLevel(logLevel) {
    if (SUPPORTED_LOG_LEVELS.indexOf(logLevel) === -1) {
      this.error(
        'Log level must be one of `info`, `success`, `warn`, `error`. ' .
        logLevel + ' given.');
    }
    this.logLevel = logLevel;
  },

  shouldLog(logLevel) {
    let currentLogLevel = this.getLogLevel();
    let logLevels = SUPPORTED_LOG_LEVELS;
    return logLevels.indexOf(currentLogLevel) <= logLevels.indexOf(logLevel);
  }
};
