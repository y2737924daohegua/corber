const td              = require('testdouble');
const path            = require('path');
const expect          = require('../../../../helpers/expect');
const RSVP            = require('rsvp');

const project = {
  root: 'app'
};

const cordovaPath = path.join('app', 'corber', 'cordova');

const xcworkspacePath = path.join(
  cordovaPath,
  'platforms',
  'ios',
  'app.xcworkspace'
);

const xcodeprojPath = path.join(
  cordovaPath,
  'platforms',
  'ios',
  'app.xcodeproj'
);

describe('Cordova Open App Task', () => {
  let openAppTask;
  let fsUtils;
  let spawn;
  let onStdout;
  let onStderr;

  beforeEach(() => {
    let getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    fsUtils = td.replace('../../../../../lib/utils/fs-utils');
    td.when(fsUtils.existsSync(xcworkspacePath)).thenReturn(true);

    let getConfig = td.replace('../../../../../lib/targets/cordova/utils/get-config');
    td.when(getConfig(project)).thenReturn(RSVP.Promise.resolve({
      widget: {
        name: ['app']
      }
    }));

    let getOpenCommand = td.replace('../../../../../lib/utils/open-app-command');
    td.when(getOpenCommand(xcworkspacePath, {})).thenReturn('open');

    onStdout = td.function();
    onStderr = td.function();

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn('open', [], { shell: true }, {
      onStdout,
      onStderr,
      cwd: 'app'
    })).thenReturn(RSVP.Promise.resolve(0));

    let OpenAppTask = require('../../../../../lib/targets/cordova/tasks/open-app');
    openAppTask = new OpenAppTask({
      application: {},
      platform: 'ios',
      project,
      onStderr,
      onStdout
    });
  });

  afterEach(() => {
    td.reset();
  });

  describe('run', () => {
    it('resolves with exit code 0 on success', () => {
      return expect(openAppTask.run()).to.eventually.equal(0);
    });

    it('rejects with error if spawn exists with failure code', () => {
      td.when(spawn('open', [], { shell: true }, {
        onStdout,
        onStderr,
        cwd: 'app'
      })).thenReturn(RSVP.Promise.reject(-1));

      return expect(openAppTask.run()).to.be.rejectedWith(/error code -1/);
    });
  });

  describe('getProjectFilePath', () => {
    it('ios returns xcworkspace if it exists', () => {
      return expect(openAppTask.getProjectFilePath('ios', project))
        .to.eventually.equal(xcworkspacePath);
    });

    it('ios returns xcodeproj if workspace does not exist', () => {
      td.when(fsUtils.existsSync(xcworkspacePath)).thenReturn(false);

      return expect(openAppTask.getProjectFilePath('ios', project))
        .to.eventually.equal(xcodeprojPath);
    });

    it('rejects if platform is android', () => {
      openAppTask.platform = 'android';

      return expect(openAppTask.run()).to.eventually.be.rejectedWith(
        /is not supported for android/
      );
    });

    it('rejects if an invalid platform is specified', () => {
      openAppTask.platform = 'invalidPlatform';

      return expect(openAppTask.run()).to.eventually.be.rejectedWith(
        /is not supported/
      );
    });
  });
});
