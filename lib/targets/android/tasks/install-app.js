const spawn           = require('../../../utils/spawn');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

module.exports = function(apkPath) {
  let install = [
    adbPath,
    ['-e', apkPath]
  ];

  return spawn.apply(null, install);
};
