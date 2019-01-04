const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;

const adbPath         = 'adbPath';
const spawnArgs       = [adbPath, ['shell', 'getprop', 'sys.boot_completed']];

describe('Android Emulator State', function() {
  let getEmulatorState;
  let spawn;

  beforeEach(function() {
    let sdkPaths = td.replace('../../../../../lib/targets/android/utils/sdk-paths');
    td.when(sdkPaths()).thenReturn({ adb: adbPath });

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({
        stdout: '  default  \n',
        stderr: ''
      }));

    getEmulatorState = require('../../../../../lib/targets/android/tasks/get-emulator-state');
  });

  afterEach(function() {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ stdout: '', stderr: '' }));

    return getEmulatorState().then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('spawns adb shell and returns trimmed stdout', () => {
    return expect(getEmulatorState()).to.eventually.equal('default');
  });

  it('returns trimmed stderr instead if present', () => {
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: 'foo', stderr: '  error  \n' }));

    return expect(getEmulatorState()).to.eventually.equal('error');
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));

    return expect(getEmulatorState())
      .to.eventually.be.rejectedWith('spawn error');
  });
});
