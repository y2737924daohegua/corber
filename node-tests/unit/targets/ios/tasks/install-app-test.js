const td              = require('testdouble');

describe('IOS Install App', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns xcrun', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let installApp = require('../../../../../lib/targets/ios/tasks/install-app');

    installApp('emulatorId', 'ipa-path');

    td.verify(spawnDouble(
      '/usr/bin/xcrun',
      [
        'simctl',
        'install',
        'emulatorId',
        'ipa-path'
      ]
    ));
  });
});
