const CoreObject       = require('core-object');
const path             = require('path');

const bootEm           = require('./tasks/boot-emulator');
const installAppEm     = require('./tasks/install-app-emulator');
const launchApp        = require('./tasks/launch-app');

const CordovaTarget    = require('../cordova/target');
const cdvConfig        = require('../cordova/utils/get-config');
const cdvPath          = require('../cordova/utils/get-path');

module.exports = CoreObject.extend({
  emulator: undefined,
  packageName: undefined,

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
    let cdvTarget = new CordovaTarget({
      platform: 'android',
      project: this.project
    });

    return cdvTarget.build();
  },

  run() {
    return bootEm(this.emulator)
      .then(() => installAppEm(this.apkPath(), this.emulator))
      .then(() => launchApp(this.packageName));
  }
});
