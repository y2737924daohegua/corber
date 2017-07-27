'use strict';

var td              = require('testdouble');

var expect          = require('../../helpers/expect');
var Promise         = require('rsvp');

var CdvTarget       = require('../../../lib/targets/cordova/target');
var HookTask        = require('../../../lib/tasks/run-hook');

var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var mockAnalytics   = require('../../fixtures/ember-cordova-mock/analytics');

var isAnything      = td.matchers.anything;

var setupBuild = function() {
  var BuildCmd = require('../../../lib/commands/build');

  var project = mockProject.project;
  project.config = function() {
    return {
      locationType: 'hash'
    };
  }

  var build = new BuildCmd({
    project: project
  });
  build.analytics = mockAnalytics;

  return build;
};

describe('Build Command', function() {
  afterEach(function() {
    td.reset();
  });

  var tasks;

  beforeEach(function() {
    mockTasks();
  });

  function mockTasks() {
    tasks = [];

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
      tasks.push('hook ' + hookName);
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
  }

  it('exits cleanly', function() {
    var build = setupBuild();

    return expect(function() {
      build.run({});
    }).not.to.throw(Error);
  });

  it('runs tasks in the correct order', function() {
    var build = setupBuild();

    return build.run({})
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'framework-validate-build',
        'cordova-target-validate-build',
        'hook beforeBuild',
        'framework-build',
        'cordova-target-build',
        'hook afterBuild'
      ]);
    });
  });

  it('skips ember-build with the --skip-ember-build flag', function() {
    var build = setupBuild();

    return build.run({skipEmberBuild: true})
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'framework-validate-build',
        'cordova-target-validate-build',
        'hook beforeBuild',
        'cordova-target-build',
        'hook afterBuild'
      ]);
    });
  });

  it('skips cordova-build with the --skip-cordova-build flag', function() {
    var build = setupBuild();

    return build.run({skipCordovaBuild: true})
    .then(function() {
      //h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'framework-validate-build',
        'cordova-target-validate-build',
        'hook beforeBuild',
        'framework-build',
        'hook afterBuild'
      ]);
    });
  });

  context('cordova target', function() {
    it('sets cordovaBuildOpts', function() {
      var optDouble = td.replace('../../../lib/targets/cordova/utils/parse-build-flags');
      var build = setupBuild();

      return build.run({}).then(function() {
        td.verify(optDouble(isAnything(), isAnything()));
      });
    });
  });

  xit('sets platform & cordovaOpts on CordovaTarget', function() {
    var passedPlatform = 'android';
    var build = setupBuild();

    return build.run({platform: passedPlatform}).then(function() {
      expect(cordovaPlatform).to.equal(passedPlatform);
    });
  });
});
