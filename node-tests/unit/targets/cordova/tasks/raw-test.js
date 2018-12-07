const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const cordovaPath     = require('../../../../../lib/targets/cordova/utils/get-path');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const RSVP            = require('rsvp');
const path            = require('path');
const Promise         = RSVP.Promise;

const cdvScriptPath = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'bin',
  'cordova-lib-runner'
);

describe('Cordova Raw Task', () => {
  let rawTask;
  let spawn;
  let onStdout;
  let onStderr;
  let chdir;

  beforeEach(() => {
    // temporary fix to allow promise-valued doubles; see:
    // https://github.com/testdouble/testdouble.js/issues/390
    td.config({ ignoreWarnings: true });

    onStdout = td.function();
    onStderr = td.function();

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(cdvScriptPath, ['["build"]'], { onStdout, onStderr }))
      .thenReturn(Promise.resolve());

    chdir = td.replace(process, 'chdir');

    let RawTask = require('../../../../../lib/targets/cordova/tasks/raw');
    rawTask = new RawTask({
      api: 'build',
      project: mockProject.project,
      onStdout,
      onStderr
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('spawns the raw cordova runner script with arguments', () => {
    return rawTask.run().then(() => {
      td.verify(spawn(cdvScriptPath, ['["build"]'], { onStdout, onStderr }));
    });
  });

  it('changes to cordova dir and back', () => {
    let processPath = process.cwd();
    let cdvPath = cordovaPath(mockProject.project);
    let deferred = RSVP.defer();

    // stub with a deferred promise we can resolve manually
    td.when(spawn(cdvScriptPath, ['["build"]'], { onStdout, onStderr }))
      .thenReturn(deferred.promise);

    let taskPromise = rawTask.run().then(() => {
      // this will be verified when spawn is complete
      td.verify(chdir(processPath));
    });

    // this should be the case until we manually resolve
    td.verify(chdir(cdvPath));

    deferred.resolve();

    return taskPromise;
  });

  describe('when the spawn fails', () => {
    beforeEach(() => {
      td.when(spawn(cdvScriptPath, ['["build"]'], { onStdout, onStderr }))
        .thenReturn(Promise.reject(new Error('fail')));
    });

    it('rejects run() with the failure', () => {
      return expect(rawTask.run()).to.eventually.be.rejectedWith(/fail/);
    });

    it('still returns to the process dir', () => {
      let processPath = process.cwd();
      return rawTask.run().catch(() => {
        td.verify(chdir(processPath));
      });
    });
  });
});
