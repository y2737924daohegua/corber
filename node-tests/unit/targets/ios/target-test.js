const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const path            = require('path');
const expect          = require('../../../helpers/expect');
const mockProject     = require('../../../fixtures/corber-mock/project');
const anything        = td.matchers.anything;

const libPath         = '../../../../lib';
const Device          = require(`${libPath}/objects/device`);

const stubEmulator = new Device({
  apiVersion: '11.1',
  name: 'iPad Pro',
  uuid: 'uuid',
  platform: 'ios',
  deviceType: 'emulator',
  state: 'Booted'
});

const stubDevice = new Device({
  apiVersion: '11.1',
  name: 'iPad Pro',
  uuid: 'uuid',
  platform: 'ios',
  deviceType: 'device',
  state: 'Booted'
});

const setupTarget = function() {
  let IOSTarget = require(`${libPath}/targets/ios/target`);
  return new IOSTarget({
    device: stubEmulator,
    project: mockProject.project
  });
};

describe('IOS Target', function() {
  afterEach(function() {
    td.reset();
  });

  context('init', function() {
    it('sets scheme & appName from cdv config', function() {
      td.replace(`${libPath}/targets/cordova/utils/get-config`, function() {
        return Promise.resolve({
          widget: {
            name: ['scheme'],
            $: { id: 'appName' }
          }
        });
      });

      let target = setupTarget();
      return target.init().then(function() {
        expect(target.scheme).to.equal('scheme');
        expect(target.packageName).to.equal('appName');
      });
    });

    it('sets ios/build paths', function() {
      let target = setupTarget();
      return target.init().then(function() {
        expect(target.scheme).to.equal('emberCordovaDummyApp');
        expect(target.packageName).to.equal('emberCordovaDummyApp');
      });
    });
  });

  context('build', function() {
    it('runs build passsing the right args', function() {
      let build = td.replace(`${libPath}/targets/ios/tasks/build`);
      td.when(build(anything(), anything(), anything(), anything())).thenReturn(Promise.resolve());

      let target = setupTarget();
      //need to force set props
      return target.init().then(() => {
        return target.build().then(() => {
          td.verify(build(target.device, target.buildPath, target.scheme, target.iosPath));
        });
      });
    });

    it('sets ipaPath after build for emulator', function() {
      td.replace(`${libPath}/targets/ios/tasks/build`, function() {
        return Promise.resolve();
      });

      let target = setupTarget();
      let expectedPath = path.join(mockProject.project.root, 'corber', 'cordova', 'platforms', 'ios', 'tmp', 'builds', 'Build', 'Products', 'Debug-iphonesimulator', 'emberCordovaDummyApp.app');


      return target.build().then(function() {
        expect(target.ipaPath).to.equal(expectedPath);
      });
    });

    it('sets ipaPath after build for device', function() {
      td.replace(`${libPath}/targets/ios/tasks/build`, function() {
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/get-ipa-path`, function() {
        return Promise.resolve('derived-path');
      });

      let target = setupTarget();
      target.device = stubDevice;

      return target.build().then(function() {
        expect(target.ipaPath).to.equal('derived-path');
      });
    });
  });

  it('run calls runEmulator when deviceType is emulator', function() {
    let target = setupTarget();
    let runEmulator = td.replace(target, 'runEmulator');

    target.run();
    td.verify(runEmulator());
  });

  it('run calls runDevice when deviceType is device', function() {
    let target = setupTarget();
    let runDevice = td.replace(target, 'runDevice');

    target.device = stubDevice;

    target.run();
    td.verify(runDevice());
  });

  context('runEmulator', function() {
    it('runEmulator runs tasks in the correct order', function() {
      let tasks = [];

      td.replace(`${libPath}/targets/ios/tasks/boot-emulator`, function() {
        tasks.push('boot-emulator');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/open-emulator`, function() {
        tasks.push('open-emulator');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/install-app-emulator`, function() {
        tasks.push('install-app');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/launch-app-emulator`, function() {
        tasks.push('launch-app');
        return Promise.resolve();
      });

      let target = setupTarget();
      return target.runEmulator().then(function() {
        expect(tasks).to.deep.equal([
          'boot-emulator',
          'open-emulator',
          'install-app',
          'launch-app'
        ]);
      });
    });

    it('passes required params', function() {
      let bootEm = td.replace(`${libPath}/targets/ios/tasks/boot-emulator`);
      let openEm = td.replace(`${libPath}/targets/ios/tasks/open-emulator`);
      let installApp = td.replace(`${libPath}/targets/ios/tasks/install-app-emulator`);
      let launchApp = td.replace(`${libPath}/targets/ios/tasks/launch-app-emulator`);

      td.when(bootEm(anything())).thenReturn(Promise.resolve());
      td.when(openEm(anything())).thenReturn(Promise.resolve());
      td.when(installApp(anything())).thenReturn(Promise.resolve());
      td.when(launchApp(anything())).thenReturn(Promise.resolve());

      let target = setupTarget();
      target.ipaPath = 'ipaPath';

      return target.runEmulator().then(function() {
        td.verify(bootEm(stubEmulator));
        td.verify(openEm());
        td.verify(installApp(stubEmulator.uuid, 'ipaPath'));
        td.verify(launchApp(stubEmulator.uuid, 'emberCordovaDummyApp'));
      });
    });
  });

  context('runDevice', function() {
    it('runDevice runs tasks in the correct order', function() {
      let tasks = [];

      let ValidateSigning = td.replace(`${libPath}/targets/ios/validators/signing-identity`);
      td.replace(ValidateSigning.prototype, 'run', function() {
        tasks.push('validate-signing');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/install-app-device`, function() {
        tasks.push('install-app-device');
        return Promise.resolve();
      });

      let target = setupTarget();
      return target.runDevice().then(function() {
        expect(tasks).to.deep.equal([
          'validate-signing',
          'install-app-device'
        ]);
      });
    });

    it('passes required params', function() {
      let ValidateSigning = td.replace(`${libPath}/targets/ios/validators/signing-identity`);
      let install = td.replace(`${libPath}/targets/ios/tasks/install-app-device`);

      td.when(install(anything(), anything(), anything())).thenReturn(Promise.resolve());
      td.replace(ValidateSigning.prototype, 'run', function() {
        return Promise.resolve();
      });

      let target = setupTarget();
      target.device = stubDevice;

      return target.init().then(function() {
        return target.runDevice().then(function() {
          td.verify(install(target.device.uuid, target.ipaPath, target.project.root));
        });
      });

    });

    it('runDevice logs error if signing fails', function() {
      let logger = td.replace(`${libPath}/utils/logger`);
      td.replace(logger, 'error');

      let ValidateSigning = td.replace(`${libPath}/targets/ios/validators/signing-identity`);
      td.replace(ValidateSigning.prototype, 'run', function() {
        return Promise.reject();
      });

      td.replace(`${libPath}/targets/ios/tasks/install-app-device`, function() {
        return Promise.resolve();
      });

      let target = setupTarget();

      return target.runDevice().catch(function() {
        td.verify(logger.error(td.matchers.contains('Could not run start on your iOS device')));
      });
    });
  });

});
