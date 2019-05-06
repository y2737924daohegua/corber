const expect          = require('../../../../helpers/expect');
const path            = require('path');
const td              = require('testdouble');
const contains        = td.matchers.contains;

const sdkRoot         = 'sdk-root';
const unixADBPath     = path.join(sdkRoot, 'platform-tools', 'adb');
const windowsADBPath  = path.join(sdkRoot, 'platform-tools', 'adb.exe');

const unixEmulatorPaths = [
  path.join(sdkRoot, 'emulator', 'emulator'),
  path.join(sdkRoot, 'tools', 'emulator')
];

const windowsEmulatorPaths = [
  path.join(sdkRoot, 'emulator', 'emulator.exe'),
  path.join(sdkRoot, 'tools', 'emulator.exe')
];

describe('Android sdk paths util', () => {
  let logger;
  let sdkRoot;
  let sdkPaths;
  let originalPlatform;

  beforeEach(() => {
    sdkRoot         = td.replace('../../../../../lib/targets/android/utils/sdk-root');
    logger          = td.replace('../../../../../lib/utils/logger');
    let resolvePath = td.replace('../../../../../lib/targets/android/utils/resolve-path');

    td.when(sdkRoot()).thenReturn('sdk-root');

    td.when(resolvePath([unixADBPath])).thenReturn('resolved-unix-adb-path');
    td.when(resolvePath(unixEmulatorPaths)).thenReturn('resolved-unix-emulator-path');

    td.when(resolvePath([windowsADBPath])).thenReturn('resolved-windows-adb-path');
    td.when(resolvePath(windowsEmulatorPaths)).thenReturn('resolved-windows-emulator-path');

    originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');

    sdkPaths = require('../../../../../lib/targets/android/utils/sdk-paths');
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', originalPlatform);

    td.reset();
  });

  it('logs an ANDROID_SDK_ROOT error if sdkRoot is undefined', () => {
    td.when(sdkRoot()).thenReturn(undefined);
    sdkPaths();
    td.verify(logger.error(contains('ANDROID_SDK_ROOT ENV variable not found')));
  });

  context('when platform is darwin', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', { value: 'darwin' });
    });

    it('returns resolved adb path', () => {
      let paths = sdkPaths();
      expect(paths.adb).to.equal('resolved-unix-adb-path');
    });

    it('returns resolved emulator path', () => {
      let paths = sdkPaths();
      expect(paths.emulator).to.equal('resolved-unix-emulator-path');
    });
  });

  context('when platform is linux', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
    });

    it('returns resolved adb path', () => {
      let paths = sdkPaths();
      expect(paths.adb).to.equal('resolved-unix-adb-path');
    });

    it('returns resolved emulator path', () => {
      let paths = sdkPaths();
      expect(paths.emulator).to.equal('resolved-unix-emulator-path');
    });
  });

  context('when platform is win32', () => {
    beforeEach(() => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
    });

    it('returns resolved adb path', () => {
      let paths = sdkPaths();
      expect(paths.adb).to.equal('resolved-windows-adb-path');
    });

    it('returns resolved emulator path', () => {
      let paths = sdkPaths();
      expect(paths.emulator).to.equal('resolved-windows-emulator-path');
    });
  });
});
