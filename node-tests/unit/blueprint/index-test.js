'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var CreateTask      = require('../../../lib/tasks/create-project');
var Promise         = require('rsvp').Promise;

describe('Blueprint Index', function() {
  var index;
  var called = false;

  beforeEach(function() {
    called = false;

    td.replace(CreateTask.prototype, 'run', function() {
      called = true;
      return Promise.resolve();
    });

    index = require('../../../blueprints/ember-cordova/index');
    index.project = mockProject.project;
    index.ui = mockProject.ui;
  });

  afterEach(function() {
    td.reset();
  });


  it('runs Create Project Task', function() {
    return index.afterInstall({}).then(function() {
      expect(called).to.equal(true);
    });
  });

  xit('sets cordovaId, name & templatePath', function() {
  });
});
