const spawn           = require('../../../utils/spawn');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

module.exports = function(packageName) {
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

  return spawn.apply(null, launch);
};

