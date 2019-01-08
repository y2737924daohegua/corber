const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');
const path            = require('path');

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
      let localizedPaths = [
        path.join(
          'fakePath',
          'platforms',
          'android',
          'build',
          'outputs',
          'apk',
          'debug'
        ),
        path.join(
          'fakePath',
          'platforms',
          'android',
          'app',
          'build',
          'outputs',
          'apk',
          'debug'
        )
      ];

      expect(calls[0]).to.deep.equal(['ls', ['-r', localizedPaths[0]]]);
      expect(calls[1]).to.deep.equal(['ls', ['-r', localizedPaths[1]]]);
    });
  });

  it('returns a matched apk file', function() {
    td.replace('../../../../../lib/utils/spawn', function() {
      return Promise.resolve({ stdout: 'fake-debug.apk'});
    });
    let apkPath = require('../../../../../lib/targets/android/utils/apk-path');

    return apkPath('fakePath', true).then(function(found) {
      let localizedPath = path.join(
        'fakePath',
        'platforms',
        'android',
        'build',
        'outputs',
        'apk',
        'debug',
        'fake-debug.apk'
      );

      expect(found).to.equal(localizedPath);
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
