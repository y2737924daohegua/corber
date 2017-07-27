const td             = require('testdouble');
const expect         = require('../../helpers/expect');

const mockProject    = require('../../fixtures/ember-cordova-mock/project');
const frameworkType  = require('../../../lib/utils/framework-type');

const root           = mockProject.project.root;

describe('Framework', function() {
  afterEach(function() {
    td.reset();
  });

  it('attempts to read package.json at root', function() {
    let packageJSON = frameworkType.getPackage(root);
    expect(packageJSON.name).to.equal('mock-project');
  });

  it('detects glimmer', function() {
    td.replace(frameworkType, 'getPackage', function() {
      return {
        name: 'my-app',
        devDependencies: {
          '@glimmer/application': '^0.5.1',
        }
      };
    });

    expect(frameworkType.get(root)).to.equal('glimmer');
  });

  it('detects ember', function() {
    td.replace(frameworkType, 'getPackage', function() {
      return {
        name: 'my-app',
        devDependencies: {
          'ember-source': '^0.5.1',
        }
      };
    });

    expect(frameworkType.get(root)).to.equal('ember');
  });

  it('detect vue', function() {
    td.replace(frameworkType, 'getPackage', function() {
      return {
        name: 'my-app',
        dependencies: {
          'vue': '0.0.0',
        }
      };
    });

    expect(frameworkType.get(root)).to.equal('vue');
  });
});
