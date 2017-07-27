const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const mockProject    = require('../../../fixtures/ember-cordova-mock/project');
const WatchmanCfg    = require('../../../../lib/frameworks/ember/tasks/update-watchman-config');

describe('Ember Framework', function() {
  xit('validateBuild runs validators in the correct order', function() {
  });

  xit('build runs an EmberBuildTask', function() {
  });

  xit('validateServe runs validators in the correct order', function() {
  });

  xit('serve runs an EmberServeTask', function() {
  });

  xit('createProject supers with ember', function() {
  });

  it('afterInstall runs UpdateWatchman task', function() {
    let tasks = [];

    td.replace(WatchmanCfg.prototype, 'run', function() {
      tasks.push('update-watchman-config');
      return Promise.resolve();
    });

    let EmberFramework = require('../../../../lib/frameworks/ember/framework');
    let framework = new EmberFramework({
      project: mockProject.project
    });

    return framework.afterInstall().then(function() {
      expect(tasks).to.deep.equal([
        'update-watchman-config'
      ]);
    });
  });
});
