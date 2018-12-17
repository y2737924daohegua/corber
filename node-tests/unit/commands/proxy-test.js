const td            = require('testdouble');
const Promise       = require('rsvp').Promise;
const path          = require('path');
const expect        = require('../../helpers/expect');
const contains      = td.matchers.contains;

const cordovaPath   = path.join('appPath', 'corber', 'cordova');

describe('Proxy Command', () => {
  let proxyCommand;
  let logger;
  let spawn;
  let VerifyInstall;

  beforeEach(() => {
    let project = {
      root: 'appPath',
      isEmberCLIProject: td.function()
    };

    logger = td.object(['warn', 'error', 'success']);
    td.replace('../../../lib/utils/logger', logger);

    let getCordovaPath = td.replace('../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    VerifyInstall = td.replace('../../../lib/targets/cordova/validators/is-installed');
    td.when(VerifyInstall.prototype.run()).thenReturn(Promise.resolve());

    spawn = td.replace('../../../lib/utils/spawn');
    td.when(spawn('cordova build', [], { shell: true }, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve());

    let ProxyCommand = require('../../../lib/commands/proxy');
    proxyCommand = new ProxyCommand({
      project,
      analytics: td.object(['track', 'trackTiming', 'trackError'])
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves when proxy spawn exits successfully', () => {
    let promise = proxyCommand.validateAndRun(['build']);
    return expect(promise).to.eventually.be.fulfilled;
  });

  it('rejects if install not verified', () => {
    td.when(VerifyInstall.prototype.run())
      .thenReturn(Promise.reject('install not verified'));

    return proxyCommand.validateAndRun(['build']).then(() => {
      td.verify(logger.error(contains('install not verified')));
    });
  });

  it('rejects with error code msg when proxy spawn exits in failure', () => {
    td.when(spawn('cordova build', [], { shell: true }, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve({ code: -1 }));

    return proxyCommand.validateAndRun(['build']).then(() => {
      td.verify(logger.error(contains('\'cordova build\' failed with error code -1')));
    });
  });

  it('warns if a supported corber command is used', () => {
    return proxyCommand.validateAndRun(['build']).then(() => {
      td.verify(logger.warn(contains('bypassed corber command')));
    });
  });

  it('warns if cordova command is unknown', () => {
    td.when(spawn('cordova foo', [], { shell: true }, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve());

    return proxyCommand.validateAndRun(['foo']).then(() => {
      td.verify(logger.warn(contains('unknown Cordova command')));
    });
  });

  it('does not warn if known non-supported corber command is used', () => {
    td.when(spawn('cordova emulate', [], { shell: true }, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve())

    return proxyCommand.validateAndRun(['emulate']).then(() => {
      td.verify(logger.warn(contains('bypassed corber command')), { times: 0 });
      td.verify(logger.warn(contains('unknown Cordova command')), { times: 0 });
    });
  });
});
