'use strict';

var td              = require('testdouble');
var mockProject     = require('../../fixtures/corber-mock/project');
var fsUtils         = require('../../../lib/utils/fs-utils');
var Promise         = require('rsvp');

var expect          = require('../../helpers/expect');

describe('Update eslintignore Task', function() {
  var expectedContent = '';

  var createTask = function(ignoreStub) {
    td.replace(fsUtils, 'read', function() {
      return Promise.resolve(ignoreStub);
    });

    var ESLintIgnore = require('../../../lib/tasks/eslintignore');
    return new ESLintIgnore({
      project: mockProject.project
    });
  };

  beforeEach(function() {
    expectedContent = '\n\n' +
      '# corber\n' +
      'corber/cordova';
  });

  afterEach(function() {
    td.reset();
  });

  it('attempts to write ignore data to .eslintignore', function() {
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    var task = createTask('');
    return task.run().then(function() {
      expect(writeContent).to.equal(expectedContent);
    });
  });

  it('returns if .eslintignore does not exist', function() {
    var writeContent;
    var task = createTask('');

    td.replace(fsUtils, 'read', function() {
      return Promise.reject();
    });

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    return task.run().catch(function() {
      expect(writeContent).to.equal(undefined);
    });
  });

  it('does not clear existing content', function() {
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    var task = createTask('dist/');
    return task.run().then(function() {
      expect(writeContent).to.equal('dist/' + expectedContent);
    });
  });

  it('does not duplicate content', function() {
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      if (path === '.eslintignore') {
        writeContent = content;
      }
      return Promise.resolve();
    });

    var expected = 'dist/' + expectedContent;
    var task = createTask(expected);
    return task.run().then(function() {
      expect(writeContent).to.equal(expected);
    });
  });
});
