const td                 = require('testdouble');
const expect             = require('../../helpers/expect');
const path               = require('path');
const mockProject        = require('../../fixtures/corber-mock/project');
const root               = mockProject.project.root;

let globalPackagePath    = path.join('..', '..', 'package.json');
let projectPackagePath   = path.join(root, 'package.json');
let corberPackagePath    = path.join(root, 'node_modules', 'corber', 'package.json');

describe('getVersions', () => {
  let getPackage, fsUtils;
  let getVersions;

  beforeEach(() => {
    getPackage = td.replace('../../../lib/utils/get-package');
    fsUtils = td.replace('../../../lib/utils/fs-utils');
    getVersions = require('../../../lib/utils/get-versions');

    td.when(getPackage(globalPackagePath)).thenReturn({ version: '1.0.0' });
    td.when(getPackage(projectPackagePath)).thenReturn({
      devDependencies: {
        corber: '~1.2.3'
      }
    });
    td.when(getPackage(corberPackagePath)).thenReturn({ version: '1.2.5' })

    td.when(fsUtils.existsSync(globalPackagePath)).thenReturn(true);
    td.when(fsUtils.existsSync(projectPackagePath)).thenReturn(true);
    td.when(fsUtils.existsSync(corberPackagePath)).thenReturn(true);
  });

  afterEach(() => {
    td.reset();
  });

  it('reads global corber version', () => {
    let versions = getVersions(root);
    expect(versions.corber.global).to.equal('1.0.0');
  });

  it('reads ./node_modules/corber/package.json version', () => {
    let versions = getVersions(root);
    expect(versions.corber.project.installed).to.equal('1.2.5');
  });

  it('reads ./package.json corber version', () => {
    let versions = getVersions(root);
    expect(versions.corber.project.required).to.equal('~1.2.3');
  });

  it('reads node version', () => {
    let versions = getVersions(root);
    expect(versions.node).to.equal(process.versions.node);
  });

  context('when project package.json does not exist', () => {
    beforeEach(() => {
      td.when(fsUtils.existsSync(projectPackagePath)).thenReturn(false);
    });

    it('does not contain a required version', () => {
      let versions = getVersions(root);
      expect(versions.corber.project.required).to.be.undefined;
    });

    it('does not contain an installed version', () => {
      let versions = getVersions(root);
      expect(versions.corber.project.installed).to.be.undefined;
    });
  });

  context('when ./node_modules/corber/package.json does not exist', () => {
    beforeEach(() => {
      td.when(fsUtils.existsSync(corberPackagePath)).thenReturn(false);
    });

    it('does not contain an installed version', () => {
      let versions = getVersions(root);
      expect(versions.corber.project.installed).to.be.undefined;
    });
  });

  context('when corber belongs to package.json dependencies', () => {
    beforeEach(() => {
      td.when(getPackage(projectPackagePath)).thenReturn({
        dependencies: {
          corber: '~1.2.3'
        }
      });
    });

    it('returns the correct required version', () => {
      let versions = getVersions(root);
      expect(versions.corber.project.required).to.equal('~1.2.3');
    })
  });
});
