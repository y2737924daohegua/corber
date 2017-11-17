const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = Task.extend({
  run(options, derivedPath) {
    //TODO - pass scheme
    let scheme = 'react';
    //TODO - cordovaPath should not req this.project // drop process.cwd()
    let iosPath = path.join(process.cwd(), 'corber', 'cordova', 'platforms', 'ios');

    let destination;
    if (options.emulator) {
      destination = `platform=iOS Simulator,name=${options.emulator}`;
    } else if (options.emulatorid) {
      destination = `id=${options.emulatorid}`
    }

    let build = [
      '/usr/bin/xcodebuild',
      [
        '-workspace', `${path.join(iosPath, 'react.xcworkspace')}`,
        '-configuration', 'Debug',
        '-scheme', `${scheme}`,
        '-destination', destination,
        '-derivedDataPath', `${derivedPath}`,
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
