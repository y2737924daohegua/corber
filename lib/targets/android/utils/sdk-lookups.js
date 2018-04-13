const getOS = require('../../../utils/get-os');
const path  = require('path');

module.exports = function() {
  let sdkPaths;
  let platform = getOS();

  if (platform === 'darwin') {
    sdkPaths = [
      path.join(`${process.env['ANDROID_HOME']}`),
      path.join(`${process.env['ANDROID_SDK']}`),
      path.join('/Applications', 'ADT', 'sdk'),
      path.join(`${process.env['HOME']}`, '.android', 'android-sdk'),
      path.join(`${process.env['HOME']}`, 'Library', 'Android', 'sdk')
    ];
  } else if (platform === 'win32') {
    sdkPaths = [
      path.join(`${process.env['ANDROID_HOME']}`),
      path.join(`${process.env['ANDROID_SDK']}`),
      path.join(`${process.env['LOCALAPPDATA']}`, 'Android', 'Sdk')
    ];
  }

  return sdkPaths;
};
