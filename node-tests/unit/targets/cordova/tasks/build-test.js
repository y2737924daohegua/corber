var td              = require('testdouble');
var mockProject     = require('../../../../fixtures/corber-mock/project');
var CdvRawTask      = require('../../../../../lib/targets/cordova/tasks/raw');

var setupBuildTask = function() {
  var CdvBuildTask = require('../../../../../lib/targets/cordova/tasks/build');
  return new CdvBuildTask(mockProject);
};

describe('Cordova Build Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('creates a raw build task', function() {
    var cdvBuild = td.replace(CdvRawTask.prototype, 'run');
    var build = setupBuildTask();
    build.platform = 'ios';
    build.run();

    td.verify(cdvBuild({platforms: ['ios'], options: {}, browserify: false, emulator: true}));
  });

  it('sets platform to android', function() {
    var cdvBuild = td.replace(CdvRawTask.prototype, 'run');
    var build = setupBuildTask();
    build.platform = 'android';
    build.run();

    td.verify(cdvBuild({platforms: ['android'], options: {}, browserify: false, emulator: true}));
  });
});
