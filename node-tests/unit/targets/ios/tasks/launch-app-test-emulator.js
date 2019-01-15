const td         = require('testdouble');
const expect     = require('../../../../helpers/expect');
const Promise    = require('rsvp').Promise;

const emulatorId = 'emulatorId';
const appName    = 'appName';

const spawnArgs = [
  '/usr/bin/xcrun',
  [
    'simctl',
    'launch',
    emulatorId,
    appName
  ]
];

describe('IOS Launch App Emulator', () => {
  let launchApp;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    launchApp = require('../../../../../lib/targets/ios/tasks/launch-app-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return launchApp(emulatorId, appName).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns xcrun and resolves with exit code', () => {
    return expect(launchApp(emulatorId, appName))
      .to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(launchApp(emulatorId, appName))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
