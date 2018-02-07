const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const adbPath         = path.join(sdkPath, 'platform-tools', 'adb');

describe('Android Eulator State', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns adb shell', function() {
    let spawnProps = {};

    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      console.log('spawning');
      spawnProps.cmd = cmd;
      spawnProps.args = args;
      return Promise.resolve('1');
    });

    let emState = require('../../../../../lib/targets/android/tasks/get-emulator-state');

    return emState().then(function() {
      expect(spawnProps.cmd).to.equal(adbPath);
      expect(spawnProps.args).to.deep.equal([
        'shell',
        'getprop',
        'sys.boot_completed'
      ]);
    });
  });
});
