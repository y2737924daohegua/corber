const Device          = require('../../../objects/device');
const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function() {
  let emulatorPath = sdkPaths().emulator;

  let list = [
    emulatorPath,
    ['-list-avds']
  ];

  return spawn(...list).then((result) => {
    let emulators = [];

    let listedEmulators = result.stdout.split('\n');
    listedEmulators.forEach((emulator, i) => {
      if (emulator && emulator !== '') {
        emulators.push(new Device({
          name: emulator,
          deviceType: 'emulator',
          platform: 'android'
        }));
      }
    });

    return emulators.reverse();
  });
};
