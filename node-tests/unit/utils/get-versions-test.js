const td                 = require('testdouble');
const expect             = require('../../helpers/expect');
const path               = require('path');
const fsUtils            = require('../../../lib/utils/fs-utils');
const mockProject        = require('../../fixtures/corber-mock/project');
const root               = mockProject.project.root;
const globalPackagePath  = path.join('..', '..', 'package.json');
const projectPackagePath = path.join(root, 'package.json');

let packages, fileExists, getVersions;

describe('getVersions', () => {
  beforeEach(() => {
    packages = {};
    packages[globalPackagePath] = { version: '1.0.0' };
    packages[projectPackagePath] = {
      devDependencies: {
        corber: '1.2.3'
      }
    };

    td.replace('../../../lib/utils/get-package', (packagePath) => {
      return packages[packagePath];
    });

    fileExists = {};
    fileExists[projectPackagePath] = true;

    td.replace(fsUtils, 'existsSync', (filePath) => {
      return fileExists[filePath];
    });

    getVersions = require('../../../lib/utils/get-versions');
  });

  afterEach(() => {
    td.reset();
  });

  it('reads the global corber version', () => {
    let versions = getVersions(root);
    expect(versions.corber.global).to.equal('1.0.0');
  });

  it('reads the project corber version', () => {
    let versions = getVersions(root);
    expect(versions.corber.project).to.equal('1.2.3');
  });

  it('reads the node version', () => {
    let versions = getVersions(root);
    expect(versions.node).to.equal(process.versions.node);
  });

  context('when corber is added as a full dependency', () => {
    beforeEach(() => {
      delete packages[projectPackagePath].devDependencies;

      packages[projectPackagePath].dependencies = {
        corber: '1.2.3'
      };
    });
  });

  context('when project package.json does not exist', () => {
    beforeEach(() => {
      fileExists[projectPackagePath] = false;
    });

    it('does not contain a project version', () => {
      let versions = getVersions(root);
      expect(versions.corber.project).to.be.undefined;
    });
  });
});
