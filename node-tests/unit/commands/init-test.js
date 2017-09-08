const td               = require('testdouble');
const expect           = require('../../helpers/expect');
const mockProject      = require('../../fixtures/corber-mock/project');
const Promise          = require('rsvp').Promise;
const isAnything       = td.matchers.anything();

const setupCmd = function() {
  let InitCommand = require('../../../lib/commands/init');
  return new InitCommand({
    project: mockProject.project,
    ui: mockProject.ui
  });
};

describe('Init Command', function() {
  afterEach(function() {
    td.reset();
  });

  it('runs Create project task', function() {
    let called = false;

    let CreateTask = require('../../../lib/tasks/create-project');
    td.replace(CreateTask.prototype, 'run', function() {
      called = true;
      return Promise.resolve();
    });

    let init = setupCmd();

    return init.run({}).then(function() {
      expect(called).to.equal(true);
    });
  });

  it('sets cordovaId, name & templatePath', function() {
    let CreateDouble = td.replace('../../../lib/tasks/create-project');

    let init = setupCmd();
    init.run({
      cordovaId: 'cordovaId',
      name: 'cordovaName',
      templatePath: 'templatePath'
    });

    td.verify(new CreateDouble({
      project: isAnything,
      ui: undefined,
      cordovaId: 'cordovaId',
      name: 'cordovaName',
      templatePath: 'templatePath'
    }));
  });
});
