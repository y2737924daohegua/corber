'use strict';

const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;

const adbPath         = 'adbPath';
const spawnArgs       = [adbPath, ['devices', '-l']];
const emulatorList    = 'emulator-5554          device product:sdk_gphone_x86 model:Android_SDK_built_for_x86 device:generic_x86 transport_id:26';

describe('Android List Running Emulators', () => {
  let sdkPaths;
  let spawn;
  let listRunningEmulators;

  beforeEach(() => {
    sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: emulatorList }));

    listRunningEmulators = require('../../../../../lib/targets/android/tasks/list-running-emulators');
  });

  afterEach(() => {
    td.reset();
  });

  it('returns an array of active emulator ids', () => {
    return expect(listRunningEmulators()).to.eventually.deep.equal([
      'emulator-5554'
    ]);
  });
});
