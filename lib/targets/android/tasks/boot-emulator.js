const spawn           = require('../../../utils/spawn');
const RSVP            = require('rsvp');
const getEmState      = require('./get-emulator-state');
const sdkPaths        = require('../utils/sdk-paths');

const pollDevices = function(deferred, emulator) {
  getEmState().then((emState) => {
    if (emState === '1') {
      return deferred.resolve();
    } else {
      setTimeout(() => {
        pollDevices(deferred, emulator);
      }, 300);
    }
  });
};

module.exports = function(emulator) {
  let deferred = RSVP.defer();
  let emulatorPath = sdkPaths().emulator;

  let boot = [
    emulatorPath,
    ['-avd', emulator.name]
  ];

  spawn.apply(null, boot);
  pollDevices(deferred, emulator);

  return deferred.promise;
};
