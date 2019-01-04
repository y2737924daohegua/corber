const spawn                  = require('../../../utils/spawn');
const Promise                = require('rsvp').Promise;
const getEmulatorState       = require('./get-emulator-state');
const sdkPaths               = require('../utils/sdk-paths');

const defaultPollingInterval = 300;

const pollDevices = function(emulator, spawnState, pollingInterval) {
  return getEmulatorState().then((emulatorState) => {
    // even if `emulatorState` is '1', reject if spawned process ended
    if (spawnState.error) {
      return Promise.reject(spawnState.error);
    }

    if (spawnState.isSettled) {
      return Promise.reject('emulator failed to start');
    }

    if (emulatorState === '1') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        pollDevices(emulator, spawnState)
          .then(resolve)
          .catch(reject);
      }, pollingInterval);
    });
  });
};

module.exports = function(emulator, pollingInterval = defaultPollingInterval) {
  let emulatorPath = sdkPaths().emulator;

  let boot = [
    emulatorPath,
    ['-avd', emulator.name]
  ];

  let spawnState = {
    isSettled: false,
    error: null
  };

  spawn(...boot)
    .catch((error) => {
      spawnState.error = error;
    }).finally(() => {
      spawnState.isSettled = true
    });

  return pollDevices(emulator, spawnState, pollingInterval);
};
