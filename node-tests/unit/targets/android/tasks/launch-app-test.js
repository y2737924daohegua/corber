const td              = require('testdouble');

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android LaunchApp', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb kill', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let launchApp = require('../../../../../lib/targets/android/tasks/launch-app');

    launchApp('io.corber.project');

    td.verify(spawnDouble(
      adbPath,
      [
        'shell',
        'monkey',
        '-p',
        'io.corber.project',
        '-c',
        'android.intent.category.LAUNCHER',
        1
      ]
    ));
  });
});
