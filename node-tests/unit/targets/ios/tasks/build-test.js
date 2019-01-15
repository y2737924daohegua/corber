const td          = require('testdouble');
const expect      = require('../../../../helpers/expect');
const Promise     = require('rsvp').Promise;

const emuDevice   = {uuid: 'emulatorId', deviceType: 'emulator'};
const physDevice  = {uuid: 'deviceId', deviceType: 'device'};
const derivedPath = 'derivedPath';
const scheme      = 'scheme';
const iosPath     = 'iosPath';

const spawnArgs = [
  '/usr/bin/xcodebuild',
  [
    '-workspace', `${iosPath}/${scheme}.xcworkspace`,
    '-scheme', scheme,
    '-destination', `id=${emuDevice.uuid}`,
    '-configuration', 'Debug',
    '-derivedDataPath', derivedPath,
    'CODE_SIGN_REQUIRED=NO',
    'CODE_SIGN_IDENTITY='
  ],
  {
    cwd: iosPath
  }
];

describe('iOS Build Emulator Task', () => {
  let buildEmulator;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs)).thenReturn(Promise.resolve({ code: 0 }));

    buildEmulator = require('../../../../../lib/targets/ios/tasks/build');
  });

  afterEach(() => {
    td.reset();
  });

  it('when deviceType is emulator it builds with the correct args', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return buildEmulator(emuDevice, derivedPath, scheme, iosPath)
      .then(() => {
        td.verify(spawn(...spawnArgs));

        td.config({ ignoreWarnings: false });
      });
  });

  it('when deviceType is device it builds with the correct args', () => {
    td.config({ ignoreWarnings: true });

    let deviceSpawnArgs = [
      '/usr/bin/xcodebuild',
      [
        '-workspace', `${iosPath}/${scheme}.xcworkspace`,
        '-scheme', scheme,
        '-destination', `id=${physDevice.uuid}`,
      ],
      {
        cwd: iosPath
      }
    ];

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return buildEmulator(physDevice, derivedPath, scheme, iosPath)
      .then(() => {
        td.verify(spawn(...deviceSpawnArgs));

        td.config({ ignoreWarnings: false });
      });
  });

  it('spawns xcodebuild and resolves with exit code', () => {
    return expect(buildEmulator(emuDevice, derivedPath, scheme, iosPath))
      .to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(buildEmulator(emuDevice, derivedPath, scheme, iosPath))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
