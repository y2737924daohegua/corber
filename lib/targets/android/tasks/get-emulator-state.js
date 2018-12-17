const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');
const RSVP            = require('rsvp');

module.exports = function() {
  let deferred = RSVP.defer();
  let adbPath = sdkPaths().adb;

  let emulatorState = [
    adbPath,
    [
      'shell',
      'getprop',
      'sys.boot_completed'
    ]
  ];

  spawn(...emulatorState).then(({ stdout, stderr }) => {
    stdout = stdout.trim();
    stderr = stderr.trim();

    //adb shell seems to always result in spawn.stderr
    if (stderr.length > 0) {
      deferred.resolve(stderr);
      return;
    }

    deferred.resolve(stdout);
  });

  return deferred.promise;
};
