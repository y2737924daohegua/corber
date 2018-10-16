const resolvePath = require('../../../../../lib/targets/android/utils/resolve-path');
const expect      = require('../../../../helpers/expect');

describe('When user passes and array of paths', function() {
  it('finds the existing one', function() {
    let paths = [
      undefined,
      process.env['HOME'],
    ];

    expect(resolvePath(paths)).to.eq(process.env['HOME']);
  });
});
