const td        = require('testdouble');
const expect    = require('../../../../helpers/expect');
const parsePbx  = require('../../../../../lib/targets/ios/utils/parse-pbxproj');
const fsUtils   = require('../../../../../lib/utils/fs-utils');

describe('Parse pbxproj Test', function() {
  afterEach(function() {
    td.reset();
  });

  it('throws if pbxproj file does not exist', function() {
    td.replace(fsUtils, 'existsSync', () => false);
    return expect(() => parsePbx('foo.pbxproj')).to.throw();
  });
});
