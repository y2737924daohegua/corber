const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function(deviceUUID, apkPath) {
  let adbPath = sdkPaths().adb;

  let install = [
    adbPath,
    ['-s', deviceUUID, 'install', '-r', apkPath]
  ];

  return spawn(...install);
};
