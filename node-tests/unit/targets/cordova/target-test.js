const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const Promise        = require('rsvp').Promise;

const CordovaTarget           = require('../../../../lib/targets/cordova/target');
const ValidatePlatform        = require('../../../../lib/targets/cordova/validators/platform');
const ValidatePlugin          = require('../../../../lib/targets/cordova/validators/plugin');
const ValidateAllowNavigation = require('../../../../lib/targets/cordova/validators/allow-navigation');

describe('Cordova Target', function() {
  context('validatons', function() {
    let tasks = [];
    beforeEach(function() {
      tasks = [];
      td.replace(ValidatePlatform.prototype, 'run', function() {
        tasks.push('validate-platform');
        return Promise.resolve();
      });

      td.replace(ValidatePlugin.prototype, 'run', function() {
        tasks.push('validate-plugin');
        return Promise.resolve();
      });

      td.replace(ValidateAllowNavigation.prototype, 'run', function() {
        tasks.push('validate-allow-navigation');
        return Promise.resolve();
      });
    });

    afterEach(function() {
      td.reset();
    });

    it('validate build runs the correct validators', function() {
      target = new CordovaTarget();

      return target.validateBuild().then(function() {
        expect(tasks).to.deep.equal([
          'validate-allow-navigation',
          'validate-platform',
        ]);
      });
    });

    it('validate serve runs the correct validators', function() {
      return target.validateServe().then(function() {
        expect(tasks).to.deep.equal([
          'validate-allow-navigation',
          'validate-platform',
          'validate-plugin'
        ]);
      });
    });
  });


  context('build', function() {
    xit('runs cordova build task', function() {
    });

    xit('passes the verbose flag', function() {
    });
  });
});

