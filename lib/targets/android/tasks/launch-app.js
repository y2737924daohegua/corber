const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');
const RSVP            = require('rsvp');

module.exports = function(packageName) {
  let defer = RSVP.defer();
  let adbPath = sdkPaths().adb;


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

