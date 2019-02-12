const td              = require('testdouble');
const expect          = require('../../../../helpers/expect');
const Promise         = require('rsvp').Promise;
const path            = require('path');

const scheme          = 'corberApp';
const iosPath         = path.join('corber', 'cordova', 'platforms', 'ios');
const workspacePath   = path.join('corber', 'cordova', 'platforms', 'ios', 'corberApp.xcworkspace');

const spawnArgs       = ['/usr/bin/xcodebuild', ['-workspace', workspacePath, '-scheme', scheme, '-showBuildSettings']];

const buildInfo = `
    ASSETCATALOG_COMPILER_LAUNCHIMAGE_NAME = LaunchImage
    AVAILABLE_PLATFORMS = appletvos appletvsimulator iphoneos iphonesimulator macosx watchos watchsimulator
    BITCODE_GENERATION_MODE = marker
    BUILD_ACTIVE_RESOURCES_ONLY = NO
    BUILD_COMPONENTS = headers build
    BUILD_DIR = /Users/alexblom/Library/Developer/Xcode/DerivedData/corberApp-uuid/Build/Products
    BUILD_ROOT = /Users/alexblom/Library/Developer/Xcode/DerivedData/corberApp-uuid/Build/Products
    BUILD_STYLE =
    BUILD_VARIANTS = normal
    BUILT_PRODUCTS_DIR = /Users/alexblom/Library/Developer/Xcode/DerivedData/corberApp-uuid/Build/Products/Release-iphoneos`;

describe('iOS Get IPA Path Task', () => {
  let getIpaPath;
  let spawn;

  beforeEach(() => {
    spawn = td.replace('../../../../../lib/utils/spawn');
    td.when(spawn(...spawnArgs))
      .thenReturn(Promise.resolve({ stdout: buildInfo }));

    getIpaPath = require('../../../../../lib/targets/ios/tasks/get-ipa-path');
  });

  afterEach(() => {
    td.reset();
  });

  it('calls spawn with correct arguments', () => {
    td.config({ ignoreWarnings: true });

    return getIpaPath(scheme, iosPath).then(() => {
      td.verify(spawn(...spawnArgs));

      td.config({ ignoreWarnings: false });
    });
  });

  it('lints out ios device, ignoring emulators & non ios devices', () => {
    let expectedPath = path.join('/', 'Users', 'alexblom', 'Library', 'Developer', 'Xcode', 'DerivedData', 'corberApp-uuid', 'Build', 'Products', 'Debug-iphoneos', 'corberApp.app');
    return expect(getIpaPath(scheme, iosPath)).to.eventually.equal(expectedPath);
  });

  it('bubbles up error message when spawn rejects', () => {
    td.when(spawn(...spawnArgs)).thenReturn(Promise.reject('spawn error'));
    return expect(getIpaPath(scheme, iosPath)).to.eventually.be.rejectedWith('spawn error');
  });
});

