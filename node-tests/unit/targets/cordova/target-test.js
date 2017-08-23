 /* eslint-disable max-len */
const td             = require('testdouble');
const expect         = require('../../../helpers/expect');
const Promise        = require('rsvp').Promise;
const mockProject    = require('../../../fixtures/ember-cordova-mock/project');

const ValidatePlatform        = require('../../../../lib/targets/cordova/validators/platform');
const ValidatePlugin          = require('../../../../lib/targets/cordova/validators/plugin');
const ValidateAllowNavigation = require('../../../../lib/targets/cordova/validators/allow-navigation');
 /* eslint-enable max-len */

describe('Cordova Target', function() {
  let CordovaTarget;

  afterEach(function() {
    CordovaTarget = undefined;
    td.reset();
  });

  context('validatons', function() {
    let tasks = [];

    beforeEach(function() {
      CordovaTarget = require('../../../../lib/targets/cordova/target');

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

    it('validate build runs the correct validators', function() {
      let target = new CordovaTarget();

      return target.validateBuild().then(function() {
        expect(tasks).to.deep.equal([
          'validate-allow-navigation',
          'validate-platform',
        ]);
      });
    });

    it('validate serve runs the correct validators', function() {
      let target = new CordovaTarget();

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
    it('runs cordova build task', function() {
      let Build = td.replace('../../../../lib/targets/cordova/tasks/build');
      let CordovaTarget = require('../../../../lib/targets/cordova/target');
      let opts = {
        project: mockProject.project,
        platform: 'ios',
        cordovaOpts: {cordovaOpts: true},
        verbose: true
      }

      let target = new CordovaTarget(opts);
      target.build(true);
      td.verify(new Build(opts));
    });
  });
});
