const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const mockProject    = require('../../fixtures/corber-mock/project');
const root           = mockProject.project.root;

describe('Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('detects glimmer', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        devDependencies: {
          '@glimmer/application': '^0.5.1',
        }
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.get(root)).to.equal('glimmer');
  });

  it('detects ember', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        devDependencies: {
          'ember-source': '^0.5.1',
        }
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.get(root)).to.equal('ember');
  });

  it('detect vue', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        dependencies: {
          'vue': '0.0.0',
        }
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.get(root)).to.equal('vue');
  });

  it('detect react', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        dependencies: {
          'react': '0.0.0',
        }
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.get(root)).to.equal('react');
  });

  it('returns custom if no type is detected', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        dependencies: {}
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.get(root)).to.equal('custom');
  });
});
