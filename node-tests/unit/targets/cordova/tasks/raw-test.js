'use strict';

const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const path            = require('path');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;
const contains        = td.matchers.contains;

const appPath         = 'appPath';
const cordovaPath     = path.join(appPath, 'corber', 'cordova');

const cdvScriptPath = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

const project = {
  root: appPath
};

const rawAPI = 'build';

describe('Cordova Raw Task', () => {
  let rawTask;
  let spawn;
  let serializedRawArgs;
  let logger;

  beforeEach(() => {
    td.replace(process, 'cwd', td.function());
    td.when(process.cwd()).thenReturn(appPath);

    let getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    spawn = td.replace('../../../../../lib/utils/spawn');

    // RawTask serializes passes its arguments as a single stringified argument
    serializedRawArgs = JSON.stringify([rawAPI]);
    td.when(spawn(cdvScriptPath, [serializedRawArgs], {}, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve());

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

  it('resolves on success', () => {
    return expect(rawTask.run()).to.eventually.be.fulfilled;
  });

  it('passes args to spawn as a single stringified argument', () => {
    let rawArgs = ['foo', 1, { foo: 'bar'}];
    serializedRawArgs = JSON.stringify([rawAPI, ...rawArgs]);

    td.when(spawn(cdvScriptPath, [serializedRawArgs], {}, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.resolve());

    return expect(rawTask.run(...rawArgs)).to.eventually.be.fulfilled;
  });

  it('logs stdout to verbose', () => {
    let deferred = RSVP.defer();

    td.when(spawn(cdvScriptPath, [serializedRawArgs], {}, contains({ cwd: cordovaPath })))
      .thenReturn(deferred.promise);

    rawTask.run();

    let captor = td.matchers.captor();
    td.verify(spawn(cdvScriptPath, [serializedRawArgs], {}, captor.capture()));
    let { onStdout } = captor.value;

    // simulate standard output from wrapping cordova process
    onStdout('foo');

    td.verify(logger.verbose('foo'), { times: 1 });
    td.verify(logger.info('foo'), { times: 0 });
    td.verify(logger.success('foo'), { times: 0 });
    td.verify(logger.warn('foo'), { times: 0 });
    td.verify(logger.error('foo'), { times: 0 });

    deferred.resolve();

    return deferred.promise;
  });

  it('logs stderr to error', () => {
    let deferred = RSVP.defer();

    td.when(spawn(cdvScriptPath, [serializedRawArgs], {}, contains({ cwd: cordovaPath })))
      .thenReturn(deferred.promise);

    rawTask.run();

    let captor = td.matchers.captor();
    td.verify(spawn(cdvScriptPath, [serializedRawArgs], {}, captor.capture()));
    let { onStderr } = captor.value;

    // simulate standard output from wrapping cordova process
    onStderr('foo');

    td.verify(logger.verbose('foo'), { times: 0 });
    td.verify(logger.info('foo'), { times: 0 });
    td.verify(logger.success('foo'), { times: 0 });
    td.verify(logger.warn('foo'), { times: 0 });
    td.verify(logger.error('foo'), { times: 1 });

    deferred.resolve();

    return deferred.promise;
  });

  it('rejects run() with the error when spawn rejects', () => {
    td.when(spawn(cdvScriptPath, [serializedRawArgs], {}, contains({ cwd: cordovaPath })))
      .thenReturn(Promise.reject(new Error('fail')));

    return expect(rawTask.run()).to.eventually.be.rejectedWith(/fail/);
  });
});
