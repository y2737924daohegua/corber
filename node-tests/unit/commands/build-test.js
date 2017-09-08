const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const Promise        = require('rsvp');
const mockProject    = require('../../fixtures/corber-mock/project');
const mockAnalytics  = require('../../fixtures/corber-mock/analytics');

describe('Build Command', function() {
  let baseOpts, tasks;
  let AddCordovaJS, LintTask;

  beforeEach(function() {
    baseOpts = {
      cordovaOutputPath: 'ember-cordova/cordova/www',
      platform: 'ios'
    };
  });

  afterEach(function() {
    td.reset();
  });

  function setupBuild() {
    let CdvTarget, HookTask;
    tasks = [];

    CdvTarget = require('../../../lib/targets/cordova/target');
    HookTask = require('../../../lib/tasks/run-hook');
    AddCordovaJS = td.replace('../../../lib/tasks/add-cordova-js');
    LintTask = td.replace('../../../lib/tasks/lint-index');

    td.replace('../../../lib/utils/require-framework', function() {
      return {
        validateBuild: function() {
          tasks.push('framework-validate-build');
          return Promise.resolve();
        },

        build: function() {
          tasks.push('framework-build');
          return Promise.resolve();
        }
      };
    });

    td.replace(HookTask.prototype, 'run', function(hookName, options) {
      expect(options, `${hookName} options`).to.be.an('object');
      tasks.push('hook ' + hookName);
      return Promise.resolve();
    });

    td.replace(LintTask.prototype, 'run', function(hookName, options) {
      tasks.push('lint-index');
      return Promise.resolve();
    });

    td.replace(CdvTarget.prototype, 'validateBuild', function() {
      tasks.push('cordova-target-validate-build');
      return Promise.resolve();
    });

    td.replace(CdvTarget.prototype, 'build', function() {
      tasks.push('cordova-target-build');
      return Promise.resolve();
    });

    td.replace(AddCordovaJS.prototype, 'run', function() {
      tasks.push('add-cordova-js');
      return Promise.resolve();
    });

    let BuildCmd = require('../../../lib/commands/build');
    let project = mockProject.project;
    project.config = function() {
      return {
        locationType: 'hash'
      };
    };

    let build = new BuildCmd({
      project: project
    });
    build.analytics = mockAnalytics;

    return build;
  }

  it('exits cleanly', function() {
    let build = setupBuild();

    return expect(function() {
      build.run(baseOpts);
    }).not.to.throw(Error);
  });

  it('runs tasks in the correct order', function() {
    let build = setupBuild();

    return build.run(baseOpts)
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'hook beforeBuild',
        'framework-validate-build',
        'cordova-target-validate-build',
        'framework-build',
        'add-cordova-js',
        'cordova-target-build',
        'hook afterBuild',
        'lint-index'
      ]);
    });
  });

  it('skips ember-build with the --skip-ember-build flag', function() {
    let build = setupBuild();
    baseOpts.skipFrameworkBuild = true;

    return build.run(baseOpts)
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'hook beforeBuild',
        'framework-validate-build',
        'cordova-target-validate-build',
        'cordova-target-build',
        'hook afterBuild',
        'lint-index'
      ]);
    });
  });

  it('skips cordova-build with the --skip-cordova-build flag', function() {
    let build = setupBuild();
    baseOpts.skipCordovaBuild = true;

    return build.run(baseOpts)
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'hook beforeBuild',
        'framework-validate-build',
        'cordova-target-validate-build',
        'framework-build',
        'add-cordova-js',
        'hook afterBuild',
        'lint-index'
      ]);
    });
  });

  it('constructs AddCordovaJS as expected', function() {
    let build = setupBuild();
    return build.run(baseOpts).then(function() {
      td.verify(new AddCordovaJS({
        source: 'ember-cordova/cordova/www/index.html'
      }));
    });
  });

  it('constructs lint index as expected', function() {
    let build = setupBuild();
    return build.run(baseOpts).then(function() {
      td.verify(new LintTask({
        source: 'www/index.html',
        project: mockProject.project
      }));
    });
  });
});
