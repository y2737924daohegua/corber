const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');
const Device          = require('../../../../../lib/objects/device');

describe('Android List Device Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('lints out emulators, ignoring non iOS devices', function() {
    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      let deviceList = `List of Devices Attached \nuuid  device usb:337641472X product:jfltevl model:SGH_I337M device:jfltecan transport_id:1 \n`;
      return Promise.resolve(deviceList);
    });

    td.replace('../../../../../lib/targets/android/utils/sdk-paths', function() {
      return {
        adb: 'fakeAdb'
      }
    });

    let list = require('../../../../../lib/targets/android/tasks/list-devices');

    return list().then(function(found) {
      expect(found).to.deep.equal([new Device({
        name: 'SGH_I337M',
        uuid: 'uuid',
        platform: 'android',
        deviceType: 'device'
      })]);
    });
  });
});
