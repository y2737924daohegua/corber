const td              = require('testdouble');
const path            = require('path');
const Promise         = require('rsvp').Promise;
const expect          = require('../../../../helpers/expect');

const setupRunTask = function() {
  let RunTask = require('../../../../../lib/targets/ios/tasks/run-emulator');
  return new RunTask();
};

describe('iOS Run Emulator Task', function() {
  afterEach(function() {
    td.reset();
  });

  it ('boots, installs & launches emulator app', function() {
    let invokes = [];
    let appPath = path.join(process.cwd(), 'corber', 'tmp/builds/Build/Products/Debug-iphonesimulator/react.app');


    td.replace('../../../../../lib/utils/spawn', function(cmd, args) {
      invokes.push([...arguments]);
      return Promise.resolve();
    });

    let runEmulator = setupRunTask();
    return runEmulator.run('emulator', 'appName', 'builtPath').then(function() {
      expect(invokes.length).to.equal(4);

      expect(invokes[0]).to.deep.equal([
        '/usr/bin/xcrun',
        ['simctl', 'boot', 'emulator']
      ]);

      expect(invokes[1]).to.deep.equal([
        'open',
        ['/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app']
      ]);

      expect(invokes[2]).to.deep.equal([
        '/usr/bin/xcrun',
        ['simctl', 'install', 'emulator', 'builtPath']
      ]);

      expect(invokes[3]).to.deep.equal([
        '/usr/bin/xcrun',
        ['simctl', 'launch', 'emulator', 'appName']
      ]);
    });
  });
});

