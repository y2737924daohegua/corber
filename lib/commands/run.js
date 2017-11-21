const Command          = require('./-command');
const logger           = require('../utils/logger');
const BuildEmulator    = require('../targets/ios/tasks/build-emulator');
const RunEmulator      = require('../targets/ios/tasks/run-emulator');
const ListEmulators    = require('../targets/ios/tasks/list-emulators');
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

  buildAndRun(emulatorConfig, emulator) {
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

      return build.run(emulatorConfig, buildPath, scheme, iosPath)
        .then(() => (runEmulator.run(emulator, appName, builtPath)));
    });
  },

  //TODO - move to _start_
  //TODO - support deviceID
  //TODO - validate emulators, list emulators, list devices
  run(options) {
    this._super.apply(this, arguments);

    let listEmulators = new ListEmulators();

    return listEmulators.run().then((emulators) => {
      if (options.emulator === '') {
        let promptOptions = {
          type: 'list',
          name: 'emulator',
          message: 'Select an emulator',
          pageSize: 30,
          choices: []
        };

        emulators.forEach((em, i) => {
          promptOptions.choices.push({
            key: i,
            name: `iOS ${em.iosVersion} ${em.name} id=${em.id}`,
            value: em
          })
        });

        this.ui.prompt(promptOptions).then((selected) => {
          let emulator = selected.emulator;
          return this.buildAndRun({emulatorid: emulator.id}, emulator.id)
        });
      } else {
        //Preference --emulator vs emulatorID if passed
        let emulatorConfig = pick(options, ['emulator', 'emulatorid']);
        let emulator = values(emulatorConfig)[0];

        return this.buildAndRun(emulatorConfig, emulator);
      }
    });
  }
});
