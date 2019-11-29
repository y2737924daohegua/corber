const chalk            = require('chalk');
const ECError          = require('./corber-error');

// supported log level must be sorted by verbosity
const SUPPORTED_LOG_LEVELS = ['verbose', 'info', 'success', 'warn', 'error'];

module.exports = {
  logLevel: 'info',

  verbose(message) {
    if (!this.shouldLog('verbose')) {
      return;
    }
    console.debug(message);
  },

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
    console.warn(chalk.yellow(message));
  },

  error(content) {
    let error = new ECError(content);
    console.error(chalk.red(error));
    return error;
  },

  stdoutVerbose(data) {
    if (!this.shouldLog('verbose')) {
      return;
    }
    process.stdout.write(data);
  },

  stdout(data) {
    if (!this.shouldLog('info')) {
      return;
    }
    process.stdout.write(data);
  },

  stderr(data) {
    process.stderr.write(data);
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
