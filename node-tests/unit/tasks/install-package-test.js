const td             = require('testdouble');
const mockProject    = require('../../fixtures/corber-mock/project');
const fsUtils        = require('../../../lib/utils/fs-utils');
const path           = require('path');
const isAnything     = td.matchers.anything;
const Promise        = require('rsvp').Promise;


describe('Update gitignore Task', function() {
  function getTask() {
    let InstallPackage = require('../../../lib/tasks/install-package');
    return new InstallPackage({ project: mockProject.project });
  }

  afterEach(function() {
    td.reset();
  });

  it('adds the current version of corber to package.json', function() {
    let writeDouble = td.replace(fsUtils, 'write');
    td.replace('../../../lib/tasks/bash');

    let install = getTask();
    return install.run().then(function() {
      let packagePath = path.join(mockProject.project.root, 'package.json');
      let expectedPackage = JSON.stringify({
        name: 'mock-project',
        devDependencies: {
          corber: require('../../../package.json').version
        }
      }, null, 2);

      td.verify(writeDouble(packagePath, expectedPackage, isAnything()));
    });
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
      return install.run().then(function() {
        td.verify(bashDouble({command: 'yarn install'}));
      });
    });

    it('detects and installs with npm', function() {
      td.replace(fsUtils, 'read', function(path) {
        if (path.indexOf('yarn') >= 0) {
          return Promise.reject();
        }
      });

      let install = getTask();
      return install.run().then(function() {
        td.verify(bashDouble({command: 'npm install'}));
      });
    });
  });
});
