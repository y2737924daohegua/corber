const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');

describe('iOS Boot Emulator Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns xcrun', function() {
    let spawnDouble = td.replace('../../../../../lib/utils/spawn');
    let bootEm = require('../../../../../lib/targets/ios/tasks/boot-emulator');

    bootEm({uuid: 'id',});
    td.verify(spawnDouble(
      '/usr/bin/xcrun',
      ['simctl', 'boot', 'id']
    ));
  });

  it('does not spawn boot if the emulator state is Booted', function() {
    let invokes = [];

    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      invokes.push([...arguments]);
      return Promise.resolve();
    });

    let bootEm = require('../../../../../lib/targets/ios/tasks/boot-emulator');

    return bootEm({id: 'emulatorId', state: 'Booted'}, 'appName', 'builtPath').then(function() {
      expect(invokes.length).to.equal(0);
    });
  });
});
