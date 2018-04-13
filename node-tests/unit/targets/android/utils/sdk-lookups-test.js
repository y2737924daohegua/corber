const expect = require('../../../../helpers/expect');
const td     = require('testdouble');

describe('Android possible sdk paths util', function() {
  afterEach(function() {
    td.reset();
  });

  context('if OS is win32', function() {
    it('passes 3 possible options ', function() {
      td.replace('../../../../../lib/utils/get-os', function() {
        return 'win32';
      });

      let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-lookups');

      expect(sdkPaths().length).to.eq(3);
    });
  });

  context('if OS is darwin', function() {
    it('passes 5 possible options ', function() {
      td.replace('../../../../../lib/utils/get-os', function() {
        return 'darwin';
      });

      let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-lookups');

      expect(sdkPaths().length).to.eq(5);
    });
  });
});
