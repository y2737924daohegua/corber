const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;

const adbPath         = 'adbPath';
const deviceUUID      = 'uuid';
const apkPath         = 'apk-path';
const spawnArgs       = [adbPath, ['-s', deviceUUID, 'install', '-r', apkPath]];

describe('Android Install App - Device', () => {
  let installAppDevice;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    installAppDevice = require('../../../../../lib/targets/android/tasks/install-app-device');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ code: 0 }));

    return installAppDevice(deviceUUID, apkPath).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('resolves with object containing exit code from spawned process', () => {
    return expect(installAppDevice(deviceUUID, apkPath))
      .to.eventually.contain({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(installAppDevice(deviceUUID, apkPath))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
