 /* eslint-disable max-len */
var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var CdvRawTask      = require('../../../lib/targets/cordova/tasks/raw');
var SetupViewTask   = require('../../../lib/targets/cordova/tasks/setup-webview');
var Promise         = require('rsvp');

var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var mockAnalytics   = require('../../fixtures/ember-cordova-mock/analytics');
 /* eslint-enable max-len */

describe('Platform Command', function() {
  function setupCommand() {
    let PlatformCmd     = require('../../../lib/commands/platform');

    let platform = new PlatformCmd({
      project: mockProject.project
    });
    platform.analytics = mockAnalytics;
    return platform;
  }

  afterEach(function() {
    td.reset();
  });

  describe('Platform Install', function() {
    beforeEach(function() {
      td.replace(SetupViewTask.prototype, 'run', function() {
        return Promise.resolve();
      });
    });

    it('passes command to Cordova Raw Task', function() {
      let platform = setupCommand();
      var rawCommand, rawPlugins;

      td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins) {
        rawCommand = cmd;
        rawPlugins = plugins;

        return Promise.resolve();
      });

      return platform.run({}, ['add', 'ios']).then(function() {
        expect(rawCommand).to.equal('add');
        expect(rawPlugins).to.equal('ios');
      });
    });

    it('passes the save flag', function() {
      let platform = setupCommand();
      var rawOpts;
      var opts = { save: false };

      td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins, options) {
        rawOpts = options;
        return Promise.resolve();
      });

      return platform.run(opts, ['add', 'ios']).then(function() {
        expect(rawOpts).to.have.property('save').and.equal(false);
      });
    });
  });

  describe('webview upgrades', function() {
    beforeEach(function() {
      td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins, options) {
        return Promise.resolve();
      });
    });

    /* eslint-disable max-len */
    it('constructs SetupWebView appropriately', function() {
      let SetupView = td.replace('../../../lib/targets/cordova/tasks/setup-webview');
      let platform = setupCommand();

      return platform.run({}, ['add', 'ios']).then(function() {
        td.verify(new SetupView({
          project: mockProject.project,
          platform: 'ios',
          crosswalk: undefined,
          uiwebview: undefined
        }));
      });
    });
    /* eslint-enable max-len */


    it('runs SetupWebView to handle init', function() {
      let platform = setupCommand();
      var setupViewDouble = td.replace(SetupViewTask.prototype, 'run');

      return platform.run({}, ['add', 'ios']).then(function() {
        td.verify(setupViewDouble());
      });
    });
  });
});
