var td              = require('testdouble');
var mockProject     = require('../../../../fixtures/corber-mock/project');
var CdvRawTask      = require('../../../../../lib/targets/cordova/tasks/raw');

var setupPrepareTask = function() {
  var PrepareTask = require('../../../../../lib/targets/cordova/tasks/prepare');
  return new PrepareTask(mockProject);
};

describe('Cordova Prepare Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('runs cordova prepare with fetch defaulted', function() {
    var RawDouble = td.replace(CdvRawTask.prototype, 'run');
    var prepare = setupPrepareTask();
    prepare.run();

    td.verify(new RawDouble({fetch: true}));
  });
});
