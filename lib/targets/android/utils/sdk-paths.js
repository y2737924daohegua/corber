const path        = require('path');
const sdkRoot     = require('./sdk-root');
const resolvePath = require('./resolve-path');
const logger      = require('../../../utils/logger')

module.exports = function() {
  let root = sdkRoot();
  if (root === undefined) {
    logger.error(
      'ANDROID_SDK_ROOT ENV variable not found ' +
      'It is recommended to set this value in bash_profile or bashrc'
    );

    return;
  }

  let adbPath = path.join(root, 'platform-tools', 'adb');

  let emulatorPaths = [
    path.join(root, 'emulator', 'emulator'),
    path.join(root, 'tools', 'emulator')
  ];

  if (process.platform === 'win32') {
    adbPath += '.exe';
    emulatorPaths = emulatorPaths.map((p) => p + '.exe');
  }

  return {
    adb: resolvePath([adbPath]),
    emulator: resolvePath(emulatorPaths)
  }
};
