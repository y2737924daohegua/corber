const Task            = require('../../../tasks/-task');
const cordovaPath     = require('../utils/get-path');
const spawn           = require('../../../utils/spawn');
const logger          = require('../../../utils/logger');
const path            = require('path');

const runnerPath = path.resolve(
  __dirname, '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

module.exports = Task.extend({
  project: undefined,
  api: undefined,

  onStdout: (data) => logger.verbose(data),
  onStderr: (data) => logger.error(data),

  cordovaPromise(...rawArgs) {
    rawArgs.unshift(this.api);
    let serializedArgs = JSON.stringify(rawArgs);

    return spawn(runnerPath, [serializedArgs], {
      onStdout: this.onStdout,
      onStderr: this.onStderr
    });
  },

  run() {
    let processPath = process.cwd();

    //Much of cordova-lib has a hardcoded process.cwd()
    //This won't work for us
    process.chdir(cordovaPath(this.project));

    return this.cordovaPromise(...arguments).finally(() => {
      process.chdir(processPath);
    });
  }
});
