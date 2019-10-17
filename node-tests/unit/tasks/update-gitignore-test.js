'use strict';

var td              = require('testdouble');
var mockProject     = require('../../fixtures/corber-mock/project');
var fsUtils         = require('../../../lib/utils/fs-utils');
var Promise         = require('rsvp');

var expect          = require('../../helpers/expect');

describe('Update gitignore Task', function() {
  var expectedGitkeep = '';

  var createTask = function(ignoreStub) {
    td.replace(fsUtils, 'read', function() {
      return Promise.resolve(ignoreStub);
    });

    var GitIgnore = require('../../../lib/tasks/update-gitignore');
    return new GitIgnore({
      project: mockProject.project
    });
  };

  beforeEach(function() {
    expectedGitkeep = '\n' +
      'corber/tmp-livereload\n' +
      'corber/cordova/node_modules\n' +
      'corber/cordova/platforms/*\n' +
      '!corber/cordova/platforms/.gitkeep\n' +
      'corber/cordova/plugins/*\n' +
      '!corber/cordova/plugins/.gitkeep\n' +
      'corber/cordova/www/*\n' +
      '!corber/cordova/www/.gitkeep';

  });

  afterEach(function() {
    td.reset();
  });

  it('attempts to write ignore data to .gitignore', function() {
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    var task = createTask('');
    return task.run().then(function() {
      expect(writeContent).to.equal(expectedGitkeep);
    });
  });

  it('creates gitignore if it does not exist', function() {
    var writeContent;
    var task = createTask('');

    td.replace(fsUtils, 'read', function() {
      return Promise.reject();
    });

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    return task.run().then(function() {
      expect(writeContent).to.equal(expectedGitkeep);
    });
  });

  it('stubs empty gitkeeps, and then writes gitkeep', function() {
    var calls = [];
    td.replace(fsUtils, 'write', function(path, content) {
      calls.push(path);
      return;
    });

    var task = createTask();
    return task.run().then(function() {
      expect(calls).to.deep.equal([
        'corber/cordova/platforms/.gitkeep',
        'corber/cordova/plugins/.gitkeep',
        'corber/cordova/www/.gitkeep',
        '.gitignore'
      ]);
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
      expect(writeContent).to.equal('dist/' + expectedGitkeep);
    });
  });

  it('does not duplicate content', function() {
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      if (path === '.gitignore') {
        writeContent = content;
      }
      return Promise.resolve();
    });

    var expected = 'dist/' + expectedGitkeep;
    var task = createTask(expected);
    return task.run().then(function() {
      expect(writeContent).to.equal(expected);
    });
  });
});
