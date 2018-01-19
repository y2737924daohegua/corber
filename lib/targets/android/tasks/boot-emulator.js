const spawn           = require('../../../utils/spawn');
const path            = require('path');
const RSVP            = require('rsvp');
const listRunningEms  = require('./list-running-emulators');

const sdkPath         = path.join(process.env['HOME'], 'Library/Android/sdk');
const emulatorPath    = path.join(sdkPath, 'tools', 'emulator');

const pollDevices = function(deferred, emulator) {
  return listRunningEms().then((emulators) => {
    if (emulators && emulators[0]) {
      emulator.id = emulators[0];

      return deferred.resolve(emulator);
    } else {
      setTimeout(() => {
        pollDevices(deferred, emulator);
      }, 300);
    }
  });
};

module.exports = function(emulator) {
  let deferred = RSVP.defer();
  let boot = [
    emulatorPath,
    ['-avd', emulator.name]
  ];

  spawn.apply(null, boot);
  pollDevices(deferred, emulator);

  return deferred.promise;
};
