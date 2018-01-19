const td              = require('testdouble');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android Kill Emulator', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb kill', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let killEmulator = require('../../../../../lib/targets/android/tasks/kill-emulator');

    killEmulator('emulator-fake');

    td.verify(spawnDouble(
      adbPath,
      [
        '-s',
        'emulator-fake',
        'emu',
        'kill'
      ]
    ));
  });
});
