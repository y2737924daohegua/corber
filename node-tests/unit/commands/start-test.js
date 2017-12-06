const td              = require('testdouble');
const path            = require('path');
const expect          = require('../../helpers/expect');
const Promise         = require('rsvp');
const LRloadShellTask = require('../../../lib/tasks/create-livereload-shell');
const ListEmulators   = require('../../../lib/targets/ios/tasks/list-emulators');
const CordovaRaw      = require('../../../lib/targets/cordova/tasks/raw');
const IOSRun          = require('../../../lib/targets/ios/tasks/run-emulator');
const IOSBuild        = require('../../../lib/targets/ios/tasks/build-emulator');
const Hook            = require('../../../lib/tasks/run-hook');
const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');

const dummyEmulators = [{
  id: 1,
  name: 'Em 1',
  state: 'Booted'
}, {
  id: 2,
  name: 'Em 2',
  state: 'Shutdown'
}];

const setupStart = function() {
  let StartCmd = require('../../../lib/commands/start');

  let start = new StartCmd({
    project: mockProject.project
  });

  start.analytics = mockAnalytics;
  start.project.config = function() {
    return {
      locationType: 'hash',

    };
  };

  return start;
};

describe('Start Command', function() {
  afterEach(function() {
    td.reset();
  });

  context('run', function() {
    let start, tasks;
    beforeEach(function() {
      tasks = [];

      td.replace('../../../lib/targets/cordova/utils/edit-xml', {
        addNavigation: function() {
          tasks.push('add-navigation');
          return Promise.resolve();
        }
      });

      td.replace('../../../lib/utils/require-framework', function() {
        return {
          validateServe() {
            tasks.push('framework-validate-serve');
            return Promise.resolve();
          },

          serve() {
            tasks.push('framework-serve');
            return Promise.resolve();
          }
        };
      });

      td.replace(LRloadShellTask.prototype, 'run', function() {
        tasks.push('create-livereload-shell');
        return Promise.resolve();
      });

      start = setupStart();

      td.replace(start, 'selectEmulator', function() {
        tasks.push('select-emulator');
        return Promise.resolve();
      });

      td.replace(start, 'buildAndRun', function() {
        tasks.push('build-and-run');
        return Promise.resolve();
      });
    });

    it('run runs tasks in the correct order', function() {
      return start.run({}).then(function() {
        expect(tasks).to.deep.equal([
          'select-emulator',
          'framework-validate-serve',
          'add-navigation',
          'create-livereload-shell',
          'build-and-run',
          'framework-serve'
        ]);
      });
    });

    it('makes the required changes to project', function() {
      return start.run({build: false, platform: 'ios'}).then(function() {
        expect(mockProject.project.targetIsCordova).to.equal(true);
        expect(mockProject.project.CORDOVA_PLATFORM).to.equal('ios')
        expect(mockProject.project.targetIsCordovaLivereload).to.equal(true);
      });
    });
  });

  describe('getReloadURL', function() {
    it('defaults to reloadUrl when provided', function() {
      let start = setupStart();
      let reloadUrl = start.getReloadUrl(1000, 'reloadUrl');
      expect(reloadUrl).to.equal('reloadUrl');
    });

    it('generates with options.port and networkAddress', function() {
      td.replace('../../../lib/utils/get-network-ip', function() {
        return 'networkAddress';
      });

      let start = setupStart();

      let reloadUrl = start.getReloadUrl(1000);
      expect(reloadUrl).to.equal('http://networkAddress:1000');
    });

    it('generates with framework.port when options is not passed', function() {
      td.replace('../../../lib/utils/get-network-ip', function() {
        return 'networkAddress';
      });

      let start = setupStart();

      let reloadUrl = start.getReloadUrl(undefined, undefined, { port: 'frameworkPort' });
      expect(reloadUrl).to.equal('http://networkAddress:frameworkPort');
    });
  });

  describe('selectEmulator', function() {
    beforeEach(function() {
      td.replace(ListEmulators.prototype, 'run', function() {
        return Promise.resolve(dummyEmulators);
      });
    });

    it('prompts for an emulator if one is not passed', function() {
      let start = setupStart();

      let promptArgs;
      start.ui = {
        prompt: function(opts) {
          promptArgs = opts;
          return Promise.resolve({emulator: dummyEmulators[0]});
        }
      }

      return start.selectEmulator({emulator: ''}).then(function() {
        expect(promptArgs.message).to.equal('Select an emulator');
        expect(promptArgs.type).to.equal('list');
        expect(promptArgs.choices[0].value).to.deep.equal(dummyEmulators[0]);
        expect(promptArgs.choices[1].value).to.deep.equal(dummyEmulators[1]);
      });
    });

    it('finds emulator by name', function() {
      let start = setupStart();

      return start.selectEmulator({emulator: 'Em 1'}).then(function(selected) {
        expect(selected).to.deep.equal(dummyEmulators[0]);
      });
    });

    it('finds emulator by id', function() {
      let start = setupStart();

      return start.selectEmulator({emulatorid: 2}).then(function(selected) {
        expect(selected).to.deep.equal(dummyEmulators[1]);
      });
    });
  });

  describe('buildAndRun', function() {
    it('runs tasks in the correct order', function() {
      let tasks = [];
      let emulator = {name: 'fakeEmulator', id: 'fakeUuid'};
      let opts = {platform: 'ios'};
      let corberRoot = path.join(mockProject.project.root, 'corber');

      td.replace(Hook.prototype, 'run', function(hookName, passedOpts) {
        tasks.push(`hook-${hookName}`);
        expect(passedOpts).to.deep.equal(opts);
        return Promise.resolve();
      });

      td.replace(CordovaRaw.prototype, 'run', function(cdvOpts) {
        tasks.push('prepare');
        expect(cdvOpts).to.deep.equal({platforms: ['ios']});
        return Promise.resolve();
      });

      td.replace(IOSBuild.prototype, 'run', function(passedEm, buildPath, scheme, iosPath) {
        tasks.push('ios-build-em');
        expect(passedEm).to.deep.equal(emulator);
        expect(buildPath).to.equal(path.join(corberRoot, 'tmp', 'builds'));
        expect(scheme).to.equal('emberCordovaDummyApp');
        expect(iosPath).to.equal(path.join(corberRoot, 'cordova', 'platforms', 'ios'));
        return Promise.resolve();
      });

      /* eslint-disable max-len */
      td.replace(IOSRun.prototype, 'run', function(passedEm, appName, builtPath) {
        tasks.push('ios-run-em');
        expect(passedEm).to.deep.equal(emulator);
        expect(appName).to.equal('emberCordovaDummyApp');
        expect(builtPath).to.equal(path.join(corberRoot, 'tmp', 'builds', 'Build', 'Products', 'Debug-iphonesimulator', 'emberCordovaDummyApp.app'));
        return Promise.resolve();
      });
      /* eslint-enable max-len */

      let start = setupStart();

      return start.buildAndRun(emulator, opts).then(function() {
        expect(tasks).to.deep.equal([
          'hook-beforeBuild',
          'prepare',
          'ios-build-em',
          'hook-afterBuild',
          'ios-run-em'
        ]);
      });
    });
  });
});
