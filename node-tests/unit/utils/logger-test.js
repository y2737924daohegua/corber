const logger = require('../../../lib/utils/logger');
const expect = require('../../helpers/expect');

describe('logger util', function() {
  it('allows to set and get a log level', function() {
    logger.setLogLevel('error');
    expect(logger.getLogLevel()).to.equal('error');
  });

  describe('shouldLog', function() {
    beforeEach(function() {
      logger.setLogLevel('info');
    });

    it('returns true for higher levels', function() {
      let shouldLog = logger.shouldLog('success');
      expect(shouldLog).to.equal(true);
    });

    it('returns true for equal levels', function() {
      let shouldLog = logger.shouldLog('info');
      expect(shouldLog).to.equal(true);
    });

    it('returns false for lower levels', function() {
      let shouldLog = logger.shouldLog('verbose');
      expect(shouldLog).to.equal(false);
    });
  });
});
