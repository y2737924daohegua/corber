const CoreObject       = require('core-object');
const path             = require('path');

const bootEm           = require('./tasks/boot-emulator');
const buildEm          = require('./tasks/build-emulator');
const openEm           = require('./tasks/open-emulator');
const installApp       = require('./tasks/install-app');
const launchApp        = require('./tasks/launch-app');

const cdvConfig        = require('../cordova/utils/get-config');
const cdvPath          = require('../cordova/utils/get-path');

module.exports = CoreObject.extend({
  emulator: undefined,
  project: undefined,

  scheme: undefined,
  appName: undefined,
  iosPath: undefined,
  buildPath: undefined,
  builtPath: undefined,

  init() {
    this._super(...arguments);
    return cdvConfig(this.project).then((config) => {
      this.scheme =  config.widget.name[0];
      this.appName = config.widget.$.id;

      let corberPath = cdvPath(this.project, true);
      this.iosPath = path.join(corberPath, 'cordova', 'platforms', 'ios');
      this.buildPath = path.join(this.iosPath, 'tmp', 'builds');
    });
  },

  build() {
    return buildEm(this.emulator.uuid, this.buildPath, this.scheme, this.iosPath).then(() => {
      this.builtPath = path.join(
        this.buildPath, 'Build', 'Products',
        'Debug-iphonesimulator', `${this.scheme}.app`
      );
    });
  },

  run() {
    let emulatorId = this.emulator.uuid;

    return bootEm(this.emulator)
      .then(() => openEm())
      .then(() => installApp(emulatorId, this.builtPath))
      .then(() => launchApp(emulatorId, this.appName))
  }
});
