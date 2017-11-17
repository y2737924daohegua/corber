const RSVP             = require('rsvp');
const childProcess     = require('child_process');

module.exports = function(command, args, options) {
  let deferred = RSVP.defer();
  let spawned = childProcess.spawn(command, args, options);

  spawned.stderr.on('data', function(data) {
    deferred.reject(data.toString());
  });

  spawned.on('close', function() {
    deferred.resolve(spawned.stdout.toString());
  });

  return deferred.promise;
};
