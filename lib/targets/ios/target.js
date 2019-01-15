const CoreObject       = require('core-object');
const path             = require('path');

const buildEm          = require('./tasks/build-emulator');

const bootEm           = require('./tasks/boot-emulator');
const openEm           = require('./tasks/open-emulator');
const installAppEm     = require('./tasks/install-app-emulator');
const launchAppEm      = require('./tasks/launch-app-emulator');

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
    return buildEm(
      this.device.uuid,
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
    let emulatorId = this.device.uuid;

    return bootEm(emulatorId)
      .then(() => openEm())
      .then(() => installAppEm(emulatorId, this.builtPath))
      .then(() => launchAppEm(emulatorId, this.packageName))
  }
});
