const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Device          = require('../../../../../lib/objects/device');
const Promise         = require('rsvp').Promise;

const spawnArgs       = ['/usr/bin/instruments', ['-s', 'devices']];

//yes - isleofcode.com is my actual device name
//(turn on the hotspot and be branding all conference long!)
const deviceList = `Known Devices
Alex’s MacBook Pro (2) [uuid]
isleofcode.com (12.1.2) [uuid]
Apple TV (12.1) [uuid] (Simulator)
iPhone X (12.1) [uuid] (Simulator)`

describe('iOS List Emulator Task', () => {
  let listDevices;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: deviceList }));

    listDevices = require('../../../../../lib/targets/ios/tasks/list-devices');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ stdout: '' }));

    return listDevices().then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('lints out ios device, ignoring emulators & non ios devices', () => {
    return expect(listDevices()).to.eventually.deep.equal([
      new Device({
        apiVersion: '12.1.2',
        name: 'isleofcode.com',
        uuid: 'uuid',
        platform: 'ios',
        deviceType: 'device'
      })
    ]);
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));
    return expect(listDevices()).to.eventually.be.rejectedWith('spawn error');
  });
});

