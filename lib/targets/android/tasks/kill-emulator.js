const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function(emulatorId) {
  let adbPath = sdkPaths().adb;

  let kill = [
    adbPath,
    ['-s', emulatorId, 'emu', 'kill']
  ];

  return spawn(...kill);
};
