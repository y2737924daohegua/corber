const td         = require('testdouble');
const expect     = require('../../../../helpers/expect');
const Promise    = require('rsvp').Promise;

const deviceId   = 'deviceId';
const bundlePath = 'bundlePath';
const rootPath   = 'rootPath';

const spawnArgs = [
  'rootPath/node_modules/corber/node_modules/ios-deploy/build/Release/ios-deploy',
  [
    '--id',
    deviceId,
    '--bundle',
    bundlePath,
    '--justlaunch'
  ]
];

describe('IOS Install App Device', function() {
  let installApp;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    installApp = require('../../../../../lib/targets/ios/tasks/install-app-device');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return installApp(deviceId, bundlePath, rootPath).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns task and resolves with exit code', () => {
    return expect(installApp(deviceId, bundlePath, rootPath))
      .to.eventually.deep.equal({ code: 0 });
  });
});

