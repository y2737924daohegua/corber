const spawn           = require('../../../utils/spawn');
const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

module.exports = function(emulatorId) {
  let kill = [
    adbPath,
    ['-s', emulatorId, 'emu', 'kill']
  ];

  return spawn.apply(null, kill);
};
