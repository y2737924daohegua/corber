const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;
const AndroidEm       = require('../../../../../lib/objects/emulator');

const emList          = 'Nexus_5X_API_27\nPixel_2_API_27';

const path            = require('path');
const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const emPath          = path.join(sdkPath, 'tools', 'emulator');

describe('Android List Emulators', function() {
  afterEach(function() {
    td.reset();
  });

  it('spawns emulator', function() {
    let spawnProps = {};

    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      spawnProps.cmd = cmd;
      spawnProps.args = args;
      return Promise.resolve(emList);
    });

    let listEms = require('../../../../../lib/targets/android/tasks/list-emulators');

    return listEms().then(function() {
      expect(spawnProps.cmd).to.equal(emPath);
      expect(spawnProps.args).to.deep.equal(['emulator', '-list-avds']);
    });
  });

  it('parses emulator -list-avds to Emulator objects', function() {
    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      return Promise.resolve(emList);
    });

    let listEms = require('../../../../../lib/targets/android/tasks/list-emulators');

    return listEms().then(function(found) {
      expect(found).to.deep.equal([
        new AndroidEm({
          name: 'Pixel_2_API_27',
          platform: 'android'
        }),
        new AndroidEm({
          name: 'Nexus_5X_API_27',
          platform: 'android'
        })]);
    });
  });
});
