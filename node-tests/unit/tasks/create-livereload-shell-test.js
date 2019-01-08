'use strict';

const td              = require('testdouble');
const Promise         = require('rsvp');
const mockProject     = require('../../fixtures/corber-mock/project');
const fsUtils         = require('../../../lib/utils/fs-utils');

const expect          = require('../../helpers/expect');
const path            = require('path');
const contains        = td.matchers.contains;
const isObject        = td.matchers.isA(Object);

const setupTask = function(shouldMockTemplate) {
  let CreateShell = require('../../../lib/tasks/create-livereload-shell');

  let shellTask = new CreateShell({
    project: mockProject.project
  });

  if (shouldMockTemplate) {
    td.replace(CreateShell.prototype, 'getShellTemplate', function() {
      return Promise.resolve('{{liveReloadUrl}}');
    });
  }

  return shellTask;
};

describe('Create Cordova Shell Task', function() {
  beforeEach(function() {
    td.replace(fsUtils, 'write', function() {
      return Promise.resolve();
    });
  });

  afterEach(function() {
    td.reset();
  });

  describe('getShellTemplate', function() {
    it('reads the right path', function() {
      let shellTask = setupTask();
      let readDouble = td.replace(fsUtils, 'read');

      shellTask.getShellTemplate();
      td.verify(readDouble(
        contains(path.join('templates', 'livereload-shell', 'index.html')),
        isObject
      ));
    });
  });

  it('attempts to get shell template', function() {
    let shellTask = setupTask();
    let called = false;

    td.replace(shellTask, 'getShellTemplate', function() {
      called = true;
      return Promise.resolve();
    });

    shellTask.run();
    expect(called).to.equal(true);
  });

  it('createShell replaces {{liveReloadUrl}} and saves', function() {
    let shellTask = setupTask(true);
    let writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    return shellTask.createShell('path', '{{liveReloadUrl}}', 'fakeUrl')
      .then(function() {
        expect(writeContent).to.equal('fakeUrl');
      });
  });

  it('catches errors', function() {
    td.replace(fsUtils, 'write', function() {
      throw new Error();
    });

    let shellTask = setupTask(true);
    return expect(shellTask.run()).to.eventually.be.rejectedWith(
      /Error moving index\.html/
    );
  });
});
