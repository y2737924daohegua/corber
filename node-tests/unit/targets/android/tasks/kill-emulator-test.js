const td              = require('testdouble');

describe('Android Kill Emulator', function() {
  beforeEach(function() {
    td.replace('../../../../../lib/targets/android/utils/sdk-paths', function() {
      return {
        adb: 'adbPath'
      }
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('spawns adb kill', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let killEmulator = require('../../../../../lib/targets/android/tasks/kill-emulator');

    killEmulator('emulator-fake');

    td.verify(spawnDouble(
      'adbPath',
      [
        '-s',
        'emulator-fake',
        'emu',
        'kill'
      ]
    ));
  });
});
