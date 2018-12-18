const spawn           = require('../../../utils/spawn');
const sdkPaths        = require('../utils/sdk-paths');

module.exports = function() {
  let adbPath = sdkPaths().adb;

  let emulatorState = [
    adbPath,
    [
      'shell',
      'getprop',
      'sys.boot_completed'
    ]
  ];

  return spawn(...emulatorState).then((result) => {
    let stdout = result.stdout.trim();
    let stderr = result.stderr.trim();

    //adb shell seems to always result in spawn.stderr
    if (stderr.length > 0) {
      return stderr;
    }

    return stdout;
  });
};
