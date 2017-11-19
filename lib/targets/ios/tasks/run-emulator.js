const Task            = require('../../../tasks/-task');
const spawn           = require('../../../utils/spawn');
const path            = require('path');

module.exports = Task.extend({
  run(emulator, appName, builtPath) {
    //TODO - Don't run if state is already booted
    let boot = [
      '/usr/bin/xcrun',
      ['simctl', 'boot', emulator]
    ];

    let open = [
      'open',
      ['/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app']
    ];

    let install = [
      '/usr/bin/xcrun',
      ['simctl', 'install', emulator, builtPath]
    ];

    let launch = [
      '/usr/bin/xcrun',
      ['simctl', 'launch', emulator, appName]
    ];

    return spawn.apply(null, boot)
      .then(() => spawn.apply(null, open))
      .then(() => spawn.apply(null, install))
      .then(() => spawn.apply(null, launch))
  }
});
