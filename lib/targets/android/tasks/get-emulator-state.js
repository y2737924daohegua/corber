const spawn           = require('../../../utils/spawn');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

const RSVP            = require('rsvp');

module.exports = function() {
  let defer = RSVP.defer();

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
