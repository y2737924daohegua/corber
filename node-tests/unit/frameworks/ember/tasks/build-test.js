const td             = require('testdouble');
const expect         = require('../../../../helpers/expect')
const Promise        = require('rsvp');
const mockProject    = require('../../../../fixtures/corber-mock/project');

describe('Ember Build Task', function() {
  afterEach(function() {
    td.reset();
  });

  it('initBuilder constructs an ember builder', function() {
    let EmberBuilder = td.replace('ember-cli/lib/models/builder');

    let Build = require('../../../../../lib/frameworks/ember/tasks/build');
    let build = new Build({project: mockProject.project});

    build.initBuilder();
    td.verify(new EmberBuilder({
      project: mockProject.project,
      environment: undefined,
      outputPath: undefined
    }));
  });

  it('runs tasks in the right order', function() {
    let tasks = [];
    td.replace('../../../../../lib/utils/create-gitkeep', function() {
      tasks.push('create-gitkeep');
    });

    let Build  = require('../../../../../lib/frameworks/ember/tasks/build');
    let build  = new Build({project: mockProject.project});
    td.replace(build, 'initBuilder', function() {
      tasks.push('init-builder');
      return {
        build() { return Promise.resolve(); }
      };
    });

    return build.run().then(function() {
      expect(tasks).to.deep.equal([
        'init-builder',
        'create-gitkeep'
      ]);
    });
  });


  it('calls createGitKeep with the right path', function() {
    let gitkeepDouble = td.replace('../../../../../lib/utils/create-gitkeep');
    let Build  = require('../../../../../lib/frameworks/ember/tasks/build');

    td.replace(Build.prototype, 'initBuilder', function() {
      return {
        build() { return Promise.resolve(); }
      };
    });

    let build  = new Build({project: mockProject.project});
    return build.run().then(function() {
      td.verify(gitkeepDouble('corber/cordova/www/.gitkeep'));
    });
  });
});
