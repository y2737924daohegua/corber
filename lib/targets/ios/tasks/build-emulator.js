const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');

module.exports = Task.extend({
  run(emulator, derivedPath, scheme, iosPath) {
    let destination = `id=${emulator.id}`;

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
