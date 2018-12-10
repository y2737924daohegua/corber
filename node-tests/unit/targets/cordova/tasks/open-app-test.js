const td              = require('testdouble');
const path            = require('path');
const BashTask        = require('../../../../../lib/tasks/bash');
const fsUtils         = require('../../../../../lib/utils/fs-utils');
const expect          = require('../../../../helpers/expect');
const openCommand     = require('../../../../../lib/utils/open-app-command');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const _merge          = require('lodash').merge;
const isObject        = td.matchers.isA(Object);

const setupOpenTask = () => {
  let OpenAppTask = require('../../../../../lib/targets/cordova/tasks/open-app');
  return new OpenAppTask(_merge(mockProject, { platform: 'ios' }));
};

describe('Cordova Open App Task', () => {
  let cdvPath;

  beforeEach(() => {
    cdvPath = path.resolve(
      __dirname, '../../../../',
      'fixtures',
      'corber-mock/corber/cordova'
    );
  });

  afterEach(() => {
    td.reset();
  });

  it('runs openApp with the path from getProjectPath', () => {
    let bashDouble = td.replace(BashTask.prototype, 'runCommand');

    let openApp = setupOpenTask();
    return openApp.run().then(() => {
      let expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcodeproj';
      let expectedCmd  = openCommand(expectedPath);
      td.verify(bashDouble(expectedCmd, isObject));
    });
  });


  context('getProjectPath', () => {
    it('ios returns xcworkspace if it exists', () => {
      td.replace(fsUtils, 'existsSync', () => {
        return true;
      });

      let openApp = setupOpenTask();
      return openApp.getProjectPath('ios', mockProject.project).then((projectPath) => {
        let expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcworkspace';
        expect(projectPath).to.equal(expectedPath);
      });
    });

    it('ios returns xcodeproj if workspace does not exist', () => {
      td.replace(fsUtils, 'existsSync', () => {
        return false;
      });

      let openApp = setupOpenTask();
      return openApp.getProjectPath('ios', mockProject.project).then((projectPath) => {
        let expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcodeproj';
        expect(projectPath).to.equal(expectedPath);
      });
    });

    it('rejects for android', () => {
      let openApp = setupOpenTask();
      openApp.platform = 'android';

      return expect(openApp.run()).to.eventually.be.rejectedWith(
        /is not supported for android/
      );
    });

    it('rejects if an invalid platform is specified', () => {
      let openApp = setupOpenTask();
      openApp.platform = 'invalidPlatform';

      return expect(openApp.run()).to.eventually.be.rejectedWith(
        /is not supported/
      );
    });
  });
});
