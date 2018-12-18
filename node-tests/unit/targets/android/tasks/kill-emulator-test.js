const td           = require('testdouble');
const expect       = require('../../../../helpers/expect');
const Promise      = require('rsvp').Promise;

const adbPath      = 'adbPath';
const emulatorName = 'emulator-fake';
const spawnArgs    = [adbPath, ['-s', emulatorName, 'emu', 'kill']];

describe('Android Kill Emulator', () => {
  let killEmulator;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ code: 0 }));

    killEmulator = require('../../../../../lib/targets/android/tasks/kill-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ code: 0 }));

    return killEmulator(emulatorName).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns adb kill and resolves with exit code', () => {
    return expect(killEmulator(emulatorName))
      .to.eventually.deep.equal({ code: 0 })
  });

  it('rejects with same error message when spawned command rejects', () => {
    td.when(spawn(...spawnArgs)).thenReject('spawn error');

    return expect(killEmulator(emulatorName))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
