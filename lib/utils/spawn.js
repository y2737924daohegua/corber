const RSVP             = require('rsvp');
const childProcess     = require('child_process');

module.exports = function(command, args = [], options = {}) {
  let { onStderr, onStdout } = options;

  let deferred = RSVP.defer();
  let spawned = childProcess.spawn(command, args, options);

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

  return deferred.promise;
};
