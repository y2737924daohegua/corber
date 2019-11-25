'use strict';

const td          = require('testdouble');
const expect      = require('../../helpers/expect');
const RSVP        = require('rsvp');
const Promise     = RSVP.Promise;
const contains    = td.matchers.contains;

const cwd         = 'tmp';
const bashCommand = 'ls -al';

describe('Bash Task', () => {
  let bashTask;
  let spawn;
  let logger;

  beforeEach(() => {
    spawn = td.replace('../../../lib/utils/spawn');
    td.when(spawn(bashCommand, [], { shell: true }, contains({ cwd })))
      .thenReturn(Promise.resolve({ code: 0 }));

    logger = td.replace('../../../lib/utils/logger');

    let BashTask = require('../../../lib/tasks/bash');
    bashTask = new BashTask({
      command: bashCommand,
      cwd
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    td.when(spawn(), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve({ code: 0 }));

    return bashTask.run().then(() => {
      td.verify(spawn(bashCommand, [], { shell: true }, contains({ cwd })));

      td.config({ ignoreWarnings: false });
    });
  });

  it('resolves with object containing exit code', () => {
    return expect(bashTask.run()).to.eventually.contain({ code: 0 });
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(bashCommand, [], { shell: true }, contains({ cwd })))
      .thenReturn(Promise.reject('fatal error'));

    return expect(bashTask.run()).to.eventually.rejectedWith('fatal error');
  });

  it('logs stdout to info', () => {
    let deferred = RSVP.defer();

    td.when(spawn(bashCommand, [], { shell: true }, contains({ cwd })))
      .thenReturn(deferred.promise);

    bashTask.run();

    let captor = td.matchers.captor();
    td.verify(spawn(bashCommand, [], { shell: true }, captor.capture()));
    let { onStdout } = captor.value;

    // simulate standard output from process
    onStdout('foo');

    td.verify(logger.verbose('foo'), { times: 0 });
    td.verify(logger.info('foo'), { times: 0 });
    td.verify(logger.success('foo'), { times: 0 });
    td.verify(logger.warn('foo'), { times: 0 });
    td.verify(logger.error('foo'), { times: 0 });
    td.verify(logger.stdoutVerbose('foo'), { times: 0 });
    td.verify(logger.stdout('foo'), { times: 1 });
    td.verify(logger.stderr('foo'), { times: 0 });

    deferred.resolve();

    return deferred.promise;
  });

  it('logs stderr to error', () => {
    let deferred = RSVP.defer();

    td.when(spawn(bashCommand, [], { shell: true }, contains({ cwd })))
      .thenReturn(deferred.promise);

    bashTask.run();

    let captor = td.matchers.captor();
    td.verify(spawn(bashCommand, [], { shell: true }, captor.capture()));
    let { onStderr } = captor.value;

    // simulate standard error from process
    onStderr('foo');

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
});
