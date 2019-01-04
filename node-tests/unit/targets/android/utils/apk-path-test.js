const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');

describe('Android apk paths util', function() {
  afterEach(function() {
    td.reset();
  });

  it('checks gradle & studio dirs', function() {
    let calls = [];
    td.replace('../../../../../lib/utils/spawn', function() {
      calls.push([...arguments]);
      return Promise.resolve({ stdout: 'fake-debug.apk' });
    });
    let apkPath = require('../../../../../lib/targets/android/utils/apk-path');

    return apkPath('fakePath', true).then(function() {
      expect(calls[0]).to.deep.equal(['ls', ['-r', 'fakePath/platforms/android/build/outputs/apk/debug']]);
      expect(calls[1]).to.deep.equal(['ls', ['-r', 'fakePath/platforms/android/app/build/outputs/apk/debug']]);
    });
  });

  it('returns a matched apk file', function() {
    td.replace('../../../../../lib/utils/spawn', function() {
      return Promise.resolve({ stdout: 'fake-debug.apk'});
    });
    let apkPath = require('../../../../../lib/targets/android/utils/apk-path');

    return apkPath('fakePath', true).then(function(found) {
      expect(found).to.equal('fakePath/platforms/android/build/outputs/apk/debug/fake-debug.apk');
    });
  });

  it('rejects if nothing was returned', function() {
    td.replace('../../../../../lib/utils/spawn', function() {
      return Promise.reject();
    });
    let apkPath = require('../../../../../lib/targets/android/utils/apk-path');

    return expect(apkPath('fakePath', true)).to.eventually.be.rejected;
  });
});
