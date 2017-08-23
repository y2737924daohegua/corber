const td               = require('testdouble');
const expect           = require('../../helpers/expect');
const mockProject      = require('../../fixtures/ember-cordova-mock/project');
const Promise          = require('rsvp').Promise;
const isAnything       = td.matchers.anything();

const setupIndex = function() {
  let index = require('../../../blueprints/ember-cordova/index');
  index.project = mockProject.project;
  return index;
}

describe('Blueprint Index', function() {
  it('runs Create Project Task', function() {
    let called = false;

    let CreateTask = require('../../../lib/tasks/create-project');
    td.replace(CreateTask.prototype, 'run', function() {
      called = true;
      return Promise.resolve();
    });

    let index = setupIndex();

    return index.afterInstall({}).then(function() {
      expect(called).to.equal(true);
    });
  });

  it('sets cordovaId, name & templatePath', function() {
    let CreateDouble = td.replace('../../../lib/tasks/create-project');

    let index = setupIndex();

    index.afterInstall({
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
