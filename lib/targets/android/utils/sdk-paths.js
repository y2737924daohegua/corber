const sdkLookups = require('./sdk-lookups');
const resolvePath = require('./resolve-path');
const path        = require('path');

module.exports = function() {
  let sdkPaths = sdkLookups();
  let sdkRoot = resolvePath(sdkPaths)
  let emulatorPaths = [
    path.join(sdkRoot, 'emulator', 'emulator'),
    path.join(sdkRoot, 'tools', 'emulator')
  ];
  let emulatorPath = resolvePath(emulatorPaths);

  return {
    adb: path.join(sdkRoot, 'platform-tools', 'adb'),
    emulator: emulatorPath
  }
};
