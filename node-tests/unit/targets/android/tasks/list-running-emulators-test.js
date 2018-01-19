const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;

const emList          = 'emulator-5554          device product:sdk_gphone_x86 model:Android_SDK_built_for_x86 device:generic_x86 transport_id:26';

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android List Running Emulators', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb', function() {
    let spawnProps = {};

    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      spawnProps.cmd = cmd;
      spawnProps.args = args;
      return Promise.resolve(emList);
    });

    let listRunning = require('../../../../../lib/targets/android/tasks/list-running-emulators');

    return listRunning().then(function() {
      expect(spawnProps.cmd).to.equal(adbPath);
      expect(spawnProps.args).to.deep.equal(['devices', '-l']);
    });
  });

  it('returns an array of active emulator ids', function() {
    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      return Promise.resolve(emList);
    });

    let listEms = require('../../../../../lib/targets/android/tasks/list-running-emulators');

    return listEms().then(function(found) {
      expect(found).to.deep.equal(['emulator-5554']);
    });
  });
});
