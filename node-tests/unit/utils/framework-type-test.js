const td             = require('testdouble');
const expect         = require('../../helpers/expect');
const mockProject    = require('../../fixtures/corber-mock/project');
const root           = mockProject.project.root;

describe('Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('get passes root to detectAll', function() {
    let frameworkType  = require('../../../lib/utils/framework-type');
    let passedRoot = '';

    td.replace(frameworkType, 'detectAll', function(root) {
      passedRoot = root;
      return [root];
    });

    frameworkType.get('rootFoo');
    expect(passedRoot).to.equal('rootFoo');

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
    let frameworks = frameworkType.detectAll(root);
    expect(frameworks.length).to.eq(1);
    expect(frameworks).to.include('glimmer');
  });

  it('detects ember as a dependency', function () {
    td.replace('../../../lib/utils/get-package', function () {
      return {
        name: 'my-app',
        dependencies: {
          'ember-source': '^0.5.1',
        }
      };
    });

    let frameworkType = require('../../../lib/utils/framework-type');
    expect(frameworkType.detectAll(root)).to.include('ember');
  });

  it('detects ember as a dev dependency', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        devDependencies: {
          'ember-source': '^0.5.1',
        }
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.detectAll(root)).to.include('ember');
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
    expect(frameworkType.detectAll(root)).to.include('vue');
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
    expect(frameworkType.detectAll(root)).to.include('react');
  });

  it('returns custom if no type is detected', function() {
    td.replace('../../../lib/utils/get-package', function() {
      return {
        name: 'my-app',
        dependencies: {}
      };
    });

    let frameworkType  = require('../../../lib/utils/framework-type');
    expect(frameworkType.detectAll(root)).to.include('custom');
  });

  it('detects more than one framework type', function() {
    td.replace('../../../lib/utils/get-package', function () {
      return {
        name: 'my-app',
        dependencies: {
          'react': '0.0.0',
          'vue': '0.0.0'
        },
        devDependencies: {
          '@glimmer/application': '^0.5.1',
          'ember-source': '^0.5.1',
        }
      };
    });
    let frameworkType = require('../../../lib/utils/framework-type');
    expect(frameworkType.detectAll(root)).to.include('glimmer');
    expect(frameworkType.detectAll(root)).to.include('ember');
    expect(frameworkType.detectAll(root)).to.include('vue');
    expect(frameworkType.detectAll(root)).to.include('react');
  });
});
