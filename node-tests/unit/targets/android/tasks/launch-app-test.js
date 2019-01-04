const td          = require('testdouble');
const expect      = require('../../../../helpers/expect');
const Promise     = require('rsvp').Promise;

const adbPath     = 'adbPath';
const packageName = 'io.corber.project';

const spawnArgs = [
  adbPath,
  [
    'shell',
    'monkey',
    '-p',
    packageName,
    '-c',
    'android.intent.category.LAUNCHER',
    1
  ]
];

describe('Android LaunchApp', () => {
  let launchApp;
  let spawn;

  beforeEach(() => {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ code: 0 }));

    launchApp = require('../../../../../lib/targets/android/tasks/launch-app');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ code: 0 }));

    return launchApp(packageName).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns adb monkey and resolves with obj containing exit code', () => {
    return expect(launchApp(packageName)).to.eventually.contain({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(launchApp(packageName))
      .to.eventually.be.rejectedWith('spawn error');
  });
});
