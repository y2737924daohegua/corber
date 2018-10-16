const td            = require('testdouble');
const expect        = require('../../../../helpers/expect');
const mockProject   = require('../../../../fixtures/corber-mock/project');
const CdvRawTask    = require('../../../../../lib/targets/cordova/tasks/raw');

const setupTask = function() {
  let PlatformTask  = require('../../../../../lib/targets/cordova/tasks/platform');

  return new PlatformTask({
    project: mockProject.project
  });
};

describe('Platform Command', function() {
  afterEach(function() {
    td.reset();
  });

  it('passes command/plugins to Corodva Raw run', function() {
    let platform = setupTask();
    let rawCommand, rawPlugins;

    td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins) {
      rawCommand = cmd;
      rawPlugins = plugins;

      return Promise.resolve();
    });

    return platform.run('add', 'ios', {}).then(function() {
      expect(rawCommand).to.equal('add');
      expect(rawPlugins).to.equal('ios');
    });
  });

  describe('flags', function() {
    let platform, rawOpts;
    beforeEach(function() {
      platform = setupTask();
      rawOpts;

      td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins, options) {
        rawOpts = options;
        return Promise.resolve();
      });
    });

    afterEach(function() {
      platform = undefined;
      rawOpts = undefined;
      td.reset();
    });

    it('passes the save flag', function() {
      let opts = { save: false };

      return platform.run('add', 'ios', opts).then(function() {
        expect(rawOpts).to.have.property('save').and.equal(false);
      });
    });

    it('defaults the fetch flag', function() {
      return platform.run('add', 'ios', {}).then(function() {
        expect(rawOpts).to.have.property('fetch').and.equal(true);
      });
    });
  });

  describe('webview upgrades', function() {
    beforeEach(function() {
      td.replace(CdvRawTask.prototype, 'run', function(cmd, plugins, options) {
        return Promise.resolve();
      });
    });

    it('constructs and runs SetupWebView', function() {
      let SetupView = td.replace('../../../../../lib/targets/cordova/tasks/setup-webview');
      let setupViewDouble = td.replace(SetupView.prototype, 'run');

      let platform = setupTask();

      return platform.run('add', 'ios', {}).then(function() {
        td.verify(new SetupView({
          project: mockProject.project,
          platform: 'ios',
          crosswalk: undefined,
          uiwebview: undefined
        }));

        td.verify(setupViewDouble());
      });
    });
  });
});
