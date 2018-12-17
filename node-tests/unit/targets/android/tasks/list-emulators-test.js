'use strict';

const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Device          = require('../../../../../lib/objects/device');
const Promise         = require('rsvp').Promise;

const emulatorPath = 'emulatorPath';
const spawnArgs    = [emulatorPath, ['-list-avds']];
const emulatorList = 'Nexus_5X_API_27\nPixel_2_API_27';

describe('Android List Emulators', () => {
  let sdkPaths;
  let spawn;
  let listEmulators;

  beforeEach(() => {
    sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ emulator: emulatorPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: emulatorList }));

    listEmulators = require('../../../../../lib/targets/android/tasks/list-emulators');
  });

  afterEach(() => {
    td.reset();
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
});
