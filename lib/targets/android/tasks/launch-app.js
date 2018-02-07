const spawn           = require('../../../utils/spawn');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

const RSVP            = require('rsvp');

module.exports = function(packageName) {
  let defer = RSVP.defer();

  let launch = [
    adbPath,
    [
      'shell',
      'monkey',
      '-p',
      packageName,
      '-c',
      'android.intent.category.LAUNCHER',
      1
    ]
  ];

  spawn.apply(null, launch).then(() => {
    defer.resolve();
  }).catch((e) => {
    //adb shell seems to always result in spawn.stderr
    defer.resolve();
  });

  return defer.promise;
};

