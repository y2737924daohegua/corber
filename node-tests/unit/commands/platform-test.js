const td              = require('testdouble');
const Promise         = require('rsvp');
const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');
const expect          = require('../../helpers/expect');

describe('Platform Command', function() {
  let tasks;

  afterEach(function() {
    td.reset();
  });

  const setupCommand = function() {
    let HookTask        = td.replace('../../../lib/tasks/run-hook');
    let PlatformCmd     = require('../../../lib/commands/platform');

    tasks = [];

    td.replace(HookTask.prototype, 'run', function(hookName, options) {
      expect(options, `${hookName} options`).to.be.an('object');
      tasks.push(`hook ${hookName}`);
      return Promise.resolve();
    });

    let platform = new PlatformCmd({
      project: mockProject.project,
      analytics: mockAnalytics
    });
    return platform;
  };

  it('validates and calls Platform.run', function() {
    let PlatformTask = td.replace('../../../lib/targets/cordova/tasks/platform');

    td.replace(PlatformTask.prototype, 'run', function(action, name) {
      tasks.push(`${action} ${name}`);
      return Promise.resolve();
    });

    let command = setupCommand();

    return command.run({}, ['platform', 'add', 'ios']).then(function() {
      expect(tasks).to.deep.equal([
        'hook beforePlatformAdd',
        'add platform',
        'hook afterPlatformAdd'
      ]);

      td.verify(new PlatformTask({
        project: mockProject.project
      }));
    });
  });

  it('runs before/after hooks for Platform.run remove', function() {
    let PlatformTask = td.replace('../../../lib/targets/cordova/tasks/platform');

    td.replace(PlatformTask.prototype, 'run', (action, name) => {
      tasks.push(`${action} ${name}`);
      return Promise.resolve();
    });

    let command = setupCommand();

    return command.run({}, ['platform', 'remove', 'ios']).then(() => {
      expect(tasks).to.deep.equal([
        'hook beforePlatformRemove',
        'remove platform',
        'hook afterPlatformRemove'
      ]);
    });
  });
});
