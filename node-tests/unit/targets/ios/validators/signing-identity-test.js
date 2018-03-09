const td          = require('testdouble');
const expect      = require('../../../../helpers/expect');
const mockProject = require('../../../../fixtures/corber-mock/project');

describe('Signing Identity Test', function() {
  let SigningIdentity;
  let validator;
  let pbxproj;

  beforeEach(function() {
    pbxproj = {};
    td.replace('../../../../../lib/targets/ios/utils/parse-pbxproj', () => {
      return pbxproj;
    });

    SigningIdentity =
      require('../../../../../lib/targets/ios/validators/signing-identity');

    validator = new SigningIdentity({
      project: mockProject.project,
      buildConfigName: 'debug'
    });
  });

  afterEach(function () {
    td.reset();
  });

  it('does not reject when log level is "warn"', function() {
    pbxproj = {};
    validator.logLevel = 'warn';
    return expect(validator.run()).to.eventually.be.fulfilled;
  });

  context('when signing style is automatic', function() {
    beforeEach(function() {
      pbxproj.provisioningStyle = 'automatic';
    });

    context('when team is not set', function() {
      it('rejects', function() {
        return expect(validator.run()).to.eventually.be.rejected;
      });

      it('sets the "failed" property to true', function(done) {
        validator.run().catch((err) => {
          expect(validator.failed).to.be.true;
          done();
        });
      });
    });

    context('when team is set', function() {
      beforeEach(function() {
        pbxproj.developmentTeam = 'isle-of-code';
      });

      it('resolves', function() {
        return expect(validator.run()).to.eventually.be.fulfilled;
      });

      it('does not set the "failed" property to false', function(done) {
        validator.run().then(() => {
          expect(validator.failed).to.be.false;
          done();
        });
      });
    });
  });

  context('when signing style is manual', function() {
    beforeEach(function() {
      pbxproj.provisioningStyle = 'manual';
      pbxproj.buildConfigurations = {
        debug: {}
      }
    });

    context('when provisioning profile is not set', function() {
      it('rejects', function() {
        return expect(validator.run()).to.eventually.be.rejected;
      });

      it('set the "failed" property to true', function(done) {
        validator.run().catch((err) => {
          expect(validator.failed).to.be.true;
          done();
        });
      });
    });

    context('when provisioning profile is set', function() {
      beforeEach(function() {
        pbxproj.buildConfigurations['debug'].provisioningProfile = 'profile';
      });

      it('resolves', function() {
        return expect(validator.run()).to.eventually.be.fulfilled;
      });

      it('sets the "failed" property to false', function(done) {
        validator.run().then(() => {
          expect(validator.failed).to.be.false;
          done();
        });
      });
    });
  });
});
