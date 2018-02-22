const expect         = require('../../helpers/expect');
const path           = require('path');

const mockProject    = require('../../fixtures/corber-mock/project');
const getPackage     = require('../../../lib/utils/get-package');

const root           = mockProject.project.root;

describe('getPackage', function() {
  it('attempts to requre package path', function() {
    const packagePath = path.join(root, 'package.json');
    let packageJSON = getPackage(packagePath);
    expect(packageJSON.name).to.equal('mock-project');
  });
});
