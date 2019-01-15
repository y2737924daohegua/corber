const CoreObject       = require('core-object');
const path             = require('path');

const build            = require('./tasks/build');

const bootEm           = require('./tasks/boot-emulator');
const openEm           = require('./tasks/open-emulator');
const installAppEm     = require('./tasks/install-app-emulator');
const launchAppEm      = require('./tasks/launch-app-emulator');

const installAppDevice = require('./tasks/install-app-device');

const cdvConfig        = require('../cordova/utils/get-config');
const cdvPath          = require('../cordova/utils/get-path');

module.exports = CoreObject.extend({
  device: undefined,
  project: undefined,

  scheme: undefined,
  packageName: undefined,
  iosPath: undefined,
  buildPath: undefined,
  builtPath: undefined,

  init() {
    this._super(...arguments);
    return cdvConfig(this.project).then((config) => {
      this.scheme =  config.widget.name[0];
      this.packageName = config.widget.$.id;

      let corberPath = cdvPath(this.project, true);
      this.iosPath = path.join(corberPath, 'cordova', 'platforms', 'ios');
      this.buildPath = path.join(this.iosPath, 'tmp', 'builds');
    });
  },

  build() {
    return build(
      this.device,
      this.buildPath,
      this.scheme,
      this.iosPath
    ).then(() => {
      this.builtPath = path.join(
        this.buildPath, 'Build', 'Products',
        'Debug-iphonesimulator', `${this.scheme}.app`
      );
    });
  },

  run() {
    if (this.device.deviceType === 'emulator') {
      return this.runEmulator();
    } else if (this.device.deviceType === 'device') {
      return this.runDevice();
    }
  },

  runEmulator() {
    let emulatorId = this.device.uuid;

    return bootEm(emulatorId)
      .then(() => openEm())
      .then(() => installAppEm(emulatorId, this.builtPath))
      .then(() => launchAppEm(emulatorId, this.packageName))
  },

  runDevice() {
    return installAppDevice(this.device.uuid, '', this.project.root);
  }
});
