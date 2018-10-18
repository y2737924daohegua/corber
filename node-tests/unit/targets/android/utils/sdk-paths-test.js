const expect          = require('../../../../helpers/expect');
const path            = require('path');
const td              = require('testdouble');
const anything        = td.matchers.anything;

describe('Android sdk paths util', function() {
  afterEach(function() {
    td.reset();
  });

  it('returns resolved adb & emulator paths', function() {
    td.replace('../../../../../lib/targets/android/utils/resolve-path', function() {
      return 'resolved-path';
    });

    td.replace('../../../../../lib/targets/android/utils/sdk-root', function() {
      return 'sdk-root'
    });

    let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-paths');
    let paths = sdkPaths();

    expect(paths).to.deep.equal({
      adb: path.join('sdk-root', 'platform-tools', 'adb'),
      emulator: path.join('resolved-path')
    });
  });

  it('errors in ANDROID_HOME is not set', function() {
    td.replace('../../../../../lib/targets/android/utils/sdk-root', function() {
      return undefined;
    });

    let logger = td.replace('../../../../../lib/utils/logger');

    let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-paths');
    sdkPaths();

    td.verify(logger.error(anything()));
  });
});
