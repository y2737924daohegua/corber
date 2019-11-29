const td                = require('testdouble');
const expect            = require('../../../../helpers/expect');
const path              = require('path');
const RSVP              = require('rsvp');
const Promise           = RSVP.Promise;
const contains          = td.matchers.contains;

const appPath           = 'appPath';
const cordovaPath       = 'cordovaPath';

const cdvScriptPath     = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

const project = {
  root: appPath
};

const rawAPI            = 'build';
const rawArgs           = ['foo', 1, { foo: 'bar' }];
const serializedRawArgs = JSON.stringify([rawAPI, ...rawArgs]);
const spawnBaseArgs     = [cdvScriptPath, [serializedRawArgs], {}];
const cwdMatcher        = contains({ cwd: cordovaPath });

describe('Cordova Raw Task', () => {
  let rawTask;
  let spawn;
  let logger;

  beforeEach(() => {
    td.replace(process, 'cwd', td.function());
    td.when(process.cwd()).thenReturn(appPath);

    let getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnBaseArgs, cwdMatcher)).thenReturn(Promise.resolve());

    logger = td.replace('../../../../../lib/utils/logger');

    let RawTask = require('../../../../../lib/targets/cordova/tasks/raw');
    rawTask = new RawTask({
      api: 'build',
      project
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ stdout: '', stderr: '' }));

    return rawTask.run(...rawArgs).then(() => {
      td.verify(spawn(...spawnBaseArgs, cwdMatcher));

      td.config({ ignoreWarnings: false });
    });
  });

  it('resolves on success', () => {
    return expect(rawTask.run(...rawArgs)).to.eventually.be.fulfilled;
  });

  it('logs stdout to verbose', () => {
    let deferred = RSVP.defer();
    td.when(spawn(...spawnBaseArgs, cwdMatcher)).thenReturn(deferred.promise);

    rawTask.run(...rawArgs);

    let captor = td.matchers.captor();
    td.verify(spawn(...spawnBaseArgs, captor.capture()));

    // simulate standard output from wrapping cordova process
    captor.value.onStdout('foo');

    td.verify(logger.verbose('foo'), { times: 0 });
    td.verify(logger.info('foo'), { times: 0 });
    td.verify(logger.success('foo'), { times: 0 });
    td.verify(logger.warn('foo'), { times: 0 });
    td.verify(logger.error('foo'), { times: 0 });
    td.verify(logger.stdoutVerbose('foo'), { times: 1 });
    td.verify(logger.stdout('foo'), { times: 0 });
    td.verify(logger.stderr('foo'), { times: 0 });

    deferred.resolve();

    return deferred.promise;
  });

  it('logs stderr to error', () => {
    let deferred = RSVP.defer();
    td.when(spawn(...spawnBaseArgs, cwdMatcher)).thenReturn(deferred.promise);

    rawTask.run(...rawArgs);

    let captor = td.matchers.captor();
    td.verify(spawn(...spawnBaseArgs, captor.capture()));

    // simulate standard output from wrapping cordova process
    captor.value.onStderr('foo');

    td.verify(logger.verbose('foo'), { times: 0 });
    td.verify(logger.info('foo'), { times: 0 });
    td.verify(logger.success('foo'), { times: 0 });
    td.verify(logger.warn('foo'), { times: 0 });
    td.verify(logger.error('foo'), { times: 0 });
    td.verify(logger.stdoutVerbose('foo'), { times: 0 });
    td.verify(logger.stdout('foo'), { times: 0 });
    td.verify(logger.stderr('foo'), { times: 1 });

    deferred.resolve();

    return deferred.promise;
  });

  it('rejects run() with the error when spawn rejects', () => {
    td.when(spawn(...spawnBaseArgs, cwdMatcher))
      .thenReturn(Promise.reject(new Error('err')));

    return expect(rawTask.run(...rawArgs)).to.eventually.be.rejectedWith(/err/);
  });
});
