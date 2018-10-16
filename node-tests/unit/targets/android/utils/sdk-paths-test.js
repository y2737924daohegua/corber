const expect = require('../../../../helpers/expect');
const path   = require('path');
const td     = require('testdouble');

describe('Android sdk paths util', function() {
  afterEach(function() {
    td.reset();
  });

  it('returns a hash with adb & emulator', function() {
    td.replace('../../../../../lib/targets/android/utils/resolve-path', function() {
      return 'fake-path';
    });

    let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-paths');
    let paths = sdkPaths();

    expect(paths).to.deep.equal({
      adb: path.join('fake-path', 'platform-tools', 'adb'),
      emulator: path.join('fake-path')
    });
  });
});
