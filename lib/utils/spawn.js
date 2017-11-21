const RSVP             = require('rsvp');
const childProcess     = require('child_process');

module.exports = function(command, args, options) {
  let deferred = RSVP.defer();
  let spawned = childProcess.spawn(command, args, options);
  let output = [];

  spawned.stderr.on('data', function(data) {
    deferred.reject(data.toString());
  });

  spawned.stdout.on('data', function(data) {
    output.push(data.toString());
  });

  spawned.on('close', function() {
    deferred.resolve(output.join('\n'));
  });

  return deferred.promise;
};
