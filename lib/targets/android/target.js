const CoreObject       = require('core-object');
const path             = require('path');

const listRunningEms   = require('./tasks/list-running-emulators');
const killEm           = require('./tasks/kill-emulator');
const bootEm           = require('./tasks/boot-emulator');
//const uninstallApp     = require('./tasks/uninstall-app');
const installApp       = require('./tasks/install-app');
const launchApp        = require('./tasks/launch-app');

const cdvConfig        = require('../cordova/utils/get-config');
const cdvPath          = require('../cordova/utils/get-path');

module.exports = CoreObject.extend({
  emulator: undefined,
  packageName: undefined,

  cdvTarget: undefined,
  project: undefined,

  init() {
    this._super(...arguments);
    return cdvConfig(this.project).then((config) => {
      this.packageName = config.widget.$.id;
    });
  },

  apkPath() {
    return path.join(
      cdvPath(this.project, true),
      'cordova',
      'platforms',
      'android',
      'app',
      'build',
      'outputs',
      'apk',
      'debug',
      'app-debug.apk'
    );
  },

  build() {
    return this.cdvTarget.build();
  },

  run() {
    return bootEm(this.emulator)
      .then(() => installApp(this.apkPath(), this.emulator))
      .then(() => launchApp(this.packageName));
  }
});
