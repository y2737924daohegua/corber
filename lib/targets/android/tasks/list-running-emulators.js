const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function() {
  let adbPath = sdkPaths().adb;

  let devices = [
    adbPath,
    ['devices', '-l']
  ];

  return spawn(...devices).then((result) => {
    let devices = result.stdout.split('\n');
    let emulators = [];

    devices.forEach((deviceString) => {
      let deviceId = deviceString.split(' ')[0];

      //An emulator is booted when status goes from offline to device
      if (deviceId.indexOf('emulator') >= 0
          && deviceString.indexOf('device') >= 0) {
        emulators.push(deviceId);
      }
    });

    return emulators;
  });
};
