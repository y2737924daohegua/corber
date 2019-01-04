const td          = require('testdouble');
const path        = require('path');
const expect      = require('../../../../helpers/expect');
const Promise     = require('rsvp').Promise;
const contains    = td.matchers.contains;

const appPath     = 'appPath';
const appName     = 'appName';
const openCommand = 'open';
const project     = { root: appPath };
const cordovaPath = path.join(appPath, 'corber', 'cordova');

const xcworkspacePath = path.join(
  cordovaPath,
  'platforms',
  'ios',
  `${appName}.xcworkspace`
);

const xcodeprojPath = path.join(
  cordovaPath,
  'platforms',
  'ios',
  `${appName}.xcodeproj`
);

describe('Cordova Open App Task', () => {
  let openAppTask;
  let fsUtils;
  let spawn;

  beforeEach(() => {
    let getCordovaPath = td.replace('../../../../../lib/targets/cordova/utils/get-path');
    td.when(getCordovaPath(project)).thenReturn(cordovaPath);

    fsUtils = td.replace('../../../../../lib/utils/fs-utils');
    td.when(fsUtils.existsSync(xcworkspacePath)).thenReturn(true);

    let getConfig = td.replace('../../../../../lib/targets/cordova/utils/get-config');
    td.when(getConfig(project))
      .thenReturn(Promise.resolve({ widget: { name: [appName] } }));

    let getOpenCommand = td.replace('../../../../../lib/utils/open-app-command');
    td.when(getOpenCommand(xcworkspacePath, {})).thenReturn(openCommand);

    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(openCommand, [], { shell: true }, contains({ cwd: appPath })))
      .thenReturn(Promise.resolve({ code: 0 }));

    let OpenAppTask = require('../../../../../lib/targets/cordova/tasks/open-app');
    openAppTask = new OpenAppTask({
      application: {},
      platform: 'ios',
      project
    });
  });

  afterEach(() => {
    td.reset();
  });

  describe('run', () => {
    it('calls spawn with correct arguments', () => {
      td.config({ ignoreWarnings: true });

      td.when(spawn(), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve({ code: 0 }));

      return openAppTask.run().then(() => {
        td.verify(spawn(openCommand, [], { shell: true }, contains({ cwd: appPath })));

        td.config({ ignoreWarnings: false });
      });
    });

    it('resolves on success', () => {
      return expect(openAppTask.run()).to.be.fulfilled;
    });

    it('rejects with error if spawn exits with failure code', () => {
      td.when(spawn(openCommand, [], { shell: true }, contains({ cwd: appPath })))
        .thenReturn(Promise.resolve({ code: -1 }));

      return expect(openAppTask.run()).to.eventually.be.rejectedWith(
        /error code -1/
      );
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
