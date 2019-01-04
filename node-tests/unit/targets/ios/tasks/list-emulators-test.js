const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Device          = require('../../../../../lib/objects/device');
const Promise         = require('rsvp').Promise;

const spawnArgs       = ['/usr/bin/xcrun', ['simctl', 'list', 'devices']];
const emulatorList    = `== Devices ==
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
  -- watchOS 4.1 --
      Apple Watch - 38mm (uuid) (Shutdown)`;

describe('iOS List Emulator Task', () => {
  let listEmulators;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: emulatorList }));

    listEmulators = require('../../../../../lib/targets/ios/tasks/list-emulators');
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

  it('lints out emulators, ignoring non-iOS devices', () => {
    return expect(listEmulators()).to.eventually.deep.equal([
      new Device({
        apiVersion: '11.1',
        name: 'iPad Pro',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      }), new Device({
        apiVersion: '11.1',
        name: 'iPhone X',
        uuid: '3B388D0A-01F2-4E68-B86B-55FDB6F96B37',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      }), new Device({
        apiVersion: '9.1',
        name: 'iPhone 5',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      }), new Device({
        apiVersion: '9.1',
        name: 'iPhone 4s',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      }), new Device({
        apiVersion: '8.4',
        name: 'iPhone 5',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      }), new Device({
        apiVersion: '8.4',
        name: 'iPhone 4s',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'emulator',
        state: 'Shutdown'
      })
    ]);
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));
    return expect(listEmulators()).to.eventually.be.rejectedWith('spawn error');
  });
});
