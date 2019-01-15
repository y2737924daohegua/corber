const td         = require('testdouble');
const expect     = require('../../../../helpers/expect');
const Promise    = require('rsvp').Promise;

const emulatorId = 'emulatorId';
const ipaPath    = 'ipa-path';

const spawnArgs = [
  '/usr/bin/xcrun',
  [
    'simctl',
    'install',
    emulatorId,
    ipaPath
  ]
];

describe('IOS Install App Emulator', function() {
  let installApp;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    installApp = require('../../../../../lib/targets/ios/tasks/install-app-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return installApp(emulatorId, ipaPath).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns scrun and resolves with exit code', () => {
    return expect(installApp(emulatorId, ipaPath))
      .to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(installApp(emulatorId, ipaPath))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
