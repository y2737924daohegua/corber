const Task            = require('../../../tasks/-task');
const cordovaPath     = require('../utils/get-path');
const fork            = require('../../../utils/fork');
const path            = require('path');
const chalk           = require('chalk');

const runnerPath = path.resolve(
  __dirname, '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

module.exports = Task.extend({
  project: undefined,
  api: undefined,

  onStdout: (output) => console.log(output),
  onStderr: (output) => console.log(chalk.red(output)),

  cordovaPromise(...args) {
    args.unshift(this.api);

    return fork(runnerPath, args, {
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
