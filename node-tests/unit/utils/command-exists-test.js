const td     = require('testdouble');
const expect = require('../../helpers/expect');

describe('Command Exists util', () => {
  let childProcess;
  let commandExists;
  let originalPlatform;

  beforeEach(() => {
    originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

    childProcess = td.replace('child_process');

    commandExists = require('../../../lib/utils/command-exists');
  });

  afterEach(() => {
    td.reset();

    Object.defineProperty(process, 'platform', originalPlatform);
  });

  it('uses command on osx', () => {
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    commandExists('foo');

    let cmd = 'command -v foo >/dev/null && { echo >&1 \'command found\'; }';
    td.verify(childProcess.execSync(cmd));
  });

  it('uses command on linux', () => {
    Object.defineProperty(process, 'platform', { value: 'linux' });

    commandExists('foo');

    let cmd = 'command -v foo >/dev/null && { echo >&1 \'command found\'; }';
    td.verify(childProcess.execSync(cmd));
  });

  it('uses where on windows', () => {
    Object.defineProperty(process, 'platform', { value: 'win32' });

    commandExists('foo');

    td.verify(childProcess.execSync('where foo'))
  });

  it('returns true when execSync returns true', () => {
    td.when(childProcess.execSync(), { ignoreExtraArgs: true })
      .thenReturn(true);

    expect(commandExists('foo')).to.be.true;
  });

  it('return false when execSync throws an exception', () => {
    td.when(childProcess.execSync(), { ignoreExtraArgs: true })
      .thenThrow(new Error('error'));

    expect(commandExists('foo')).to.be.false;
  });
});
