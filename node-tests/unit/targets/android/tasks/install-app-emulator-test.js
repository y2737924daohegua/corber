const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;

const adbPath         = 'adbPath';
const apkPath         = 'apkPath';
const spawnArgs       = [adbPath, ['-e', 'install', '-r', apkPath]];

describe('Android Install App', () => {
  let installAppEmulator;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    installAppEmulator = require('../../../../../lib/targets/android/tasks/install-app-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ code: 0 }));

    return installAppEmulator(apkPath).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns adb install and resolves with obj containing exit code', () => {
    return expect(installAppEmulator(apkPath))
      .to.eventually.contain({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(installAppEmulator(apkPath))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
