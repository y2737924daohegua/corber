var td              = require('testdouble');
var path            = require('path');
var BashTask        = require('../../../../../lib/tasks/bash');
var fsUtils         = require('../../../../../lib/utils/fs-utils');
var expect          = require('../../../../helpers/expect');
var openCommand     = require('../../../../../lib/utils/open-app-command');
var mockProject     = require('../../../../fixtures/corber-mock/project');
var _merge          = require('lodash').merge;
var isObject        = td.matchers.isA(Object);

var setupOpenTask = function() {
  var OpenAppTask = require('../../../../../lib/targets/cordova/tasks/open-app');
  return new OpenAppTask(_merge(mockProject, { platform: 'ios' }));
};

describe('Cordova Open App Task', function() {
  var cdvPath;

  beforeEach(function() {
    cdvPath = path.resolve(
      __dirname, '../../../../',
      'fixtures',
      'corber-mock/corber/cordova'
    );
  });

  afterEach(function() {
    td.reset();
  });

  it('runs openApp with the path from getProjectPath', function() {
    var bashDouble = td.replace(BashTask.prototype, 'runCommand');

    var openApp = setupOpenTask();
    return openApp.run().then(function() {
      var expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcodeproj';
      var expectedCmd  = openCommand(expectedPath);
      td.verify(bashDouble(expectedCmd, isObject));
    });
  });


  context('getProjectPath', function() {
    it('ios returns xcworkspace if it exists', function() {
      td.replace(fsUtils, 'existsSync', function() {
        return true;
      });

      var openApp = setupOpenTask();
      return openApp.getProjectPath('ios', mockProject.project).then(function(projectPath) {
        var expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcworkspace';
        expect(projectPath).to.equal(expectedPath);
      });
    });

    it('ios returns xcodeproj if workspace does not exist', function() {
      td.replace(fsUtils, 'existsSync', function() {
        return false;
      });

      var openApp = setupOpenTask();
      return openApp.getProjectPath('ios', mockProject.project).then(function(projectPath) {
        var expectedPath = cdvPath + '/platforms/ios/emberCordovaDummyApp.xcodeproj';
        expect(projectPath).to.equal(expectedPath);
      });
    });

    it('rejects for android', function() {
      var openApp = setupOpenTask();
      openApp.platform = 'android';

      return expect(openApp.run()).to.eventually.be.rejectedWith(
        /is not supported for android/
      );
    });

    it('rejects if an invalid platform is specified', function() {
      var openApp = setupOpenTask();
      openApp.platform = 'invalidPlatform';

      return expect(openApp.run()).to.eventually.be.rejectedWith(
        /is not supported/
      );
    });
  });
});
