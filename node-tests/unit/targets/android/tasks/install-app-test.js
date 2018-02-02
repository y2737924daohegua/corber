const td              = require('testdouble');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android Install App', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb kill', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let installApp = require('../../../../../lib/targets/android/tasks/install-app');

    installApp('apk-path');

    td.verify(spawnDouble(
      adbPath,
      [
        '-e',
        'install',
        '-r',
        'apk-path'
      ]
    ));
  });
});
