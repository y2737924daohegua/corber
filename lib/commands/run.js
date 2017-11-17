const Command          = require('./-command');
const logger           = require('../utils/logger');
const BuildEmulator    = require('../targets/ios/tasks/build-emulator');
const RunEmulator      = require('../targets/ios/tasks/run-emulator');
const pick             = require('lodash').pick;
const values           = require('lodash').values;
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

    let buildPath = path.join(this.project.root, 'corber', 'tmp', 'builds');
    let build = new BuildEmulator();
    let runEmulator = new RunEmulator();

    let emulatorConfig = pick(options, ['emulator', 'emulatorid']);
    let emulator = values(emulatorConfig);
    return build.run(emulatorConfig, buildPath)
      .then(() => (runEmulator.run(emulator[0])));
  }
});
