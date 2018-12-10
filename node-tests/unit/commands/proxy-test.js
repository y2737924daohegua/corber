'use strict';

const td            = require('testdouble');
const Promise       = require('rsvp').Promise;
const path          = require('path');

const mockProject   = require('../../fixtures/corber-mock/project');
const mockAnalytics = require('../../fixtures/corber-mock/analytics');
const expect        = require('../../helpers/expect');
const contains      = td.matchers.contains;

const appPath     = mockProject.project.root;
const cordovaPath = path.join(appPath, 'corber', 'cordova');

describe('Proxy Command', () => {
  let proxyCommand;
  let logger;

  let spawn;
  let onStdout;
  let onStderr;

  let VerifyInstall;

  beforeEach(() => {
    logger = td.replace('../../../lib/utils/logger', td.object(['warn', 'error', 'success']));

    let getCordovaPath = td.replace('../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(mockProject.project)).thenReturn(cordovaPath);

    VerifyInstall = td.replace('../../../lib/targets/cordova/validators/is-installed');
    td.when(VerifyInstall.prototype.run()).thenReturn(Promise.resolve());

    onStdout = td.function();
    onStderr = td.function();

    spawn = td.replace('../../../lib/utils/spawn');

    td.when(spawn('cordova build', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: cordovaPath
    })).thenReturn(Promise.resolve(0))

    let ProxyCommand = require('../../../lib/commands/proxy');

    proxyCommand = new ProxyCommand({
      project: mockProject.project,
      onStdout,
      onStderr
    });

    proxyCommand.analytics = mockAnalytics;
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves when proxy spawn exits successfully', () => {
    let promise = proxyCommand.validateAndRun(['build']);
    return expect(promise).to.eventually.equal(0);
  });

  it('rejects if install not verified', () => {
    td.when(VerifyInstall.prototype.run())
      .thenReturn(Promise.reject('install not verified'));

    return proxyCommand.validateAndRun(['build']).then(() => {
      td.verify(logger.error(contains('install not verified')));
    });
  });

  it('rejects with error code msg when proxy spawn exits in failure', () => {
    td.when(spawn('cordova build', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: cordovaPath
    })).thenReturn(Promise.reject(-1));

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
    td.when(spawn('cordova foo', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: cordovaPath
    })).thenReturn(Promise.reject(-1));

    return proxyCommand.validateAndRun(['foo']).then(() => {
      td.verify(logger.warn(contains('unknown Cordova command')));
    });
  });

  it('does not warn if known non-supported corber command is used', () => {
    td.when(spawn('cordova emulate', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: cordovaPath
    })).thenReturn(Promise.resolve(0))

    return proxyCommand.validateAndRun(['emulate']).then(() => {
      td.verify(logger.warn(contains('bypassed corber command')), { times: 0 });
      td.verify(logger.warn(contains('unknown Cordova command')), { times: 0 });
    });
  });
});
