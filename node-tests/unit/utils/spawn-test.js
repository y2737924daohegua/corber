const td     = require('testdouble');
const expect = require('../../helpers/expect');
const path   = require('path');

describe('Spawn', () => {
  let spawn;
  let onStdout;
  let onStderr;
  let mockProcess;
  let chdir;
  let childProcess;

  beforeEach(() => {
    onStdout = td.function();
    onStderr = td.function();

    mockProcess = {
      on: td.function(),
      stdout: td.object(['on']),
      stderr: td.object(['on'])
    };

    chdir = td.replace(process, 'chdir');

    childProcess = td.replace('child_process');
    td.when(childProcess.spawn('ls', ['-l'], {})).thenReturn(mockProcess);

    td.when(childProcess.fork('script.js', ['-foo'], {
      silent: true
    })).thenReturn(mockProcess);

    spawn = require('../../../lib/utils/spawn');
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves on successful exit', () => {
    let promise = spawn('ls', ['-l']);

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate successful exit
    captor.value(0);

    return expect(promise).to.eventually.be.fulfilled;
  });

  it('resolves on exit with non-fatal error code', () => {
    let promise = spawn('ls', ['-l']);

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate non-fatal error code
    captor.value(-1);

    return expect(promise).to.eventually.be.fulfilled;
  });

  it('rejects on exit with error code 127', () => {
    let promise = spawn('ls', ['-l']);

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate "command not found" error code
    captor.value(127);

    return expect(promise).to.eventually.be.rejectedWith(/'ls' not found/);
  });

  it('returns stdout buffer', () => {
    let promise = spawn('ls', ['-l'], {}, { onStdout, onStderr });

    let stdoutCaptor = td.matchers.captor();
    td.verify(mockProcess.stdout.on('data', stdoutCaptor.capture()));

    // simulate stdout data
    stdoutCaptor.value('hello');
    stdoutCaptor.value('world');

    // exit process
    let exitCaptor = td.matchers.captor();
    td.verify(mockProcess.on('exit', exitCaptor.capture()));
    exitCaptor.value(0);

    return promise.then(({ stdout }) => {
      expect(stdout).to.equal('hello\nworld');
    });
  });

  it('returns stderr buffer', () => {
    let promise = spawn('ls', ['-l'], {}, { onStdout, onStderr });

    let stderrCaptor = td.matchers.captor();
    td.verify(mockProcess.stderr.on('data', stderrCaptor.capture()));

    // simulate stdout data
    stderrCaptor.value('hello');
    stderrCaptor.value('world');

    // exit process
    let exitCaptor = td.matchers.captor();
    td.verify(mockProcess.on('exit', exitCaptor.capture()));
    exitCaptor.value(0);

    return promise.then(({ stderr }) => {
      expect(stderr).to.equal('hello\nworld');
    });
  });

  it('returns exit code', () => {
    let promise = spawn('ls', ['-l'], {}, { onStdout, onStderr });

    let exitCaptor = td.matchers.captor();
    td.verify(mockProcess.on('exit', exitCaptor.capture()));
    exitCaptor.value(-1);

    return promise.then(({ code }) => {
      expect(code).to.equal(-1);
    });
  });

  it('pipes output from stdout to supplied handler', () => {
    spawn('ls', ['-l'], {}, { onStdout, onStderr });

    let captor = td.matchers.captor();
    td.verify(mockProcess.stdout.on('data', captor.capture()));

    // simulate stdout data
    captor.value('message');
    td.verify(onStdout('message'));
  });

  it('pipes output from stderr to supplied handler', () => {
    spawn('ls', ['-l'], {}, { onStdout, onStderr });

    let captor = td.matchers.captor();
    td.verify(mockProcess.stderr.on('data', captor.capture()));

    // simulate stderr data
    captor.value('error');
    td.verify(onStderr('error'));
  });

  it('changes to specified working directory', () => {
    let workingPath = path.join('/', 'app', 'tmp');

    spawn('ls', ['-l'], {}, {
      onStdout,
      onStderr,
      cwd: workingPath
    });

    // this should be the case until we manually resolve
    td.verify(chdir(workingPath));
  });

  it('changes back to original dir on success', () => {
    let appPath = path.join('/', 'app');
    let workingPath = path.join('/', 'tmp');

    td.replace(process, 'cwd', td.function());
    td.when(process.cwd()).thenReturn(appPath);

    let promise = spawn('ls', ['-l'], {}, {
      onStdout,
      onStderr,
      cwd: workingPath
    });

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate successful exit
    captor.value(0);

    return promise.then(() => {
      td.verify(chdir(appPath));
    });
  }),

  it('changes back to original dir on failure', () => {
    let appPath = path.join('/', 'app');
    let workingPath = path.join('/', 'tmp');

    td.replace(process, 'cwd', td.function());
    td.when(process.cwd()).thenReturn(appPath);

    let promise = spawn('ls', ['-l'], {}, {
      onStdout,
      onStderr,
      cwd: workingPath,
    });

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate failure
    captor.value(-1);

    return promise.catch(() => {
      td.verify(chdir(appPath));
    });
  }),

  it('uses childProcess.fork with `silent: true` if fork bool is set', () => {
    td.config({ ignoreWarnings: true });

    td.when(childProcess.spawn(), { ignoreExtraArgs: true })
      .thenReturn(mockProcess);

    let promise = spawn('script.js', ['-foo'], {}, { fork: true });

    let captor = td.matchers.captor();
    td.verify(mockProcess.on('exit', captor.capture()));

    // simulate exit
    captor.value(0);

    return promise.then(() => {
      td.verify(childProcess.fork('script.js', ['-foo'], { silent: true }));
      td.config({ ignoreWarnings: false });
    });
  });
});
