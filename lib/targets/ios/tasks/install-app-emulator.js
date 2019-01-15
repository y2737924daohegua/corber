const spawn           = require('../../../utils/spawn');

module.exports = function(emulatorId, ipaPath) {
  let install = [
    '/usr/bin/xcrun',
    ['simctl', 'install', emulatorId, ipaPath]
  ];

  return spawn(...install);
};
