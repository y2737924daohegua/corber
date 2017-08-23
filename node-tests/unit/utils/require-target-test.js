const td               = require('testdouble');
const isAnything       = td.matchers.anything;
const isObject         = td.matchers.isA(Object);

describe('requireTarget util', function() {
  afterEach(function() {
    td.reset();
  });

  it('parses cordova build flag', function() {
    /* eslint-disable max-len */
    let optDouble = td.replace('../../../lib/targets/cordova/utils/parse-build-flags');
    let requireTarget = require('../../../lib/utils/require-target');
    /* eslint-enable max-len */

    requireTarget({}, {});
    td.verify(optDouble(isAnything(), isAnything()));
  });

  it('initializes a CordovaTarget with required values', function() {
    let CordovaTarget = td.replace('../../../lib/targets/cordova/target');
    let requireTarget = require('../../../lib/utils/require-target');
    td.constructor(CordovaTarget);

    requireTarget({}, {platform: 'android'});

    td.verify(new CordovaTarget({
      platform: 'android',
      project: isObject,
      cordovaOpts: isObject
    }));
  });
});
