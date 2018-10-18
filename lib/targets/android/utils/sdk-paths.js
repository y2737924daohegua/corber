const path        = require('path');
const sdkRoot     = require('./sdk-root');
const resolvePath = require('./resolve-path');
const logger      = require('../../../utils/logger')

module.exports = function() {
  let root = sdkRoot();
  if (root === undefined) {
    logger.error(
      'ANDROID_HOME ENV variable not found ' +
      'It is recommended to set this value in bash_profile or bashrc'
    );

    return;
  }

  let emulatorPaths = [
    path.join(root, 'emulator', 'emulator'),
    path.join(root, 'tools', 'emulator')
  ];

  let emulatorPath = resolvePath(emulatorPaths);

  return {
    adb: path.join(root, 'platform-tools', 'adb'),
    emulator: emulatorPath
  }
};
