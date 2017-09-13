const td             = require('testdouble');
const expect         = require('../../../../helpers/expect');
const mockProject    = require('../../../../fixtures/corber-mock/project');

const initValidator = function() {
  let Homepage = require('../../../../../lib/frameworks/react/validators/homepage');
  return new Homepage({root: mockProject.project.root});
};

describe('React Homepage Validator', function() {
  afterEach(function() {
    td.reset();
  });

  it('rejects with warnMsg if package.homepage[0] === /', function() {
    td.replace('../../../../../lib/utils/get-package', function() {
      return {
        homepage: '/'
      };
    });

    let validator = initValidator();
    return expect(validator.run()).to.eventually.be.rejectedWith(validator.warnMsg());
  });

  it('rejects with warnMsg if package.homepage === undefined', function() {
    td.replace('../../../../../lib/utils/get-package', function() {
      return {};
    });

    let validator = initValidator();
    return expect(validator.run()).to.eventually.be.rejectedWith(validator.warnMsg());
  });

  it('resolves if package.homepage does not meet fail criteria', function() {
    td.replace('../../../../../lib/utils/get-package', function() {
      return {
        homepage: './'
      };
    });

    let validator = initValidator();
    return expect(validator.run()).to.eventually.be.fulfilled;
  });
});
