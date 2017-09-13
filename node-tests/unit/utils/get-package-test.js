const expect         = require('../../helpers/expect');

const mockProject    = require('../../fixtures/corber-mock/project');
const getPackage     = require('../../../lib/utils/get-package');

const root           = mockProject.project.root;

describe('getPackage', function() {
  it('attempts to read package.json at root', function() {
    let packageJSON = getPackage(root);
    expect(packageJSON.name).to.equal('mock-project');
  });
});
