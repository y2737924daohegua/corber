const td              = require('testdouble');
const mockProject     = require('../../../../fixtures/corber-mock/project');
const path            = require('path');
const contains        = td.matchers.contains;
const isAnything      = td.matchers.anything;

const setupBuildTask = function() {
  let BuildTask = require('../../../../../lib/targets/ios/tasks/build-emulator');
  return new BuildTask(mockProject);
};

describe('iOS Build Emulator Task', function() {
  let spawnDouble;

  beforeEach(function() {
    spawnDouble = td.replace('../../../../../lib/utils/spawn');
    return spawnDouble;
  });

  afterEach(function() {
    td.reset();
  });

  it('spawns xcode build with expected flags', function() {
    let iosPath = path.join(process.cwd(), 'corber', 'cordova', 'platforms', 'ios');
    let build = setupBuildTask();
    build.run({emulator: 'emulator'}, 'buildPath');

    td.verify(spawnDouble(
      '/usr/bin/xcodebuild',
      [
        '-workspace', `${path.join(iosPath, 'react.xcworkspace')}`,
        '-configuration', 'Debug',
        '-scheme', 'react',
        '-destination', 'platform=iOS Simulator,name=emulator',
        '-derivedDataPath', 'buildPath',
        'CODE_SIGN_REQUIRED=NO',
        'CODE_SIGN_IDENTITY='
      ],
      {
        cwd: iosPath
      }
    ));
  });

  it('sets destination when building for emulator by name', function() {
    let build = setupBuildTask();
    build.run({emulator: 'iPhone X'}, 'buildPath');

    td.verify(spawnDouble(
      isAnything(),
      contains('-destination', 'platform=iOS Simulator,name=iPhone X'),
      isAnything()
    ));
  });

  it('sets destination when building for emulator by id', function() {
    let build = setupBuildTask();
    build.run({emulatorid: 'UUID'}, 'buildPath');

    td.verify(spawnDouble(
      isAnything(),
      contains('-destination', 'id=UUID'),
      isAnything()
    ));
  });
});

