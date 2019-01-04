const td        = require('testdouble');
const Promise   = require('rsvp').Promise;
const expect    = require('../../../../helpers/expect');

const uuid      = 'uuid';
const spawnArgs = ['/usr/bin/xcrun', ['simctl', 'boot', uuid]];

describe('iOS Boot Emulator Task', () => {
  let bootEmulator;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    bootEmulator = require('../../../../../lib/targets/ios/tasks/boot-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('does not spawn boot if the emulator state is Booted', () => {
    return bootEmulator({ uuid, state: 'Booted' }).then(() => {
      td.verify(spawn(), { ignoreExtraArgs: true, times: 0 });
    });
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return bootEmulator({ uuid }).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns xcrun and resolves with exit code', () => {
    return expect(bootEmulator({ uuid })).to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(bootEmulator({ uuid }))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
