const spawn           = require('../../../utils/spawn');
const Promise         = require('rsvp').Promise;

module.exports = function(emulator) {
  let boot = [
    '/usr/bin/xcrun',
    ['simctl', 'boot', emulator.uuid]
  ];

  if (emulator.state !== 'Booted') {
    return spawn.apply(null, boot);
  } else {
    return Promise.resolve();
  }
};
