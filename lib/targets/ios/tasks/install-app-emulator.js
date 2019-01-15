const spawn           = require('../../../utils/spawn');

module.exports = function(emulatorId, builtPath) {
  let install = [
    '/usr/bin/xcrun',
    ['simctl', 'install', emulatorId, builtPath]
  ];

  return spawn(...install);
};
