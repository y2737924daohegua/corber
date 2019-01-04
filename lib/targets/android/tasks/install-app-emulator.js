const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function(apkPath) {
  let adbPath = sdkPaths().adb;

  let install = [
    adbPath,
    ['-e', 'install', '-r', apkPath]
  ];

  return spawn(...install);
};
