const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');
const RSVP            = require('rsvp');

module.exports = function() {
  let defer = RSVP.defer();
  let adbPath = sdkPaths().adb;

  let emulatorState = [
    adbPath,
    [
      'shell',
      'getprop',
      'sys.boot_completed'
    ]
  ];

  spawn.apply(null, emulatorState).then((emState) => {
    defer.resolve(emState.trim());
  }).catch((emState) => {
    //adb shell seems to always result in spawn.stderr
    defer.resolve(emState.trim());
  });

  return defer.promise;
};
