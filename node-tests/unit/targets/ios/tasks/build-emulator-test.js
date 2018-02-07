const td              = require('testdouble');
const contains        = td.matchers.contains;
const isAnything      = td.matchers.anything;

describe('iOS Build Emulator Task', function() {
  let spawnDouble, buildTask;

  beforeEach(function() {

    spawnDouble = td.replace('../../../../../lib/utils/spawn');
    buildTask = require('../../../../../lib/targets/ios/tasks/build-emulator');
  });

  afterEach(function() {
    td.reset();
  });

  it('spawns xcode build with expected flags', function() {
    buildTask('emulatorId', 'buildPath', 'testScheme', 'iosPath');

    td.verify(spawnDouble(
      '/usr/bin/xcodebuild',
      [
        '-workspace', 'iosPath/testScheme.xcworkspace',
        '-configuration', 'Debug',
        '-scheme', 'testScheme',
        '-destination', 'id=emulatorId',
        '-derivedDataPath', 'buildPath',
        'CODE_SIGN_REQUIRED=NO',
        'CODE_SIGN_IDENTITY='
      ],
      {
        cwd: 'iosPath'
      }
    ));
  });

  it('sets destination when building for emulator by id', function() {
    buildTask('UUID', 'buildPath', 'testScheme', 'iosPath');

    td.verify(spawnDouble(
      isAnything(),
      contains('-destination', 'id=UUID'),
      isAnything()
    ));
  });
});

