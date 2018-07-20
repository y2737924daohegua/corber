const td             = require('testdouble');
const mockProject    = require('../../fixtures/corber-mock/project');
const fsUtils        = require('../../../lib/utils/fs-utils');
const Promise        = require('rsvp').Promise;

describe('InstallPackage Task', function() {
  function getTask() {
    let InstallPackage = require('../../../lib/tasks/install-package');
    return new InstallPackage({ rootPath: mockProject.project.root });
  }

  afterEach(function() {
    td.reset();
  });

  context('install command', function() {
    let bashDouble;
    beforeEach(function() {
      bashDouble = td.replace('../../../lib/tasks/bash');
      td.replace(fsUtils, 'write');
    });

    it('detects and installs with yarn', function() {
      td.replace(fsUtils, 'read', function(path) {
        if (path.indexOf('yarn') >= 0) {
          return Promise.resolve();
        }
      });

      let install = getTask();
      return install.run('corber').then(function() {
        td.verify(bashDouble({command: 'yarn add corber --dev'}));
      });
    });

    it('detects and installs with npm', function() {
      td.replace(fsUtils, 'read', function(path) {
        if (path.indexOf('yarn') >= 0) {
          return Promise.reject();
        }
      });

      let install = getTask();
      return install.run('corber').then(function() {
        td.verify(bashDouble({command: 'npm install corber --save'}));
      });
    });

    it('appends version when provided', function() {
      td.replace(fsUtils, 'read', function(path) {
        if (path.indexOf('yarn') >= 0) {
          return Promise.resolve();
        }
      });

      let install = getTask();
      return install.run('corber', '1.0').then(function() {
        td.verify(bashDouble({command: 'yarn add corber@1.0 --dev'}));
      });
    });
  });
});
