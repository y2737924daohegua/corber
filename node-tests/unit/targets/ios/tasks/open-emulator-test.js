const td              = require('testdouble');

describe('IOS Open Emulator', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns xcrun', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let openEm = require('../../../../../lib/targets/ios/tasks/open-emulator');

    openEm();

    td.verify(spawnDouble(
      'open',
      ['/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app']
    ));
  });
});
