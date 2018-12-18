const td           = require('testdouble');
const expect       = require('../../../../helpers/expect');
const Device       = require('../../../../../lib/objects/device');
const Promise      = require('rsvp').Promise;

const emulatorPath = 'emulatorPath';
const spawnArgs    = [emulatorPath, ['-list-avds']];
const emulatorList = 'Nexus_5X_API_27\nPixel_2_API_27';

describe('Android List Emulators', () => {
  let listEmulators;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ emulator: emulatorPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: emulatorList }));

    listEmulators = require('../../../../../lib/targets/android/tasks/list-emulators');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ stdout: '' }));

    return listEmulators().then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('parses emulator -list-avds to Emulator objects', () => {
    return expect(listEmulators()).to.eventually.deep.equal([
      new Device({
        name: 'Pixel_2_API_27',
        platform: 'android',
        deviceType: 'emulator'
      }),
      new Device({
        name: 'Nexus_5X_API_27',
        platform: 'android',
        deviceType: 'emulator'
      })
    ]);
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));
    return expect(listEmulators()).to.eventually.be.rejectedWith('spawn error');
  });
});
