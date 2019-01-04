const td        = require('testdouble');
const expect    = require('../../../../helpers/expect');
const Promise   = require('rsvp').Promise;

const spawnArgs = [
  'open',
  ['/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app']
];

describe('IOS Open Emulator', function() {
  let openEmulator;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    openEmulator = require('../../../../../lib/targets/ios/tasks/open-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return openEmulator().then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns xcrun and resolves with exit code', () => {
    return expect(openEmulator())
      .to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(openEmulator())
      .to.eventually.be.rejectedWith('spawn error');
  });
});
