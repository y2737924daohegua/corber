const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const path            = require('path');
const RSVP            = require('rsvp');

const appPath = path.join('/', 'app');
const cordovaPath = path.join(appPath, 'corber', 'cordova');

const cdvScriptPath = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

const project = {
  root: appPath
};

describe('Cordova Raw Task', () => {
  let rawTask;
  let spawn;
  let onStdout;
  let onStderr;

  beforeEach(() => {
    td.replace(process, 'cwd', td.function());
    td.when(process.cwd()).thenReturn(appPath);

    let getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    onStdout = td.function();
    onStderr = td.function();

    spawn = td.replace('../../../../../lib/utils/spawn');

    // RawTask serializes passes its arguments as a single stringified argument
    td.when(spawn(cdvScriptPath, ['["build"]'], {}, {
      onStdout,
      onStderr,
      cwd: cordovaPath
    })).thenReturn(RSVP.Promise.resolve(0));

    let RawTask = require('../../../../../lib/targets/cordova/tasks/raw');
    rawTask = new RawTask({
      api: 'build',
      project,
      onStdout,
      onStderr
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('resolves on success with exit code 0', () => {
    expect(rawTask.run()).to.eventually.equal(0);
  });

  describe('when the spawn fails', () => {
    beforeEach(() => {
      td.when(spawn(cdvScriptPath, ['["build"]'], {}, {
        onStdout,
        onStderr,
        cwd: cordovaPath
      })).thenReturn(RSVP.Promise.reject(new Error('fail')));
    });

    it('rejects run() with the failure', () => {
      return expect(rawTask.run()).to.eventually.be.rejectedWith(/fail/);
    });
  });
});
