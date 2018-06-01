const td               = require('testdouble');
const expect           = require('../../helpers/expect');
const mockProject      = require('../../fixtures/corber-mock/project');
const Promise          = require('rsvp').Promise;
const isAnything       = td.matchers.anything();

const setupCmd = function(stubCreate) {
  if (stubCreate) {
    let CreateProject = td.replace('../../../lib/tasks/create-project');
    td.replace(CreateProject.prototype, 'run', function() {
      return Promise.resolve();
    });
  }
  let InitCommand = require('../../../lib/commands/init');
  return new InitCommand({
    project: mockProject.project,
    ui: mockProject.ui
  });
};

describe('Init Command', function() {
  let opts = {};

  beforeEach(function() {
    opts = {
      cordovaId: 'cordovaId',
      name: 'cordovaName',
      templatePath: 'templatePath',
      platform: 'ios'
    };
  });

  afterEach(function() {
    td.reset();
  });

  it('sets cordovaId, name & templatePath on createproject', function() {
    let called;
    let CreateProject = td.replace('../../../lib/tasks/create-project');
    td.replace(CreateProject.prototype, 'run', function() {
      called = true;
      return Promise.resolve();
    });

    let init = setupCmd();
    return init.run(opts).then(() => {
      td.verify(new CreateProject({
        project: isAnything,
        ui: isAnything,
        cordovaId: 'cordovaId',
        name: 'cordovaName',
        templatePath: 'templatePath'
      }));

      expect(called).to.equal(true);
    });

  });

  it('calls installPlatforms with --platform', function() {
    let init = setupCmd(true);
    let installDouble = td.replace(init, 'installPlatforms');

    return init.run(opts).then(() => {
      td.verify(installDouble(['ios']));
    });
  });

  it('prompts then installs platforms when --platform is not passed', function() {
    let init = setupCmd(true);
    let passedPlatforms = [];
    opts.platform = undefined;

    td.replace(init, 'installPlatforms', function(platforms) {
      passedPlatforms = platforms;
      return Promise.resolve();
    });

    init.ui = {
      prompt: function(opts) {
        return Promise.resolve({platforms: ['ios', 'android']});
      }
    };

    return init.run(opts).then(() => {
      expect(passedPlatforms).to.deep.equal(['ios', 'android']);
    });
  });

  it('does not call installPlatforms if the selected platform is none', function() {
    let init = setupCmd(true);
    let installDouble = td.replace(init, 'installPlatforms');
    opts.platform = undefined;

    init.ui = {
      prompt: function(opts) {
        return Promise.resolve({platforms: ['none']});
      }
    }

    return init.run(opts).then(() => {
      td.verify(installDouble(), {times: 0});
    });
  });

  describe('validateAndRun', function() {
    context('when corber is already initialized', function() {
      it('throws an exception', function() {
        td.replace('../../../lib/utils/get-versions', () => {
          return {
            corber: {
              project: '1.0.0'
            }
          };
        });

        let init = setupCmd();
        expect(() => init.validateAndRun()).to.throw();
      });
    });

    context('when corber folder already exists in project', function() {
      it('throws an exception', function () {
        td.replace('../../../lib/utils/fs-utils', 'existsSync', (path) => {
          return path !== './corber';
        });

        let init = setupCmd();
        expect(() => init.validateAndRun()).to.throw();
      });
    });
  });

  describe('getPlatforms', function() {
    it('splits a single string', function() {
      let init = setupCmd();
      let platforms = init.getPlatforms('ios');
      expect(platforms).to.deep.equal(['ios']);
    });

    it('splits a multi string', function() {
      let init = setupCmd();
      let platforms = init.getPlatforms('ios,android');
      expect(platforms).to.deep.equal(['ios', 'android']);
    });
  });

  describe('buildPromptOptions', function() {
    context('is win32', function() {
      it('does not includes an ios option', function() {
        td.replace('../../../lib/utils/get-os', function() {
          return 'win32';
        });

        let init = setupCmd();

        expect(init.buildPromptOptions()['choices'].length).to.eq(2);
      });
    });

    context('is darwin', function() {
      it('includes an ios option', function() {
        td.replace('../../../lib/utils/get-os', function() {
          return 'darwin';
        });

        let init = setupCmd();

        expect(init.buildPromptOptions()['choices'].length).to.eq(3);
      });
    });
  });

  describe('installPlatforms', function() {
    it('installs each passed platform', function() {
      let calls = [];

      let PlatformTask = require('../../../lib/targets/cordova/tasks/platform');
      td.replace(PlatformTask.prototype, 'run', function(action, platform) {
        calls.push(platform);
      });
      let init = setupCmd();

      return init.installPlatforms(['ios', 'android']).then(() => {
        expect(calls).to.deep.equal(['ios', 'android']);
      });
    });

    it('passes webview and save options to the platform task', function() {
      let calls = [];

      let PlatformTask = require('../../../lib/targets/cordova/tasks/platform');
      td.replace(PlatformTask.prototype, 'run', function(action, platform, opts) {
        calls.push(opts);
        return Promise.resolve();
      });

      let init = setupCmd();

      return init.installPlatforms(['ios', 'android'], {uiwebview: false, crosswalk: true}).then(function() {
        expect(calls[0]).to.deep.equal({uiwebview: false, crosswalk: true, save: true});
      });
    });
  });
});
