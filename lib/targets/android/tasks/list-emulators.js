const Emulator        = require('../../../objects/emulator');
const spawn           = require('../../../utils/spawn');
const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const emulatorPath    = path.join(sdkPath, 'tools', 'emulator');

module.exports = function() {
  let list = [
    emulatorPath,
    ['emulator', '-list-avds']
  ];

  return spawn.apply(null, list).then((found) => {
    let emulators = [];

    let listedEmulators = found.split('\n');
    listedEmulators.forEach((emulator, i) => {
      if (emulator && emulator !== '') {
        emulators.push(new Emulator({
          name: emulator,
          platform: 'android'
        }));
      }
    });

    return emulators.reverse();
  });
};
