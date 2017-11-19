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
    let build = setupBuildTask();
    build.run({emulator: 'emulator'}, 'buildPath', 'testScheme', 'iosPath');

    td.verify(spawnDouble(
      '/usr/bin/xcodebuild',
      [
        '-workspace', 'iosPath/testScheme.xcworkspace',
        '-configuration', 'Debug',
        '-scheme', 'testScheme',
        '-destination', 'platform=iOS Simulator,name=emulator',
        '-derivedDataPath', 'buildPath',
        'CODE_SIGN_REQUIRED=NO',
        'CODE_SIGN_IDENTITY='
      ],
      {
        cwd: 'iosPath'
      }
    ));
  });

  it('sets destination when building for emulator by name', function() {
    let build = setupBuildTask();
    build.run({emulator: 'iPhone X'}, 'buildPath', 'testScheme', 'iosPath');

    td.verify(spawnDouble(
      isAnything(),
      contains('-destination', 'platform=iOS Simulator,name=iPhone X'),
      isAnything()
    ));
  });

  it('sets destination when building for emulator by id', function() {
    let build = setupBuildTask();
    build.run({emulatorid: 'UUID'}, 'buildPath', 'testScheme', 'iosPath');

    td.verify(spawnDouble(
      isAnything(),
      contains('-destination', 'id=UUID'),
      isAnything()
    ));
  });
});

