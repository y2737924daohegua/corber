const Command          = require('./-command');
const logger           = require('../utils/logger');
const BuildEmulator    = require('../targets/ios/tasks/build-emulator');
const RunEmulator      = require('../targets/ios/tasks/run-emulator');
const pick             = require('lodash').pick;
const values           = require('lodash').values;
const cordovaPath      = require('../targets/cordova/utils/get-path');
const cdvConfig        = require('../targets/cordova/utils/get-config');
const path             = require('path');

module.exports = Command.extend({
  name: 'run',
  aliases: [ 'run' ],
  description: 'Run app on device/emulator',
  works: 'insideProject',

  availableOptions: [
    { name: 'platform',   type: String,  default: 'ios' },
    { name: 'emulator',   type: String },
    { name: 'emulatorid', type: String }
  ],

  //TODO - move to _start_
  //TODO - support deviceID
  //TODO - validate emulators, list emulators, list devices
  run(options) {
    this._super.apply(this, arguments);
    return cdvConfig(this.project).then((config) => {
      let scheme =  config.widget.name[0];
      let appName = config.widget.$.id;

      let corberPath = cordovaPath(this.project, true);
      let iosPath = path.join(corberPath, 'cordova', 'platforms', 'ios');
      let buildPath = path.join(corberPath, 'tmp', 'builds');
      let builtPath = path.join(
        buildPath, 'Build', 'Products',
        'Debug-iphonesimulator', `${scheme}.app`
      );

      let build = new BuildEmulator();
      let runEmulator = new RunEmulator();

      //Preference --emulator vs emulatorID if passed
      let emulatorConfig = pick(options, ['emulator', 'emulatorid']);
      let emulator = values(emulatorConfig)[0];

      return build.run(emulatorConfig, buildPath, scheme, iosPath)
        .then(() => (runEmulator.run(emulator, appName, builtPath)));
    });
  }
});
