const td              = require('testdouble');
const expect          = require('../../helpers/expect');
const mockProject     = require('../../fixtures/corber-mock/project');
const mockAnalytics   = require('../../fixtures/corber-mock/analytics');
const lodash          = require('lodash');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;

describe('Start Command', () => {
  // run()
  let CreateLRShell;
  let CordovaTarget;
  let CordovaRawTask;
  let editXml;
  let getPlatforms;
  let IOSTarget;
  let AndroidTarget;
  let logger;
  let requireFramework;

  // buildReloadUrl()
  let getNetworkIp;

  // getInstalledDevices()
  let iosListEmulators;
  let iosListDevices;
  let androidListEmulators;
  let androidListDevices;

  let project;
  let start;

  let setupCommand = () => {
    let StartCmd = require('../../../lib/commands/start');
    start = new StartCmd({
      project
    });

    start.analytics = mockAnalytics;

    return start;
  };

  beforeEach(() => {
    // run()
    td.replace('../../../lib/tasks/run-hook');

    CreateLRShell        = td.replace('../../../lib/tasks/create-livereload-shell');
    CordovaTarget        = td.replace('../../../lib/targets/cordova/target');
    CordovaRawTask       = td.replace('../../../lib/targets/cordova/tasks/raw');
    editXml              = td.replace('../../../lib/targets/cordova/utils/edit-xml');
    getPlatforms         = td.replace('../../../lib/targets/cordova/utils/get-platforms');
    IOSTarget            = td.replace('../../../lib/targets/ios/target');
    AndroidTarget        = td.replace('../../../lib/targets/android/target');
    logger               = td.replace('../../../lib/utils/logger');
    requireFramework     = td.replace('../../../lib/utils/require-framework');

    // buildReloadUrl()
    getNetworkIp         = td.replace('../../../lib/utils/get-network-ip');

    // getInstalledDevices()
    iosListEmulators     = td.replace('../../../lib/targets/ios/tasks/list-emulators');
    iosListDevices       = td.replace('../../../lib/targets/ios/tasks/list-devices');
    androidListEmulators = td.replace('../../../lib/targets/android/tasks/list-emulators');
    androidListDevices   = td.replace('../../../lib/targets/android/tasks/list-devices');


    project = lodash.cloneDeep(mockProject.project);
    project.config = () => {
      return {
        locationType: 'hash',
      };
    };

    start = setupCommand();

  });

  afterEach(() => {
    td.reset();
  });

  context('run', () => {
    let start;
    let tasks;
    let iosDevice, androidDevice;

    let stubTask = (id, returnValue) => {
      return (...args) => {
        let label = typeof (id) === 'function' ? id(...args) : id;
        tasks.push(label);
        return Promise.resolve(returnValue);
      }
    };

    beforeEach(() => {
      tasks = [];

      iosDevice = {
        id: '1',
        name: 'iOS Device',
        platform: 'ios'
      };

      androidDevice = {
        id: '2',
        name: 'Android Device',
        platform: 'android'
      };

      td.replace('../../../lib/tasks/run-hook', stubTask((hookName) => `hook-${hookName}`));
      CreateLRShell.prototype.run = stubTask('create-livereload-shell');
      CordovaTarget.prototype.validateServe = stubTask('cordova-validate-serve');
      CordovaRawTask.prototype.run = stubTask('cordova-prepare');
      editXml.addNavigation = stubTask('add-navigation');
      editXml.removeNavigation = stubTask('remove-navigation');
      editXml.addAndroidCleartext = stubTask('add-android-cleartext');
      editXml.removeAndroidCleartext = stubTask('remove-android-cleartext');
      IOSTarget.prototype.build = stubTask('ios-platform-build');
      IOSTarget.prototype.run = stubTask('ios-platform-run');
      AndroidTarget.prototype.build = stubTask('android-platform-build');
      AndroidTarget.prototype.run = stubTask('android-platform-run');

      start = setupCommand();

      td.replace(start, 'buildReloadUrl');
      td.when(start.buildReloadUrl(), { ignoreExtraArgs: true })
        .thenReturn('http://192.168.0.1');

      td.replace(start, 'selectPlatforms', stubTask('select-platforms', ['ios', 'android']));
      td.replace(start, 'selectDevice', stubTask('select-device', iosDevice));

      td.when(requireFramework(project)).thenReturn({
        validateServe: stubTask('framework-validate-serve'),
        serve: stubTask('framework-serve')
      });
    });

    it('logs starting message to info', () => {
      return start.run().then(() => {
        td.verify(logger.info('Corber Starting'));
      });
    });

    it('runs tasks in the correct order for ios device', () => {
      return start.run().then(() => {
        expect(tasks).to.deep.equal([
          'select-platforms',
          'select-device',
          'hook-beforeBuild',
          'add-navigation',
          'cordova-validate-serve',
          'framework-validate-serve',
          'create-livereload-shell',
          'cordova-prepare',
          'ios-platform-build',
          'hook-afterBuild',
          'ios-platform-run',
          'framework-serve',
          'remove-navigation'
        ]);
      });
    });

    it('runs tasks in the correct order for android device', () => {
      td.replace(start, 'selectDevice', stubTask('select-device', androidDevice));

      return start.run().then(() => {
        expect(tasks).to.deep.equal([
          'select-platforms',
          'select-device',
          'hook-beforeBuild',
          'add-navigation',
          'add-android-cleartext',
          'cordova-validate-serve',
          'framework-validate-serve',
          'create-livereload-shell',
          'cordova-prepare',
          'android-platform-build',
          'hook-afterBuild',
          'android-platform-run',
          'framework-serve',
          'remove-navigation',
          'remove-android-cleartext'
        ]);
      });
    });


    it('sets process.env.CORBER_PLATFORM/CORBER_LIVERELOAD & opts.platform', () => {
      process.env.CORBER_PLATFORM = undefined;
      process.env.CORBER_LIVERELOAD = undefined;

      let opts = { build: false };

      return start.run(opts).then(() => {
        expect(process.env.CORBER_PLATFORM).to.equal('ios');
        expect(opts.platform).to.equal('ios');
        expect(process.env.CORBER_LIVERELOAD).to.equal('true');
      });
    });
  });

  describe('buildReloadUrl', () => {
    let start;

    beforeEach(() => {
      td.when(getNetworkIp()).thenReturn('192.168.0.1');
      start = setupCommand();
    });

    it('generates url with port argument', () => {
      expect(start.buildReloadUrl(1000)).to.equal('http://192.168.0.1:1000');
    });

    it('generates url with framework.port when port argument omitted', () => {
      let framework = { port: 3000 };
      let reloadUrl = start.buildReloadUrl(undefined, undefined, framework);
      expect(reloadUrl).to.equal('http://192.168.0.1:3000');
    });

    it('omits port if port argument and framework port are omitted', () => {
      td.when(getNetworkIp()).thenReturn('192.168.0.1');
      expect(start.buildReloadUrl()).to.equal('http://192.168.0.1');
    });
  });

  describe('selectPlatforms', () => {
    let start;
    let target;

    beforeEach(() => {
      target = new CordovaTarget();

      td.when(getPlatforms(project))
        .thenReturn(Promise.resolve(['ios', 'android']));

      start = setupCommand();
    });

    it('returns all installed platforms by default', () => {
      return expect(start.selectPlatforms(target))
        .to.eventually.deep.equal(['ios', 'android']);
    });

    it('rejects with instructions if no platforms are installed', () => {
      td.when(getPlatforms(project))
        .thenReturn(Promise.resolve([]));

      let promise = start.selectPlatforms(target);

      return RSVP.all([
        expect(promise).to.eventually.be.rejectedWith(/No platforms installed/),
        expect(promise).to.eventually.be.rejectedWith(/corber platform add/)
      ]);
    });

    context('when a platform is specified', () => {
      it('returns only that platform', () => {
        return expect(start.selectPlatforms({ platform: 'ios' }))
          .to.eventually.deep.equal(['ios']);
      });

      it('rejects if platform is unsupported', () => {
        return expect(start.selectPlatforms({ platform: 'foo' }))
          .to.eventually.be.rejectedWith(/not a supported platform/);
      });

      it('rejects if platform is not installed', () => {
        td.when(getPlatforms(project))
          .thenReturn(Promise.resolve(['android']));

        return expect(start.selectPlatforms({ platform: 'ios' }))
          .to.eventually.be.rejectedWith(/not installed/);
      });
    });
  });

  describe('selectDevice', () => {
    let start;
    let device;

    beforeEach(() => {
      device = {
        id: '1',
        name: 'iPhone X',
        platform: 'ios',
        label() { return 'Apple iPhone X'; }
      };

      start = setupCommand();

      td.replace(start, 'promptForDevice');
      td.when(start.promptForDevice(), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve(device));

      td.replace(start, 'getInstalledDevices');
      td.when(start.getInstalledDevices(), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve([device]));
    });

    it('prompts for a device by default', () => {
      return start.selectDevice(['ios']).then(() => {
        td.config({ ignoreWarnings: true });
        td.verify(start.promptForDevice([device]))
        td.config({ ignoreWarnings: false });
      });
    });

    context('when no devices are found', () => {
      beforeEach(() => {
        td.when(start.getInstalledDevices(), { ignoreExtraArgs: true })
          .thenReturn(Promise.resolve([]));
      });

      it('rejects with ios instructions if ios was selected', () => {
        let promise = start.selectDevice(['ios']);

        return RSVP.all([
          expect(promise).to.eventually.be.rejectedWith(/No emulators or devices found/),
          expect(promise).to.eventually.be.rejectedWith(/sudo xcode-select/)
        ]);
      });

      it('rejects without ios instructions if ios not selected', () => {
        let promise = start.selectDevice(['android']);

        return RSVP.all([
          expect(promise).to.eventually.be.rejectedWith(/No emulators or devices found/),
          expect(promise).to.not.eventually.be.rejectedWith(/sudo xcode-select/)
        ]);
      })
    });

    context('when emulator [name] is specified', () => {
      it('resolves with emulator if it exists', () => {
        return expect(start.selectDevice(['ios'], { emulator: 'iPhone X' }))
          .to.eventually.deep.equal(device);
      });

      it('rejects if no emulator matches', () => {
        return expect(start.selectDevice(['ios'], { emulator: 'iPhone 6' }))
          .to.eventually.be.rejectedWith(/no device/);
      });
    });

    context('when emulator id is specified', () => {
      it('resolves with emulator if it exists', () => {
        return expect(start.selectDevice(['ios'], { emulatorId: '1' }))
          .to.eventually.deep.equal(device);
      });

      it('rejects if no emulator matches', () => {
        return expect(start.selectDevice(['ios'], { emulatorId: '2' }))
          .to.eventually.be.rejectedWith(/no device/);
      });
    });
  });

  describe('getInstalledDevices', () => {
    let start;
    let iosEmulator;
    let iosDevice;
    let androidDevice;
    let androidEmulator;

    beforeEach(() => {
      iosEmulator = { name: 'iOS Emulator' };
      iosDevice = { name: 'iOS Device' };
      androidDevice = { name: 'Android Device' };
      androidEmulator = { name: 'Android Emulator' };

      td.when(iosListEmulators())
        .thenReturn(Promise.resolve([iosEmulator]));

      td.when(iosListDevices())
        .thenReturn(Promise.resolve([iosDevice]));

      td.when(androidListEmulators())
        .thenReturn(Promise.resolve([androidEmulator]));

      td.when(androidListDevices())
        .thenReturn(Promise.resolve([androidDevice]));

      start = setupCommand();
    });

    it('gets everything when `ios`, `android` are both platforms', () => {
      return start.getInstalledDevices(['ios', 'android']).then((devices) => {
        expect(devices).to.contain(iosEmulator);
        expect(devices).to.contain(iosDevice);
        expect(devices).to.contain(androidDevice);
        expect(devices).to.contain(androidEmulator);
      });
    });

    it('gets ios emulators when `ios` is only platform', () => {
      return start.getInstalledDevices(['ios']).then((devices) => {
        expect(devices).to.contain(iosEmulator);
        expect(devices).to.contain(iosDevice);
        expect(devices).to.not.contain(androidEmulator);
        expect(devices).to.not.contain(androidDevice);
      });
    });

    it('gets android devices/emulators when `android` is only platform', () => {
      return start.getInstalledDevices(['android']).then((devices) => {
        expect(devices).to.not.contain(iosEmulator);
        expect(devices).to.not.contain(iosDevice);
        expect(devices).to.contain(androidEmulator);
        expect(devices).to.contain(androidDevice);
      });
    });

    it('waits for listAndroidDevices to finish before running listAndroidEmulators', () => {
      let deferred = RSVP.defer();

      // ensure listDevices function won't resolve until we say so
      td.when(androidListDevices()).thenReturn(deferred.promise.then(() => {
        return [androidDevice];
      }));

      // register a `then` handler on the promise _before_ start does
      let promise = deferred.promise.then(() => {
        td.config({ ignoreWarnings: true });
        td.verify(androidListEmulators(), { times: 0 });
        td.config({ ignoreWarnings: false });
      });

      start.getInstalledDevices(['android']);
      deferred.resolve();

      return promise;
    });
  });

  describe('promptForDevice', () => {
    let start;
    let devices;

    beforeEach(() => {
      devices = [{
        id: '1',
        label() { return 'iPhone X' }
      }, {
        id: '2',
        label() { return 'Galaxy Note' }
      }];

      start = setupCommand();

      start.ui = td.object(['prompt']);
      td.when(start.ui.prompt(), { ignoreExtraArgs: true })
        .thenReturn(Promise.resolve({ device: devices[1] }));
    });

    it('opens UI prompt with correct options', () => {
      return start.promptForDevice(devices).then(() => {
        td.config({ ignoreWarnings: true });
        td.verify(start.ui.prompt({
          type: 'list',
          name: 'device',
          message: 'Select a device/emulator',
          pageSize: 30,
          choices: [{
            key: 0,
            name: 'iPhone X',
            value: devices[0]
          }, {
            key: 1,
            name: 'Galaxy Note',
            value: devices[1]
          }]
        }));
        td.config({ ignoreWarnings: false });
      });
    });

    it('returns the device selected by prompt', () => {
      return expect(start.promptForDevice(devices))
        .to.eventually.deep.equal(devices[1]);
    });
  });
});
