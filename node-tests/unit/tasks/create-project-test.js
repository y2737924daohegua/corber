'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var Promise         = require('rsvp');
var CreateCordova   = require('../../../lib/targets/cordova/tasks/create-project');
var GitIgnore       = require('../../../lib/tasks/update-gitignore');
var WatchmanCfg     = require('../../../lib/tasks/update-watchman-config');
var getFramework    = require('../../../lib/utils/get-framework');

describe('Create Project', function() {
  var createTask;
  var project = mockProject.project;
  var ui = mockProject.ui;
  var tasks;

  beforeEach(function() {
    tasks = [];

    td.replace(CreateCordova.prototype, 'run', function() {
      tasks.push('create-cordova-project');
      return Promise.resolve();
    });

    td.replace(GitIgnore.prototype, 'run', function() {
      tasks.push('update-gitignore');
      return Promise.resolve();
    });

    td.replace(WatchmanCfg.prototype, 'run', function() {
      tasks.push('update-watchman-config');
      return Promise.resolve();
    });

    td.replace(getFramework, 'get', function() {
      return {
        _createProject: function() {
          tasks.push('framework-create-project');
          return Promise.resolve();
        }
      };
    });

    var CreateProject = require('../../../lib/tasks/create-project');
    createTask = new CreateProject({
      project: mockProject.project,
      ui: mockProject.ui,
      cordovaId: 'com.embercordova.app',
      name: 'com.emberCordova.app'
    });
  });

  afterEach(function() {
    td.reset();
  });


  it('runs tasks in the correct order', function() {
    return createTask.run().then(function() {
      expect(tasks).to.deep.equal([
        'framework-create-project',
        'create-cordova-project',
        'update-gitignore',
        'update-watchman-config'
      ]);
    });
  });

  context('create cordova project', function() {
    it('passes template path', function() {
      td.replace(CreateCordova.prototype, 'run', function(path) {
        expect(path).to.equal('templatePath');
        return Promise.resolve();
      });

      createTask.templatePath = 'templatePath';
      return createTask.run();
    });

    xit('sets id and name', function() {
    });
  });
});
