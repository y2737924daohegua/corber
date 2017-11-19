const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = Task.extend({
  run(options, derivedPath, scheme, iosPath) {
    let destination;
    if (options.emulator) {
      destination = `platform=iOS Simulator,name=${options.emulator}`;
    } else if (options.emulatorid) {
      destination = `id=${options.emulatorid}`
    }

    let build = [
      '/usr/bin/xcodebuild',
      [
        '-workspace', `${iosPath}/${scheme}.xcworkspace`,
        '-configuration', 'Debug',
        '-scheme', scheme,
        '-destination', destination,
        '-derivedDataPath', derivedPath,
        'CODE_SIGN_REQUIRED=NO',
        'CODE_SIGN_IDENTITY='
      ],
      {
        cwd: iosPath
      },
    ];

    return spawn.apply(null, build);
  }
});
