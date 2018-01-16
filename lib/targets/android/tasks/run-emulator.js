const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const RSVP            = require('rsvp');
const Promise         = RSVP.Promise;
const path            = require('path');

module.exports = Task.extend({
  pollDevices(deferred) {
    let bootedEmulator;

    let devices = [
      path.join(process.env['HOME'], 'Library/Android/sdk/platform-tools/adb'),
      ['devices', '-l']
    ];

    return spawn.apply(null, devices).then((foundDevices) => {
      let devices = foundDevices.split('\n');
      for (let i = 0; i < devices.length; i++) {
        let deviceString = devices[i];
        let deviceName = deviceString.split(' ')[0];

        //An emulator is booted when status goes from offline to device
        if (deviceName.indexOf('emulator') >= 0 && deviceString.indexOf('device') >= 0) {
          bootedEmulator = deviceName;
          break;
        }
      };

      if (bootedEmulator) {
        deferred.resolve(bootedEmulator);
      } else {
        setTimeout(() => {
          this.pollDevices(deferred);
        }, 300)
      }
    });
  },

  //TODO - handle case where emulator already running
  //TODO - SDK path
  run(emulator) {
    let boot = [
      path.join(process.env['HOME'], 'Library/Android/sdk/tools/emulator'),
      ['-avd', emulator.name],
      { detached: true }
    ];

    let deferred = RSVP.defer();

    //emulator -avd wont close/resolve
    spawn.apply(null, boot);

    return this.pollDevices(deferred)
      .then(() => {
        return deferred.promise;
      })
  }
});
