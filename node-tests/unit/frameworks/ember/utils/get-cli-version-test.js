const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');
const root            = mockProject.project.root;

let cliPackagePath    = path.join(root, 'node_modules', 'ember-cli', 'package.json');
let packagePath       = path.join(root, 'package.json');

describe('Get Ember CLI version test', () => {
  let fsUtils, getPackage;
  let getCLIVersion;

  beforeEach(() => {
    fsUtils = td.replace('../../../../../lib/utils/fs-utils');
    getPackage = td.replace('../../../../../lib/utils/get-package');

    getCLIVersion = require('../../../../../lib/frameworks/ember/utils/get-cli-version');

    td.when(fsUtils.existsSync(cliPackagePath)).thenReturn(true);
    td.when(getPackage(cliPackagePath)).thenReturn({ version: '2.13.2' });
    td.when(getPackage(packagePath)).thenReturn({
      devDependencies: {
        'ember-cli': '~2.13.0'
      }
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('returns the node_modules/ember-cli/package.json version', () => {
    expect(getCLIVersion(root)).to.equal('2.13.2');
  });

  context('when node_modules/ember-cli/package.json does not exist', () => {
    beforeEach(() => {
      td.when(fsUtils.existsSync(cliPackagePath)).thenReturn(false);
    });

    it('coerces version from package.json devDependencies', () => {
      expect(getCLIVersion(root)).to.equal('2.13.0');
    });

    context('when ember-cli is in package.json dependencies', () => {
      beforeEach(() => {
        td.when(getPackage(packagePath)).thenReturn({
          dependencies: {
            'ember-cli': '~3.10.0'
          }
        });
      })

      it('coerces version from package.json devDependencies', () => {
        expect(getCLIVersion(root)).to.equal('3.10.0');
      });
    });
  });
});
