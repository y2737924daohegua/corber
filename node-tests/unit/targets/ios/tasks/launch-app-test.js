const td              = require('testdouble');

describe('IOS Launch App', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns xcrun', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let launchApp = require('../../../../../lib/targets/ios/tasks/launch-app');

    launchApp('emulatorId', 'appName');

    td.verify(spawnDouble(
      '/usr/bin/xcrun',
      [
        'simctl',
        'launch',
        'emulatorId',
        'appName'
      ]
    ));
  });
});
