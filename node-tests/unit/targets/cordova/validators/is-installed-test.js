const td     = require('testdouble');
const expect = require('../../../../helpers/expect');

describe('Verify Cordova Installed Task', () => {
  let commandExists;
  let isInstalled;

  beforeEach(() => {
    commandExists = td.replace('../../../../../lib/utils/command-exists');
    td.when(commandExists('cordova')).thenReturn(true);

    let IsInstalled = require('../../../../../lib/targets/cordova/validators/is-installed');

    isInstalled = new IsInstalled({
      command: 'foo',
      options: {}
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves when cordova command exists', () => {
    expect(isInstalled.run()).to.eventually.be.fulfilled;
  });

  describe('when cordova command does not exist', () => {
    beforeEach(() => {
      td.when(commandExists('cordova')).thenReturn(false);
    });

    it('rejects with message', () => {
      expect(isInstalled.run())
        .to.eventually.be.rejectedWith(/The command `cordova` was not found/);
    });

    it('resolves if cordova check is skipped', () => {
      isInstalled.options.skipCordovaCheck = true
      expect(isInstalled.run()).to.eventually.be.fulfilled;
    });
  })
});
