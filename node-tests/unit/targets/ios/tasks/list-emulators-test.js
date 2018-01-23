const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');
const IOSEmulator     = require('../../../../../lib/objects/emulator/ios');

describe('iOS List Emulator Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('lints out emulators, ignoring non iOS devices', function() {
    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      let emList = `== Devices ==
        -- iOS 8.4 --
            iPhone 4s (uuid) (Shutdown)
            iPhone 5 (uuid) (Shutdown)
        -- iOS 9.1 --
            iPhone 4s (uuid) (Shutdown)
            iPhone 5 (uuid) (Shutdown)
        -- iOS 11.1 --
            iPhone X (3B388D0A-01F2-4E68-B86B-55FDB6F96B37) (Shutdown)
            iPad Pro (10.5-inch) (uuid) (Shutdown)
        -- tvOS 11.1 --
            Apple TV (uuid) (Shutdown)
            Apple TV 4K (uuid) (Shutdown)
            Apple TV 4K (at 1080p) (uuid) (Shutdown)
        -- watchOS 4.1 --\n
            Apple Watch - 38mm (uuid) (Shutdown)`;

      return Promise.resolve(emList);
    });

    let list = require('../../../../../lib/targets/ios/tasks/list-emulators');

    return list().then(function(found) {
      expect(found).to.deep.equal([new IOSEmulator({
        apiVersion: '11.1',
        name: 'iPad Pro',
        uuid: 'uuid',
        platform: 'ios',
        state: 'Shutdown'
      }), new IOSEmulator({
        apiVersion: '11.1',
        name: 'iPhone X',
        uuid: '3B388D0A-01F2-4E68-B86B-55FDB6F96B37',
        platform: 'ios',
        state: 'Shutdown'
      }), new IOSEmulator({
        apiVersion: '9.1',
        name: 'iPhone 5',
        uuid: 'uuid',
        platform: 'ios',
        state: 'Shutdown'
      }), new IOSEmulator({
        apiVersion: '9.1',
        name: 'iPhone 4s',
        uuid: 'uuid',
        platform: 'ios',
        state: 'Shutdown'
      }), new IOSEmulator({
        apiVersion: '8.4',
        name: 'iPhone 5',
        uuid: 'uuid',
        platform: 'ios',
        state: 'Shutdown'
      }), new IOSEmulator({
        apiVersion: '8.4',
        name: 'iPhone 4s',
        uuid: 'uuid',
        platform: 'ios',
        state: 'Shutdown'
      })]);
    });
  });
});
