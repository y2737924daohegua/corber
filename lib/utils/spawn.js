const RSVP             = require('rsvp');
const childProcess     = require('child_process');

module.exports = function(command, args = [], processOpts = {}, opts = {}) {
  let { onStderr, onStdout, cwd } = opts;
  let processPath;

  if (cwd) {
    processPath = process.cwd();
    process.chdir(cwd);
  }

  let deferred = RSVP.defer();
  let spawned = childProcess.spawn(command, args, processOpts);

  spawned.stdout.on('data', (data) => {
    if (onStdout) {
      onStdout(data.toString());
    }
  });

  spawned.stderr.on('data', (data) => {
    if (onStderr) {
      onStderr(data.toString());
    }
  });

  spawned.on('exit', function(code) {
    let handler = code ? deferred.reject : deferred.resolve;
    handler(code);
  });

  if (processPath) {
    deferred.promise.finally(() => {
      process.chdir(processPath);
    });
  }

  return deferred.promise;
};
