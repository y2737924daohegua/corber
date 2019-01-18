const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = function(scheme, iosPath) {
  let workspacePath = path.join(iosPath, `${scheme}.xcworkspace`);

  let getBuildInfo = [
    '/usr/bin/xcodebuild',
    ['-workspace', workspacePath,
     '-scheme', scheme,
     '-showBuildSettings']
  ];

  return spawn(...getBuildInfo).then(function(buildInfo) {
    let buildDir = buildInfo.stdout.split('BUILD_DIR')[1].split('\n')[0];
    buildDir = buildDir.split('=')[1].trim();

    let ipaPath = path.join(buildDir, 'Debug-iphoneos', `${scheme}.app`);

    return ipaPath;
  });
};
