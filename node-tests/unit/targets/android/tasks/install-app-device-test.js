const td              = require('testdouble');

describe('Android Install App - Device', function() {
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

  it('spawns adb install', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let installApp = require('../../../../../lib/targets/android/tasks/install-app-device');

    installApp('uuid', 'apk-path');

    td.verify(spawnDouble(
      'adbPath',
      [
        '-s',
        'uuid',
        'install',
        'apk-path'
      ]
    ));
  });
});
