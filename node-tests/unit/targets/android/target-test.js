const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../helpers/expect');
const mockProject     = require('../../../fixtures/corber-mock/project');

const libPath         = '../../../../lib';
const Emulator         = require(`${libPath}/objects/emulator`);

const setupTarget = function() {
  let AndroidTarget = require(`${libPath}/targets/android/target`);
  return new AndroidTarget({
    emulator: new Emulator({
      name: 'Emultor',
      uuid: 'uuid',
      platform: 'android'
    }),
    project: mockProject.project
  });
};

describe('Android Target', function() {
  afterEach(function() {
    td.reset();
  });

  context('init', function() {
    it('sets packageName from cdv config', function() {
      td.replace(`${libPath}/targets/cordova/utils/get-config`, function() {
        return Promise.resolve({
          widget: {
            $: { id: 'appName' }
          }
        });
      });

      let target = setupTarget();
      return target.init().then(function() {
        expect(target.packageName).to.equal('appName');
      });
    });
  });

  context('build', function() {
    it('runs a cordova build', function() {
      let CdvTarget = td.replace(`${libPath}/targets/cordova/target`);

      let didBuild = false;
      td.replace(CdvTarget.prototype, 'build', function() {
        didBuild = true;
      });

      let target = setupTarget();
      target.build();

      td.verify(new CdvTarget({
        platform: 'android',
        project: mockProject.project
      }));

      expect(didBuild).to.equal(true);
    });
  });


  context('run', function() {
    it('runs tasks in the correct order', function() {
      let tasks = [];

      td.replace(`${libPath}/targets/android/tasks/boot-emulator`, function() {
        tasks.push('boot-emulator');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/android/tasks/install-app-emulator`, function() {
        tasks.push('install-app');
        return Promise.resolve();
      });

      td.replace(`${libPath}/targets/android/tasks/launch-app`, function() {
        tasks.push('launch-app');
        return Promise.resolve();
      });

      let target = setupTarget();
      return target.run().then(function() {
        expect(tasks).to.deep.equal([
          'boot-emulator',
          'install-app',
          'launch-app'
        ]);
      });
    });
  });
});

