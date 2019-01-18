const CoreObject       = require('core-object');
const path             = require('path');
const Promise          = require('rsvp').Promise;

const build            = require('./tasks/build');

const bootEm           = require('./tasks/boot-emulator');
const openEm           = require('./tasks/open-emulator');
const installAppEm     = require('./tasks/install-app-emulator');
const launchAppEm      = require('./tasks/launch-app-emulator');

const installAppDevice = require('./tasks/install-app-device');
const getIpaPath       = require('./tasks/get-ipa-path');

const cdvConfig        = require('../cordova/utils/get-config');
const cdvPath          = require('../cordova/utils/get-path');

const ValidateSigning  = require('./validators/signing-identity');

const logger           = require('../../utils/logger');

module.exports = CoreObject.extend({
  device: undefined,
  project: undefined,

  scheme: undefined,
  packageName: undefined,
  iosPath: undefined,
  buildPath: undefined,
  ipaPath: undefined,

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
      if (this.device.deviceType === 'emulator') {
        this.ipaPath = path.join(
          this.buildPath, 'Build', 'Products',
          'Debug-iphonesimulator', `${this.scheme}.app`
        );
      } else if (this.device.deviceType === 'device') {
        return getIpaPath(this.scheme, this.iosPath).then((ipaPath) => {
          this.ipaPath = ipaPath;
        });
      }
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
    let emulator = this.device;

    return bootEm(emulator)
      .then(() => openEm())
      .then(() => installAppEm(emulator.uuid, this.ipaPath))
      .then(() => launchAppEm(emulator.uuid, this.packageName))
  },

  runDevice() {
    /* eslint-disable max-len */

    let validateSigning = new ValidateSigning({
      project: this.project
    });

    return validateSigning.run().then(() => {
      return installAppDevice(this.device.uuid, this.ipaPath, this.project.root);
    }).catch(function() {
      let errorMsg = 'Could not run start on your iOS device. \n';
      errorMsg += 'Either automatic signing has been set and no team associated, or manual signing is not setup correctly. \n';
      errorMsg += 'Run corber open and set your identities correctly. If you are new, we suggest automated signing. \n';

      logger.error(errorMsg);
      return Promise.reject();
    });
    /* eslint-enable max-len */
  }
});
