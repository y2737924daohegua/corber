const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const path            = require('path');
const expect          = require('../../../helpers/expect');
const mockProject     = require('../../../fixtures/corber-mock/project');

const libPath         = '../../../../lib';
const IOSEmulator     = require(`${libPath}/objects/emulator/ios`);

const setupTarget = function() {
  let IOSTarget = require(`${libPath}/targets/ios/target`);
  return new IOSTarget({
    emulator: new IOSEmulator({
      apiVersion: '11.1',
      name: 'iPad Pro',
      uuid: 'uuid',
      platform: 'ios',
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
        expect(target.appName).to.equal('appName');
      });
    });

    it('sets ios/build paths', function() {
      let target = setupTarget();
      return target.init().then(function() {
        expect(target.scheme).to.equal('emberCordovaDummyApp');
        expect(target.appName).to.equal('emberCordovaDummyApp');
      });
    });
  });

  context('build', function() {
    it('runs buildEm passsing the right args', function() {
      let buildArgs = {};
      td.replace(`${libPath}/targets/ios/tasks/build-emulator`, function(uuid, buildPath, scheme, iosPath) {
        buildArgs.uuid = uuid;
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

    it('sets builtPath', function() {
      td.replace(`${libPath}/targets/ios/tasks/build-emulator`, function() {
        return Promise.resolve();
      });

      let target = setupTarget();

      return target.build().then(function() {
        let expectedPath = path.join(mockProject.project.root, 'corber', 'cordova', 'platforms', 'ios', 'tmp', 'builds', 'Build', 'Products', 'Debug-iphonesimulator', 'emberCordovaDummyApp.app');
        expect(target.builtPath).to.equal(expectedPath);
      });
    });
  });

  context('run', function() {
    it('runs tasks in the correct order', function() {
      let tasks = [];

      td.replace(`${libPath}/targets/ios/tasks/boot-emulator`, function() {
        tasks.push('boot-emulator');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/open-emulator`, function() {
        tasks.push('open-emulator');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/install-app`, function() {
        tasks.push('install-app');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/ios/tasks/launch-app`, function() {
        tasks.push('launch-app');
        return Promise.resolve();
      });

      let target = setupTarget();
      return target.run().then(function() {
        expect(tasks).to.deep.equal([
          'boot-emulator',
          'open-emulator',
          'install-app',
          'launch-app'
        ]);
      });
    });
  });
});
