const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const path            = require('path');
const expect          = require('../../../helpers/expect');
const mockProject     = require('../../../fixtures/corber-mock/project');

const libPath         = '../../../../lib';
const Device          = require(`${libPath}/objects/device`);

const setupTarget = function() {
  let IOSTarget = require(`${libPath}/targets/ios/target`);
  return new IOSTarget({
    device: new Device({
      apiVersion: '11.1',
      name: 'iPad Pro',
      uuid: 'uuid',
      platform: 'ios',
      deviceType: 'emulator',
      state: 'Booted'
    }),
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
      let buildArgs = {};
      td.replace(`${libPath}/targets/ios/tasks/build`, function(device, buildPath, scheme, iosPath) {
        buildArgs.uuid = device.uuid;
        buildArgs.buildPath = buildPath;
        buildArgs.scheme = scheme;
        buildArgs.iosPath = iosPath;
        return Promise.resolve();
      });

      let target = setupTarget();
      target.uuid = 'uuid';
      target.buildPath = 'buildPath';
      target.scheme = 'scheme';
      target.iosPath = 'iosPath';

      return target.build().then(function() {
        expect(buildArgs).to.deep.equal({
          uuid: 'uuid',
          buildPath: 'buildPath',
          scheme: 'scheme',
          iosPath: 'iosPath',
        });
      });
    });

    it('sets ipaPath correctly for emulator', function() {
      td.replace(`${libPath}/targets/ios/tasks/build`, function() {
        return Promise.resolve();
      });

      let target = setupTarget();

      return target.build().then(function() {
        let expectedPath = path.join(mockProject.project.root, 'corber', 'cordova', 'platforms', 'ios', 'tmp', 'builds', 'Build', 'Products', 'Debug-iphonesimulator', 'emberCordovaDummyApp.app');
        expect(target.ipaPath).to.equal(expectedPath);
      });
    });

    it('sets ipaPath correctly for device', function() {
      td.replace(`${libPath}/targets/ios/tasks/build`, function() {
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/get-ipa-path`, function() {
        return Promise.resolve('derived-path');
      });

      let target = setupTarget();
      target.device.deviceType = 'device';

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

    target.device.deviceType = 'device';

    target.run();
    td.verify(runDevice());
  });

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
