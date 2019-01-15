const spawn           = require('../../../utils/spawn');

module.exports = function(emulatorId, appName) {
  let launch = [
    '/usr/bin/xcrun',
    ['simctl', 'launch', emulatorId, appName]
  ];

  return spawn(...launch);
};
