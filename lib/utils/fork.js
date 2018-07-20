const RSVP             = require('rsvp');
const childProcess     = require('child_process');

module.exports = function(cmdPath, args = [], options = {}) {
  let { onStderr, onStdout } = options;
  let deferred = RSVP.defer();

  // args can be values or objects; only safe thing to do is serialize together
  let serializedArgs = JSON.stringify(args);

  // must set `silent: true` to use `proc.stdout.on`
  let proc = childProcess.fork(cmdPath, [serializedArgs], {
    silent: true
  });

  proc.stdout.on('data', (data) => {
    if (onStdout) {
      onStdout(data.toString());
    }
  });

  proc.stderr.on('data', (data) => {
    if (onStderr) {
      onStderr(data.toString());
    }
  });

  proc.on('exit', (code) => {
    let handler = code ? deferred.reject : deferred.resolve;
    handler(code);
  });

  return deferred.promise;
};
