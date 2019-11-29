const Task            = require('../../../tasks/-task');
const getCordovaPath  = require('../utils/get-path');
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

  // hide all cordova-lib stdout unless `--verbose` flag is set explicitly
  onStdout: (data) => logger.stdoutVerbose(data),
  onStderr: (data) => logger.stderr(data),

  run(...args) {
    args.unshift(this.api);

    // in order to pass mixed-type arguments (including POJOs) safely, we
    // serialize all arguments to a single string argument
    let serializedArgs = JSON.stringify(args);

    return spawn(runnerPath, [serializedArgs], {}, {
      onStdout: this.onStdout,
      onStderr: this.onStderr,
      cwd: getCordovaPath(this.project),
      fork: true
    });
  }
});
