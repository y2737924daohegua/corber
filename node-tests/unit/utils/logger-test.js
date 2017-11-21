const logger = require('../../../lib/utils/logger');
const expect = require('../../helpers/expect');

describe('logger util', function() {
  it('allows to set and get a log level', function() {
    logger.setLogLevel('error');
    expect(logger.getLogLevel()).to.equal('error');
  });
});
