const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function(packageName) {
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

  return spawn(...launch);
};
