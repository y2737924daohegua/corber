'use strict';

const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;

const adbPath         = 'adbPath';
const spawnArgs       = [adbPath, ['shell', 'getprop', 'sys.boot_completed']];

describe('Android Emulator State', function() {
  let getEmulatorState;
  let spawn;

  beforeEach(function() {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({
        stdout: 'default',
        stderr: ''
      }));

    getEmulatorState = require('../../../../../lib/targets/android/tasks/get-emulator-state');
  });

  afterEach(function() {
    td.reset();
  });

  it('spawns adb shell and returns stdout', () => {
    return expect(getEmulatorState()).to.eventually.equal('default');
  });

  it('returns stderr instead if present', () => {
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: 'default', stderr: 'error' }));

    return expect(getEmulatorState()).to.eventually.equal('error');
  });

  it('trims the output', () => {
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: '  output  \n', stderr: '' }));

    return expect(getEmulatorState()).to.eventually.equal('output');
  })
});
