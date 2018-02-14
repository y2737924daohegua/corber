/* global xit */
const td              = require('testdouble');
const path            = require('path');
const expect          = require('../../../../helpers/expect');

describe('Android sdk paths util', function() {
  afterEach(function() {
    td.reset();
  });

  context('darwin', function() {
    beforeEach(function() {
      td.replace('../../../../../lib/utils/get-os', function() {
        return 'darwin';
      });
    });

    it('returns a hash with adb & emulator', function() {
      let sdkPaths = require('../../../../../lib/targets/android/utils/sdk-paths');
      let sdkRoot = path.join(process.env['HOME'], 'Library', 'Android', 'sdk');

      let paths = sdkPaths();

      expect(paths).to.deep.equal({
        adb: path.join(sdkRoot, 'platform-tools', 'adb'),
        emulator: path.join(sdkRoot, 'tools', 'emulator')
      });
    });
  });

  context('win32', function() {
    xit('returns a hash with adb & emulator', function() {
    });
  });
});


