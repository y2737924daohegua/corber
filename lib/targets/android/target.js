const CoreObject       = require('core-object');

const listRunningEms   = require('./tasks/list-running-emulators');
const killEm           = require('./tasks/kill-emulator');
const bootEm           = require('./tasks/boot-emulator');
const installApp       = require('./tasks/install-app');

//TODO - warn user we are killing emulators
module.exports = CoreObject.extend({
  emulator: undefined,

  runEmulator() {
    return listRunningEms().then((emulators) => {
      if (emulators && emulators.length > 0) {
        emulators.forEach((emulator) => {
          killEm(emulator);
        });
      }
    })
    .then(() => bootEm(this.emulator))
  },

  install(apkPath) {
    if (this.emulator) {
      return installApp(apkPath, this.emulator);
    }
  }
});
