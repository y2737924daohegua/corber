const td              = require('testdouble');
const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');

const setupCommand = function() {
  let PlatformCmd     = require('../../../lib/commands/platform');

  let platform = new PlatformCmd({
    project: mockProject.project,
    analytics: mockAnalytics
  });
  return platform;
};

describe('Platform Command', function() {
  afterEach(function() {
    td.reset();
  });

  it('validates and calls Platform.run', function() {
    let PlatformTask = td.replace('../../../lib/targets/cordova/tasks/platform');
    let runDouble = td.replace(PlatformTask.prototype, 'run');

    let command = setupCommand();

    return command.run({}, ['platform', 'add', 'ios']).then(function() {
      td.verify(new PlatformTask({
        project: mockProject.project
      }));

      td.verify(runDouble('add', 'platform', {}));
    });
  });
});
