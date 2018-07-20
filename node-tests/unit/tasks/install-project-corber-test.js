const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const mockProject    = require('../../fixtures/corber-mock/project');
const InstallPackage = require('../../../lib/tasks/install-package');
const Promise        = require('rsvp').Promise;


describe('Install project corber Task', function() {
  function getTask() {
    let InstallCorber = require('../../../lib/tasks/install-project-corber');
    return new InstallCorber({ rootPath: mockProject.project.root });
  }

  afterEach(function() {
    td.reset();
  });

  it('detects the current corber version and spawns an install-task', function() {
    let passedName, passedVersion;

    td.replace(InstallPackage.prototype, 'run', function(name, version) {
      passedName = name;
      passedVersion = version;
      return Promise.resolve();
    });

    let installCorber = getTask();

    let expectedVersion = require('../../../package.json').version;
    return installCorber.run().then(function() {
      expect(passedName).to.equal('corber');
      expect(passedVersion).to.equal(expectedVersion);
    });
  });
});
