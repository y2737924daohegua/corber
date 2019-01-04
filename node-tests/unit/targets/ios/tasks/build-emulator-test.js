const td          = require('testdouble');
const expect      = require('../../../../helpers/expect');
const Promise     = require('rsvp').Promise;

const emulatorId  = 'emulatorId';
const derivedPath = 'derivedPath';
const scheme      = 'scheme';
const iosPath     = 'iosPath';

const spawnArgs = [
  '/usr/bin/xcodebuild',
  [
    '-workspace', `${iosPath}/${scheme}.xcworkspace`,
    '-configuration', 'Debug',
    '-scheme', scheme,
    '-destination', `id=${emulatorId}`,
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

    buildEmulator = require('../../../../../lib/targets/ios/tasks/build-emulator');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve());

    return buildEmulator(emulatorId, derivedPath, scheme, iosPath)
      .then(() => {
        td.verify(spawn(...spawnArgs));

        td.config({ ignoreWarnings: false });
      });
  });

  it('spawns xcodebuild and resolves with exit code', () => {
    return expect(buildEmulator(emulatorId, derivedPath, scheme, iosPath))
      .to.eventually.deep.equal({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(buildEmulator(emulatorId, derivedPath, scheme, iosPath))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
