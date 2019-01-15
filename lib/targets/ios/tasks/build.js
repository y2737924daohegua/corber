const spawn           = require('../../../utils/spawn');

module.exports = function(device, derivedPath, scheme, iosPath) {
  let destination = `id=${device.uuid}`;

  let buildArgs = [
    '-workspace', `${iosPath}/${scheme}.xcworkspace`,
    '-scheme', scheme,
    '-destination', destination
  ];

  if (device.deviceType === 'emulator') {
    buildArgs.push('-configuration');
    buildArgs.push('Debug');
    buildArgs.push('-derivedDataPath');
    buildArgs.push(derivedPath);
    buildArgs.push('CODE_SIGN_REQUIRED=NO');
    buildArgs.push('CODE_SIGN_IDENTITY=');
  }

  let build = [
    '/usr/bin/xcodebuild',
    buildArgs,
    {
      cwd: iosPath
    },
  ];

  return spawn(...build);
};
