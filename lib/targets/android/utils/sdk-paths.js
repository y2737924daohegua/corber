const path            = require('path');
const getOS           = require('../../../utils/get-os');

module.exports = function() {
  let platform = getOS();

  if (platform === 'darwin') {
    let sdkRoot = path.join(process.env['HOME'], 'Library', 'Android', 'sdk');
    return {
      adb: path.join(sdkRoot, 'platform-tools', 'adb'),
      emulator: path.join(sdkRoot, 'tools', 'emulator')
    }
  } else if (platform === 'win32') {
    //TODO
  }
};
